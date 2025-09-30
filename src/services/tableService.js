import axios from "axios";

const API_URL = "http://localhost:5000/api/tables";

// Get all tables (works for users and admin)
// Users: no token, Admin: pass token
export const getTables = async (date, time, token = null) => {
  const query = date && time ? `?date=${date}&time=${time}` : "";
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await axios.get(API_URL + query, config);
  return res.data;
};

// Create new table (admin only)
export const createTable = async (tableData, token) => {
  if (!token) throw new Error("Admin token required");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(API_URL, tableData, config);
  return res.data;
};

// Update table (admin only)
export const updateTable = async (id, tableData, token) => {
  if (!token) throw new Error("Admin token required");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.put(`${API_URL}/${id}`, tableData, config);
  return res.data;
};

// Delete table (admin only)
export const deleteTable = async (id, token) => {
  if (!token) throw new Error("Admin token required");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.delete(`${API_URL}/${id}`, config);
  return res.data;
};
