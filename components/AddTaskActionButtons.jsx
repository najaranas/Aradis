import { I18nManager, StyleSheet, Text, View } from "react-native";
import React from "react";
import MyButton from "./MyButton";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "react-i18next";
import { COLORS, SIZES } from "../constants/theme";

export default function AddTaskActionButtons({
  disabled,
  lastPage,
  handleContinueBtn,
  handleBackBtn,
  backTranslationText,
  finishTranslationText,
  continiueTranslationText,
}) {
  const { theme } = useTheme();

  return (
    <View style={[styles.buttonContainer]}>
      {/* Back Button */}
      <MyButton
        pressHandler={handleBackBtn}
        parentStyle={{ flex: 1 }}
        disabled={disabled}>
        <View
          style={[
            styles.backButton,
            { color: theme.text },
            disabled && {
              backgroundColor: theme.lightGray,
              borderColor: theme.lightGray,
              opacity: 0.4,
            },
          ]}>
          <Text style={[styles.backButtonText, { color: theme.text }]}>
            {backTranslationText}
          </Text>
        </View>
      </MyButton>

      {/* Continue Button   */}
      <MyButton pressHandler={handleContinueBtn} parentStyle={{ flex: 1 }}>
        <View style={styles.continueButton}>
          <Text style={styles.continueButtonText}>
            {lastPage ? finishTranslationText : continiueTranslationText}
          </Text>
        </View>
      </MyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  // Button Container Styles
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SIZES.small,
  },
  backButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: SIZES.medium,
    paddingVertical: 1.3 * SIZES.medium,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: COLORS.black,
    fontSize: SIZES.medium,
  },
  disabledButton: {
    opacity: 0.4,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    paddingVertical: 1.3 * SIZES.medium,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
});
