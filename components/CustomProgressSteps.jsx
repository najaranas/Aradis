import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { useTheme } from "../contexts/ThemeProvider";
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";
import { useTranslation } from "react-i18next";

export default function CustomProgressSteps({ DATA }) {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(
    DATA?.activeStep <= 0
      ? 0
      : DATA?.activeStep - 1 >= DATA?.data.length
      ? DATA?.data.length - 1
      : DATA?.activeStep - 1
  );
  const [isComplete, setIsComplete] = useState(
    DATA?.activeStep >= DATA?.data.length ? true : false
  );

  useEffect(() => {
    setActiveStep(
      DATA?.activeStep <= 0 || isNaN(DATA?.activeStep)
        ? 0
        : DATA?.activeStep - 1 >= DATA?.data.length
        ? DATA?.data.length - 1
        : DATA?.activeStep - 1
    );
    setIsComplete(DATA?.activeStep >= DATA?.data.length ? true : false);
  }, [DATA]);

  const { theme } = useTheme();

  return (
    <View>
      <ProgressSteps
        activeStep={activeStep}
        isComplete={isComplete}
        topOffset={0}
        marginBottom={0}
        borderWidth={2}
        progressBarColor={theme.lightGray}
        labelFontFamily={FONTS.medium}
        labelFontSize={SIZES.medium}
        labelColor={theme.lightGray}
        disabledStepIconColor={theme.lightGray}
        activeStepIconBorderColor={COLORS.primary}
        completedCheckColor={COLORS.white}
        completedProgressBarColor={COLORS.primary}
        completedLabelColor={COLORS.primary}
        completedStepIconColor={COLORS.primary}
        completedStepNumColor={COLORS.primary}
        activeStepNumColor={COLORS.primary}
        activeLabelColor={COLORS.primary}>
        {DATA?.data?.map((item, index) => {
          return (
            <ProgressStep
              key={index}
              // label={t("item.label")}
              label={t(`cardDetails.progressSteps.${item.id}`)}
              removeBtnRow
            />
          );
        })}
      </ProgressSteps>
    </View>
  );
}

const styles = StyleSheet.create({});
