import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import TableImageCarousel from "./TableImageCarousel.jsx";

const OnlineTableCard = ({ table }) => {
  return (
    <Link to={`/restaurant/${table._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group"
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <TableImageCarousel images={table.restaurantImages} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Restaurant Name & Price */}
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-bold text-gray-900 truncate pr-4" title={table.restaurantName}>
              {table.restaurantName || 'Restaurant'}
            </h2>
          </div>

          {/* Rating & Location */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center flex-shrink-0">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="font-bold text-gray-800">4.5</span>
              <span className="text-gray-500 ml-1">(120)</span>
            </div>
            {table.location?.address && (
              <div className="flex items-center truncate ml-4">
                <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate">{table.location.address}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default OnlineTableCard;