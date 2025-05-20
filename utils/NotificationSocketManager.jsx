import { useEffect, useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { connectNotificationSocket } from "./api/notificationApi";
import { getStoredValue } from "./storage";
import { useUser } from "../hooks/useUser";

export default function NotificationSocketManager() {
  const { userData } = useUser();
  const { setNotifications, setUnreadCount } = useNotifications();
  const userId = userData?.id;
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getStoredValue("token");
      console.log("Fetched token:", storedToken);
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    let socket;

    if (!userId || !token) return;

    socket = connectNotificationSocket(
      userId,
      token,
      (updated) => {
        setNotifications(updated);
        console.log("Notifications updated:", updated);
      },
      (count) => {
        setUnreadCount(count);
        console.log("Unread count updated:", count);
      }
    );

    return () => {
      if (socket) socket.disconnect();
    };
  }, [userId, token]);
  return null;
}
