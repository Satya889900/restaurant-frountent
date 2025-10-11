import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTableById, updateTable } from "../services/tableService.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { Plus, Trash2, Upload, X, ChevronLeft, ChevronRight } from "lucide-react";

const ImageCarousel = ({ images, onImagesUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImageUrl = event.target.result;
        onImagesUpdate([...images, newImageUrl]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesUpdate(newImages);
    if (currentIndex >= newImages.length && newImages.length > 0) {
      setCurrentIndex(newImages.length - 1);
    } else if (newImages.length === 0) {
      setCurrentIndex(0);
    }
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gray-50 min-h-64">
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-500 mb-4">No images added yet</p>
        <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
          <Upload className="w-4 h-4 inline mr-2" />
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
      {/* Main Image Display */}
      <div className="relative h-80 md:h-96">
        <img
          src={images[currentIndex]}
          alt={`Table view ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Remove Current Image Button */}
        <button
          type="button"
          onClick={() => removeImage(currentIndex)}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="p-4 bg-gray-800">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                index === currentIndex ? 'border-indigo-500' : 'border-transparent'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <label className="flex-shrink-0 w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-gray-700 transition-colors">
            <Plus className="w-6 h-6 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

const AdminEditTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    tableNumber: "",
    seats: "",
    isAvailable: true,
    restaurantImages: [],
    location: "",
    foodTypes: "",
    foodMenu: [{ name: "", price: "", veg: true, isAvailable: true }],
    tableClass: "general",
    classFeatures: [],
    price: "",
    offers: [{ title: "", discountPercent: "", bank: "", active: true }],
    notes: "",
  });

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTableData = async () => {
      setIsLoading(true);
      try {
        const table = await getTableById(id);
        setFormData({
          tableNumber: table.tableNumber || "",
          seats: table.seats || "",
          isAvailable: table.isAvailable !== undefined ? table.isAvailable : true,
          restaurantImages: table.restaurantImages || table.restaurantImage ? [table.restaurantImage] : [], // Handles both old and new field
          location: table.location?.address || "",
          foodTypes: (table.foodTypes || []).join(", "),
          foodMenu: (table.foodMenu || []).length > 0 ? table.foodMenu : [{ name: "", price: "", veg: true, isAvailable: true }],
          tableClass: table.tableClass || "general",
          classFeatures: table.classFeatures || [],
          price: table.price || "",
          offers: (table.offers || []).length > 0 ? table.offers : [{ title: "", discountPercent: "", bank: "", active: true }],
          notes: table.notes || "",
        });
      } catch (err) {
        setMessage({ text: `Error fetching table data: ${err.message}`, type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTableData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFeatureChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, classFeatures: [...prev.classFeatures, value] };
      } else {
        return { ...prev, classFeatures: prev.classFeatures.filter((feature) => feature !== value) };
      }
    });
  };

  const handleFoodMenuChange = (index, field, value) => {
    const newFoodMenu = [...formData.foodMenu];
    newFoodMenu[index][field] = value;
    setFormData({ ...formData, foodMenu: newFoodMenu });
  };

  const addFoodMenuItem = () => {
    setFormData({
      ...formData,
      foodMenu: [...formData.foodMenu, { name: "", price: "", veg: true, isAvailable: true }],
    });
  };

  const removeFoodMenuItem = (index) => {
    const newFoodMenu = formData.foodMenu.filter((_, i) => i !== index);
    setFormData({ ...formData, foodMenu: newFoodMenu });
  };

  const handleOfferChange = (index, field, value) => {
    const newOffers = [...formData.offers];
    newOffers[index][field] = value;
    setFormData({ ...formData, offers: newOffers });
  };

  const addOffer = () => {
    setFormData({ ...formData, offers: [...formData.offers, { title: "", discountPercent: "", bank: "", active: true }] });
  };

  const removeOffer = (index) => {
    const newOffers = formData.offers.filter((_, i) => i !== index);
    setFormData({ ...formData, offers: newOffers });
  };

  const handleImagesUpdate = (newImages) => {
    setFormData({ ...formData, restaurantImages: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      const dataToSend = {
        ...formData,
        price: Number(formData.price),
        seats: Number(formData.seats),
        tableNumber: Number(formData.tableNumber),
        location: { address: formData.location, city: "Mumbai" },
        foodTypes: formData.foodTypes.split(",").map((f) => f.trim()).filter(Boolean),
        foodMenu: formData.foodMenu.filter(item => item.name.trim() !== "").map(item => ({ ...item, price: Number(item.price) || 0 })),
        classFeatures: formData.classFeatures,
        offers: formData.offers.filter(offer => offer.title.trim() !== "").map(offer => ({
          ...offer,
          discountPercent: Number(offer.discountPercent) || 0,
          active: true
        })),
      };

      await updateTable(id, dataToSend, token);
      setMessage({ text: "✅ Table updated successfully! Redirecting...", type: "success" });
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setMessage({ text: err.message || "❌ Failed to update table.", type: "error" });
    } finally {
      setIsLoading(false);
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

  if (isLoading && !formData.tableNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading table data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Edit Table Configuration
          </h1>
          <p className="text-gray-600 text-lg">
            Update table details, images, and features
          </p>
        </motion.div>

        {message && (
          <motion.div
            variants={itemVariants}
            className={`mb-6 p-4 rounded-xl border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center justify-center">
              <span className="font-semibold">{message.text}</span>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Carousel Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></div>
                Table Images
              </h3>
              <ImageCarousel 
                images={formData.restaurantImages}
                onImagesUpdate={handleImagesUpdate}
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              {/* Basic Details Card */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></div>
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-2">Table Number</label>
                    <input 
                      type="number" 
                      name="tableNumber" 
                      value={formData.tableNumber} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required 
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-2">Seats</label>
                    <input 
                      type="number" 
                      name="seats" 
                      value={formData.seats} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required 
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      name="isAvailable" 
                      checked={formData.isAvailable} 
                      onChange={handleChange} 
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label className="font-semibold text-gray-700">Available for Reservation</label>
                  </div>
                </div>
              </motion.div>

              {/* Location & Food Types Card */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></div>
                  Location & Cuisine
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-2">Location (Address)</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="e.g. Downtown, Mumbai" 
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-2">Food Types (comma-separated)</label>
                    <input 
                      type="text" 
                      name="foodTypes" 
                      value={formData.foodTypes} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Indian, Chinese, Italian" 
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Features & Pricing */}
            <div className="space-y-6">
              {/* Table Class & Features Card */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></div>
                  Table Class & Features
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-2">Table Class</label>
                    <select 
                      name="tableClass" 
                      value={formData.tableClass} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="general">General</option>
                      <option value="1st-class">1st Class</option>
                      <option value="2nd-class">2nd Class</option>
                      <option value="3rd-class">3rd Class</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-3">Class Features</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Private Area', 'Air-conditioned', 'Window Seat', 'Rooftop', 'Sea View', 'VIP Lounge'].map(feature => (
                        <label
                          key={feature}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={feature}
                            checked={formData.classFeatures.includes(feature)}
                            onChange={handleFeatureChange}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                          />
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-2">Base Price (₹)</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="e.g. 1500" 
                    />
                  </div>
                </div>
              </motion.div>

              {/* Notes Card */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></div>
                  Additional Notes
                </h3>
                <textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-32"
                  placeholder="Additional details about this table, special requirements, or any other relevant information..." 
                />
              </motion.div>
            </div>
          </div>

          {/* Food Menu Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <div className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></div>
                Food Menu
              </h3>
              <button 
                type="button" 
                onClick={addFoodMenuItem}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.foodMenu.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-all">
                  <div className="md:col-span-5">
                    <input 
                      type="text" 
                      placeholder="Item Name" 
                      value={item.name} 
                      onChange={(e) => handleFoodMenuChange(index, 'name', e.target.value)} 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input 
                      type="number" 
                      placeholder="Price (₹)" 
                      value={item.price} 
                      onChange={(e) => handleFoodMenuChange(index, 'price', e.target.value)} 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="md:col-span-3 flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={item.veg} 
                        onChange={(e) => handleFoodMenuChange(index, 'veg', e.target.checked)} 
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-gray-700 font-medium">Vegetarian</span>
                    </label>
                  </div>
                  <div className="md:col-span-1 flex justify-center">
                    <button 
                      type="button" 
                      onClick={() => removeFoodMenuItem(index)}
                      className="text-red-500 hover:text-red-700 p-2 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Offers Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <div className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></div>
                Special Offers
              </h3>
              <button 
                type="button" 
                onClick={addOffer}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Offer
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.offers.map((offer, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-all">
                  <div className="md:col-span-4">
                    <input 
                      type="text" 
                      placeholder="Offer Title" 
                      value={offer.title} 
                      onChange={(e) => handleOfferChange(index, 'title', e.target.value)} 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input 
                      type="text" 
                      placeholder="Bank Name" 
                      value={offer.bank || ''} 
                      onChange={(e) => handleOfferChange(index, 'bank', e.target.value)} 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input 
                      type="number" 
                      placeholder="Discount %" 
                      value={offer.discountPercent} 
                      onChange={(e) => handleOfferChange(index, 'discountPercent', e.target.value)} 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-center">
                    <button 
                      type="button" 
                      onClick={() => removeOffer(index)}
                      className="text-red-500 hover:text-red-700 p-2 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="flex justify-center pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-12 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Updating Table...
                </div>
              ) : (
                "Update Table"
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminEditTable;