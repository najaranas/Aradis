import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  I18nManager,
  Pressable,
  ActivityIndicator,
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
import { useTheme } from "../contexts/ThemeProvider";
import * as NavigationBar from "expo-navigation-bar";
import { useTranslation } from "react-i18next";
import CustomToast from "../components/CustomToast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const { changeUserData } = useAuth();

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

  const storeToken = async (value) => {
    try {
      await AsyncStorage.setItem("token", value);
    } catch (error) {
      console.error("Error Saving Token:", error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/sign-in`,
        {
          method: "POST",
          body: JSON.stringify({
            email: userFieldsData.email,
            password: userFieldsData.password,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const user = await res.json();
      console.log(user);
      console.log(res);

      if (res.ok && user) {
        changeUserData({
          ...user.data,
          role: user.data.role,
          userService: user.data.userService,
          userCategory: user.data.userCategory,
          firstName: user.data.firstName,
          lastName: user.data.lastName,
          image: user.data.image,
        });
        // store token in local storage
        storeToken(user.token);

        navigation.reset({
          index: 0,
          routes: [{ name: "TabNavigator", params: { screen: "Home" } }],
        });
        return;
      } else {
        setToast({ message: user.message, type: "error", show: true });
      }
    } catch (error) {
      setToast({
        message: t("login.connection_error"),
        type: "error",
        show: true,
      });
    } finally {
      setIsLoading(false); // Set loading to false when done
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

    setIsLoading(true); // Set loading to true before fetch
    fetchData();
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
          <View style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
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
