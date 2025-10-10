import { motion } from "framer-motion";

const TableCard = ({ table, onBook }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        y: -5
      }}
      className={`relative p-6 rounded-2xl shadow-lg transform transition-all duration-500 border-2 overflow-hidden group
        ${
          table.available 
            ? "bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200 hover:border-green-300 hover:shadow-xl" 
            : "bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border-red-200 hover:border-red-300 hover:shadow-xl"
        }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-20 h-20 bg-current rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-current rounded-full"></div>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

      {/* Header Section */}
      <div className="relative z-10">
        {/* Table Number & Premium Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300
              ${
                table.available 
                  ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                  : "bg-gradient-to-br from-red-500 to-rose-600"
              }`}
            >
              <span className="text-2xl text-white">🍽️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Table {table.tableNumber}
              </h2>
              <div className={`w-16 h-1 rounded-full mt-1
                ${
                  table.available 
                    ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                    : "bg-gradient-to-r from-red-500 to-rose-500"
                }`}></div>
            </div>
          </div>
          
          {/* Premium Badge */}
          {table.seats >= 6 && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg transform rotate-12">
              ⭐ Premium
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Seats */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">👥</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 text-center mb-1">
              {table.seats}
            </p>
            <p className="text-gray-600 text-sm text-center font-medium">Seats</p>
          </div>

          {/* Table Type */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">🪑</span>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-800 text-center mb-1 capitalize">
              {table.seats <= 2 ? 'Intimate' : table.seats <= 4 ? 'Standard' : 'Family'}
            </p>
            <p className="text-gray-600 text-sm text-center font-medium">Type</p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { icon: "🪟", label: "Window", available: table.features?.window || Math.random() > 0.3 },
            { icon: "🔇", label: "Quiet", available: table.features?.quiet || Math.random() > 0.5 },
            { icon: "🌿", label: "Garden", available: table.features?.garden || Math.random() > 0.7 }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1 text-sm
                ${feature.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
              >
                {feature.icon}
              </div>
              <p className={`text-xs font-medium ${feature.available ? 'text-gray-600' : 'text-gray-400'}`}>
                {feature.label}
              </p>
            </div>
          ))}
        </div>

        {/* Status & Pricing */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${table.available ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`font-bold text-sm ${table.available ? 'text-green-600' : 'text-red-600'}`}>
              {table.available ? 'Available Now' : 'Reserved'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">
              ${table.price || (table.seats * 15)}
            </p>
            <p className="text-gray-500 text-xs">Total for 2 hours</p>
          </div>
        </div>

        {/* Book Button */}
        <motion.button
          whileHover={{ scale: table.available ? 1.02 : 1 }}
          whileTap={{ scale: table.available ? 0.98 : 1 }}
          onClick={() => table.available && onBook(table._id)}
          disabled={!table.available}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg relative overflow-hidden group/btn
            ${
              table.available
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:shadow-xl"
                : "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed"
            }`}
        >
          {/* Button Shimmer */}
          {table.available && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
          )}
          
          <span className="relative z-10 flex items-center justify-center">
            {table.available ? (
              <>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Book This Table
                <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Currently Booked
              </>
            )}
          </span>
        </motion.button>

        {/* Quick Info */}
        {table.available && (
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
          table.available 
            ? "bg-gradient-to-br from-green-500 to-emerald-500" 
            : "bg-gradient-to-br from-red-500 to-rose-500"
        }`}></div>
      <div className={`absolute bottom-0 left-0 w-16 h-16 rounded-tr-2xl opacity-10
        ${
          table.available 
            ? "bg-gradient-to-tr from-emerald-500 to-green-500" 
            : "bg-gradient-to-tr from-rose-500 to-red-500"
        }`}></div>

      {/* Floating Elements */}
      {table.available && (
        <>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 animate-pulse"></div>
        </>
      )}
    </motion.div>
  );
};

export default TableCard;