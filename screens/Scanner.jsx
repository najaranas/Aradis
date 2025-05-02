import {
  SafeAreaView,
  Linking,
  StyleSheet,
  Text,
  View,
  I18nManager,
  AppState,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import * as tabNavigation from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions } from "expo-camera";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import MyButton from "../components/MyButton";
import { Entypo, Ionicons } from "@expo/vector-icons";
import QRCodeOverlay from "../components/QRCodeOverlay";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Scanner() {
  const [permissions, requestPermissions] = useCameraPermissions();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isRTL = I18nManager.isRTL || i18n.language === "ar";
  const [appState, setAppState] = useState(AppState.currentState);

  const [hasPermission, setHasPermission] = useState(null);

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
    tabNavigation.setVisibilityAsync("hidden");
    tabNavigation.setButtonStyleAsync("light");

    return () => {
      tabNavigation.setVisibilityAsync("visible");
      tabNavigation.setButtonStyleAsync(
        theme.name === "light" ? "dark" : "light"
      );
    };
  }, []);

  const handleFlash = () => {
    setIsFlashOn((prev) => !prev);
  };

  const handleback = () => {
    navigation.goBack();
  };

  const scanHandler = () => {
    navigation.navigate("ConfirmScan");
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar hidden />

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
              if (appState === "active") {
                scanHandler();
              }
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
    </SafeAreaView>
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
