// TabSelector.js
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { useTranslation } from "react-i18next";

export function TabSelector({ activeTab, onTabChange, tabs, isRTL }) {
  const { t } = useTranslation();
  return (
    <View
      style={{
        alignItems: isRTL ? "flex-end" : "flex-start",
      }}>
      <View
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          gap: SIZES.medium,
          alignItems: "center",
          borderColor: COLORS.lightGray,
          borderBottomWidth: 1,
        }}>
        {tabs.map((tab) => (
          <Pressable key={tab.id} onPress={() => onTabChange(tab.id)}>
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && {
                  color: COLORS.primary,
                  borderColor: COLORS.primary,
                  borderBottomWidth: 2,
                  fontFamily: FONTS.semiBold,
                },
              ]}>
              {t(`cardDetails.taskDetails.${tab.label}`)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  tabLabel: {
    color: COLORS.gray,
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    paddingVerticalEnd: SIZES.medium,
  },
});
