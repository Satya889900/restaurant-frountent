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
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useContext(AuthContext);

  const fetchTables = async () => {
    if (!selectedDateTime) return;

    setIsLoading(true);
    const date = selectedDateTime.toISOString().split("T")[0];
    const time = selectedDateTime.toTimeString().split(" ")[0].slice(0, 5);

    try {
      const data = await getTables(date, time);
      setTables(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load tables");
    } finally {
      setIsLoading(false);
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

  // Format selected date for display
  const formattedDate = selectedDateTime?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = selectedDateTime?.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mb-6 shadow-2xl">
            <span className="text-3xl">🍽️</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent drop-shadow-lg">
            Reserve Your Table
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Experience fine dining at its best. Book your perfect table for an unforgettable culinary journey.
          </p>
        </div>

        {/* Date/Time Picker Panel */}
        <div className="mb-16 flex justify-center">
          <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-lg transition-all duration-500 hover:bg-white/15 hover:scale-[1.02]">
            {/* Glowing Border Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-sm"></div>
            <div className="absolute inset-0 rounded-3xl border border-white/10"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">📅</span>
                </div>
                <div>
                  <label className="text-2xl font-bold text-white block leading-tight">
                    Select Date & Time
                  </label>
                  <p className="text-purple-200 text-sm">
                    Choose when you'd like to dine with us
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <DateTimePicker
                  onChange={setSelectedDateTime}
                  value={selectedDateTime}
                  minDate={minDateTime}
                  disableClock={false}
                  format="y-MM-dd h:mm a"
                  className="w-full border-2 border-white/20 rounded-xl p-4 text-white bg-white/5 backdrop-blur-sm focus:ring-4 focus:ring-purple-500/30 focus:outline-none transition-all duration-300 hover:border-white/30"
                  calendarClassName="bg-slate-800 shadow-2xl border border-white/20 rounded-xl p-4 backdrop-blur-lg"
                  clockClassName="bg-slate-800 shadow-2xl border border-white/20 rounded-xl p-4 backdrop-blur-lg"
                />
                
                {selectedDateTime && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white text-center font-semibold">
                      📍 Selected: <span className="text-purple-300">{formattedDate}</span> at <span className="text-purple-300">{formattedTime}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="relative">
          {/* Section Header */}
          {selectedDateTime && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Available Tables
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin animation-delay-500"></div>
              </div>
            </div>
          )}

          {/* Tables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {!isLoading && selectedDateTime ? (
              tables.length > 0 ? (
                tables.map((table) => (
                  <TableCard
                    key={table._id}
                    table={table}
                    onBook={handleBook}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10 max-w-2xl mx-auto">
                    <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">😕</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      No Tables Available
                    </h3>
                    <p className="text-purple-200 text-lg">
                      We're fully booked for this date and time. Please try a different time slot.
                    </p>
                  </div>
                </div>
              )
            ) : !selectedDateTime && (
              <div className="col-span-full text-center py-20">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10 max-w-2xl mx-auto">
                  <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">⏰</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Select Your Preferred Time
                  </h3>
                  <p className="text-purple-200 text-lg">
                    Choose a date and time above to see available tables for your reservation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 pt-8 border-t border-white/10">
          <p className="text-purple-300">
            Need assistance? Call us at <span className="text-white font-semibold">(555) 123-4567</span>
          </p>
        </div>
      </div>

      {/* Custom Styles */}
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
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* DateTimePicker Custom Styles */
        .react-datetime-picker__wrapper {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 2px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 12px !important;
          padding: 12px !important;
          color: white !important;
          backdrop-filter: blur(10px);
        }
        
        .react-datetime-picker__inputGroup__input {
          color: white !important;
        }
        
        .react-datetime-picker__button {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        
        .react-datetime-picker__button:hover {
          color: white !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border-radius: 6px !important;
        }
        
        .react-datetime-picker__calendar,
        .react-datetime-picker__clock {
          background: #1e293b !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
          backdrop-filter: blur(20px) !important;
          z-index: 1000 !important;
        }
      `}</style>
    </div>
  );
};

export default Home;