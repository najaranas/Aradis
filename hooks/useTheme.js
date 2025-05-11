// src/hooks/useTheme.js
import { useSelector, useDispatch } from "react-redux";
import { useColorScheme } from "react-native";
import { toggleTheme, setTheme } from "../store/slices/themeSlice";
import { THEME } from "../constants/theme";

export const useTheme = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const system = useColorScheme();

  // Resolve real mode based on 'SYSTEM'
  const resolved = mode === "SYSTEM" ? system?.toUpperCase() || "LIGHT" : mode;

  return {
    theme: THEME[resolved], // returns theme colors
    mode,
    setTheme: (newMode) => dispatch(setTheme(newMode)),
    toggleTheme: () => dispatch(toggleTheme()),
  };
};
