import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MyButton from "./MyButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FONTS, SIZES } from "../constants/theme";
import { useTranslation } from "react-i18next";

const priorities = {
  normal: {
    label: "Normal",
    bgColor: "#0070C030",
    icon: "alert-circle",
    iconColor: "#0777e7",
  },
  urgent: {
    label: "Urgent",
    bgColor: "#ffaa0030",
    icon: "alert",
    iconColor: "#ffaa00",
  },
  "t.urgent": {
    label: "T.Urgent",
    bgColor: "#FF000030",
    icon: "alert-octagon",
    iconColor: "#FF0000",
  },
};

export default function Priority({ priority }) {
  const { t } = useTranslation();
  const currentPriority = priorities[priority] || "";

  return (
    <MyButton noOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: currentPriority?.bgColor,
          padding: 4,
          borderRadius: 5,
          gap: 2,
        }}>
        <MaterialCommunityIcons
          name={currentPriority.icon}
          style={{
            fontSize: 1.2 * SIZES.medium,
            color: currentPriority?.iconColor,
          }}
        />
        <Text
          style={{
            fontSize: 1.3 * SIZES.small,
            fontFamily: FONTS.regular,
            color: currentPriority?.iconColor,
          }}>
          {t(
            `cardDetails.priority.options.${
              priority === "t.urgent" ? "t_urgent" : priority
            }`
          )}
        </Text>
      </View>
    </MyButton>
  );
}

const styles = StyleSheet.create({});
