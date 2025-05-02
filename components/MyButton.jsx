import { Text, TouchableOpacity } from "react-native";
import React from "react";

export default function MyButton({
  children,
  pressHandler,
  noOpacity,
  parentStyle,
  disabled,
}) {
  return (
    <TouchableOpacity
      disabled={disabled && disabled}
      style={parentStyle && parentStyle}
      onPress={pressHandler && (() => pressHandler())}
      activeOpacity={noOpacity ? 1 : 0.3}>
      {children}
    </TouchableOpacity>
  );
}
