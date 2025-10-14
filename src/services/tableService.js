import axios from "axios";

const API_URL = "http://localhost:5000/api/tables";

/**
 * Uploads image files to the backend and returns an array of Cloudinary URLs.
 * @param {File[]} imageFiles - The image files to upload.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<string[]>} - A promise that resolves to an array of image URLs.
 */
const uploadImages = async (imageFiles, token) => {
  const formData = new FormData();
  for (const file of imageFiles) {
    formData.append("images", file);
  }

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const { data } = await axios.post(`${API_URL}/upload-images`, formData, config);
    return data.urls; // The backend returns { urls: [...] }
  } catch (error) {
    console.error("Error uploading images:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Image upload failed");
  }
};

/**
 * Creates a new table, handling image uploads first if necessary.
 * @param {object} tableData - The table data from the form.
 * @param {File[]} imageFiles - New image files to upload.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} - A promise that resolves to the created table object.
 */
export const createTable = async (tableData, imageFiles, token) => {
  try {
    // Filter out local data URLs, keeping only existing http/https URLs
    let existingImageUrls = (tableData.restaurantImages || []).filter(
      (url) => typeof url === 'string' && url.startsWith('http')
    );

    if (imageFiles && imageFiles.length > 0) {
      const newImageUrls = await uploadImages(imageFiles, token);
      existingImageUrls = [...existingImageUrls, ...newImageUrls];
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(API_URL, { ...tableData, restaurantImages: existingImageUrls }, config);
    return data;
  } catch (error) {
    console.error("Error creating table:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Table creation failed");
  }
};

/**
 * Fetches tables with availability for a specific date and time.
 * @param {string} date - The date in 'YYYY-MM-DD' format.
 * @param {string} time - The time in 'HH:MM' format.
 * @param {string} [token] - Optional JWT for authorization if needed for other filters.
 * @returns {Promise<object[]>} - A promise that resolves to an array of tables.
 */
export const getTables = async (date, time, token) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data } = await axios.get(`${API_URL}`, {
      ...config,
      params: { date, time },
    });
    return data;
  } catch (error) {
    console.error("Error fetching tables:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch tables");
  }
};

/**
 * Updates a table by its ID.
 * @param {string} id - The ID of the table to update.
 * @param {object} tableData - The new data for the table, may include existing image URLs.
 * @param {File[]} imageFiles - New image files to upload.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} - A promise that resolves to the updated table object.
 */
export const updateTable = async (id, tableData, imageFiles, token) => {
  try {
    // Filter out local data URLs, keeping only existing http/https URLs
    let existingImageUrls = (tableData.restaurantImages || []).filter(
      (url) => typeof url === 'string' && url.startsWith('http')
    );

    // Upload new images if any
    if (imageFiles && imageFiles.length > 0) {
      const newImageUrls = await uploadImages(imageFiles, token);
      existingImageUrls = [...existingImageUrls, ...newImageUrls];
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Ensure the final data sent to the backend has the correct image URLs
    const finalTableData = { ...tableData, restaurantImages: existingImageUrls };

    const { data } = await axios.put(`${API_URL}/${id}`, finalTableData, config);
    return data;
  } catch (error) {
    console.error("Error updating table:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Table update failed");
  }
};

/**
 * Deletes a table by its ID.
 * @param {string} id - The ID of the table to delete.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} - A promise that resolves to the success message.
 */
export const deleteTable = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const { data } = await axios.delete(`${API_URL}/${id}`, config);
    return data;
  } catch (error) {
    console.error("Error deleting table:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Table deletion failed");
  }
};

/**
 * Fetches a single table by its ID.
 * @param {string} id - The ID of the table to fetch.
 * @returns {Promise<object>} - A promise that resolves to the table object.
 */
export const getTableById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching table with id ${id}:`, error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch table data");
  }
};