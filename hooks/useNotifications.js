// src/hooks/useNotifications.js
import { useSelector, useDispatch } from "react-redux";
import {
  setUnreadCount,
  setNotifications,
} from "../store/slices/notificationsSlice";

export const useNotifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  return {
    notifications: notifications,
    unreadCount: unreadCount,
    setUnreadCount: (newData) => dispatch(setUnreadCount(newData)),
    setNotifications: (newNotif) => dispatch(setNotifications(newNotif)),
  };
};
