import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeProvider";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  cancelAnimation,
  runOnJS,
} from "react-native-reanimated";
import { FORMTOAST_TYPES } from "../constants/data";
import MyButton from "./MyButton";

export default function CustomToast({
  type,
  message,
  textStyle,
  iconStyle,
  duration,
  isActive,
  setToast,
  toastTopPosition,
}) {
  const notificationType =
    FORMTOAST_TYPES[type?.toLowerCase()] || FORMTOAST_TYPES.info;
  const { theme } = useTheme();

  const toastPosition = useSharedValue(SIZES.screenWidth);
  const progressWidth = useSharedValue("100%");
  const animationStartTime = useRef(Date.now());
  const animationDuration = useRef(duration);

  useEffect(() => {
    if (isActive) {
      toastPosition.value = withSpring(0, { damping: 10, stiffness: 100 });
      progressWidth.value = "100%";
      animationDuration.current = duration;

      startProgressAnimation();
    }
  }, [isActive]);

  const dismissToast = () => {
    toastPosition.value = withSpring(SIZES.screenWidth);
    if (setToast) {
      setToast((prev) => ({ ...prev, show: false }));
    }
  };

  const startProgressAnimation = () => {
    animationStartTime.current = new Date();
    progressWidth.value = withTiming(
      0,
      {
        duration: animationDuration.current,
      },
      (finished) => {
        if (finished) {
          runOnJS(dismissToast)();
        }
      }
    );
  };
  const pauseProgressAnimation = () => {
    const currentTime = new Date();
    animationDuration.current -= Math.max(
      0,
      currentTime - animationStartTime.current
    );
    cancelAnimation(progressWidth);
  };

  const toastAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toastPosition.value }],
  }));

  const progressAnimationStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  return (
    <Animated.View
      onTouchStart={pauseProgressAnimation}
      onTouchEnd={startProgressAnimation}
      style={[
        styles.toastContainer,
        { backgroundColor: theme.background, top: toastTopPosition },
        toastAnimationStyle,
      ]}>
      <View style={[styles.contentContainer]}>
        <View style={[styles.contentContainer, { flex: 1 }]}>
          <MaterialCommunityIcons
            name={notificationType.icon}
            style={
              iconStyle || {
                fontSize: 2 * SIZES.medium,
                color: notificationType.iconColor,
              }
            }
          />
          <Text
            style={
              textStyle || {
                fontSize: 1.2 * SIZES.medium,
                color: theme.text,
                fontFamily: FONTS.regular,
                flexShrink: 1,
              }
            }>
            {message || "Notification Message"}
          </Text>
        </View>

        <MyButton
          // parentStyle={{ flex: 1, alignItems: "flex-end" }}
          pressHandler={dismissToast}>
          <View style={styles.closeButton}>
            <FontAwesome name="close" style={styles.closeIcon} />
          </View>
        </MyButton>
      </View>
      <Animated.View
        style={[
          styles.progressBar,
          { backgroundColor: notificationType.iconColor },
          progressAnimationStyle,
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    padding: SIZES.small,
    position: "absolute",
    right: SIZES.medium,
    left: SIZES.medium,
    gap: SIZES.small,
    backgroundColor: "red",
    zIndex: 1000,
    borderRadius: 8,
    borderColor: COLORS.gray,
    borderWidth: 0.5,
    // Box shadow for Android
    elevation: 10,
    // Box shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SIZES.small,
  },

  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  closeIcon: {
    fontSize: 1.2 * SIZES.medium,
    color: COLORS.gray,
  },
  progressBar: {
    height: SIZES.small / 2,
    borderRadius: 3,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "red",
  },
});
