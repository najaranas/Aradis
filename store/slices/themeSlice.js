import { createSlice } from "@reduxjs/toolkit";
import { useColorScheme } from "react-native";
import { THEME } from "../../constants/theme";

const initialState = {
  mode: "LIGHT",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "LIGHT" ? "DARK" : "LIGHT";
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;

// Selector to get the current theme object
export const selectTheme = (state) => THEME[state.theme.mode];

export default themeSlice.reducer;
