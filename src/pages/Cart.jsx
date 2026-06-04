import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, Calendar, MapPin, Clock, PackageX } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/mockData';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, cartCount, totalAmount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getCategoryEmoji = (categoryId) => {
    const cat = CATEGORIES.find((c) => c.id === categoryId);
    return cat ? cat.emoji : '📌';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen pt-20 pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-clash font-bold text-3xl sm:text-4xl mb-2" style={{ color: 'var(--text-primary)' }}>
            <ShoppingCart size={32} className="inline mr-3" style={{ color: 'var(--accent)' }} />
            My Event Cart
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {cartCount === 0 ? 'Your cart is empty' : `${cartCount} event${cartCount > 1 ? 's' : ''} ready to register`}
          </p>
        </motion.div>

        {cartCount === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <PackageX size={64} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h2 className="font-clash font-semibold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
              No events in your cart
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Browse events and add the ones you like to register for them all at once!
            </p>
            <Link to="/events" className="btn-base btn-filled text-sm no-underline">
              Browse Events
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.eventId || item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-2xl p-5 flex flex-col sm:flex-row gap-4"
                  >
                    {/* Event Emoji Badge */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: item.bannerColor || 'var(--accent)', opacity: 0.9 }}
                    >
                      {getCategoryEmoji(item.categoryId)}
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-clash font-semibold text-base mb-1 truncate" style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {formatDate(item.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {item.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {item.venue}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)' }}
                        >
                          {item.categoryId}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: 'var(--accent-em)' }}>
                          {item.fee ? `₹${item.fee}` : 'FREE'}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.eventId || item.id)}
                      className="self-start p-2 rounded-lg transition-all hover:scale-110 cursor-pointer border-none"
                      style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)' }}
                      aria-label="Remove from cart"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="text-xs font-medium px-4 py-2 rounded-lg cursor-pointer border-none transition-all hover:opacity-80"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--accent-danger)' }}
              >
                Clear Entire Cart
              </button>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-[320px]">
              <div className="lg:sticky lg:top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="font-clash font-semibold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                    Registration Summary
                  </h3>

                  <div className="space-y-3 mb-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                    {cartItems.map((item) => (
                      <div key={item.eventId || item.id} className="flex justify-between text-sm">
                        <span className="truncate mr-2" style={{ color: 'var(--text-muted)' }}>
                          {item.title}
                        </span>
                        <span className="font-medium flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                          {item.fee ? `₹${item.fee}` : 'Free'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--text-muted)' }}>Events</span>
                    <span style={{ color: 'var(--text-primary)' }}>{cartCount}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span style={{ color: 'var(--text-muted)' }}>Platform Fee</span>
                    <span style={{ color: 'var(--accent-em)' }}>Free</span>
                  </div>

                  <div
                    className="flex justify-between text-base font-bold mb-6 pt-3"
                    style={{ borderTop: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    <span>Total</span>
                    <span style={{ color: 'var(--accent)' }}>
                      {totalAmount > 0 ? `₹${totalAmount}` : 'FREE'}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="btn-base btn-filled w-full py-3 text-sm"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </button>

                  <Link
                    to="/events"
                    className="block text-center text-xs mt-3 no-underline transition-all hover:opacity-80"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    + Add more events
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
