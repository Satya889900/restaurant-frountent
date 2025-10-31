import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Utensils } from 'lucide-react';

const RestaurantCard = ({ restaurant, onClick }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={() => onClick(restaurant)}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold">{restaurant.name}</h3>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span className="truncate">{restaurant.address}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {restaurant.foodTypes.slice(0, 3).map((type, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">{type}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;