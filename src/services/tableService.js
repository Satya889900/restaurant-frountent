import axios from "axios";

export const staticTablesData = [
  {
    _id: "static-1",
    tableNumber: 1,
    seats: 4,
    isAvailable: true,
    price: 1200,
    restaurantImages: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60"],
    tableClass: "1st-class",
    classFeatures: ["Window Seat", "Private Area"],
  },
  {
    _id: "static-2",
    tableNumber: 2,
    seats: 2,
    isAvailable: false,
    price: 800,
    restaurantImages: ["https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60"],
    tableClass: "general",
  },
  {
    _id: "static-3",
    tableNumber: 3,
    seats: 6,
    isAvailable: true,
    price: 1800,
    restaurantImages: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60"],
    tableClass: "VIP Lounge",
  },
];

const API_URL = "http://localhost:5000/api/tables";

/**
 * Get all tables with availability for a specific date/time.
 * @param {string} [date] Optional date filter (YYYY-MM-DD)
 * @param {string} [time] Optional time filter (HH:mm:ss)
 * @returns {Promise<Array>} List of tables
 */
export const getTables = async (date, time) => {
  try {
    const queryParams = [];
    if (date) queryParams.push(`date=${encodeURIComponent(date)}`);
    if (time) queryParams.push(`time=${encodeURIComponent(time)}`);
    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

    const res = await axios.get(`${API_URL}${queryString}`);
    if (!res.data) throw new Error("No data received from server");
    return res.data;
  } catch (error) {
    console.error("Error fetching tables:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch tables"
    );
  }
};

/**
 * Get a single table by its ID.
 * @param {string} id Table ID
 * @returns {Promise<Object>} The table object
 */
export const getTableById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    if (!res.data) throw new Error("No data received from server");
    return res.data;
  } catch (error) {
    console.error("Error fetching table by ID:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch table"
    );
  }
};
/**
 * Create a new table (admin only)
 * @param {Object} tableData Full table data object
 * @param {string} token Admin JWT token
 * @returns {Promise<Object>} Created table
 */
export const createTable = async (tableData, token) => {
  if (!token) throw new Error("Admin token required");
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const res = await axios.post(API_URL, tableData, config);
    if (!res.data) throw new Error("No response from server");
    return res.data;
  } catch (error) {
    console.error("Error creating table:", error.response || error);
    if (error.code === "ERR_NETWORK") {
      throw new Error(
        "Network Error: Could not connect to the server. Is the backend running?"
      );
    }
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Update table (admin only)
 * @param {string} id Table ID
 * @param {Object} tableData Table data { tableNumber, seats, available }
 * @param {string} token Admin JWT token
 * @returns {Promise<Object>} Updated table
 */
export const updateTable = async (id, tableData, token) => {
  if (!token) throw new Error("Admin token required");
  if (!id) throw new Error("Table ID required");
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.put(`${API_URL}/${id}`, tableData, config);
    if (!res.data) throw new Error("No response from server");
    return res.data;
  } catch (error) {
    console.error("Error updating table:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to update table"
    );
  }
};

/**
 * Delete table (admin only)
 * @param {string} id Table ID
 * @param {string} token Admin JWT token
 * @returns {Promise<Object>} Deletion response
 */
export const deleteTable = async (id, token) => {
  if (!token) throw new Error("Admin token required");
  if (!id) throw new Error("Table ID required");
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.delete(`${API_URL}/${id}`, config);
    if (!res.data) throw new Error("No response from server");
    return res.data;
  } catch (error) {
    console.error("Error deleting table:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete table"
    );
  }
};
