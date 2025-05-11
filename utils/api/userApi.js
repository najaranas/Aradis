/**
 * Updates the user's profile image by sending a PUT request with the image data.
 *
 * @async
 * @function updateUserProfileImage
 * @param {string} userId - The ID of the user whose profile image is being updated.
 * @param {string} selectedImageUri - The URI of the selected image to be uploaded.
 * @param {string} token - The authorization token for the API request.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 * @throws {Error} If the request fails or the response is not OK.
 */

export const updateUserProfileImage = async (
  userId,
  selectedImageUri,
  token
) => {
  const formData = new FormData();

  formData.append("image", {
    uri: selectedImageUri,
    name: "profile.jpg",
    type: "image/jpeg",
  });

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_BASE_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update profile image.");
  }

  return await response.json();
};
