import { useEffect, useState, useContext, useRef, useLayoutEffect } from "react";
import TableCard from "../components/TableCard.jsx";
import { getTables } from "../services/tableService.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { createBooking } from "../services/bookingService.js";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle,
  Crown,
  Coffee,
  Utensils,
  Pizza,
  Salad,
  IceCream,
  Sparkles,
  Tag as TagIcon
} from "lucide-react";

const Home = () => {
  const [tables, setTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { user } = useContext(AuthContext);
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });
  const [bookingModal, setBookingModal] = useState({ isOpen: false, table: null });
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paymentOffers, setPaymentOffers] = useState([]);
  const carouselRef = useRef(null);

  // Available time slots
  const timeSlots = [
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
  ];

  // Restaurant Cuisine Categories with enhanced data
  const cuisineCategories = [
    { 
      id: "north-indian", 
      name: "North Indian", 
      icon: "🍛", 
      restaurants: 1897,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-r from-orange-500 to-red-500",
      description: "Rich curries & tandoori delights"
    },
    { 
      id: "cafe", 
      name: "Cafe", 
      icon: "☕", 
      restaurants: 926,
      color: "from-amber-600 to-orange-500",
      bgColor: "bg-gradient-to-r from-amber-600 to-orange-500",
      description: "Coffee & light bites"
    },
    { 
      id: "chinese", 
      name: "Chinese", 
      icon: "🥢", 
      restaurants: 584,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-red-500 to-pink-500",
      description: "Authentic Asian flavors"
    },
    { 
      id: "south-indian", 
      name: "South Indian", 
      icon: "🍛", 
      restaurants: 523,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
      description: "Dosas & traditional meals"
    },
    { 
      id: "italian", 
      name: "Italian", 
      icon: "🍝", 
      restaurants: 321,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-r from-green-500 to-emerald-500",
      description: "Pasta & wood-fired pizzas"
    },
    { 
      id: "pan-asian", 
      name: "Pan Asian", 
      icon: "🍜", 
      restaurants: 216,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      description: "Fusion Asian cuisine"
    },
    { 
      id: "mediterranean", 
      name: "Mediterranean", 
      icon: "🥙", 
      restaurants: 45,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
      description: "Fresh & healthy options"
    },
    { 
      id: "desserts", 
      name: "Desserts", 
      icon: "🍰", 
      restaurants: 189,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-gradient-to-r from-pink-500 to-rose-500",
      description: "Sweet treats & pastries"
    }
  ];

  // Food Trends Data
  const foodTrends = [
    {
      title: "As EazyDiner Completes Another Successful Edition Of EazyDiner Foodie Awards In Bengaluru, Let's Take A Look At The Winners",
      description: "Discover the top restaurants that won big at this year's foodie awards ceremony",
      date: "Tanu Seth Nov 14, 2024",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Awards"
    },
    {
      title: "Where Flavours Meet Vibes: Bangalore's Favourite Dining Spots",
      description: "Explore the hottest dining destinations where great food meets amazing ambiance",
      date: "Puneet Kapoor Oct 8, 2025",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Trending"
    },
    {
      title: "Trending Tables To Buzzing Corners, 8 Bangalore Spots Everyone's Talking About",
      description: "From hidden gems to popular hotspots, these are the places you need to try",
      date: "Mansi Mishra Oct 1, 2025",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      category: "Hotspots"
    },
    {
      title: "Celebrate Pujo With A Grand Feast At These 5 Restaurants In Bangalore",
      description: "Special festive menus and traditional Bengali cuisine await you this season",
      date: "Shreem Nema Sep 27, 2025",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Festive"
    }
  ];

  // Carousel slides data
  const carouselSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Elegant Dining Experience",
      subtitle: "Discover our premium restaurant ambiance"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      title: "Gourmet Cuisine",
      subtitle: "Exquisite dishes prepared by master chefs"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Perfect Atmosphere",
      subtitle: "Create unforgettable memories with us"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    if (window.location.hash === '#booking-section') {
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

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

  useEffect(() => {
    if (tables.length > 0) {
      const allOffers = tables.flatMap(table => table.offers || []);
      const activeOffers = allOffers.filter(offer => offer.active);
      
      // Deduplicate offers by title to show each offer only once
      const uniqueOffers = Array.from(new Map(activeOffers.map(offer => [offer.title, offer])).values());
      
      setPaymentOffers(uniqueOffers);
    }
  }, [tables]);

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
    const totalCells = 42;
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 relative overflow-hidden">
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
            {popup.type === "success" ? (
              <CheckCircle className="w-6 h-6 text-white" />
            ) : (
              <XCircle className="w-6 h-6 text-white" />
            )}
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

      {/* Hero Carousel */}
      <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
        <div 
          ref={carouselRef}
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselSlides.map((slide) => (
            <div
              key={slide.id}
              className="w-full h-full flex-shrink-0 relative"
            >
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white px-4 max-w-4xl">
                    <motion.h2 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
                    >
                      {slide.title}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-xl md:text-2xl lg:text-3xl text-purple-200 font-light"
                    >
                      {slide.subtitle}
                    </motion.p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-300 z-10 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-300 z-10 backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
                index === currentSlide 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10 -mt-8"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {/* What's Your Mood? Restaurant Categories Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-2xl mx-4 md:mx-8 mb-12 overflow-hidden"
        >
          {/* Section Header */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center mb-4 lg:mb-0">
                <div className="w-2 h-12 bg-indigo-500 rounded-full mr-4"></div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">What's Your Mood?</h2>
                  <p className="text-gray-600 mt-2 text-lg">Discover restaurants by cuisine type</p>
                </div>
              </div>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Explore All Cuisines
              </button>
            </div>
          </div>

          {/* Cuisine Categories Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cuisineCategories.map((cuisine, index) => (
                <motion.div
                  key={cuisine.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5
                  }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  {/* Background Gradient Effect */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${cuisine.color} rounded-full -translate-y-10 translate-x-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl ${cuisine.bgColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl text-white">{cuisine.icon}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{cuisine.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{cuisine.description}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{cuisine.restaurants.toLocaleString()}</p>
                    <p className="text-gray-500 text-sm font-medium">Restaurants</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                      <div 
                        className={`h-2 rounded-full ${cuisine.bgColor} transition-all duration-500 group-hover:shadow-lg`}
                        style={{ 
                          width: `${(cuisine.restaurants / Math.max(...cuisineCategories.map(c => c.restaurants))) * 80 + 20}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Hover Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Food Trends & Critic Recommendations Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-2xl mx-4 md:mx-8 mb-12 overflow-hidden"
        >
          {/* Section Header */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center mb-4 lg:mb-0">
                <div className="w-2 h-12 bg-indigo-500 rounded-full mr-4"></div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Food Trends | Critic Recommendations</h2>
                  <p className="text-gray-600 mt-2 text-lg">Latest food trends and expert recommendations in Bengaluru</p>
                </div>
              </div>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                View All Articles
              </button>
            </div>
          </div>

          {/* Food Trends Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {foodTrends.map((trend, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                  <div className="flex h-48">
                    <div className="w-2/5 relative overflow-hidden">
                      <img 
                        src={trend.image} 
                        alt={trend.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {trend.category}
                        </span>
                      </div>
                    </div>
                    <div className="w-3/5 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 leading-tight">
                          {trend.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {trend.description}
                        </p>
                      </div>
                      <p className="text-indigo-600 text-sm font-semibold flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        {trend.date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Exclusive Payment Offers Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl mx-4 md:mx-8 mb-12 overflow-hidden"
        >
          <div className="p-12 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">🎉 Exclusive Payment Offers</h3>
              <p className="text-indigo-100 text-xl max-w-2xl mx-auto">
                Save more with these amazing bank offers and discounts
              </p>
              <div className="w-24 h-1 bg-white/50 mx-auto rounded-full mt-6"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {paymentOffers.length > 0 ? paymentOffers.map((offer, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-6 shadow-2xl border border-white/20 backdrop-blur-sm"
                >
                  {/* Bank Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">🏦</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{offer.bank || "Bank Offer"}</h4>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 text-sm font-medium">Verified Offer</span>
                        </div>
                      </div>
                    </div>
                    {offer.discountPercent > 0 && (
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {offer.discountPercent}% OFF
                      </div>
                    )}
                  </div>

                  {/* Offer Details */}
                  <div className="space-y-4 mb-6">
                    {/* Main Offer */}
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <p className="text-gray-800 font-semibold text-lg">{offer.title}</p>
                    </div>

                    {/* Discount Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {offer.description && (
                        <div className="bg-gray-50 p-3 rounded-lg text-center col-span-2">
                          <p className="text-gray-600">{offer.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Validity & Usage */}
                    <div className="space-y-2 text-sm">
                      {offer.validTo && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Valid Until:</span>
                          <span className="font-semibold text-gray-800">{new Date(offer.validTo).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Promo Code */}
                    {offer.code && (
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">Promo Code:</span>
                          <div className="flex items-center space-x-2">
                            <code className="bg-white px-3 py-2 rounded-lg text-sm font-mono font-bold text-indigo-600 border border-indigo-200">
                              {offer.code}
                            </code>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(offer.code);
                                showPopup("Promo code copied to clipboard!");
                              }}
                              className="text-indigo-500 hover:text-indigo-700 transition-colors p-2 hover:bg-indigo-50 rounded-lg"
                            >
                              📋
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Avail This Offer
                  </motion.button>

                  {/* Terms */}
                  <p className="text-gray-400 text-xs text-center mt-3">
                    T&C Apply • Limited period offer
                  </p>
                </motion.div>
              )) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-indigo-200">No special offers available at the moment. Please check back later!</p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-12">
              <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <p className="text-white text-lg font-medium">Instant discount at payment</p>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/30"></div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-blue-300" />
                  <p className="text-white text-lg font-medium">No minimum wait time</p>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/30"></div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <p className="text-white text-lg font-medium">Applicable on all restaurants</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Booking Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-2xl mx-4 md:mx-8 mb-12 overflow-hidden"
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
              Reserve Your Table
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Experience fine dining at its best. Book your perfect table for an unforgettable culinary journey.
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

                {/* Selected Date Display */}
                {selectedDate && (
                  <div className="mb-6 p-4 bg-white rounded-xl border border-indigo-200 shadow-sm">
                    <p className="text-gray-800 text-center font-semibold text-lg">
                      📍 Selected: <span className="text-indigo-600">{formatDate(selectedDate)}</span>
                    </p>
                  </div>
                )}

                {/* Calendar */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-3 hover:bg-indigo-50 rounded-xl transition-colors text-gray-600 hover:text-indigo-600 hover:scale-110"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h4 className="text-gray-900 font-bold text-xl">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-3 hover:bg-indigo-50 rounded-xl transition-colors text-gray-600 hover:text-indigo-600 hover:scale-110"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Week Days */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-gray-500 font-semibold py-3">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
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
                          className={`
                            h-12 rounded-lg text-base font-semibold transition-all duration-200
                            ${disabled 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'hover:bg-indigo-50 text-gray-700 cursor-pointer hover:scale-110'
                            }
                            ${today && !selected ? 'bg-indigo-100 text-indigo-700' : ''}
                            ${selected ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105' : ''}
                            ${!isCurrentMonth ? 'opacity-30' : ''}
                          `}
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

                {/* Selected Time Display */}
                {selectedTime && (
                  <div className="mb-6 p-4 bg-white rounded-xl border border-indigo-200 shadow-sm">
                    <p className="text-gray-800 text-center font-semibold text-lg">
                      ⏰ Selected: <span className="text-indigo-600">{formatTime(selectedTime)}</span>
                    </p>
                  </div>
                )}

                {/* Time Slots */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {timeSlots.map((time) => (
                    <motion.button
                      key={time}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTime(time)}
                      className={`
                        p-4 rounded-xl font-semibold transition-all duration-200 border text-base
                        ${selectedTime === time
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105 border-transparent'
                          : 'bg-white text-gray-700 hover:bg-indigo-50 border-gray-200 hover:border-indigo-300'
                        }
                      `}
                    >
                      {formatTime(time)}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Tables Section */}
            <motion.div 
              variants={itemVariants}
              className="mt-12"
            >
              {/* Section Header */}
              {selectedDate && selectedTime && (
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Available Tables for {formatDate(selectedDate)} at {formatTime(selectedTime)}
                  </h2>
                  <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center items-center py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animation-delay-500"></div>
                    <p className="text-gray-600 mt-6 text-center text-lg">Loading available tables...</p>
                  </div>
                </div>
              )}

              {/* Tables Grid */}
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
                        <TableCard
                          table={table}
                          onBook={openBookingModal}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-12 border border-indigo-100 max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <XCircle className="w-12 h-12 text-indigo-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          No Tables Available
                        </h3>
                        <p className="text-gray-600 text-lg mb-6">
                          We're fully booked for this date and time. Please try a different time slot.
                        </p>
                        <button
                          onClick={() => {
                            setSelectedTime("");
                            setSelectedDate(null);
                          }}
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
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Select Date & Time
                      </h3>
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

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-16 pt-12 border-t border-gray-300 px-8 pb-8"
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 text-lg mb-4">
              Need assistance? Call us at <span className="text-indigo-600 font-semibold">(555) 123-4567</span>
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 Fine Dining Restaurant. All rights reserved. | 
              <span className="text-indigo-500 ml-2">Privacy Policy</span> • 
              <span className="text-indigo-500 ml-2">Terms of Service</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;