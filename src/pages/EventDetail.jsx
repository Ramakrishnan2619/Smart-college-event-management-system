import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Users, Tag, ChevronRight,
  ChevronDown, Share2, Copy, Star, Send, CheckCircle2, ShoppingCart,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getEventById } from '../api/events';
import { isRegistered, submitFeedback, getMyRegistrations } from '../api/registrations';
import { CATEGORIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for leaflet default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2 text-center mb-6">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hrs', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Sec', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="glass py-2 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <div className="text-xl font-bold font-clash" style={{ color: 'var(--accent)' }}>
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const AddToCartBtn = ({ event }) => {
  const { addToCart, isInCart, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const eventId = event.eventId || event.id;
  const inCart = isInCart(eventId);

  return (
    <button
      onClick={() => {
        if (!isAuthenticated) {
          toast.error('Please login first');
          navigate('/login');
          return;
        }
        if (inCart) {
          removeFromCart(eventId);
        } else {
          addToCart(event);
        }
      }}
      className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
      style={{
        backgroundColor: inCart ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.08)',
        color: inCart ? 'var(--accent-em)' : 'var(--accent)',
        border: `1px solid ${inCart ? 'rgba(16, 185, 129, 0.2)' : 'var(--border)'}`,
      }}
    >
      <ShoppingCart size={16} />
      {inCart ? 'In Cart ✓ (Click to remove)' : 'Add to Cart'}
    </button>
  );
};

const EventDetail = () => {
  const { categoryId, eventId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [registration, setRegistration] = useState(null);

  const category = CATEGORIES.find((c) => c.id === categoryId);
  const isCompleted = registration?.status === 'completed';
  const hasFeedback = registration?.feedback !== null && registration?.feedback !== undefined;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const data = await getEventById(eventId);
        setEvent(data);
        const regStatus = await isRegistered(eventId);
        setAlreadyRegistered(regStatus);
        if (user) {
          const myRegs = await getMyRegistrations();
          const myReg = myRegs.find((r) => r.eventId === eventId);
          if (myReg) setRegistration(myReg);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchAll();
  }, [eventId, user]);

  const seatsPercent = event ? (event.registeredCount / event.maxSeats) * 100 : 0;
  const seatsLeft = event ? event.maxSeats - event.registeredCount : 0;

  const getProgressColor = () => {
    if (seatsPercent >= 80) return 'var(--accent-danger)';
    if (seatsPercent >= 50) return 'var(--accent-warn)';
    return 'var(--accent-em)';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleFeedbackSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    toast.loading('Submitting feedback...');
    await submitFeedback(registration.id, { rating, comment });
    toast.dismiss();
    toast.success('Feedback submitted! Thank you 🎉');
    setFeedbackSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <h2 className="font-clash font-bold text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>Event not found</h2>
          <Link to="/events" className="btn-base btn-filled mt-4 no-underline">Back to Events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Full-width banner */}
      <div
        className="relative w-full flex items-end"
        style={{
          height: '320px',
          backgroundColor: event.bannerColor,
          background: `linear-gradient(135deg, ${event.bannerColor}, ${event.bannerColor}cc)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-4 flex-wrap">
            <Link to="/" className="text-white/60 no-underline hover:text-white/80">Home</Link>
            <ChevronRight size={14} className="text-white/40" />
            <Link to="/events" className="text-white/60 no-underline hover:text-white/80">Events</Link>
            <ChevronRight size={14} className="text-white/40" />
            <Link to={`/events/${categoryId}`} className="text-white/60 no-underline hover:text-white/80">{category?.name}</Link>
            <ChevronRight size={14} className="text-white/40" />
            <span className="text-white font-medium truncate max-w-[200px]">{event.title}</span>
          </div>
          <h1 className="font-clash font-bold text-3xl sm:text-4xl text-white mb-2">{event.title}</h1>
          <p className="text-white/70 text-sm">{formatDate(event.date)} · {event.time}</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content (65%) */}
          <div className="flex-1 lg:max-w-[65%]">
            {/* About */}
            <motion.section
              className="glass rounded-2xl p-6 sm:p-8 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-clash font-semibold text-xl mb-4" style={{ color: 'var(--text-primary)' }}>
                About This Event
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {event.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)' }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* Venue Map */}
            <motion.section
              className="glass rounded-2xl p-6 sm:p-8 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-red-500" size={24} />
                <h2 className="font-clash font-semibold text-xl" style={{ color: 'var(--text-primary)' }}>
                  Venue Location
                </h2>
              </div>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>
                {event.venue}
              </p>
              
              <div className="w-full h-[300px] rounded-xl overflow-hidden shadow-sm border border-gray-100 z-0 relative">
                {/* Fallback coordinates, in a real app these would come from the backend per event */}
                <MapContainer center={[12.9716, 77.5946]} zoom={15} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[12.9716, 77.5946]}>
                    <Popup>
                      <strong>{event.venue}</strong><br />
                      SCEMS Campus
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </motion.section>

            {/* Schedule */}
            <motion.section
              className="glass rounded-2xl p-6 sm:p-8 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="font-clash font-semibold text-xl mb-6" style={{ color: 'var(--text-primary)' }}>
                Schedule
              </h2>
              <div className="space-y-0">
                {event.schedule.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: 'var(--accent)' }}
                      />
                      {i < event.schedule.length - 1 && (
                        <div className="w-0.5 flex-1 min-h-[40px]" style={{ backgroundColor: 'var(--border)' }} />
                      )}
                    </div>
                    <div className="pb-6">
                      <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                        {item.time}
                      </span>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
                        {item.activity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* FAQ */}
            <motion.section
              className="glass rounded-2xl p-6 sm:p-8 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-clash font-semibold text-xl mb-6" style={{ color: 'var(--text-primary)' }}>
                FAQs
              </h2>
              <div className="space-y-3">
                {event.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left text-sm font-medium cursor-pointer border-none"
                      style={{ color: 'var(--text-primary)', backgroundColor: 'transparent' }}
                    >
                      {faq.q}
                      <ChevronDown
                        size={18}
                        className="flex-shrink-0 ml-2 transition-transform duration-200"
                        style={{
                          color: 'var(--text-muted)',
                          transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p
                            className="px-4 pb-4 text-sm"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Feedback section for completed events */}
            {isCompleted && !hasFeedback && !feedbackSubmitted && (
              <motion.section
                className="glass rounded-2xl p-6 sm:p-8 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="font-clash font-semibold text-xl mb-4" style={{ color: 'var(--text-primary)' }}>
                  Rate This Event
                </h2>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 cursor-pointer border-none bg-transparent transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        fill={(hoverRating || rating) >= star ? 'var(--accent-warn)' : 'transparent'}
                        stroke={(hoverRating || rating) >= star ? 'var(--accent-warn)' : 'var(--text-muted)'}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Share your experience (optional)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl text-sm resize-none mb-4"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                  }}
                />
                <button onClick={handleFeedbackSubmit} className="btn-base btn-filled text-sm">
                  <Send size={16} />
                  Submit Feedback
                </button>
              </motion.section>
            )}

            {feedbackSubmitted && (
              <motion.div
                className="glass rounded-2xl p-6 text-center mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle2 size={40} style={{ color: 'var(--accent-em)' }} className="mx-auto mb-3" />
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Thank you for your feedback!</p>
              </motion.div>
            )}
          </div>

          {/* Sidebar (35%) */}
          <div className="lg:w-[35%]">
            <div className="lg:sticky lg:top-24">
              <motion.div
                className="glass rounded-2xl p-6 mb-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="font-clash font-semibold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>
                  Event Details
                </h3>
                <CountdownTimer targetDate={event.date} />
                <div className="space-y-4">
                  {[
                    { icon: <Calendar size={18} />, label: 'Date', value: formatDate(event.date) },
                    { icon: <Clock size={18} />, label: 'Time', value: event.time },
                    { icon: <MapPin size={18} />, label: 'Venue', value: event.venue },
                    { icon: <Clock size={18} />, label: 'Duration', value: event.duration },
                    { icon: <Tag size={18} />, label: 'Department', value: event.department },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div style={{ color: 'var(--accent)' }} className="mt-0.5 flex-shrink-0">{item.icon}</div>
                      <div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                    >
                      {event.organizer.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Organizer</div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{event.organizer}</div>
                    </div>
                  </div>
                </div>

                {/* Seats progress */}
                <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'var(--text-muted)' }}>Seats</span>
                    <span style={{ color: getProgressColor() }} className="font-semibold">
                      {seatsLeft} left of {event.maxSeats}
                    </span>
                  </div>
                  <div className="progress-bar h-2.5">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${seatsPercent}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      style={{ backgroundColor: getProgressColor() }}
                    />
                  </div>
                </div>

                {/* Register button */}
                <div className="mt-6">
                  {alreadyRegistered ? (
                    <div
                      className="w-full text-center py-3 rounded-xl text-sm font-semibold"
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--accent-em)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      <CheckCircle2 size={16} className="inline mr-2" />
                      Already Registered ✓
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.error('Please login to register');
                          navigate('/login');
                          return;
                        }
                        navigate(`/register/${event.eventId || event.id}`);
                      }}
                      className="btn-base btn-filled w-full py-3 text-sm"
                    >
                      Register Now
                    </button>
                  )}
                </div>

                {/* Add to Cart button */}
                {!alreadyRegistered && (
                  <AddToCartBtn event={event} />
                )}

                {/* Share */}
                <button
                  onClick={handleCopyLink}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <Copy size={16} />
                  Copy Link
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 lg:hidden p-4 z-40"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {alreadyRegistered ? (
          <div
            className="w-full text-center py-3 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-em)',
            }}
          >
            Already Registered ✓
          </div>
        ) : (
          <button
            onClick={() => {
              if (!isAuthenticated) {
                toast.error('Please login to register');
                navigate('/login');
                return;
              }
              navigate(`/register/${event.eventId || event.id}`);
            }}
            className="btn-base btn-filled w-full py-3 text-sm"
          >
            Register Now — {seatsLeft} seats left
          </button>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
