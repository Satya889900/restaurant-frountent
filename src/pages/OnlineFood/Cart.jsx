import React from 'react';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                <ShoppingCart className="w-24 h-24 mx-auto text-gray-300" />
                <h2 className="text-2xl font-bold text-gray-700 mt-4">Your cart is empty</h2>
                <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/online-food" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Browse Restaurants
                </Link>
            </div>
        );
    }

    const restaurantName = cartItems[0]?.restaurantName;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
                    <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-semibold flex items-center">
                        <Trash2 className="w-4 h-4 mr-1" /> Clear Cart
                    </button>
                </div>
                <p className="text-lg text-gray-600 mb-6">From: <span className="font-bold text-indigo-600">{restaurantName}</span></p>

                <div className="space-y-4">
                    {cartItems.map(item => (
                        <motion.div
                            key={item.name}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md border"
                        >
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                                <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 border rounded-lg p-1">
                                    <button onClick={() => updateQuantity(item.name, item.quantity - 1)} className="p-1 text-gray-500 hover:text-indigo-600">
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.name, item.quantity + 1)} className="p-1 text-gray-500 hover:text-indigo-600">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="font-bold w-20 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
                                <button onClick={() => removeFromCart(item.name)} className="text-gray-400 hover:text-red-500 p-1">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t">
                    <div className="flex justify-end items-center">
                        <span className="text-xl font-bold text-gray-800">Total:</span>
                        <span className="text-2xl font-bold text-indigo-600 ml-4">₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-end mt-6">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-12 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                        >
                            Proceed to Checkout
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Cart;