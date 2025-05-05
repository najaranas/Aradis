// utils/tagApi.ts or api/tagApi.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

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

export const fetchNotifications = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${apiBaseUrl}/notifications/${token}`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error("Error in fetchNotifations:", error);
  }
};
