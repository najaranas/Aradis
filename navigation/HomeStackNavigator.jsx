//
// HomeStackNavigator.jsx
// This file defines a stack navigator for the home screen and actions screen.
//

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { I18nManager, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";
import Home from "../screens/Home";
import Actions from "../screens/Actions";
import { useTranslation } from "react-i18next";
import Scanner from "../screens/Scanner";

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
