import { deviceName, deviceType } from "expo-device";

/**
 * Authenticates a user with the provided email and password.
 * @async
 * @function authenticateUser
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing user data.
 * @throws {Error} If the authentication fails or the response is not OK.
 */
export const authenticateUser = async (email, password) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/sign-in`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Authentication failed.");
  }

  return result;
};

/**
 * Registers a new user with the provided email, password, and name.
 * @async
 * @function registerNotificationToken
 *  @param {string} token - The notification token to be registered.
 * @param {string} userId - The ID of the user.
 * @param {string} authToken - The authorization token for the API request.
 * @returns {Promise<void>} A promise that resolves when the token is registered.
 * @throws {Error} If the registration fails or the response is not OK.
 */
export const registerNotificationToken = async (token, userId, authToken) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/register-device-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({
          token,
          userId,
          deviceInfo: `${deviceName} ${deviceType}`,
        }),
      }
    );
    console.log("Response:", response);
    console.log("res:", await response.json());
  } catch (error) {
    caches.error("Failed to register notification token:", error);
  }
};
