import axios from "axios";

const UPLOAD_API_URL = "http://localhost:5000/api/upload";

/**
 * Uploads an image file.
 * @param {File} file The image file to upload.
 * @param {string} token The user's JWT token.
 * @returns {Promise<{url: string}>} The URL of the uploaded image.
 */
export const uploadImage = async (file, token) => {
  if (!token) throw new Error("User token required for upload");

  const formData = new FormData();
  formData.append("image", file);

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const res = await axios.post(UPLOAD_API_URL, formData, config);
    return res.data; // Should return { url: '...' }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(error.response?.data?.message || "Image upload failed");
  }
};