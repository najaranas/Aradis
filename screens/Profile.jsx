//
// Prfile.jsx
// This component displays the user's profile information and settings.
// It includes options for changing the theme, language, and logging out.
// It uses React Navigation for navigation, AsyncStorage for storing user data, and Expo's NavigationBar API for setting the navigation bar color.
// It also includes a check for internet connectivity using a custom component.
//

import {
  Button,
  FlatList,
  I18nManager,
  Modal,
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
import CustomBottomSheet from "../components/CustomBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  getStoredValue,
  removeStoredValue,
  storeValue,
} from "../utils/storage";
import { removeNotificationToken } from "../utils/api/logoutApi";
import { useTheme } from "../hooks/useTheme";
import { useUser } from "../hooks/useUser";
import { BarIndicator } from "react-native-indicators";

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const [isLogOutLoading, setIsLogOutLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(
    theme.name === "light" ? false : true
  );

  const { t, i18n } = useTranslation();
  const isRTL = I18nManager.isRTL || i18n.language === "ar";
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { userData, clearUserData } = useUser();

  useEffect(() => {
    const storeTheme = async () => {
      if (isSwitchEnabled) {
        await storeValue("theme", "DARK");
      } else {
        await storeValue("theme", "LIGHT");
      }
    };
    storeTheme();
  }, [isSwitchEnabled]);

  /**
   * Toggles the switch for dark mode and light mode.
   * Sets the state of the switch and calls the toggleTheme function.
   * The toggleTheme function is responsible for changing the theme of the app.
   * This function is called when the user toggles the switch.
   */
  const toggleSwitch = () => {
    setIsSwitchEnabled((prev) => !prev);
    toggleTheme();
  };

  /**
   * Handles the logout process.
   * Sets the popupVisible state to true to show the logout confirmation popup.
   * This function is called when the user presses the logout button.
   */
  const logoutHandler = () => {
    setPopupVisible(true);
  };

  /**
   * Handles the confirmation of logout.
   * Removes the notification token and user data from AsyncStorage.
   * Resets the navigation stack to the login screen.
   * This function is called when the user confirms logout in the popup.
   */
  const confirmLogoutHandler = async () => {
    try {
      setIsLogOutLoading(true);
      const token = await getStoredValue("token");
      const notificationToken = await getStoredValue("notificationToken");

      await removeNotificationToken(notificationToken, userData?.id, token);
      removeStoredValue("token");
      removeStoredValue("data");
      clearUserData();
    } catch (error) {
      console.log("Error in deleting token", error);
    } finally {
      setIsLogOutLoading(false);
    }

    setPopupVisible(false);
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  /**
   * Handles the cancellation of logout.
   * This function is called when the user presses the cancel button in the popup.
   * It sets the popupVisible state to false.
   */
  const cancelLogoutHandler = () => {
    setPopupVisible(false);
  };

  /**
   * Handles the navigation to different screens.
   * This function is called when the user presses a menu item.
   * It navigates to the specified route.
   *
   * @param {string} route - The route to navigate to.
   */
  const navigateHandler = (route) => {
    navigation.navigate(route);
  };

  /**
   * Handles the back navigation.
   * This function is called when the user presses the back button.
   * It navigates back to the previous screen.
   */
  const BackHandler = () => {
    navigation.goBack();
  };

  /**
   * Gets the text for the selected language.
   * This function is used to display the selected language in the language menu item.
   * @returns {string} - The text for the selected language.
   */
  const getLanguageText = () => {
    const pickedLanguage = LANGUAGES.find(
      (item) => item.langCode === i18n.language
    );
    return pickedLanguage.text;
  };

  /**
   * MenuItem component
   * This component is used to display each menu item in the profile screen.
   * It includes an icon, text, and an optional switch for dark mode.
   * @param {object} item - The menu item data.
   * @param {boolean} isLogout - Indicates if the item is for logout.
   * @param {boolean} isDarkMode - Indicates if the item is for dark mode.
   * @param {boolean} isLanguage - Indicates if the item is for language selection.
   * @param {object} theme - The current theme.
   * @returns {JSX.Element} - The rendered menu item.
   */
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

  return (
    <View style={[styles.container, { paddingTop: SIZES.small + insets.top }]}>
      <View style={styles.TopContainer}>
        <TopTabPage text={t("profile.profile")} BackHandler={BackHandler} />
        <ProfilePictureData
          img={userData.image || workerMan}
          name={`${userData?.firstName} ${userData?.lastName}`}
          id={userData?.mat}
          theme={theme}
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
                <MyButton
                  pressHandler={() => cancelLogoutHandler()}
                  parentStyle={{ flex: 1, flexGrow: 1 }}>
                  <View
                    style={[
                      styles.button,
                      { backgroundColor: COLORS.lightGray },
                    ]}>
                    <Text
                      style={[
                        styles.popupButton,
                        {
                          color: COLORS.darkGray,
                          textAlign: "center",
                        },
                      ]}>
                      {t("profile.keep_logged_in")}
                    </Text>
                  </View>
                </MyButton>
                <MyButton
                  pressHandler={() => confirmLogoutHandler()}
                  parentStyle={{ flex: 1, flexGrow: 1 }}
                  disabled={isLogOutLoading}>
                  <View
                    style={[
                      styles.button,
                      {
                        backgroundColor: theme.error,
                        opacity: isLogOutLoading ? 0.5 : 1,
                      },
                    ]}>
                    {isLogOutLoading ? (
                      <BarIndicator
                        color={COLORS.white}
                        count={4}
                        size={1.4 * SIZES.medium}
                        animationDuration={3000}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.popupButton,
                          {
                            color: theme.white,
                            textAlign: "center",
                          },
                        ]}>
                        {t("profile.confirm_logout")}
                      </Text>
                    )}
                  </View>
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
  button: {
    gap: SIZES.small,
    padding: SIZES.medium,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: SIZES.xLarge,
    borderRadius: 10,
  },
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
    // padding: SIZES.medium,
    // borderRadius: 10,
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
