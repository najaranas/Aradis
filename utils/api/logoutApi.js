/**
 * Removes the notification token for a user from the server.
 * @async
 * @function removeNotificationToken
 * @param {string} notificationToken - The notification token to be removed.
 * @param {string} userId - The ID of the user.
 * @param {string} authToken - The authorization token for the API request.
 * @returns {Promise<void>} A promise that resolves when the token is removed.
 */

export const removeNotificationToken = async (token, userId, authToken) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/remove-device-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({
          token,
          userId,
        }),
      }
    );
    console.log("Response:", response);
    console.log("res:", await response.json());
  } catch (error) {
    caches.error("Failed to register notification token:", error);
  }
};
