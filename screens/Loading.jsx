//
// Loading.jsx
// This component is responsible for displaying a loading screen while checking the user's login status and theme preference.
// It uses React Navigation for navigation, AsyncStorage for storing user data, and Expo's NavigationBar API for setting the navigation bar color.
// It also includes a check for internet connectivity using a custom component.
//

import { StyleSheet, SafeAreaView } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { COLORS, SIZES } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import CheckInternet from "../components/handlers/CheckInternet";
import { SvgXml } from "react-native-svg";
import { logoTextSvg } from "../constants/svg";
import { useTheme } from "../hooks/useTheme";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { getStoredValue } from "../utils/storage";
import { useUser } from "../hooks/useUser";

export default function Loading() {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const { saveUserData } = useUser();

  /**
   * Fetches the stored theme value from AsyncStorage and applies it.
   * If no value is found, it defaults to the current theme.
   */
  const fetchThemeValue = async () => {
    const storedTheme = await getStoredValue("theme", theme);
    console.log("Stored theme:", storedTheme);
    toggleTheme(storedTheme);
  };

  /**
   * Fetches the stored token from AsyncStorage and checks if the user is logged in.
   * If the token is found, it retrieves the user data and navigates to the Home screen.
   * If not, it navigates to the Login screen.
   */
  const fetchisLoggedIn = async () => {
    const storedToken = await getStoredValue("token");
    console.log("Stored token :", storedToken);
    const timeOut = setTimeout(async () => {
      if (storedToken) {
        const userData = await getStoredValue("data", {});
        console.log(userData);
        saveUserData(JSON.parse(userData));
        navigation.reset({
          index: 0,
          routes: [{ name: "TabNavigator", params: { screen: "Home" } }],
        });
      } else {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      }
    }, 2000);

    return () => clearTimeout(timeOut);
  };

  /**
   * Sets the navigation bar color and button style based on the current theme.
   * This is done using the NavigationBar API from Expo.
   */
  useEffect(() => {
    requestAnimationFrame(async () => {
      await NavigationBar.setBackgroundColorAsync(COLORS.primary);
      await NavigationBar.setButtonStyleAsync("light");
    });

    fetchisLoggedIn();

    fetchThemeValue();
  }, []);

  return (
    <SafeAreaView style={[styles.mainContainer, styles.flexCenter]}>
      <CheckInternet />
      <StatusBar backgroundColor="transparent" style={"light"} />
      <SvgXml xml={logoTextSvg} style={styles.logo} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  flexCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    // width: "100%",
    // height: "100%",
    resizeMode: "contain",
    width: 5 * SIZES.xLarge,
    height: 5 * SIZES.xLarge,
  },
  text: {
    color: COLORS.white,
    color: COLORS.primary,
    fontSize: SIZES.xLarge,
    letterSpacing: 4,
    textAlign: "center",
  },
});
