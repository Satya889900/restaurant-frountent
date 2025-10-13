import { useEffect, useState, useContext } from "react";
import { getMyBookings, cancelBooking, updateBooking, deleteBooking  } from "../services/bookingService.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

const Bookings = () => {
  const { user, token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null); // State for the booking being edited
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "success" }), 1500);
  };

  const fetchBookings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getMyBookings(token);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      showPopup("Failed to load bookings", "error");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) fetchBookings();
  }, [user, token]);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await cancelBooking(id, token);
      showPopup("Booking cancelled successfully");
      fetchBookings();
    } catch (err) {
      console.error(err);
      showPopup("Failed to cancel booking", "error");
    } finally {
      setCancellingId(null);
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    const bookingDate = new Date(booking.startTime);
    setNewDate(bookingDate.toISOString().split('T')[0]);
    setNewTime(bookingDate.toTimeString().split(' ')[0].substring(0, 5));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingBooking || !newDate || !newTime) return;

    const newStartTime = new Date(`${newDate}T${newTime}:00`);
    
    setLoading(true);
    try {
      await updateBooking(editingBooking._id, { startTime: newStartTime.toISOString() }, token);
      showPopup("Booking updated successfully!");
      setEditingBooking(null);
      fetchBookings();
    } catch (err) {
      console.error(err);
      showPopup(err.message || "Failed to update booking", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this table booking permanently?")) return;
  
  setDeletingId(id);
  try {
    await deleteBooking(id, token);
    showPopup("Table booking deleted successfully!", "success");
    fetchBookings();
  } catch (err) {
    console.error(err);
    showPopup("Failed to delete booking", "error");
  } finally {
    setDeletingId(null);
  }
};


  const getStatusColor = (status) => {
    return {
      confirmed: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
    }[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    return {
      confirmed: "✅",
      pending: "⏳",
      cancelled: "❌",
      completed: "🎉",
    }[status] || "📅";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 bg-gray-300 rounded w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Popup Notification */}
      <AnimatePresence>
        {popup.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-24 left-1/2 z-50 p-4 rounded-xl shadow-2xl text-white ${
              popup.type === "success"
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : "bg-gradient-to-r from-red-500 to-rose-600"
            }`}
          >
            <div className="flex items-center space-x-3">
              <span>{popup.type === "success" ? "✅" : "❌"}</span>
              <p className="font-semibold">{popup.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Booking Modal */}
      <AnimatePresence>
        {editingBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Booking</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button type="button" onClick={() => setEditingBooking(null)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600 text-lg">Manage and view your restaurant reservations</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: bookings.length, color: "text-gray-800" },
            { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, color: "text-green-600" },
            { label: "Pending", value: bookings.filter(b => b.status === "pending").length, color: "text-yellow-600" },
            { label: "Cancelled", value: bookings.filter(b => b.status === "cancelled").length, color: "text-red-600" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bookings Grid */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">You haven't made any reservations yet.</p>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300 font-medium">
              Make Your First Booking
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {b.table?.tableNumber || "N/A"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Table {b.table?.tableNumber || "N/A"}</h3>
                      <p className="text-sm text-gray-600">{b.table?.seats || "N/A"} seats</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(b.status)}`}>
                    <span className="mr-1">{getStatusIcon(b.status)}</span>
                    {b.status?.charAt(0).toUpperCase() + b.status?.slice(1) || "Unknown"}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Date", value: b.startTime ? new Date(b.startTime).toLocaleDateString() : "N/A" },
                    { label: "Start Time", value: b.startTime ? new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A" },
                    { label: "End Time", value: b.endTime ? new Date(b.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A" },
                    {
                      label: "Duration",
                      value:
                        b.startTime && b.endTime
                          ? `${Math.round((new Date(b.endTime) - new Date(b.startTime)) / (1000 * 60 * 60))} hours`
                          : "N/A",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="text-sm font-medium text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
                

                {/* Action */}
                <div className="mt-4 space-y-2">
                  {b.status !== "cancelled" && b.status !== "completed" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(b)}
                        className="flex-1 py-3 px-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-300 font-medium border border-blue-200 flex items-center justify-center space-x-2"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleCancel(b._id)}
                        disabled={cancellingId === b._id}
                        className="flex-1 py-3 px-4 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium border border-yellow-200 flex items-center justify-center space-x-2"
                      >
                        {cancellingId === b._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                            <span>Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <span>🚫</span>
                            <span>Cancel</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {b.status === "completed" ? (
                    <div className="w-full py-3 px-4 bg-gray-50 text-gray-600 rounded-xl text-center font-medium border border-gray-200">
                      Booking Completed
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDelete(b._id)}
                      disabled={deletingId === b._id || cancellingId === b._id}
                      className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium border border-red-200 flex items-center justify-center space-x-2"
                    >
                      {deletingId === b._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <span>🗑️</span>
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                {/* This block is now handled above */}
                {/* {b.status === "cancelled" || b.status === "completed" ? (
                  <div className="mt-4 w-full py-3 px-4 bg-gray-50 text-gray-600 rounded-xl text-center font-medium border border-gray-200">
                    {b.status === "cancelled" ? "Booking Cancelled" : "Booking Completed"}
                  </div>
                ) : null} */}
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {bookings.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Showing {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;