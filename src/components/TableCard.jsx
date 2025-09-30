const TableCard = ({ table, onBook }) => {
  return (
    <div
      className={`p-6 rounded-xl shadow-md transform transition duration-300 hover:scale-105 hover:shadow-2xl
        ${table.available ? "bg-green-50 hover:bg-green-100" : "bg-red-50 hover:bg-red-100"}`}
    >
      {/* Table Number */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        🍽️ Table {table.tableNumber}
      </h2>

      {/* Seats */}
      <p className="text-gray-600 mb-3">Seats: {table.seats}</p>

      {/* Status */}
      <p className="mb-4">
        Status:{" "}
        {table.available ? (
          <span className="inline-block px-2 py-1 text-sm font-semibold text-green-700 bg-green-200 rounded-full">
            Available ✅
          </span>
        ) : (
          <span className="inline-block px-2 py-1 text-sm font-semibold text-red-700 bg-red-200 rounded-full">
            Booked ❌
          </span>
        )}
      </p>

      {/* Book Button */}
      <button
        onClick={() => onBook(table._id)}
        disabled={!table.available}
        className={`w-full py-2 rounded-lg font-semibold transition 
          ${
            table.available
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
      >
        {table.available ? "Book Now" : "Unavailable"}
      </button>
    </div>
  );
};

export default TableCard;
