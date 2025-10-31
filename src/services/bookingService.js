import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/bookings`;

/**
 * Create a new booking
 * @param {Object} bookingData Booking data { table, startTime, endTime }
 * @param {string} token User JWT token
 * @returns {Promise<{message: string, booking: object, tables: Array<object>}>} Result object with created booking and updated tables
 */
export const createBooking = async (bookingData, token) => {
  if (!token) throw new Error("User token required");
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(API_URL, bookingData, config);
    return res.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error.response?.data || new Error("Failed to create booking");
  }
};

// Get all bookings (for admin or user)
export const getBookings = async (token) => {
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error.response?.data || new Error("Failed to fetch bookings");
  }
};

/**
 * Get bookings for the current user
 * @param {string} token User JWT token
 * @returns {Promise<Array>} List of bookings
 */
export const getMyBookings = async (token) => {
  if (!token) throw new Error("User token required");
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(`${API_URL}/me`, config);
    return res.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch bookings");
  }
};

/**
 * Cancel a booking
 * @param {string} bookingId Booking ID
 * @param {string} token User JWT token
 * @returns {Promise<Object>} Cancelled booking data
 */
export const cancelBooking = async (bookingId, token) => {
  if (!token) throw new Error("User token required");
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.post(`${API_URL}/${bookingId}/cancel`, {}, config);
    return res.data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw new Error(error.response?.data?.message || "Failed to cancel booking");
  }
};
export const deleteBooking = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Update a booking (optional, backend dependent)
 * @param {string} bookingId Booking ID
 * @param {Object} updateData Data to update { startTime?, table? }
 * @param {string} token User JWT token
 * @returns {Promise<Object>} Updated booking
 */
export const updateBooking = async (bookingId, updateData, token) => {
  if (!token) throw new Error("User token required");
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.put(`${API_URL}/${bookingId}`, updateData, config);
    return res.data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error.response?.data || new Error("Failed to update booking");
  }
};
