import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCategories } from '../api/events';
import CategoryCard from '../components/CategoryCard';

const EventCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Vertical side text */}
      <div
        className="fixed left-4 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-2"
      >
        {'S·C·E·M·S'.split('').map((char, i) => (
          <motion.span
            key={i}
            className="font-clash font-bold text-sm vertical-text"
            style={{ color: 'var(--accent)', opacity: 0.5 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-16">
        {/* Page header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="font-clash font-bold mb-3"
            style={{ color: 'var(--text-primary)', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            CATEGORIES
          </h1>
          <p className="text-base" style={{ color: 'var(--text-muted)' }}>
            Explore events across {categories.length} categories. Tap any card to dive in.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="skeleton rounded-2xl"
                style={{ height: '280px' }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCategories;
