import { useEffect, useState, useRef } from "react";
import OnlineTableCard from "../../components/Table/OnlineTableCard.jsx";
import { getTables } from "../../services/tableService.js";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const OnlineFood = () => {
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  const carouselSlides = [
    { id: 1, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80", title: "Explore Culinary Delights", subtitle: "Find and book the best tables in town" },
    { id: 2, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", title: "Instant Reservations", subtitle: "Your next favorite meal is just a click away" },
    { id: 3, image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80", title: "Unforgettable Ambiance", subtitle: "Dine in style and comfort" }
  ];

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "success" });
    }, 3000);
  };

  useEffect(() => {
    const fetchTables = async () => {
      setIsLoading(true);
      try {
        const data = await getTables();
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
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  const goToSlide = (index) => setCurrentSlide(index);



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

      <motion.div
        className="w-full"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {/* Main Booking Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white shadow-2xl overflow-hidden"
          id="booking-section"
        >
          {/* Hero Carousel */}
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <div 
              ref={carouselRef}
              className="flex h-full transition-transform duration-700 ease-in-out"
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
                          key={slide.id} // Add key to re-trigger animation on slide change
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="text-4xl md:text-6xl font-bold mb-6"
                        >
                          {slide.title}
                        </motion.h2>
                        <motion.p 
                          key={slide.id + 'sub'} // Add key to re-trigger animation
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="text-xl md:text-2xl text-purple-200 font-light"
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
            <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 z-10 backdrop-blur-sm">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 z-10 backdrop-blur-sm">
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
              {carouselSlides.map((_, index) => (
                <button key={index} onClick={() => goToSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 backdrop-blur-sm ${index === currentSlide ? 'bg-white scale-125 shadow-lg' : 'bg-white/50 hover:bg-white/70'}`} />
              ))}
            </div>
          </div>

          <div className="p-8">
            {/* Tables Section */}
            <motion.div variants={itemVariants} className="mt-12" id="tables-section">
              {isLoading && (
                <div className="flex justify-center items-center py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-gray-600 mt-6 text-center text-lg">Loading available tables...</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {!isLoading &&
                  (tables.length > 0 ? (
                    tables.map((table, index) => (
                      <motion.div
                        key={table._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <OnlineTableCard table={table} onBook={() => {}} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-12 border border-indigo-100 max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <XCircle className="w-12 h-12 text-indigo-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Restaurants Found</h3>
                        <p className="text-gray-600 text-lg mb-6">
                          There are currently no restaurants available. Please check back later.
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OnlineFood;