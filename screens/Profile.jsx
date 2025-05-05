import {
  FlatList,
  I18nManager,
  Modal,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import TopTabPage from "../components/TopTabPage";
import ProfilePictureData from "../components/ProfilePictureData";
import { COLORS, FONTS, SIZES, THEME } from "../constants/theme";
import { workerMan } from "../constants/dataImage";
import { LANGUAGES, PROFILEMENUDATA } from "../constants/data";
import MyButton from "../components/MyButton";
import { useTheme } from "../contexts/ThemeProvider";
import CustomBottomSheet from "../components/CustomBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { removeStoredValue } from "../utils/asyncStorage";

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const [popupVisible, setPopupVisible] = useState(false);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(
    theme.name === "light" ? false : true
  );
  const { t, i18n } = useTranslation();
  const isRTL = I18nManager.isRTL || i18n.language === "ar";
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { userData, changeUserData } = useAuth();

  useEffect(() => {
    if (isSwitchEnabled) {
      storeTheme("DARK");
    } else {
      storeTheme("LIGHT");
    }
  }, [isSwitchEnabled]);

  const toggleSwitch = () => {
    setIsSwitchEnabled((prev) => !prev);
    toggleTheme();
  };

  const logoutHandler = () => {
    setPopupVisible(true);
  };
  const confirmLogoutHandler = () => {
    try {
      AsyncStorage.removeItem("token");
      removeStoredValue("data");
      changeUserData({});
    } catch (error) {
      console.log("Error in deleting token", error);
    }

    setPopupVisible(false);

    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };
  const cancelLogoutHandler = () => {
    setPopupVisible(false);
  };

  const navigateHandler = (route) => {
    navigation.navigate(route);
  };

  const BackHandler = () => {
    navigation.goBack();
  };

  const getLanguageText = () => {
    const pickedLanguage = LANGUAGES.find(
      (item) => item.langCode === i18n.language
    );
    return pickedLanguage.text;
  };

  const MenuItem = ({ item, isLogout, children, theme }) => (
    <View style={[styles.menuItem]}>
      <Ionicons
        name={item.iconName}
        style={[
          styles.menuIcon,
          { color: isLogout ? theme.error : theme.text },
        ]}
      />
      <Text
        style={[
          styles.menuText,
          { color: isLogout ? theme.error : theme.text },
        ]}>
        {t(item.translationKey)}
      </Text>
      {children && (
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
          }}>
          {children}
        </View>
      )}
    </View>
  );

  const storeTheme = (theme) => {
    try {
      AsyncStorage.setItem("theme", theme);
    } catch (error) {
      console.log("Error in theme storing ", error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: SIZES.small + insets.top }]}>
      <View style={styles.TopContainer}>
        <TopTabPage text={t("profile.profile")} BackHandler={BackHandler} />
        <ProfilePictureData
          img={userData?.image}
          name={`${userData?.firstName} ${userData?.lastName}`}
          id={userData?.mat}
        />
      </View>

      <FlatList
        overScrollMode="never"
        bounces={false}
        data={PROFILEMENUDATA}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: SIZES.large,
          padding: 1.5 * SIZES.medium,
          paddingTop: 0,
        }}
        keyExtractor={(item, id) => id}
        renderItem={({ item, index }) => {
          const isLogout = item.type === "logout";
          const isDarkMode = item.type === "switch";
          const isLanguage = item.type === "language";

          return (
            <View key={index}>
              {
                <MyButton
                  noOpacity={isDarkMode}
                  pressHandler={() => {
                    if (isLogout) {
                      logoutHandler();
                    } else if (item.route) {
                      navigateHandler(item.route);
                    }
                  }}>
                  <MenuItem theme={theme} item={item} isLogout={isLogout}>
                    {isDarkMode && (
                      <Switch
                        style={{
                          height: SIZES.medium,
                          transform: [
                            { scaleX: isRTL ? -1.4 : 1.4 },
                            { scaleY: 1.4 },
                          ],
                        }}
                        trackColor={{
                          false: "#9d9c9e56",
                          true: theme.primary,
                        }}
                        thumbColor={isSwitchEnabled ? theme.white : "#f6f4f6"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isSwitchEnabled}
                      />
                    )}

                    {isLanguage && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: SIZES.small,
                        }}>
                        <Text
                          style={{
                            color: COLORS.gray,
                            fontFamily: FONTS.medium,
                            fontSize: SIZES.medium,
                          }}>
                          {getLanguageText()}
                        </Text>

                        <Ionicons
                          name={
                            isRTL
                              ? "chevron-back-outline"
                              : "chevron-forward-outline"
                          }
                          style={{
                            color: COLORS.gray,
                            fontSize: SIZES.medium * 1.5,
                          }}
                        />
                      </View>
                    )}
                  </MenuItem>
                </MyButton>
              }
            </View>
          );
        }}
      />

      {/* Logout Confirmation Popup */}

      <Modal
        transparent
        visible={popupVisible}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setPopupVisible(false);
        }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <CustomBottomSheet
            isVisible={popupVisible}
            overlay={true}
            backgroundBorderRaduis={20}
            onClose={() => setPopupVisible(false)}>
            <View
              style={[
                styles.popupContainer,
                { backgroundColor: theme.secondaryBackground },
              ]}>
              <View style={styles.customHandle} />
              <View
                style={[
                  styles.popupIconContainer,
                  { backgroundColor: theme.transparentError },
                ]}>
                <MaterialCommunityIcons
                  name="alert"
                  style={[styles.popupIcon, { color: theme.error }]}
                />
              </View>
              <Text style={[styles.popupMainText, { color: theme.text }]}>
                {t("profile.logout")}
              </Text>
              <Text style={[styles.popupSubText, { color: theme.text }]}>
                {t("profile.logout_confirmation")}
              </Text>
              <View style={styles.popupButtonContainer}>
                <MyButton pressHandler={() => cancelLogoutHandler()}>
                  <Text
                    style={[
                      styles.popupButton,
                      {
                        backgroundColor: COLORS.lightGray,
                        color: COLORS.darkGray,
                      },
                    ]}>
                    {t("profile.keep_logged_in")}
                  </Text>
                </MyButton>
                <MyButton pressHandler={() => confirmLogoutHandler()}>
                  <Text
                    style={[
                      styles.popupButton,
                      {
                        backgroundColor: theme.error,
                        color: theme.white,
                      },
                    ]}>
                    {t("profile.confirm_logout")}
                  </Text>
                </MyButton>
              </View>
            </View>
          </CustomBottomSheet>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SIZES.medium,
  },
  TopContainer: {
    padding: 1.5 * SIZES.medium,
    paddingTop: 0,
    gap: SIZES.xLarge,
  },
  menuContainer: {
    gap: SIZES.large,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.medium,
  },
  menuText: {
    fontFamily: FONTS.medium,
    fontSize: 1.4 * SIZES.medium,
  },
  menuIcon: {
    fontSize: 1.7 * SIZES.medium,
  },
  switchContainer: {
    flex: 1,
    alignItems: "flex-end",
  },

  // Popup Styles

  customHandle: {
    width: SIZES.xLarge,
    height: 0.5 * SIZES.small,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },

  popupContainer: {
    padding: SIZES.medium,
    alignItems: "center",
    gap: SIZES.medium,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  popupIconContainer: {
    padding: 10,
    minHeight: SIZES.xLarge,
    minWidth: SIZES.xLarge,
    borderRadius: SIZES.xLarge / 2,
  },
  popupIcon: {
    fontSize: SIZES.large,
  },
  popupMainText: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    letterSpacing: 3,
  },
  popupSubText: {
    fontSize: 1.2 * SIZES.medium,
    textAlign: "center",
    fontFamily: FONTS.medium,
  },
  popupButtonContainer: {
    flexDirection: "row",
    gap: SIZES.small,
  },
  popupButton: {
    padding: SIZES.medium,
    borderRadius: 10,
    fontFamily: FONTS.bold,
  },

  tabBar: {
    height: SIZES.large * 2.3,
    borderRadius: 50,
    marginBottom: SIZES.medium,
    marginTop: -SIZES.small,
    marginInline: SIZES.small,
    elevation: 0,
    position: "absolute",
  },
});
