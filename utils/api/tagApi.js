import AsyncStorage from "@react-native-async-storage/async-storage";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
/**
 * Fetches notifications from the API using the stored token.
 *
 * @async
 * @function fetchTags
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing tags.
 * @throws {Error} If there is an issue with fetching or parsing the response.
 */

export const fetchTags = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${apiBaseUrl}/tag`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error in fetchTags:", error);
  }
};
