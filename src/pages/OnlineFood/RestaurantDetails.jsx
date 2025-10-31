import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getTableById } from '../../services/tableService';
import { Star, MapPin, Utensils, ShoppingCart, Clock, Users, Building, ArrowLeft } from 'lucide-react';
import TableImageCarousel from '../../components/Table/TableImageCarousel';
import { useCart } from '../../context/CartContext';

const RestaurantDetails = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const { cartItems, addToCart } = useCart();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addNotification, setAddNotification] = useState({ show: false, text: '' });

    const handleAddToCart = (item) => {
        const currentItem = cartItems.find(cartItem => cartItem.name === item.name);
        const newQuantity = (currentItem?.quantity || 0) + 1;
        
        addToCart(item, restaurant);

        setAddNotification({ show: true, text: `${item.name} added (x${newQuantity})` });
        setTimeout(() => {
            setAddNotification({ show: false, text: '' });
        }, 2000);
    };

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                setLoading(true);
                const data = await getTableById(id);
                setRestaurant(data);
            } catch (err) {
                setError('Failed to load restaurant details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    if (!restaurant) {
        return <div className="text-center py-20">Restaurant not found.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <AnimatePresence>
                {addNotification.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
                    >
                        <div className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-full shadow-lg flex items-center">
                            <ShoppingCart className="w-5 h-5 mr-3" />
                            {addNotification.text}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <Link to="/online-food" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Restaurants
                    </Link>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="relative h-64 md:h-96">
                        <TableImageCarousel images={restaurant.restaurantImages} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 md:p-8">
                            <h1 className="text-3xl md:text-5xl font-bold text-white shadow-lg">{restaurant.restaurantName}</h1>
                            <div className="flex items-center mt-2 text-indigo-200">
                                <MapPin className="w-5 h-5 mr-2" />
                                <span>{restaurant.location?.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="flex items-center space-x-4">
                                <div className="bg-yellow-100 p-3 rounded-full"><Star className="w-6 h-6 text-yellow-500" /></div>
                                <div>
                                    <p className="font-bold text-lg">4.5 / 5</p>
                                    <p className="text-sm text-gray-500">120 Ratings</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-green-100 p-3 rounded-full"><Utensils className="w-6 h-6 text-green-500" /></div>
                                <div>
                                    <p className="font-bold text-lg capitalize">{(restaurant.foodTypes || []).join(', ')}</p>
                                    <p className="text-sm text-gray-500">Cuisine</p>
                                </div>
                            </div>
                        </div>

                        {/* Food Menu Section */}
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <Utensils className="w-6 h-6 mr-3 text-indigo-500" />
                                Food Menu
                            </h2>
                            {restaurant.foodMenu && restaurant.foodMenu.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {restaurant.foodMenu.map((item, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-start hover:shadow-md hover:border-indigo-200 transition-all"
                                        >
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                                <p className={`text-sm font-medium ${item.veg ? 'text-green-600' : 'text-red-600'}`}>
                                                    {item.veg ? 'Veg' : 'Non-Veg'}
                                                </p>
                                                <div className="flex items-center mt-2 text-sm text-gray-600">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                    <span className="font-bold text-gray-800">4.2</span>
                                                    <span className="text-gray-500 ml-1">(25)</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 text-lg">₹{item.price}</p>
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleAddToCart(item)}
                                                    className="mt-2 inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-200 transition-colors">
                                                    <ShoppingCart className="w-3 h-3 mr-1.5" />
                                                    Add
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Menu information is not available for this restaurant.</p>
                            )}
                        </div>

                        {/* Class Details */}
                        {restaurant.tableClass && restaurant.tableClass !== 'general' && (
                            <div className="mt-12 border-t pt-8">
                                <div className="flex items-center text-sm"><Star className="w-4 h-4 mr-2 text-gray-500"/> Class: <span className="capitalize ml-1 font-semibold">{restaurant.tableClass}</span></div>
                            </div>
                        )}

                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RestaurantDetails;
