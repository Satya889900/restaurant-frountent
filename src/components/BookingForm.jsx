import { useState, useEffect, useContext } from "react";
import { createBooking } from "../services/bookingService.js";
import { getTables } from "../services/tableService.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";

const BookingForm = () => {
  const { user, token } = useContext(AuthContext);
  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState({
    table: "",
    startTime: "",
    endTime: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      // Assuming getTables doesn't need auth, or pass token if it does
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0];
      const data = await getTables(date, time);
      setTables(data);
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bookingData = {
        table: formData.table,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      const result = await createBooking(bookingData, token);
      setMessage("✅ Booking created successfully!");
      console.log("Booking response:", result);
      setFormData({ table: "", startTime: "", endTime: "" });
    } catch (err) {
      setMessage(err.message || "❌ Failed to create booking. Try again.");
    }
  };

  return (
    <motion.div
      className="max-w-lg mx-auto mt-10 bg-white shadow-xl p-8 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        Book a Table 🍽️
      </h2>

      {message && (
        <div className="text-center mb-4 text-sm font-medium text-green-600">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Table */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Select Table
          </label>
          <select
            value={formData.table}
            onChange={(e) =>
              setFormData({ ...formData, table: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">-- Choose Table --</option>
            {tables.map((table) => (
              <option key={table._id} value={table._id}>
                Table #{table.tableNumber} — Seats: {table.seats} —{" "}
                {table.available ? "Available" : "Booked"}
              </option>
            ))}
          </select>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Start Time
          </label>
          <input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
        >
          Confirm Booking
        </motion.button>
      </form>
    </motion.div>
  );
};

export default BookingForm;