import React, { createContext, useState, useContext, useEffect } from 'react';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Could not parse cart items from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item, restaurant) => {
        setCartItems(prevItems => {
            // Check if cart has items from another restaurant
            if (prevItems.length > 0 && prevItems[0].restaurantId !== restaurant._id) {
                // Here you could show a confirmation modal to the user
                // For now, we'll just replace the cart
                console.warn("Replacing cart items from a different restaurant.");
                return [{ ...item, quantity: 1, restaurantId: restaurant._id, restaurantName: restaurant.restaurantName }];
            }

            const existingItem = prevItems.find(i => i.name === item.name);
            if (existingItem) {
                return prevItems.map(i =>
                    i.name === item.name
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            } else {
                return [...prevItems, { ...item, quantity: 1, restaurantId: restaurant._id, restaurantName: restaurant.restaurantName }];
            }
        });
    };

    const removeFromCart = (itemName) => {
        setCartItems(prevItems => prevItems.filter(item => item.name !== itemName));
    };

    const updateQuantity = (itemName, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemName);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.name === itemName ? { ...item, quantity } : item
                )
            );
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};