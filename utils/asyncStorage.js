import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Retrieves a value from AsyncStorage
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Value to return if key doesn't exist
 * @returns {Promise<string|null>} The stored value or defaultValue
 */
export const getStoredValue = async (key, defaultValue = null) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch (error) {
    console.error(`Error retrieving "${key}" from storage:`, error);
    return defaultValue;
  }
};

/**
 * Stores a value in AsyncStorage
 * @param {string} key - The key to store under
 * @param {string} value - The value to store
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const storeValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error storing "${key}" in storage:`, error);
    return false;
  }
};

/**
 * Removes a value from AsyncStorage
 * @param {string} key - The key to remove
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const removeStoredValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing "${key}" from storage:`, error);
    return false;
  }
};

/**
 * Checks if a key exists in AsyncStorage
 * @param {string} key - The key to check
 * @returns {Promise<boolean>} True if exists, false otherwise
 */
export const hasStoredValue = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch (error) {
    console.error(`Error checking for "${key}" in storage:`, error);
    return false;
  }
};

/**
 * Clears all values from AsyncStorage
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing storage:", error);
    return false;
  }
};

/**
 * Gets all keys from AsyncStorage
 * @returns {Promise<string[]>} Array of keys or empty array on error
 */
export const getAllStorageKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error("Error getting all storage keys:", error);
    return [];
  }
};
