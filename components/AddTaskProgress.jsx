import {
  I18nManager,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { useTheme } from "../contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function AddTaskProgress({
  size,
  progress,
  sectionTitle,
  nextStep,
  formatText,
}) {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const isRTL = I18nManager.isRTL || i18n.language === "ar";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.ProgressHeader]}>
        <View
          style={[
            styles.ProgressHeaderTextContainer,
            {
              alignItems: isRTL ? "flex-end" : "flex-start",
            },
          ]}>
          <Text style={[styles.ProgressSectionTitle, { color: theme.text }]}>
            {sectionTitle && t(sectionTitle)}
          </Text>
          <Text style={styles.progressNextStep}>{nextStep && t(nextStep)}</Text>
        </View>
        <Progress.Circle
          size={size}
          progress={progress}
          thickness={5}
          color={COLORS.primary}
          unfilledColor="#f0eeee"
          borderWidth={0}
          showsText={true}
          formatText={() => formatText}
          textStyle={styles.progressText}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  ProgressHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  ProgressHeaderTextContainer: {
    gap: 0.2 * SIZES.small,
  },
  ProgressSectionTitle: {
    fontSize: 1.4 * SIZES.medium,
    fontFamily: FONTS.medium,
  },
  progressNextStep: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  progressText: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
});
