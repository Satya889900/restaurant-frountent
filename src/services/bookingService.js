import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings";

// Create booking
export const createBooking = async (tableId, token, startTime) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(
    API_URL,
    { table: tableId, startTime }, // send startTime here
    config
  );
  return res.data;
};

// Get bookings for current user
export const getMyBookings = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await axios.get(`${API_URL}/me`, config);
  return res.data;
};

// Cancel booking
export const cancelBooking = async (bookingId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await axios.post(`${API_URL}/${bookingId}/cancel`, {}, config);
  return res.data;
};
