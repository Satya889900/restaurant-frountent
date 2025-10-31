import { useEffect, useState, useContext } from "react";
import TableCard from "../components/Table/TableCard.jsx";
import { getTables } from "../services/tableService.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { createBooking } from "../services/bookingService.js";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle,
  Tag as TagIcon,
  Utensils
} from "lucide-react";

const OnlineFood = () => {
  const [tables, setTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { user } = useContext(AuthContext);
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });
  const [bookingModal, setBookingModal] = useState({ isOpen: false, table: null });
  const [selectedOffer, setSelectedOffer] = useState(null);

  // Available time slots
  const timeSlots = [
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
  ];

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "success" });
    }, 3000);
  };

  useEffect(() => {
    const fetchTables = async () => {
      if (!selectedDate || !selectedTime) return;

      setIsLoading(true);
      const date = selectedDate.toISOString().split("T")[0];
      
      try {
        const data = await getTables(date, selectedTime);
        setTables(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        showPopup("Failed to load tables", "error");
        setTables([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, [selectedDate, selectedTime]);

  const handleBook = async (tableId) => {
    if (!user || !user.token) return showPopup("Please login to book a table", "error");
    if (!tableId) return showPopup("Invalid table", "error");
    if (!selectedDate || !selectedTime) return showPopup("Please select a date and time", "error");

    const dateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":");
    dateTime.setHours(parseInt(hours), parseInt(minutes));

    try {
      const result = await createBooking({ 
        table: tableId, 
        startTime: dateTime.toISOString(),
        offerTitle: selectedOffer,
      }, user.token);

      showPopup("Table booked successfully!");
      setBookingModal({ isOpen: false, table: null });
      setTables(result.tables || []);
    } catch (err) {
      console.error(err.response?.data || err);
      showPopup(err.response?.data?.message || "Booking failed", "error");
    }
  };

  const openBookingModal = (table) => {
    setBookingModal({ isOpen: true, table });
  };

  // Calendar functions
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };
  const isSelected = (date) => selectedDate && date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, daysInPrevMonth - i), isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i), isCurrentMonth: true });
    }
    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({ date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i), isCurrentMonth: false });
    }
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const formatDate = (date) => date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Popup Notification */}
      <AnimatePresence>
        {popup.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-24 left-1/2 z-50 p-6 rounded-2xl shadow-2xl text-white flex items-center space-x-4 min-w-80 ${
              popup.type === "success"
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : "bg-gradient-to-r from-red-500 to-rose-600"
            }`}
          >
            {popup.type === "success" ? <CheckCircle className="w-6 h-6 text-white" /> : <XCircle className="w-6 h-6 text-white" />}
            <p className="font-semibold text-lg">{popup.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Confirmation Modal */}
      <AnimatePresence>
        {bookingModal.isOpen && bookingModal.table && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setBookingModal({ isOpen: false, table: null })}
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Confirm Your Booking</h2>
                <p className="text-gray-600 mb-6">
                  You are booking <span className="font-semibold text-indigo-600">Table {bookingModal.table.tableNumber}</span> for {bookingModal.table.seats} guests.
                </p>
              </div>

              <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <TagIcon className="w-5 h-5 mr-2 text-indigo-500" />
                  Available Offers
                </h3>
                {bookingModal.table.offers && bookingModal.table.offers.length > 0 ? (
                  <div className="space-y-3 text-sm">
                    {bookingModal.table.offers.map((offer, index) => (
                      <label key={index} className={`flex items-center p-4 bg-white rounded-xl border-2 cursor-pointer transition-all ${selectedOffer === offer.title ? 'border-indigo-500 shadow-md' : 'border-gray-200'}`}>
                        <input
                          type="radio"
                          name="offer"
                          value={offer.title}
                          checked={selectedOffer === offer.title}
                          onChange={() => setSelectedOffer(offer.title)}
                          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <div className="ml-4">
                          <p className="font-semibold text-gray-800">{offer.title}</p>
                          <p className="text-gray-500">{offer.description || `Get ${offer.discountPercent}% off`}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No offers available for this table.</p>
                )}
                <p className="text-xs text-gray-500 mt-3 text-center bg-yellow-50 p-2 rounded-md border border-yellow-200">
                  The best applicable offer will be automatically applied to your booking.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setBookingModal({ isOpen: false, table: null })}
                  className="w-full py-3 px-6 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBook(bookingModal.table._id)}
                  className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Confirm Booking
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {/* Main Booking Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-2xl mx-4 md:mx-8 my-12 overflow-hidden"
          id="booking-section"
        >
          {/* Header */}
          <div className="text-center p-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-2xl"
            >
              <Utensils className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              Order Food Online
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Select a date and time to see available tables and place your order.
            </motion.p>
          </div>

          {/* Date & Time Selection */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Date Selection Card */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-100 p-8 transition-all duration-500 hover:shadow-xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Select Date</h3>
                    <p className="text-gray-600">Choose your preferred dining date</p>
                  </div>
                </div>

                {selectedDate && (
                  <div className="mb-6 p-4 bg-white rounded-xl border border-indigo-200 shadow-sm">
                    <p className="text-gray-800 text-center font-semibold text-lg">
                      📍 Selected: <span className="text-indigo-600">{formatDate(selectedDate)}</span>
                    </p>
                  </div>
                )}

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigateMonth(-1)} className="p-3 hover:bg-indigo-50 rounded-xl transition-colors text-gray-600 hover:text-indigo-600 hover:scale-110">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h4 className="text-gray-900 font-bold text-xl">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                    <button onClick={() => navigateMonth(1)} className="p-3 hover:bg-indigo-50 rounded-xl transition-colors text-gray-600 hover:text-indigo-600 hover:scale-110">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-gray-500 font-semibold py-3">{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {generateCalendar().map(({ date, isCurrentMonth }, index) => {
                      const disabled = isPastDate(date) || !isCurrentMonth;
                      const today = isToday(date);
                      const selected = isSelected(date);
                      return (
                        <button
                          key={index}
                          onClick={() => !disabled && setSelectedDate(date)}
                          disabled={disabled}
                          className={`h-12 rounded-lg text-base font-semibold transition-all duration-200 ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-indigo-50 text-gray-700 cursor-pointer hover:scale-110'} ${today && !selected ? 'bg-indigo-100 text-indigo-700' : ''} ${selected ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105' : ''} ${!isCurrentMonth ? 'opacity-30' : ''}`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Time Selection Card */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-100 p-8 transition-all duration-500 hover:shadow-xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Select Time</h3>
                    <p className="text-gray-600">Choose your preferred dining time</p>
                  </div>
                </div>

                {selectedTime && (
                  <div className="mb-6 p-4 bg-white rounded-xl border border-indigo-200 shadow-sm">
                    <p className="text-gray-800 text-center font-semibold text-lg">
                      ⏰ Selected: <span className="text-indigo-600">{formatTime(selectedTime)}</span>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {timeSlots.map((time) => (
                    <motion.button
                      key={time}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTime(time)}
                      className={`p-4 rounded-xl font-semibold transition-all duration-200 border text-base ${selectedTime === time ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105 border-transparent' : 'bg-white text-gray-700 hover:bg-indigo-50 border-gray-200 hover:border-indigo-300'}`}
                    >
                      {formatTime(time)}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Tables Section */}
            <motion.div variants={itemVariants} className="mt-12">
              {selectedDate && selectedTime && (
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Available Tables for {formatDate(selectedDate)} at {formatTime(selectedTime)}
                  </h2>
                  <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-center items-center py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-gray-600 mt-6 text-center text-lg">Loading available tables...</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {!isLoading && selectedDate && selectedTime ? (
                  tables.length > 0 ? (
                    tables.map((table, index) => (
                      <motion.div
                        key={table._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <TableCard table={table} onBook={openBookingModal} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-12 border border-indigo-100 max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <XCircle className="w-12 h-12 text-indigo-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Tables Available</h3>
                        <p className="text-gray-600 text-lg mb-6">
                          We're fully booked for this date and time. Please try a different time slot.
                        </p>
                        <button
                          onClick={() => { setSelectedTime(""); setSelectedDate(null); }}
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                        >
                          Choose Different Time
                        </button>
                      </div>
                    </div>
                  )
                ) : (!selectedDate || !selectedTime) && (
                  <div className="col-span-full text-center py-16">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-12 border border-indigo-100 max-w-2xl mx-auto">
                      <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-12 h-12 text-indigo-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Select Date & Time</h3>
                      <p className="text-gray-600 text-lg">
                        Choose a date and time above to see available tables for your reservation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OnlineFood;