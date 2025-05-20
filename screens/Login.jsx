//
// Loading.jsx
// This component is responsible for displaying a loading screen while checking
// the user's login status and theme preference. It uses React Navigation for navigation,
// AsyncStorage for storing user data, and Expo's NavigationBar API for setting the navigation bar color.
// It also includes a check for internet connectivity using a custom component.
//

import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { aradisBigLogo } from "../constants/dataImage";
import FormInput from "../components/FormInput";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import MyButton from "../components/MyButton";
import { useNavigation } from "@react-navigation/native";
import CheckInternet from "../components/handlers/CheckInternet";
import { useTheme } from "../hooks/useTheme";
import * as NavigationBar from "expo-navigation-bar";
import { useTranslation } from "react-i18next";
import CustomToast from "../components/CustomToast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getStoredValue, storeValue } from "../utils/storage";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from "react-native-indicators";
import {
  authenticateUser,
  registerNotificationToken,
} from "../utils/api/loginApi";
import { useUser } from "../hooks/useUser";

export default function Login() {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);
  const [localChecked, setLocalChecked] = useState(false);
  const [userFieldsData, setUserFieldsData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const isRTL = i18n.language === "ar";
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { saveUserData } = useUser();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    requestAnimationFrame(async () => {
      await NavigationBar.setBackgroundColorAsync(theme.background);
      await NavigationBar.setButtonStyleAsync(
        theme.name === "light" ? "dark" : "light"
      );
    });
  }, [theme.name]);

  const referenceIcon = (
    <MaterialIcons
      name="numbers"
      style={[styles.icon, { color: theme.darkGray }]}
    />
  );

  const passwordIcon = (
    <MaterialIcons
      name="lock-outline"
      style={[styles.icon, { color: theme.darkGray }]}
    />
  );

  const passwordEyeIcon = (
    <Feather
      name={isSecureTextEntry ? "eye-off" : "eye"}
      style={[styles.icon, { color: theme.darkGray }]}
      onPress={() => {
        setIsSecureTextEntry((prev) => !prev);
      }}
    />
  );

  const checkData = (data, type) => {
    switch (type) {
      case "email":
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(data);
      case "password":
        const passwordPattern =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
        return passwordPattern.test(data);
      default:
        break;
    }
  };

  const handleLoginRequest = async () => {
    try {
      const user = await authenticateUser(
        userFieldsData.email,
        userFieldsData.password
      );

      console.log(user?.data);
      if (
        user?.data?.role === "user" &&
        user?.data?.userCategory === "operational"
      ) {
        saveUserData(user?.data);
        await storeValue("token", user?.token);
        await storeValue("data", JSON.stringify(user?.data));
        const notificationToken = await getStoredValue("notificationToken");
        console.log("Notification Token:", notificationToken);
        console.log("User data", user);
        if (notificationToken) {
          await registerNotificationToken(
            notificationToken,
            user?.data?.id,
            user?.token
          );
        }
        navigation.reset({
          index: 0,
          routes: [{ name: "TabNavigator", params: { screen: "Home" } }],
        });
      } else {
        setToast({
          message: t("login.access_denied"),
          type: "error",
          show: true,
        });
      }
    } catch (error) {
      setToast({
        message: error.message || t("login.connection_error"),
        type: "error",
        show: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginPressHandler = () => {
    const emailCheck = checkData(userFieldsData?.email, "email");
    const passwordCheck = checkData(userFieldsData?.password, "password");

    if (!emailCheck) {
      setToast({
        show: true,
        message: t("login.email_pattern_error"),
        type: "error",
      });
      return;
    } else if (!passwordCheck) {
      setToast({
        show: true,
        message: t("login.password_pattern_error"),
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    handleLoginRequest();
  };

  const onChangeText = (text, type) => {
    setUserFieldsData((prev) => ({ ...prev, [type]: text }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
            paddingTop: insets.top + SIZES.small,
          },
        ]}>
        <CustomToast
          type={toast.type}
          duration={3000}
          isActive={toast.show}
          message={toast.message}
          setToast={setToast}
          toastTopPosition={insets.top + SIZES.medium}
        />
        <CheckInternet />
        <StatusBar
          backgroundColor="transparent"
          style={theme.name === "dark" ? "light" : "dark"}
        />

        <View
          style={{
            gap: SIZES.small,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Image source={aradisBigLogo} style={styles.logo} />
          <Text
            style={[
              styles.loginText,
              {
                color: theme.text,
                textAlign: "center",
              },
            ]}>
            {t("login.title")}
          </Text>
        </View>

        <View style={[styles.formContainer]}>
          <FormInput
            type={"email"}
            placeholder={t("login.placeholder_reference")}
            keyboardType={"email-address"}
            onChangeText={onChangeText}
            isRTL={isRTL}>
            {referenceIcon}
          </FormInput>

          <FormInput
            type={"password"}
            placeholder={t("login.placeholder_password")}
            keyboardType={"default"}
            onChangeText={onChangeText}
            isSecureTextEntry={isSecureTextEntry}
            passwordEyeIcon={passwordEyeIcon}
            isRTL={isRTL}>
            {passwordIcon}
          </FormInput>

          {/* Check Box */}

          {/* <View
            onPress={handleCheckBox}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: SIZES.small,
            }}>
            <MyButton pressHandler={handleCheckBox}>
              <Text style={[styles.saveText, { color: COLORS.gray }]}>
                {t("login.remember_me")}
              </Text>
            </MyButton>
            <BouncyCheckbox
              isChecked={localChecked}
              size={SIZES.large * 0.7}
              fillColor={theme.primary}
              unFillColor={theme.background}
              text={t("login.remember_me")}
              disableText={true}
              iconStyle={{
                borderRadius: 6,
                borderWidth: 1.6,
                borderColor: theme.primary,
              }}
              innerIconStyle={{
                borderRadius: 6,
              }}
              textStyle={{
                textDecorationLine: "none",
                color: theme.text,
              }}
              onPress={() => handleCheckBox()}
            />
          </View> */}
        </View>

        <MyButton pressHandler={() => loginPressHandler()} disabled={isLoading}>
          <View style={[styles.button, { opacity: isLoading ? 0.5 : 1 }]}>
            {isLoading ? (
              <View>
                <BarIndicator
                  color={COLORS.white}
                  count={4}
                  size={1.4 * SIZES.medium}
                  animationDuration={3000}
                />
              </View>
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: theme.white,
                  },
                ]}>
                {t("login.login_button")}
              </Text>
            )}
          </View>
        </MyButton>

        <View style={[styles.forgetPassContainer]}>
          <Text
            style={[
              styles.forgetPassTitle,
              {
                color: theme.primary,
              },
            ]}>
            {t("login.forgot_password")}
          </Text>
          <Text
            style={[
              styles.forgetPassText,
              {
                color: theme.gray,
              },
            ]}>
            {t("login.forgot_password_text")}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SIZES.large,
    padding: 1.5 * SIZES.medium,
  },
  formContainer: {
    gap: SIZES.medium,
    width: "100%",
    justifyContent: "flex-start",
  },
  logo: {
    width: 5 * SIZES.xLarge,
    height: 50,
    resizeMode: "contain",
  },
  loginText: {
    fontFamily: FONTS.regular,
    fontSize: 1.8 * SIZES.medium,
  },
  icon: {
    fontSize: 1.6 * SIZES.medium,
  },
  saveText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SIZES.small,
    padding: SIZES.medium,
    backgroundColor: COLORS.primary,

    minWidth: "100%",
    minHeight: SIZES.xLarge,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    textAlign: "center",
  },
  forgetPassContainer: {
    gap: 5,
    width: "100%",
    justifyContent: "center",
  },
  forgetPassTitle: {
    fontFamily: FONTS.bold,
    fontSize: 1.2 * SIZES.medium,
  },
  forgetPassText: {},
});
