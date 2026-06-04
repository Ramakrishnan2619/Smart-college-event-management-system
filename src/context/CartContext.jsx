import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('scems_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('scems_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (event) => {
    const eventId = event.eventId || event.id;
    if (cartItems.find((item) => (item.eventId || item.id) === eventId)) {
      toast.error('Event already in cart!');
      return false;
    }
    setCartItems((prev) => [...prev, { ...event, cartAddedAt: Date.now() }]);
    toast.success(`${event.title} added to cart! 🛒`);
    return true;
  };

  const removeFromCart = (eventId) => {
    setCartItems((prev) => prev.filter((item) => (item.eventId || item.id) !== eventId));
    toast.success('Removed from cart');
  };

  const isInCart = (eventId) => {
    return cartItems.some((item) => (item.eventId || item.id) === eventId);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;

  const totalAmount = cartItems.reduce((sum, item) => {
    // Events are free by default, but some may have a fee
    return sum + (item.fee || 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        isInCart,
        clearCart,
        cartCount,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
