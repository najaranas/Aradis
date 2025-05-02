import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import MyButton from "../MyButton";
import { useTheme } from "../../contexts/ThemeProvider";
import Priority from "../Priority";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export default function CardHeader({
  TagNumber,
  category,
  categoryColor,
  priority,
  isRTL,
}) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.container, { borderColor: theme.lightGray }]}>
      <View style={[styles.header, isRTL && { flexDirection: "row-reverse" }]}>
        <Text style={[styles.TagNumber, { color: theme.text }]}>
          {TagNumber}
        </Text>
        <View
          style={{
            backgroundColor: categoryColor
              ? categoryColor.bgColor
              : "transparent",
            padding: 1.2 * SIZES.small,
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: categoryColor ? categoryColor.color : "transparent",
          }}>
          <Text
            style={{
              color: categoryColor ? categoryColor.color : COLORS.gray,
              fontFamily: FONTS.medium,
            }}>
            {category}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          gap: 4,
        }}>
        <Text
          style={{
            color: COLORS.gray,
            fontFamily: FONTS.regular,
            fontSize: SIZES.medium,
          }}>
          {t("cardDetails.priority.label")}:
        </Text>
        <Priority priority={priority} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingBottom: SIZES.medium,
    gap: SIZES.small,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SIZES.small,
  },

  TagNumber: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
  },
});
