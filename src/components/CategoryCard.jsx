import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category, index }) => {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link
        to={`/events/${category.id}`}
        className="block rounded-2xl overflow-hidden relative no-underline group"
        style={{
          height: '280px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--bg-card)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image / Fallback */}
        <div className="absolute inset-0 overflow-hidden">
          {!imgError ? (
            <img
              src={category.gifUrl}
              alt={category.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-6xl"
              style={{
                background: `linear-gradient(135deg, var(--accent), var(--accent-em))`,
              }}
            >
              {category.emoji}
            </div>
          )}
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 60%)',
          }}
        />

        {/* Reaction badge */}
        <div className="absolute top-3 right-3 z-10">
          <motion.span
            className="text-2xl"
            animate={isHovered ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {category.reactionBadge}
          </motion.span>
        </div>

        {/* Meme caption on hover */}
        <motion.div
          className="absolute top-3 left-3 right-12 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -20 }}
          transition={{ duration: 0.3 }}
        >
          <span
            className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide"
            style={{
              fontFamily: '"Impact", "Bebas Neue", sans-serif',
              color: '#ffffff',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            {category.memeCaption}
          </span>
        </motion.div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <div className="flex items-end justify-between">
            <div>
              <h3
                className="font-clash font-bold text-xl mb-1"
                style={{ color: '#ffffff' }}
              >
                {category.emoji} {category.name}
              </h3>
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.3)',
                  color: '#c7d2fe',
                }}
              >
                {category.eventCount} events
              </span>
            </div>
            <motion.div
              className="flex items-center justify-center w-9 h-9 rounded-full"
              style={{ backgroundColor: 'var(--accent)' }}
              whileHover={{ scale: 1.1 }}
            >
              <ArrowRight size={16} color="#fff" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
