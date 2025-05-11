import { I18nManager, StyleSheet, Text, View } from "react-native";
import { FONTS, SIZES } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import MyButton from "./MyButton";
import { useTheme } from "../hooks/useTheme";

export default function TopTabPage({ text, children, BackHandler }) {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = I18nManager.isRTL || i18n.language === "ar";

  return (
    <View style={styles.container}>
      <MyButton pressHandler={BackHandler}>
        <Ionicons
          name={isRTL ? "arrow-forward-outline" : "arrow-back-outline"}
          style={[styles.icon, { color: theme.text }]}
        />
      </MyButton>
      <Text style={[styles.text, { color: theme.text }]}>{text}</Text>
      {children ? (
        children
      ) : (
        <View style={{ pointerEvents: "none" }}>
          <Ionicons
            name="arrow-forward-outline"
            style={{ ...styles.icon, opacity: 0, color: theme.text }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    fontSize: 0.9 * SIZES.large,
  },
  text: {
    fontSize: SIZES.large,
    fontFamily: FONTS.medium,
    textAlign: "center",
    flex: 1,
  },
});
