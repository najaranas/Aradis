import { StyleSheet, SafeAreaView } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { COLORS, SIZES } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import CheckInternet from "../components/handlers/CheckInternet";
// import { Image } from "expo-image";
import { SvgXml } from "react-native-svg";
import { logoTextSvg } from "../constants/svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeProvider";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../contexts/AuthProvider";

export default function Loading() {
  const naviagation = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const { isLoginSaved, changeIsLoginSaved } = useAuth();

  const getStoredItem = async (item, defaultValue) => {
    try {
      const value = await AsyncStorage.getItem(item);
      return value || defaultValue;
    } catch (error) {
      console.error(`Error Reading ${item}:`, error);
      return defaultValue;
    }
  };

  useEffect(() => {
    const fetchThemeValue = async () => {
      const storedTheme = await getStoredItem("theme", theme);
      console.log("Stored theme:", storedTheme);
      toggleTheme(storedTheme);
    };

    // const fetchLoginCheckValue = async () => {
    //   const storedLoginCheck = await getStoredItem("isLoginSaved");
    //   console.log("Stored login Check :", storedLoginCheck);
    //   const timeOut = setTimeout(() => {
    //     if (storedLoginCheck === "true") {
    //       naviagation.reset({
    //         index: 0,
    //         routes: [{ name: "TabNavigator", params: { screen: "Home" } }],
    //       });
    //     } else {
    //       naviagation.reset({ index: 0, routes: [{ name: "Login" }] });
    //     }
    //   }, 2000);

    //   return () => clearTimeout(timeOut);
    // };
    // fetchLoginCheckValue();

    fetchThemeValue();

    const timeOut = setTimeout(() => {
      naviagation.reset({ index: 0, routes: [{ name: "Login" }] });
    }, 2000);

    return () => clearTimeout(timeOut);
  }, []);

  useEffect(() => {
    requestAnimationFrame(async () => {
      await NavigationBar.setBackgroundColorAsync(COLORS.primary);
      await NavigationBar.setButtonStyleAsync("light");
    });
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
