import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { I18nManager, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeProvider";
import Home from "../screens/Home";
import Actions from "../screens/Actions";
import Scanner from "../screens/Scanner";
import { useTranslation } from "react-i18next";

const HomeStack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = I18nManager.isRTL || i18n.language === "ar";

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: theme.background },
      }}
      initialRouteName="Home">
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Actions" component={Actions} />
    </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({});
