import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Calendar } from 'lucide-react';
import { getEventBannerImage, TAMIL_MEMES } from '../data/mockData';

const EventCard = ({ event, index, categoryId }) => {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const seatsPercent = (event.registeredCount / event.maxSeats) * 100;
  const seatsLeft = event.maxSeats - event.registeredCount;
  const bannerImage = getEventBannerImage(event);
  const tamilMeme = TAMIL_MEMES[event.categoryId] || '';

  const getProgressColor = () => {
    if (seatsPercent >= 80) return 'var(--accent-danger)';
    if (seatsPercent >= 50) return 'var(--accent-warn)';
    return 'var(--accent-em)';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link
        to={`/events/${categoryId || event.categoryId}/${event.eventId || event.id}`}
        className="block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 no-underline group"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Banner with GIF image */}
        <div
          className="relative h-44 overflow-hidden"
          style={{
            backgroundColor: event.bannerColor,
            background: `linear-gradient(135deg, ${event.bannerColor}, ${event.bannerColor}dd)`,
          }}
        >
          {/* GIF Background */}
          {bannerImage && !imgError ? (
            <img
              key={bannerImage}
              src={bannerImage}
              alt={event.title}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
              style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
            />
          ) : null}

          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: bannerImage && !imgError
                ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)'
                : 'rgba(0,0,0,0.2)',
            }}
          />

          {/* Trending badge */}
          {event.isTrending && (
            <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
              🔥 Trending
            </span>
          )}

          {/* Tamil meme caption on hover */}
          <motion.div
            className="absolute top-3 left-3 right-14 z-10"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -15 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="inline-block px-2.5 py-1.5 rounded-lg text-[10px] font-bold leading-tight"
              style={{
                fontFamily: '"Impact", "Arial Black", sans-serif',
                color: '#ffffff',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
                maxWidth: '100%',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
              }}
            >
              {tamilMeme}
            </span>
          </motion.div>

          {/* Title on banner */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="font-clash font-bold text-lg text-white leading-snug drop-shadow-lg">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent)' }}
            >
              <Calendar size={12} className="inline mr-1" />
              {formatDate(event.date)}
            </span>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-em)' }}
            >
              {event.department}
            </span>
          </div>

          {/* Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <MapPin size={14} />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Clock size={14} />
              <span>{event.time} · {event.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Users size={14} />
              <span>by {event.organizer}</span>
            </div>
          </div>

          {/* Seats progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: 'var(--text-muted)' }}>
                {event.registeredCount}/{event.maxSeats} registered
              </span>
              <span style={{ color: getProgressColor() }} className="font-semibold">
                {seatsLeft} left
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${seatsPercent}%`,
                  backgroundColor: getProgressColor(),
                }}
              />
            </div>
          </div>

          {/* Register button */}
          <div
            className="w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group-hover:shadow-lg"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
            }}
          >
            View & Register →
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
