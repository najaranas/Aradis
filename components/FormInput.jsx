import { I18nManager, StyleSheet, TextInput, View } from "react-native";
import React, { useEffect } from "react";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "react-i18next";

export default function FormInput({
  children,
  keyboardType,
  placeholder,
  isSecureTextEntry,
  passwordEyeIcon,
  value,
  type,
  onChangeText,
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.formInputContainer,
        {
          borderWidth: theme.name === "light" ? 1 : 0.5,
        },
      ]}>
      {children && children}
      <TextInput
        value={value && value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onChangeText={(text) => onChangeText(text, type)}
        numberOfLines={1}
        secureTextEntry={
          isSecureTextEntry !== undefined ? isSecureTextEntry : false
        }
        style={[
          styles.input,
          {
            textAlign: I18nManager.isRTL ? "right" : "left",
            color: theme.text,
          },
        ]}
        placeholderTextColor={COLORS.gray}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {passwordEyeIcon && (
        <View style={styles.eyeIconContainer}>{passwordEyeIcon}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.small,
    borderRadius: 10,
    padding: SIZES.medium,
    width: "100%",
    borderColor: COLORS.lightGray,
  },

  eyeIconContainer: {
    marginLeft: SIZES.small,
    // marginLeft: 30,
  },

  input: {
    color: COLORS.black,
    fontSize: 1.2 * SIZES.medium,
    flex: 1,
    fontFamily: FONTS.medium,
  },
});
