import { useEffect, useState, useContext } from "react";
import { getMyBookings, cancelBooking } from "../services/bookingService.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const { user, token } = useContext(AuthContext);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      if (!token) return;
      const data = await getMyBookings(token);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) fetchBookings();
  }, [user, token]);

  const handleCancel = async (id) => {
    try {
      setCancellingId(id);
      await cancelBooking(id, token);
      alert("Booking cancelled successfully");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return "✅";
      case "pending":
        return "⏳";
      case "cancelled":
        return "❌";
      case "completed":
        return "🎉";
      default:
        return "📅";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-6"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600 text-lg">
            Manage and view your restaurant reservations
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-800">{bookings.length}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === "confirmed").length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.status === "cancelled").length}
            </div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
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
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
              >
                {/* Header with Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {booking.table?.tableNumber || "N/A"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Table {booking.table?.tableNumber || "N/A"}</h3>
                      <p className="text-sm text-gray-600">{booking.table?.seats || "N/A"} seats</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    <span className="mr-1">{getStatusIcon(booking.status)}</span>
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || "Unknown"}
                  </span>
                </div>

                {/* Booking Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Date</span>
                    <span className="text-sm font-medium text-gray-800">
                      {booking.startTime ? new Date(booking.startTime).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Start Time</span>
                    <span className="text-sm font-medium text-gray-800">
                      {booking.startTime ? new Date(booking.startTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">End Time</span>
                    <span className="text-sm font-medium text-gray-800">
                      {booking.endTime ? new Date(booking.endTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium text-gray-800">
                      {booking.startTime && booking.endTime
                        ? `${Math.round(
                            (new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60 * 60)
                          )} hours`
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                {booking.status !== "cancelled" && booking.status !== "completed" && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancellingId === booking._id}
                    className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium border border-red-200 flex items-center justify-center space-x-2"
                  >
                    {cancellingId === booking._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Cancelling...</span>
                      </>
                    ) : (
                      <>
                        <span>❌</span>
                        <span>Cancel Booking</span>
                      </>
                    )}
                  </button>
                )}

                {/* Cancelled State */}
                {(booking.status === "cancelled" || booking.status === "completed") && (
                  <div className="w-full py-3 px-4 bg-gray-50 text-gray-600 rounded-xl text-center font-medium border border-gray-200">
                    {booking.status === "cancelled" ? "Booking Cancelled" : "Booking Completed"}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State Alternative */}
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