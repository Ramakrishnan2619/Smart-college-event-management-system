import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="font-clash font-bold mb-4"
          style={{ color: 'var(--accent)', fontSize: 'clamp(6rem, 15vw, 12rem)' }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          404
        </motion.h1>
        <h2 className="font-clash font-semibold text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>
          Page not found
        </h2>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-base btn-filled no-underline">
          <Home size={18} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
