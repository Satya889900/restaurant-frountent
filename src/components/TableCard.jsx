const TableCard = ({ table, onBook }) => {
  return (
    <div
      className={`relative p-6 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border backdrop-blur-lg overflow-hidden group
        ${
          table.available 
            ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/15 hover:to-emerald-500/15 border-green-500/20" 
            : "bg-gradient-to-br from-red-500/10 to-rose-500/10 hover:from-red-500/15 hover:to-rose-500/15 border-red-500/20"
        }`}
    >
      {/* Animated Background Glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl
        ${
          table.available 
            ? "bg-gradient-to-br from-green-500/5 to-emerald-500/5" 
            : "bg-gradient-to-br from-red-500/5 to-rose-500/5"
        }`}></div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

      {/* Header Section */}
      <div className="relative z-10">
        {/* Table Number */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl shadow-lg backdrop-blur-sm
              ${
                table.available 
                  ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30" 
                  : "bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30"
              }`}
            >
              <span className="text-2xl">🍽️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                Table {table.tableNumber}
              </h2>
              <div className={`w-12 h-1 rounded-full mt-1
                ${
                  table.available 
                    ? "bg-gradient-to-r from-green-400 to-emerald-400" 
                    : "bg-gradient-to-r from-red-400 to-rose-400"
                }`}></div>
            </div>
          </div>
          
          {/* Premium Badge */}
          {table.seats >= 6 && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              ⭐ Premium
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Seats */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-300">👤</span>
              </div>
              <span className="text-white font-semibold text-sm">Seats</span>
            </div>
            <p className="text-2xl font-bold text-white text-center">
              {table.seats}
            </p>
          </div>

          {/* Table Type */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-300">🪑</span>
              </div>
              <span className="text-white font-semibold text-sm">Type</span>
            </div>
            <p className="text-sm font-semibold text-white/80 text-center capitalize">
              {table.seats <= 2 ? 'Intimate' : table.seats <= 4 ? 'Standard' : 'Family'}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6 flex justify-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border
            ${
              table.available
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-100 border-green-500/30"
                : "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-100 border-red-500/30"
            }`}
          >
            {table.available ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="font-bold text-sm">Available Now</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                <span className="font-bold text-sm">Reserved</span>
              </>
            )}
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={() => onBook(table._id)}
          disabled={!table.available}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform shadow-2xl backdrop-blur-sm border relative overflow-hidden group/btn
            ${
              table.available
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-green-500/30 hover:scale-102 active:scale-95"
                : "bg-gradient-to-r from-gray-600/50 to-gray-700/50 text-gray-400 border-gray-500/30 cursor-not-allowed"
            }`}
        >
          {/* Button Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
          
          <span className="relative z-10 flex items-center justify-center">
            {table.available ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Reserve Table
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Unavailable
              </>
            )}
          </span>
        </button>

        {/* Quick Info */}
        {table.available && (
          <div className="mt-4 text-center">
            <p className="text-green-300/80 text-sm font-medium">
              ✓ Ready to book instantly
            </p>
          </div>
        )}
      </div>

      {/* Corner Accents */}
      <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-2xl
        ${
          table.available 
            ? "bg-gradient-to-br from-green-500/10 to-transparent" 
            : "bg-gradient-to-br from-red-500/10 to-transparent"
        }`}></div>
      <div className={`absolute bottom-0 left-0 w-16 h-16 rounded-tr-2xl
        ${
          table.available 
            ? "bg-gradient-to-tr from-emerald-500/10 to-transparent" 
            : "bg-gradient-to-tr from-rose-500/10 to-transparent"
        }`}></div>
    </div>
  );
};

export default TableCard;