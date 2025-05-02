import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "../contexts/ThemeProvider";
import { FONTS, SIZES } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
export default function TagFpsHeader({ text, isRTL, children }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.headerContainer,
        isRTL && { flexDirection: "row-reverse" },
      ]}>
      {children}
      <Text style={[styles.Pagetitle, { color: theme.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SIZES.small,
  },
  Pagetitle: {
    fontSize: 1.3 * SIZES.medium,
    fontFamily: FONTS.medium,
    textAlign: "center",
    flexShrink: 1,
  },
});
