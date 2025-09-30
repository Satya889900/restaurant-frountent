import { useEffect, useState, useContext } from "react";
import { getMyBookings, cancelBooking } from "../services/bookingService.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const { user, token } = useContext(AuthContext); // ✅ get token separately

  const fetchBookings = async () => {
    try {
      if (!token) return; // safety check
      const data = await getMyBookings(token);
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && token) fetchBookings(); // ✅ fetch only if token exists
  }, [user, token]);

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id, token);
      alert("Booking cancelled");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {bookings.map((b) => (
  <div key={b._id} className="border p-4 rounded shadow">
    <p>Table: {b.table ? b.table.tableNumber : "N/A"}</p>
    <p>Seats: {b.table ? b.table.seats : "N/A"}</p>
    <p>Start: {b.startTime ? new Date(b.startTime).toLocaleString() : "N/A"}</p>
    <p>End: {b.endTime ? new Date(b.endTime).toLocaleString() : "N/A"}</p>
    <p>Status: {b.status}</p>
    {b.status !== "cancelled" && (
      <button
        onClick={() => handleCancel(b._id)}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
      >
        Cancel Booking
      </button>
    )}
  </div>
))}

      </div>
    </div>
  );
};

export default Bookings;
