import { useEffect, useState, useContext, useRef } from "react";
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
  const { user, token } = useContext(AuthContext);
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  // Available time slots
  const timeSlots = [
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
  ];

  // Restaurant Cuisine Categories with counts
  const cuisineCategories = [
    { 
      id: "north-indian", 
      name: "North Indian", 
      icon: "🍛", 
      restaurants: 1897,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-r from-orange-500 to-red-500"
    },
    { 
      id: "cafe", 
      name: "Cafe", 
      icon: "☕", 
      restaurants: 926,
      color: "from-amber-600 to-orange-500",
      bgColor: "bg-gradient-to-r from-amber-600 to-orange-500"
    },
    { 
      id: "chinese", 
      name: "Chinese", 
      icon: "🥢", 
      restaurants: 584,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-red-500 to-pink-500"
    },
    { 
      id: "south-indian", 
      name: "South Indian", 
      icon: "🍛", 
      restaurants: 523,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-gradient-to-r from-yellow-500 to-orange-500"
    },
    { 
      id: "italian", 
      name: "Italian", 
      icon: "🍝", 
      restaurants: 321,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-r from-green-500 to-emerald-500"
    },
    { 
      id: "pan-asian", 
      name: "Pan Asian", 
      icon: "🍜", 
      restaurants: 216,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    { 
      id: "mediterranean", 
      name: "Mediterranean", 
      icon: "🥙", 
      restaurants: 45,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-r from-blue-500 to-cyan-500"
    }
  ];

  // Food Trends Data
  const foodTrends = [
    {
      title: "As EazyDiner Completes Another Successful Edition Of EazyDiner Foodie Awards In Bengaluru, Let's Take A Look At The Winners",
      description: "Discover the top restaurants that won big at this year's foodie awards ceremony",
      date: "Tanu Seth Nov 14, 2024",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Where Flavours Meet Vibes: Bangalore's Favourite Dining Spots",
      description: "Explore the hottest dining destinations where great food meets amazing ambiance",
      date: "Puneet Kapoor Oct 8, 2025",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Trending Tables To Buzzing Corners, 8 Bangalore Spots Everyone's Talking About",
      description: "From hidden gems to popular hotspots, these are the places you need to try",
      date: "Mansi Mishra Oct 1, 2025",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    },
    {
      title: "Celebrate Pujo With A Grand Feast At These 5 Restaurants In Bangalore",
      description: "Special festive menus and traditional Bengali cuisine await you this season",
      date: "Shreem Nema Sep 27, 2025",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "success" });
    }, 2000);
  };

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
      const result = await createBooking({ 
        table: tableId, 
        startTime: dateTime.toISOString(),
        // endTime is calculated on the backend
      }, token);

      showPopup("Table booked successfully!");

      setTables(result.tables || []); // Use the updated table list from the backend
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
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
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white px-4 max-w-4xl">
                    <motion.h2 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
                    >
                      {slide.title}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-xl md:text-2xl lg:text-3xl text-purple-200"
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
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* What's Your Mood? Restaurant Categories Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl shadow-lg mx-4 md:mx-8 mb-12 md:mb-16 overflow-hidden mt-8"
        >
          {/* Section Header */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">What's Your Mood?</h2>
                <p className="text-gray-600 mt-2">Discover restaurants by cuisine type</p>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                See all
              </button>
            </div>
          </div>

          {/* Cuisine Categories Grid */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cuisineCategories.map((cuisine, index) => (
                <motion.div
                  key={cuisine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-16 h-16 rounded-xl ${cuisine.bgColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl text-white">{cuisine.icon}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{cuisine.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{cuisine.restaurants.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Restaurants</p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className={`h-2 rounded-full ${cuisine.bgColor} transition-all duration-500`}
                      style={{ 
                        width: `${(cuisine.restaurants / Math.max(...cuisineCategories.map(c => c.restaurants))) * 80 + 20}%` 
                      }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Food Trends & Critic Recommendations Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg mx-4 md:mx-8 mb-12 md:mb-16 overflow-hidden"
        >
          {/* Section Header */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Food Trends | Critic Recommendation in Bengaluru</h2>
                <p className="text-gray-600 mt-2">Latest food trends and expert recommendations</p>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                See all
              </button>
            </div>
          </div>

          {/* Food Trends Grid */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {foodTrends.map((trend, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="flex">
                    <div className="w-1/3">
                      <img 
                        src={trend.image} 
                        alt={trend.title}
                        className="w-full h-32 md:h-40 object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-bold text-gray-800 text-sm md:text-base mb-2 line-clamp-2">
                        {trend.title}
                      </h3>
                      <p className="text-gray-600 text-xs md:text-sm mb-2 line-clamp-2">
                        {trend.description}
                      </p>
                      <p className="text-purple-600 text-xs font-semibold">
                        {trend.date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Payment Offers Section */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-purple-50 to-indigo-50 border-t border-purple-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">🎉 Exclusive Payment Offers</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Save more with these amazing bank offers and discounts</p>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { 
                bank: "AXIS Bank", 
                offer: "Get 20% off up to ₹500",
                discount: "20% OFF",
                minAmount: "₹1000",
                maxDiscount: "₹500",
                validity: "Until Dec 31, 2024",
                usage: "First 3 transactions",
                code: "AXISDINE20",
                icon: "🏦",
                color: "from-blue-500 to-blue-600"
              },
              { 
                bank: "Amex Platinum", 
                offer: "1+1 on dining across city",
                discount: "BUY 1 GET 1",
                minAmount: "₹1500",
                maxDiscount: "₹1000",
                validity: "Valid till stock lasts",
                usage: "Weekends only",
                code: "AMEXBOGO",
                icon: "💎",
                color: "from-green-500 to-emerald-600"
              },
              { 
                bank: "Indusind", 
                offer: "15% instant discount",
                discount: "15% OFF",
                minAmount: "₹800",
                maxDiscount: "₹300",
                validity: "Until Jan 15, 2025",
                usage: "Unlimited usage",
                code: "INDUSDINE15",
                icon: "🔶",
                color: "from-orange-500 to-red-500"
              },
              { 
                bank: "HSBC", 
                offer: "Buy 1 Get 1 free",
                discount: "B1G1 FREE",
                minAmount: "₹1200",
                maxDiscount: "₹800",
                validity: "Friday & Saturday",
                usage: "Once per month",
                code: "HSBCB1G1",
                icon: "🔴",
                color: "from-red-500 to-pink-500"
              },
              { 
                bank: "DBS Bank Vantage Card", 
                offer: "Extra 10% cashback",
                discount: "10% CASHBACK",
                minAmount: "₹500",
                maxDiscount: "₹250",
                validity: "All days",
                usage: "First 5 transactions",
                code: "DBSVANTAGE10",
                icon: "💳",
                color: "from-purple-500 to-indigo-600"
              },
              { 
                bank: "Amex Centurion", 
                offer: "Complimentary dessert + 25% off",
                discount: "25% OFF + DESSERT",
                minAmount: "₹2000",
                maxDiscount: "₹750",
                validity: "Fine dining restaurants",
                usage: "Once per card",
                code: "AMEXCENT25",
                icon: "👑",
                color: "from-black to-gray-800"
              }
            ].map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5
                }}
                className="relative group"
              >
                {/* Main Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-2xl transition-all duration-500 group-hover:border-purple-300 relative overflow-hidden">
                  {/* Background Gradient Effect */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${offer.color}/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500`}></div>
                  
                  {/* Bank Logo/Badge */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${offer.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-white font-bold text-lg">{offer.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{offer.bank}</h4>
                        <div className="flex items-center space-x-1">
                          <span className="text-green-500 text-sm">⭐</span>
                          <span className="text-gray-500 text-xs">Verified Offer</span>
                        </div>
                      </div>
                    </div>
                    {/* Discount Badge */}
                    <div className="text-right">
                      <div className={`bg-gradient-to-r ${offer.color} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                        {offer.discount}
                      </div>
                    </div>
                  </div>

                  {/* Offer Details */}
                  <div className="relative z-10 space-y-3 mb-4">
                    {/* Main Offer */}
                    <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <p className="text-gray-700 font-semibold text-sm">{offer.offer}</p>
                    </div>

                    {/* Discount Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <p className="text-gray-500">Min. Amount</p>
                        <p className="font-semibold text-gray-800">{offer.minAmount}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <p className="text-gray-500">Max. Discount</p>
                        <p className="font-semibold text-gray-800">{offer.maxDiscount}</p>
                      </div>
                    </div>

                    {/* Validity & Usage */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Validity:</span>
                        <span className="font-semibold text-gray-800">{offer.validity}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Usage:</span>
                        <span className="font-semibold text-gray-800">{offer.usage}</span>
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-xs">Promo Code:</span>
                        <div className="flex items-center space-x-2">
                          <code className="bg-white px-2 py-1 rounded text-xs font-mono font-bold text-purple-600 border border-purple-200">
                            {offer.code}
                          </code>
                          <button 
                            onClick={() => navigator.clipboard.writeText(offer.code)}
                            className="text-purple-500 hover:text-purple-700 transition-colors"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full bg-gradient-to-r ${offer.color} hover:shadow-xl text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 group-hover:shadow-purple-200 relative z-10`}
                  >
                    Avail This Offer
                  </motion.button>

                  {/* Terms */}
                  <p className="text-gray-400 text-xs text-center mt-3">
                    T&C Apply • Limited period offer
                  </p>

                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 animate-pulse"></div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-purple-100">
              <div className="flex items-center space-x-2">
                <span className="text-green-500 text-lg">✅</span>
                <p className="text-gray-600 text-sm font-medium">Instant discount at payment</p>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500 text-lg">🔄</span>
                <p className="text-gray-600 text-sm font-medium">No minimum wait time</p>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-500 text-lg">🎯</span>
                <p className="text-gray-600 text-sm font-medium">Applicable on all restaurants</p>
              </div>
            </div>
          </div>

          {/* How to Use Section */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200 max-w-4xl mx-auto">
            <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">How to Use These Offers</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">1</span>
                </div>
                <h5 className="font-semibold text-gray-800 mb-2">Select Your Bank</h5>
                <p className="text-gray-600 text-sm">Choose your preferred bank offer from the list above</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 text-xl">2</span>
                </div>
                <h5 className="font-semibold text-gray-800 mb-2">Apply Promo Code</h5>
                <p className="text-gray-600 text-sm">Copy and apply the promo code during payment</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 text-xl">3</span>
                </div>
                <h5 className="font-semibold text-gray-800 mb-2">Enjoy Discount</h5>
                <p className="text-gray-600 text-sm">Get instant discount on your final bill amount</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12 md:mb-16 px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mb-4 md:mb-6 shadow-2xl"
          >
            <span className="text-2xl md:text-3xl text-white">🍽️</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg"
          >
            Reserve Your Table
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Experience fine dining at its best. Book your perfect table for an unforgettable culinary journey.
          </motion.p>
        </div>

        {/* Date & Time Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 md:mb-16 px-4 md:px-8"
        >
          {/* Date Selection Card */}
          <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl shadow-lg border border-purple-100 p-6 md:p-8 transition-all duration-500 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg md:text-xl text-white">📅</span>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">Select Date</h3>
                <p className="text-gray-600 text-sm">Choose your preferred dining date</p>
              </div>
            </div>

            {/* Selected Date Display */}
            {selectedDate && (
              <div className="mb-6 p-4 bg-white rounded-xl border border-purple-200 shadow-sm">
                <p className="text-gray-800 text-center font-semibold">
                  📍 Selected: <span className="text-purple-600">{formatDate(selectedDate)}</span>
                </p>
              </div>
            )}

            {/* Calendar */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-purple-50 rounded-lg transition-colors hover:scale-110 text-gray-600 hover:text-purple-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h4 className="text-gray-800 font-semibold text-lg">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-purple-50 rounded-lg transition-colors hover:scale-110 text-gray-600 hover:text-purple-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-gray-500 text-sm font-medium py-2">
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
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'hover:bg-purple-50 text-gray-700 cursor-pointer hover:scale-110'
                        }
                        ${today && !selected ? 'bg-purple-100 text-purple-700' : ''}
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
          <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl shadow-lg border border-purple-100 p-6 md:p-8 transition-all duration-500 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg md:text-xl text-white">⏰</span>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">Select Time</h3>
                <p className="text-gray-600 text-sm">Choose your preferred dining time</p>
              </div>
            </div>

            {/* Selected Time Display */}
            {selectedTime && (
              <div className="mb-6 p-4 bg-white rounded-xl border border-purple-200 shadow-sm">
                <p className="text-gray-800 text-center font-semibold">
                  ⏰ Selected: <span className="text-purple-600">{formatTime(selectedTime)}</span>
                </p>
              </div>
            )}

            {/* Time Slots */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((time) => (
                <motion.button
                  key={time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    p-3 md:p-4 rounded-xl font-medium transition-all duration-200 border
                    ${selectedTime === time
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg transform scale-105 border-transparent'
                      : 'bg-white text-gray-700 hover:bg-purple-50 border-gray-200 hover:border-purple-300'
                    }
                  `}
                >
                  {formatTime(time)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tables Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative px-4 md:px-8"
        >
          {/* Section Header */}
          {selectedDate && selectedTime && (
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Available Tables for {formatDate(selectedDate)} at {formatTime(selectedTime)}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-16 md:py-20">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 md:w-16 md:h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin animation-delay-500"></div>
                <p className="text-gray-600 mt-4 text-center">Loading available tables...</p>
              </div>
            </div>
          )}

          {/* Tables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {!isLoading && selectedDate && selectedTime ? (
              tables.length > 0 ? (
                tables.map((table, index) => (
                  <motion.div
                    key={table._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <TableCard
                      table={table}
                      onBook={handleBook}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 md:py-16">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-purple-100 max-w-2xl mx-auto">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                      <span className="text-2xl md:text-4xl">😕</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                      No Tables Available
                    </h3>
                    <p className="text-gray-600 text-base md:text-lg">
                      We're fully booked for this date and time. Please try a different time slot.
                    </p>
                  </div>
                </div>
              )
            ) : (!selectedDate || !selectedTime) && (
              <div className="col-span-full text-center py-12 md:py-16">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-purple-100 max-w-2xl mx-auto">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <span className="text-2xl md:text-4xl">⏰</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                    Select Date & Time
                  </h3>
                  <p className="text-gray-600 text-base md:text-lg">
                    Choose a date and time above to see available tables for your reservation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-16 md:mt-20 pt-8 md:pt-12 border-t border-gray-200 px-4 md:px-8">
          <p className="text-gray-600 text-sm md:text-base">
            Need assistance? Call us at <span className="text-purple-600 font-semibold">(555) 123-4567</span>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © 2024 Fine Dining Restaurant. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;