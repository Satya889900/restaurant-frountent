import { useEffect, useState, useContext } from "react";
import { getTables, deleteTable, updateTable } from "../services/tableService.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plus, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Users,
  Table as TableIcon,
  MapPin,
  Star,
  AlertCircle
} from "lucide-react";
import { Utensils, StickyNote, Tag, ChefHat } from "lucide-react";
import TableImageCarousel from "../components/TableImageCarousel.jsx";

const AdminPanel = () => {
  const { user, token } = useContext(AuthContext);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0];
      const data = await getTables(date, time, token);
      setTables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError(`Failed to fetch tables: ${err.message}`);
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchTables();
    }
  }, [user]);

  const handleDeleteTable = async (id) => {
    if (!window.confirm("Are you sure you want to delete this table?")) return;
    setLoading(true);
    try {
      await deleteTable(id, token);
      showSuccess("Table deleted successfully!");
      fetchTables();
    } catch (err) {
      console.error("Delete table error:", err.message);
      setError(`Failed to delete table: ${err.message}`);
    } finally {
      setLoading(false);
    }
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

  if (user?.role !== "admin") return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Access Denied</h3>
        <p className="text-gray-600 mb-6">Admin privileges required to access this page.</p>
        <Link
          to="/"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  );

  const availableTables = tables.filter(table => table.isAvailable);
  const bookedTables = tables.filter(table => !table.isAvailable);
  const totalSeats = tables.reduce((sum, table) => sum + (table.seats || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Table Management</h1>
          <p className="text-gray-600 text-lg">Manage your restaurant tables and seating arrangements</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <TableIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Tables</p>
                <p className="text-2xl font-bold text-gray-800">{tables.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-xl mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Available</p>
                <p className="text-2xl font-bold text-gray-800">{availableTables.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-xl mr-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Booked</p>
                <p className="text-2xl font-bold text-gray-800">{bookedTables.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Seats</p>
                <p className="text-2xl font-bold text-gray-800">{totalSeats}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-indigo-500 rounded-full mr-4"></div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Table Management</h3>
                <p className="text-gray-600">Add new tables or manage existing ones</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={fetchTables}
                disabled={loading}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 flex items-center font-semibold"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                to="/admin/add-table"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Table
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center"
          >
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-800 font-medium">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            variants={itemVariants}
            className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center"
          >
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800 font-medium">{success}</span>
          </motion.div>
        )}

        {/* Tables Grid */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-indigo-500 rounded-full mr-4"></div>
              <h3 className="text-2xl font-bold text-gray-900">Restaurant Tables</h3>
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Showing {tables.length} table{tables.length !== 1 ? 's' : ''}
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center">
                <RefreshCw className="animate-spin w-8 h-8 text-indigo-600 mr-4" />
                <span className="text-gray-600 text-lg font-medium">Loading tables...</span>
              </div>
            </div>
          )}

          {tables.length === 0 && !loading && !error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <TableIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No tables available</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Get started by adding your first table to manage reservations and seating arrangements.
              </p>
              <Link
                to="/admin/add-table"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Table
              </Link>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tables.map((table) => (
              <motion.div
                key={table._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <TableImageCarousel images={table.restaurantImages} />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      table.isAvailable 
                        ? 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20' 
                        : 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20'
                    }`}>
                      {table.isAvailable ? 'Available' : 'Booked'}
                    </span>
                    {table.tableClass && table.tableClass !== 'general' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 ring-1 ring-inset ring-purple-600/20">
                        <Star className="w-3 h-3 mr-1" />
                        {table.tableClass}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex-grow">
                    {/* Title and Seats */}
                    <div className="flex justify-between items-baseline mb-3">
                      <h4 className="text-xl font-bold text-gray-900">Table {table.tableNumber}</h4>
                      <p className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                        {table.seats} {table.seats === 1 ? 'seat' : 'seats'}
                      </p>
                    </div>

                    {/* Price and Features */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-bold text-gray-900">₹{table.price || 'N/A'}</span>
                      </div>
                      
                      {table.location?.address && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="truncate">{table.location.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Food Types */}
                    {table.foodTypes && table.foodTypes.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Utensils className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-semibold">Cuisine</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {table.foodTypes.map((type, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">{type}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Class Features */}
                    {table.classFeatures && table.classFeatures.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Star className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-semibold">Features</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {table.classFeatures.map((feature, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Food Menu Preview */}
                    {table.foodMenu && table.foodMenu.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <ChefHat className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-semibold">Menu Items</span>
                        </div>
                        <p className="text-xs text-gray-600">{table.foodMenu.length} item(s) configured.</p>
                      </div>
                    )}

                    {/* Offers Preview */}
                    {table.offers && table.offers.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Tag className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-semibold">Offers</span>
                        </div>
                        <p className="text-xs text-gray-600">{table.offers.length} offer(s) available.</p>
                      </div>
                    )}

                    {/* Notes */}
                    {table.notes && (
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <StickyNote className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-semibold">Notes</span>
                        </div>
                        <div className="text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                          <p className="truncate group-hover:whitespace-normal group-hover:overflow-visible">
                            {table.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                    <Link
                      to={`/admin/edit-table/${table._id}`}
                      className="flex-1 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-xl hover:bg-indigo-100 transition-all duration-200 flex items-center justify-center font-semibold text-sm group/edit"
                    >
                      <Edit className="w-4 h-4 mr-2 group-hover/edit:scale-110 transition-transform" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteTable(table._id)}
                      disabled={loading}
                      className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-xl hover:bg-red-100 transition-all duration-200 disabled:opacity-50 flex items-center justify-center font-semibold text-sm group/delete"
                    >
                      <Trash2 className="w-4 h-4 mr-2 group-hover/delete:scale-110 transition-transform" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Stats */}
        {tables.length > 0 && (
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Showing {tables.length} table{tables.length !== 1 ? 's' : ''} • 
              {' '}{availableTables.length} available • 
              {' '}{bookedTables.length} booked • 
              {' '}Total capacity: {totalSeats} seats
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPanel;