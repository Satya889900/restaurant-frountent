import { useEffect, useState, useContext } from "react";
import { getTables, createTable, deleteTable, updateTable } from "../services/tableService.js";
import { AuthContext } from "../context/AuthContext.jsx";

const AdminPanel = () => {
  const { user, token } = useContext(AuthContext);
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [seats, setSeats] = useState("");
  const [editTableId, setEditTableId] = useState(null);
  const [editTableNumber, setEditTableNumber] = useState("");
  const [editSeats, setEditSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTables = async () => {
  setLoading(true);
  setError(null);
  try {
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(" ")[0]; // HH:MM:SS

    // Correct argument order: date, time, token
    const data = await getTables(date, time, token);
    setTables(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Fetch error:", err.message);
    setError(`Failed to fetch tables: ${err.message}`);
    setTables([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (user?.role === "admin") {
      fetchTables();
    }
  }, [user]);

  const handleAddTable = async () => {
    if (!tableNumber || !seats) {
      alert("Please enter table number and seats");
      return;
    }
    setLoading(true);
    try {
      await createTable({ tableNumber, seats }, token);
      setTableNumber("");
      setSeats("");
      fetchTables();
    } catch (err) {
      console.error("Add table error:", err.message);
      alert(`Failed to add table: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async (id) => {
    if (!window.confirm("Are you sure you want to delete this table?")) return;
    setLoading(true);
    try {
      await deleteTable(id, token);
      fetchTables();
    } catch (err) {
      console.error("Delete table error:", err.message);
      alert(`Failed to delete table: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTable = (table) => {
    setEditTableId(table._id);
    setEditTableNumber(table.tableNumber);
    setEditSeats(table.seats);
  };

  const handleUpdateTable = async () => {
    if (!editTableNumber || !editSeats) {
      alert("Please enter table number and seats");
      return;
    }
    setLoading(true);
    try {
      await updateTable(editTableId, { tableNumber: editTableNumber, seats: editSeats }, token);
      setEditTableId(null);
      setEditTableNumber("");
      setEditSeats("");
      fetchTables();
    } catch (err) {
      console.error("Update table error:", err.message);
      alert(`Failed to update table: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTableId(null);
    setEditTableNumber("");
    setEditSeats("");
  };

  if (user?.role !== "admin") return (
    <p className="p-6 text-center text-red-600 font-semibold">
      Access Denied: Admin privileges required
    </p>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Panel - Table Management
        </h2>

        {/* Add Table Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Table</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="number"
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Number of Seats"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleAddTable}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Table"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {loading && <p className="text-gray-600 text-center mb-4">Loading tables...</p>}
        {tables.length === 0 && !loading && !error && (
          <p className="text-gray-600 text-center mb-4">No tables available</p>
        )}

        {/* Table Data Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((t) => (
            <div
              key={t._id}
              className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              {editTableId === t._id ? (
                <div className="flex flex-col gap-4">
                  <input
                    type="number"
                    placeholder="Table Number"
                    value={editTableNumber}
                    onChange={(e) => setEditTableNumber(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Number of Seats"
                    value={editSeats}
                    onChange={(e) => setEditSeats(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateTable}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-green-300"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-800">
                      Table: {t.tableNumber}
                    </p>
                    <p className="text-gray-600">Seats: {t.seats}</p>
                    <p className={`text-sm font-semibold ${t.available ? "text-green-600" : "text-red-600"}`}>
                      Status: {t.available ? "Available" : "Booked"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTable(t)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTable(t._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:bg-red-300"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
