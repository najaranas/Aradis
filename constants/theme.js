/**
 * @typedef {Object} ThemeColors
 * @property {string} primary - Primary color.
 * @property {string} secondary - Secondary color.
 * @property {string} accent - Accent color.
 * @property {string} darkGray - Dark gray color.
 * @property {string} gray - gray color.
 * @property {string} lightGray - Light gray color.
 * @property {string} error - Error color.
 * @property {string} transparentError - Transparent error color.
 * @property {string} overlay - Overlay color.
 * @property {string} shadow - shadow color.
 * @property {string} text - Text color.
 * @property {string} background - Background color.
 */

/**
 * @type {Object.<string, ThemeColors>}
 */

import { Dimensions, PixelRatio, StatusBar } from "react-native";

const fontScale = PixelRatio.getFontScale();
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const SIZES = {
  small: 9 * fontScale,
  medium: 14 * fontScale,
  large: 30 * fontScale,
  xLarge: 50 * fontScale,
  screenHeight: SCREEN_HEIGHT,
  screenWidth: SCREEN_WIDTH,
  statusBarHeight: STATUSBAR_HEIGHT,
};

const COLORS = {
  primary: "#3E7B27",
  // primary: "#2FCC41",

  secondary: "#99c975",
  darkGray: "#4C4E52",
  gray: "#808080",
  lightGray: "#d4d4d4",
  red: "#FC4100",
  transparentRed: "rgba(224, 10, 10, 0.212)",
  semiTransparentBlack: "rgba(0, 0, 0, 0.5)",
  blue: "#258CE6",
  white: "#FFFFFF",
  black: "#000000",
};

// const COLORS = {
const THEME = {
  logoColor: "#FFF",
  logoTextColor: "#FFF",
  LIGHT: {
    name: "light",
    // primary: "#2FCC41",
    primary: "#3E7B27",
    secondary: "#99c975",
    darkGray: "#4C4E52",
    gray: "#4C4E52",
    lightGray: "#d4d4d4",
    error: "#FC4100",
    transparentError: "rgba(224, 10, 10, 0.212)",
    overlay: "rgba(0, 0, 0 , 0.7)",
    shadow: "rgba(0, 0, 0, 0.1)",
    text: "#000",
    background: "#FFF",
    secondaryBackground: "#FFF",
    lightHover: "#f6f6f6",
    white: "#FFF",
    black: "#000",
  },
  DARK: {
    name: "dark",
    // primary: "#2FCC41",
    primary: "#3E7B27",
    secondary: "#99c975",
    darkGray: "#4C4E52",
    gray: "#808080",
    lightGray: "#83838366",
    error: "#FC4100",
    transparentError: "rgba(224, 10, 10, 0.212)",
    overlay: "rgba(0, 0, 0 , 0.7)",
    shadow: "rgba(0, 0, 0, 0.1)",
    text: "#d4d4d4",
    background: "#121212",
    secondaryBackground: "#1f1f1f",
    lightHover: "#5a5a5aa7",
    white: "#FFF",
    black: "#000",
  },
};

const FONTS = {
  bold: "InterBold",
  semiBold: "InterSemiBold",
  medium: "InterMedium",
  regular: "InterRegular",
  light: "InterLight",
};

export { SIZES, COLORS, FONTS, THEME };
