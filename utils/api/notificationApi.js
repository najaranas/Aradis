import { io } from "socket.io-client";

/**
 * Establishes a socket connection to receive real-time notifications
 * @function connectNotificationSocket
 * @param {string} userId - The ID of the user to subscribe to notifications for
 * @param {string} token - The authentication token
 * @param {Function} onNotificationsUpdate - Callback when notifications are updated
 * @param {Function} onUnreadCountUpdate - Callback when unread count changes
 * @returns {Object} The socket connection object that can be disconnected later
 */
export const connectNotificationSocket = (
  userId,
  token,
  onNotificationsUpdate,
  onUnreadCountUpdate
) => {
  if (!userId || !token) return null;

  const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
    auth: { token },
    autoConnect: true,
  });

  socket.emit("join", userId);

  socket.on("updatedNotifications", (updated) => {
    onNotificationsUpdate(updated);
  });

  socket.on("unreadNotificationCount", (count) => {
    onUnreadCountUpdate(count);
  });

  return socket;
};

/**
 * Marks a notification as read
 * @async
 * @function markNotificationAsRead
 * @param {string} token - The authorization token
 * @param {string|number} notificationId - The ID of the notification to mark as read
 * @returns {Promise<Object>} A promise that resolves to the response data
 * @throws {Error} If the fetch fails or the response is not OK
 */
export const markNotificationAsRead = async (token, notificationId) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_BASE_URL}/notifications/${notificationId}/read`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${token}`,
      },
    }
  );

  if (response.status === 200 && response.ok) {
    return await response.json();
  }

  throw new Error(`Failed to mark notification as read: ${response.status}`);
};
