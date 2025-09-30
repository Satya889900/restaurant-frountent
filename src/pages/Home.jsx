import { useEffect, useState, useContext } from "react";
import TableCard from "../components/TableCard.jsx";
import { getTables } from "../services/tableService.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { createBooking } from "../services/bookingService.js";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";

const Home = () => {
  const [tables, setTables] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const { user, token } = useContext(AuthContext);

  const fetchTables = async () => {
    if (!selectedDateTime) return; // do nothing if not selected

    const date = selectedDateTime.toISOString().split("T")[0];
    const time = selectedDateTime.toTimeString().split(" ")[0].slice(0, 5); // HH:mm

    try {
      const data = await getTables(date, time);
      setTables(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load tables");
    }
  };

  useEffect(() => {
    fetchTables();
  }, [selectedDateTime]);

  const handleBook = async (tableId) => {
    if (!user || !token) return alert("Please login to book a table");
    if (!tableId) return alert("Invalid table");
    if (!selectedDateTime) return alert("Please select a date and time");

    try {
      await createBooking(tableId, token, selectedDateTime.toISOString());
      alert("Table booked successfully!");

      // Optimistically update table availability locally
      setTables((prev) =>
        prev.map((t) =>
          t._id === tableId ? { ...t, available: false } : t
        )
      );
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  const minDateTime = new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-extrabold text-indigo-800 mb-10 text-center drop-shadow-lg tracking-tight animate-fade-in">
          🍽️ Book Your Perfect Table
        </h1>

        {/* Date/Time Picker Panel */}
        <div className="mb-12 flex justify-center">
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]">
            {/* Decorative Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl"></div>
            <label className="text-xl font-bold text-gray-800 mb-4 tracking-wide flex items-center gap-2">
              <span className="text-blue-500">📅</span> Select Date & Time
            </label>
            <DateTimePicker
              onChange={setSelectedDateTime}
              value={selectedDateTime}
              minDate={minDateTime}
              disableClock={false}
              format="y-MM-dd h:mm a"
              className="w-full border-2 border-blue-200 rounded-lg p-3 text-gray-800 bg-white focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-300"
              calendarClassName="bg-white shadow-lg border border-gray-200 rounded-lg p-4"
              clockClassName="bg-white shadow-lg border border-gray-200 rounded-lg p-4"
            />
            <p className="mt-3 text-sm text-gray-600 text-center font-medium">
              Choose your date and time to find available tables
            </p>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-slide-up">
          {selectedDateTime ? (
            tables.length > 0 ? (
              tables.map((table) => (
                <TableCard
                  key={table._id}
                  table={table}
                  onBook={handleBook}
                />
              ))
            ) : (
              <p className="text-center text-gray-600 text-lg col-span-full font-medium animate-pulse">
                😕 No tables available for this date & time.
              </p>
            )
          ) : (
            <p className="text-center text-gray-600 text-lg col-span-full font-medium animate-pulse">
              ⏰ Please select a date & time to see available tables
            </p>
          )}
        </div>
      </div>

      {/* Custom Tailwind Animation and Calendar Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        /* Override DateTimePicker calendar and clock styles */
        .react-datetime-picker__calendar,
        .react-datetime-picker__clock {
          background-color: #ffffff !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          padding: 16px !important;
          z-index: 1000 !important;
        }
        .react-datetime-picker__calendar--open,
        .react-datetime-picker__clock--open {
          opacity: 1 !important;
        }
        .react-datetime-picker__wrapper {
          background-color: #ffffff !important;
          border-radius: 8px !important;
        }
      `}</style>
    </div>
  );
};

export default Home;