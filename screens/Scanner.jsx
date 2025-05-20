//
// Scanner.jsx
// This component is responsible for rendering the QR code scanner screen.
// It uses the expo-camera library to access the device's camera and scan QR codes.
// It handles camera permissions, flash functionality, and scanning logic.
// It also includes a custom button component for handling button presses.
// It uses React Navigation for navigation, and Expo's NavigationBar API for setting the navigation bar color.
// It uses the useTranslation hook for internationalization and the useTheme hook for theming.
// It also includes a custom toast component for displaying error messages.
//

import {
  Linking,
  StyleSheet,
  Text,
  View,
  I18nManager,
  AppState,
  StatusBar,
} from "react-native";
import { useEffect, useState, useRef, useCallback } from "react";
import * as tabNavigation from "expo-navigation-bar";
// import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions } from "expo-camera";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import MyButton from "../components/MyButton";
import { Entypo, Ionicons } from "@expo/vector-icons";
import QRCodeOverlay from "../components/QRCodeOverlay";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTheme } from "../hooks/useTheme";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomToast from "../components/CustomToast";

export default function Scanner() {
  const [permissions, requestPermissions] = useCameraPermissions();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isRTL = I18nManager.isRTL || i18n.language === "ar";
  const [appState, setAppState] = useState(AppState.currentState);
  const [isScanned, setIsScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const getPermissions = async () => {
      // Check if we already have permissions
      if (!permissions?.granted) {
        const permissionResult = await requestPermissions();
        setHasPermission(permissionResult?.granted || false);
      } else {
        setHasPermission(true);
      }
    };
    getPermissions();

    // handle the app on bg
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [permissions?.granted]);

  // Handle navigation bar visibility
  useEffect(() => {
    tabNavigation.setButtonStyleAsync("light");
    tabNavigation.setBackgroundColorAsync("#000000");
    return () => {
      tabNavigation.setButtonStyleAsync(
        theme.name === "light" ? "dark" : "light"
      );
      tabNavigation.setBackgroundColorAsync(theme.background);
    };
  });

  const handleFlash = () => {
    setIsFlashOn((prev) => !prev);
  };

  const handleback = () => {
    navigation.goBack();
  };

  const scanHandler = (data) => {
    setTimeout(() => {
      setIsScanned(false);
      console.log("reseted");
    }, 3000);

    // Step 1: Validate QR code format
    if (!data.startsWith("TAG-") && !data.startsWith("FPS-")) {
      setToast({
        show: true,
        message: "Invalid QR Code, This QR code is not recognized.",
        type: "error",
      });

      return;
    }

    const type = data.split("-")[0];

    const fetchScan = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setToast({
          show: true,
          message: "User token not found. Please log in again.",
          type: "error",
        });

        return;
      }

      try {
        const response = await fetch(
          `${
            process.env.EXPO_PUBLIC_API_BASE_URL
          }/${type.toLowerCase()}/${data}/scan`,
          {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${token}`,
            },
          }
        );

        const result = await response.json();

        // Step 2: Handle known backend responses
        if (!response.ok) {
          if (result?.message) {
            if (result.message.includes("not assigned")) {
              setToast({
                show: true,
                message: "You are not assigned to This Tag or have no access",
                type: "error",
              });
            } else {
              setToast({
                show: true,
                message: result.message,
                type: "error",
              });
            }
          } else {
            setToast({
              show: true,
              message: "Unexpected server response.",
              type: "error",
            });
          }
        } else {
          // Step 3: Success case
          navigation.navigate("ConfirmScan");
        }
      } catch (error) {
        console.error(error);
        setToast({
          show: true,
          message: "Network Error, Unable to connect to the server.",
          type: "error",
        });
      }
    };

    fetchScan();
  };
  return (
    <View style={[styles.container]}>
      <StatusBar barStyle={"light-content"} />

      {/* error toast */}
      <CustomToast
        type={toast.type}
        duration={3000}
        isActive={toast.show}
        message={toast.message}
        setToast={setToast}
        toastTopPosition={insets.top + SIZES.medium}
      />

      {/* Camera View */}

      {!hasPermission ? (
        <View style={styles.noPermissionContainer}>
          <MyButton pressHandler={handleback}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Entypo
                name={isRTL ? "chevron-right" : "chevron-left"}
                style={{ fontSize: 1.5 * SIZES.medium }}
                color={COLORS.white}
              />
              <Text
                style={{
                  fontFamily: FONTS.medium,
                  color: COLORS.white,
                  fontSize: 1.3 * SIZES.medium,
                }}>
                {t("scanner.back")}
              </Text>
            </View>
          </MyButton>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: COLORS.white,
                textAlign: "center",
                marginBottom: SIZES.medium,
              }}>
              {t("scannerPermission.permissionDenied")}
            </Text>
            <Text
              style={{
                color: COLORS.white,
                textAlign: "center",
                marginBottom: SIZES.large,
              }}>
              {t("scannerPermission.permissionInstructions")}
            </Text>
            <MyButton pressHandler={() => Linking.openSettings()}>
              <View
                style={{
                  backgroundColor: COLORS.gray + 50,
                  padding: SIZES.medium,
                  borderRadius: 10,
                }}>
                <Text style={{ color: COLORS.white, fontFamily: FONTS.bold }}>
                  {t("scannerPermission.openSettings")}
                </Text>
              </View>
            </MyButton>
          </View>
        </View>
      ) : (
        <>
          <CameraView
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              height: "100%",
              width: "100%",
            }}
            enableTorch={isFlashOn}
            flash={isFlashOn ? "on" : "off"}
            active={true}
            facing="back"
            onMountError={(error) => console.log("Camera error:", error)}
            onBarcodeScanned={({ data }) => {
              setIsScanned(true);
              if (isScanned === false) {
                // setTimeout(() => {
                scanHandler(data);
                console.log(data);
                // }, 400);
              }
              // if (appState === "active") {
              // }
            }}
          />

          {/* QR Code Overlay Component */}
          <QRCodeOverlay isRTL={isRTL} />

          <View
            style={[
              styles.headerContainer,
              { paddingTop: SIZES.small + insets.top },
            ]}>
            <MyButton pressHandler={handleback}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <Entypo
                  name={isRTL ? "chevron-right" : "chevron-left"}
                  style={{ fontSize: 1.5 * SIZES.medium }}
                  color={COLORS.white}
                />
                <Text
                  style={{
                    fontFamily: FONTS.medium,
                    color: COLORS.white,
                    fontSize: 1.3 * SIZES.medium,
                  }}>
                  {t("scanner.back")}
                </Text>
              </View>
            </MyButton>
            <MyButton pressHandler={handleFlash}>
              <Ionicons
                name={isFlashOn ? "flash" : "flash-off"}
                style={{ fontSize: 1.5 * SIZES.medium }}
                color={COLORS.white}
              />
            </MyButton>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.medium,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SIZES.small,
  },
  noPermissionContainer: {
    flex: 1,
    paddingTop: SIZES.xLarge,
    paddingHorizontal: SIZES.medium,
    gap: SIZES.xLarge,
  },
});
