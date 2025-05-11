// src/store/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  userData: {},
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = {};
    },
    updateUserData: (state, action) => {
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
    },
  },
});

export const { setUserData, clearUserData, updateUserData } = userSlice.actions;
export default userSlice.reducer;
