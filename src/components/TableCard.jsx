import { motion } from "framer-motion";
import { Users, Clock, MapPin, Star, CheckCircle, XCircle, Crown, Tag } from "lucide-react";
import TableImageCarousel from "./TableImageCarousel.jsx";

const TableCard = ({ table, onBook }) => {
  const isAvailable = table.isAvailable !== undefined ? table.isAvailable : table.available;
  const tablePrice = table.price || (table.seats * 15);
  const activeOffers = table.offers?.filter(offer => offer.active) || [];
  
  // Determine table type based on seats
  const getTableType = (seats) => {
    if (seats <= 2) return { label: 'Intimate', color: 'purple' };
    if (seats <= 4) return { label: 'Standard', color: 'blue' };
    if (seats <= 6) return { label: 'Family', color: 'green' };
    return { label: 'Large Group', color: 'orange' };
  };

  const tableType = getTableType(table.seats);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative group"
    >
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-500
          ${
            isAvailable 
              ? "bg-gradient-to-br from-white to-gray-50 border-green-200 hover:border-green-300 hover:shadow-2xl" 
              : "bg-gradient-to-br from-white to-gray-50 border-red-200 hover:border-red-300 hover:shadow-xl"
          } shadow-lg hover:shadow-2xl`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-4 right-4 w-20 h-20 bg-current rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-current rounded-full"></div>
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
            <TableImageCarousel images={table.restaurantImages} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            
            {/* Premium Badge */}
            {table.tableClass && table.tableClass !== 'general' && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg flex items-center">
                <Crown className="w-3 h-3 mr-1" />
                {table.tableClass}
              </div>
            )}

            {/* Availability Badge */}
            <div className="absolute top-4 right-4">
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm
                ${
                  isAvailable 
                    ? 'bg-green-500/90 text-white' 
                    : 'bg-red-500/90 text-white'
                }`}
              >
                {isAvailable ? (
                  <CheckCircle className="w-4 h-4 mr-1" />
                ) : (
                  <XCircle className="w-4 h-4 mr-1" />
                )}
                {isAvailable ? 'Available' : 'Booked'}
              </div>
            </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300
                ${
                  isAvailable 
                    ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                    : "bg-gradient-to-br from-red-500 to-rose-600"
                }`}
              >
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Table {table.tableNumber}
                </h2>
                <div className={`w-20 h-1 rounded-full
                  ${
                    isAvailable 
                      ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                      : "bg-gradient-to-r from-red-500 to-rose-500"
                  }`}
                ></div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Seats */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 text-center mb-1">
                {table.seats}
              </p>
              <p className="text-gray-600 text-sm text-center font-medium">Seats</p>
            </div>

            {/* Table Type */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                  ${
                    tableType.color === 'purple' ? 'bg-purple-100' :
                    tableType.color === 'blue' ? 'bg-blue-100' :
                    tableType.color === 'green' ? 'bg-green-100' : 'bg-orange-100'
                  }`}
                >
                  <Star className={`w-5 h-5 ${
                    tableType.color === 'purple' ? 'text-purple-600' :
                    tableType.color === 'blue' ? 'text-blue-600' :
                    tableType.color === 'green' ? 'text-green-600' : 'text-orange-600'
                  }`} />
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900 text-center mb-1">
                {tableType.label}
              </p>
              <p className="text-gray-600 text-sm text-center font-medium">Type</p>
            </div>
          </div>

          {/* Features Preview */}
          {table.classFeatures && table.classFeatures.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {table.classFeatures.slice(0, 4).map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-200"
                  >
                    {feature}
                  </span>
                ))}
                {table.classFeatures.length > 4 && (
                  <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                    +{table.classFeatures.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Offers Preview */}
          {activeOffers.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-gray-500" />
                Offers Available
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded-lg border border-rose-200">
                  {activeOffers.length} {activeOffers.length === 1 ? 'Offer' : 'Offers'}
                </span>
              </div>
            </div>
          )}

          {/* Location */}
          {table.location?.address && (
            <div className="mb-6 flex items-center text-sm text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-200">
              <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
              <span className="truncate">{table.location.address}</span>
            </div>
          )}

          {/* Status & Pricing */}
          <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className={`font-bold text-sm ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {isAvailable ? 'Available Now' : 'Reserved'}
              </span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ₹{tablePrice}
              </p>
              <p className="text-gray-500 text-xs flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Total for 2 hours
              </p>
            </div>
          </div>

          {/* Book Button */}
          <motion.button
            whileHover={{ scale: isAvailable ? 1.02 : 1 }}
            whileTap={{ scale: isAvailable ? 0.98 : 1 }}
            onClick={() => isAvailable && onBook(table)}
            disabled={!isAvailable}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg relative overflow-hidden group/btn
              ${
                isAvailable
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-xl"
                  : "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed"
              }`}
          >
            {/* Button Shimmer */}
            {isAvailable && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
            )}
            
            <span className="relative z-10 flex items-center justify-center">
              {isAvailable ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-3" />
                  Book This Table
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 mr-3" />
                  Currently Booked
                </>
              )}
            </span>
          </motion.button>

          {/* Quick Info */}
          {isAvailable && (
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-green-600 text-sm font-medium">
                Ready to book • Confirmation in 30s
              </p>
            </div>
          )}
        </div>

        {/* Corner Accents */}
        <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-2xl opacity-10
          ${
            isAvailable 
              ? "bg-gradient-to-br from-green-500 to-emerald-500" 
              : "bg-gradient-to-br from-red-500 to-rose-500"
          }`}
        ></div>
        <div className={`absolute bottom-0 left-0 w-16 h-16 rounded-tr-2xl opacity-10
          ${
            isAvailable 
              ? "bg-gradient-to-tr from-emerald-500 to-green-500" 
              : "bg-gradient-to-tr from-rose-500 to-red-500"
          }`}
        ></div>

        {/* Floating Elements */}
        {isAvailable && (
          <>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 animate-pulse"></div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TableCard;