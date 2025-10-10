import { useEffect, useState, useContext } from "react";
import TableCard from "../components/TableCard.jsx";
import { getTables } from "../services/tableService.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { createBooking } from "../services/bookingService.js";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [tables, setTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { user, token } = useContext(AuthContext);
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });

  // Available time slots
  const timeSlots = [
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
  ];

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "success" });
    }, 2000); // The popup will show for 2 seconds
  };

  const fetchTables = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsLoading(true);
    const date = selectedDate.toISOString().split("T")[0];
    
    try {
      const data = await getTables(date, selectedTime);
      setTables(data);
    } catch (err) {
      console.error(err);
      showPopup("Failed to load tables", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [selectedDate, selectedTime]);

  const handleBook = async (tableId) => {
    if (!user || !token) return showPopup("Please login to book a table", "error");
    if (!tableId) return showPopup("Invalid table", "error");
    if (!selectedDate || !selectedTime) return showPopup("Please select a date and time", "error");

    const dateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":");
    dateTime.setHours(parseInt(hours), parseInt(minutes));

    try {
      await createBooking(tableId, token, dateTime.toISOString());
      showPopup("Table booked successfully!");

      setTables((prev) =>
        prev.map((t) =>
          t._id === tableId ? { ...t, available: false } : t
        )
      );
    } catch (err) {
      console.error(err.response?.data || err);
      showPopup(err.response?.data?.message || "Booking failed", "error");
    }
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return selectedDate && date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Previous month days
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, daysInPrevMonth - i);
      days.push({ date, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push({ date, isCurrentMonth: true });
    }

    // Next month days
    const totalCells = 42; // 6 weeks
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8 relative overflow-hidden">
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

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mb-4 md:mb-6 shadow-2xl">
            <span className="text-2xl md:text-3xl">🍽️</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent drop-shadow-lg">
            Reserve Your Table
          </h1>
          <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Experience fine dining at its best. Book your perfect table for an unforgettable culinary journey.
          </p>
        </div>

        {/* Date & Time Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 md:mb-16">
          {/* Date Selection Card */}
          <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 transition-all duration-500 hover:bg-white/15">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg md:text-xl">📅</span>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Select Date</h3>
                <p className="text-purple-200 text-sm">Choose your preferred dining date</p>
              </div>
            </div>

            {/* Selected Date Display */}
            {selectedDate && (
              <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white text-center font-semibold">
                  📍 Selected: <span className="text-purple-300">{formatDate(selectedDate)}</span>
                </p>
              </div>
            )}

            {/* Calendar */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/10">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h4 className="text-white font-semibold text-lg">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-purple-300 text-sm font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendar().map(({ date, isCurrentMonth }, index) => {
                  const disabled = isPastDate(date) || !isCurrentMonth;
                  const today = isToday(date);
                  const selected = isSelected(date);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => !disabled && setSelectedDate(date)}
                      disabled={disabled}
                      className={`
                        h-10 md:h-12 rounded-lg text-sm font-medium transition-all duration-200
                        ${disabled 
                          ? 'text-gray-500 cursor-not-allowed' 
                          : 'hover:bg-white/10 text-white cursor-pointer'
                        }
                        ${today && !selected ? 'bg-purple-500/30 text-white' : ''}
                        ${selected ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg transform scale-105' : ''}
                        ${!isCurrentMonth ? 'opacity-30' : ''}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time Selection Card */}
          <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 transition-all duration-500 hover:bg-white/15">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg md:text-xl">⏰</span>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Select Time</h3>
                <p className="text-purple-200 text-sm">Choose your preferred dining time</p>
              </div>
            </div>

            {/* Selected Time Display */}
            {selectedTime && (
              <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white text-center font-semibold">
                  ⏰ Selected: <span className="text-purple-300">{formatTime(selectedTime)}</span>
                </p>
              </div>
            )}

            {/* Time Slots */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    p-3 md:p-4 rounded-xl font-medium transition-all duration-200
                    ${selectedTime === time
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg transform scale-105'
                      : 'bg-white/5 text-white hover:bg-white/10 hover:scale-105'
                    }
                  `}
                >
                  {formatTime(time)}
                </button>
              ))}
            </div>

            {/* Time Period Labels */}
            
          </div>
        </div>

        {/* Tables Section */}
        <div className="relative">
          {/* Section Header */}
          {selectedDate && selectedTime && (
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Available Tables for {formatDate(selectedDate)} at {formatTime(selectedTime)}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-16 md:py-20">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 md:w-16 md:h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin animation-delay-500"></div>
                <p className="text-white mt-4 text-center">Loading available tables...</p>
              </div>
            </div>
          )}

          {/* Tables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {!isLoading && selectedDate && selectedTime ? (
              tables.length > 0 ? (
                tables.map((table) => (
                  <TableCard
                    key={table._id}
                    table={table}
                    onBook={handleBook}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 md:py-16">
                  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10 max-w-2xl mx-auto">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                      <span className="text-2xl md:text-4xl">😕</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                      No Tables Available
                    </h3>
                    <p className="text-purple-200 text-base md:text-lg">
                      We're fully booked for this date and time. Please try a different time slot.
                    </p>
                  </div>
                </div>
              )
            ) : (!selectedDate || !selectedTime) && (
              <div className="col-span-full text-center py-12 md:py-16">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10 max-w-2xl mx-auto">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <span className="text-2xl md:text-4xl">⏰</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    Select Date & Time
                  </h3>
                  <p className="text-purple-200 text-base md:text-lg">
                    Choose a date and time above to see available tables for your reservation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 md:mt-16 pt-6 md:pt-8 border-t border-white/10">
          <p className="text-purple-300 text-sm md:text-base">
            Need assistance? Call us at <span className="text-white font-semibold">(555) 123-4567</span>
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
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
      `}</style>
    </div>
  );
};

export default Home;