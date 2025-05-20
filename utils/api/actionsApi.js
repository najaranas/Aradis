import { getStoredValue } from "../storage";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export const fetchActions = async (userId) => {
  console.log(`${apiBaseUrl}/fps/helper-actions/${userId}`);
  try {
    const token = await getStoredValue("token");
    const response = await fetch(`${apiBaseUrl}/fps/helper-actions/${userId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    const json = await response.json();
    console.log(response.json());
    console.log(json);
    return json.data;
  } catch (error) {
    console.error("Error in fetchActions:", error);
  }
};
