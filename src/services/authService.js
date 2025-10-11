import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

/**
 * Register a new user
 * @param {Object} userData User data { name, email, password, role? }
 * @returns {Promise<Object>} Returns { user, token }
 */
export const register = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData);
    return res.data; // { user, token }
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error(error.response?.data?.message || "Failed to register user");
  }
};

/**
 * Login user
 * @param {Object} userData Login credentials { email, password }
 * @returns {Promise<Object>} Returns { user, token }
 */
export const login = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/login`, userData);
    return res.data; // { user, token }
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error(error.response?.data?.message || "Failed to login");
  }
};

/**
 * Get current user info (optional)
 * @param {string} token JWT token
 * @returns {Promise<Object>} Returns user data
 */
export const getCurrentUser = async (token) => {
  if (!token) throw new Error("Token required");
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(`${API_URL}/me`, config);
    return res.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch user data");
  }
};
