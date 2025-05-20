import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    unreadCount: 0,
    notifications: [],
  },
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
});

export const { setUnreadCount, setNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
