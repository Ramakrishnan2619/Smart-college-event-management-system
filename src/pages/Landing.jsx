import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Sparkles, CalendarCheck, BarChart3, Search, ArrowRight } from 'lucide-react';

const categories = ['Technical', 'Dance', 'Music', 'Hackathon', 'Sports', 'Quiz', 'Drama', 'Photography', 'Workshops', 'Cultural', 'Competitions', 'Seminars', 'E-Sports', 'Literature', 'Social Impact', 'Startup'];

const CountUpNumber = ({ end, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const Landing = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 gradient-mesh" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 120%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
          }}
        />

        {/* Floating orbs */}
        <motion.div
          className="absolute w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: 'var(--accent)', top: '10%', left: '10%' }}
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: 'var(--accent-em)', bottom: '10%', right: '10%' }}
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={16} />
              Smart Campus Event Management System
            </motion.div>

            <h1
              className="font-clash font-bold leading-tight mb-6"
              style={{
                color: 'var(--text-primary)',
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              }}
            >
              Discover.{' '}
              <span style={{ color: 'var(--accent)' }}>Register.</span>{' '}
              <br className="hidden sm:block" />
              Experience.
            </h1>

            <p
              className="font-syne text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              Your complete campus event hub — workshops, fests, sports & more.
              Never miss what matters on campus.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/events" className="btn-base btn-filled text-base px-8 py-3.5 no-underline">
                Browse Events <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-base btn-outlined text-base px-8 py-3.5 no-underline">
                Login to Register
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {[
              { value: 40, suffix: '+', label: 'Events' },
              { value: 12, suffix: '', label: 'Departments' },
              { value: 500, suffix: '+', label: 'Registrations' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-3xl sm:text-4xl font-clash font-bold"
                  style={{ color: 'var(--accent)' }}
                >
                  <CountUpNumber end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div
            className="w-6 h-10 rounded-full flex items-start justify-center p-1.5"
            style={{ border: '2px solid var(--text-muted)' }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--accent)' }}
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Marquee */}
      <section className="py-6 overflow-hidden" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="marquee-container">
          <div className="marquee-content">
            {[...categories, ...categories].map((cat, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-6 text-sm font-medium whitespace-nowrap"
                style={{ color: 'var(--text-muted)' }}
              >
                {cat}
                <span style={{ color: 'var(--accent)' }}>·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="font-clash font-bold text-3xl sm:text-4xl text-center mb-4"
            style={{ color: 'var(--text-primary)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Everything you need
          </motion.h2>
          <p className="text-center mb-16 text-base" style={{ color: 'var(--text-muted)' }}>
            From discovery to feedback — all in one place
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Search size={28} />,
                title: 'Browse & Discover',
                desc: 'Explore events across 16 categories. Filter by department, date, or type. Find your next campus experience.',
              },
              {
                icon: <CalendarCheck size={28} />,
                title: 'Register Instantly',
                desc: 'Simple 3-step registration with smart form validation. Confirm your spot in seconds and get instant confirmation.',
              },
              {
                icon: <BarChart3 size={28} />,
                title: 'Track Everything',
                desc: 'View your registrations, upcoming events, and past experiences. Provide feedback to help improve future events.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2"
                style={{ cursor: 'default' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent)' }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="font-clash font-semibold text-xl mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 text-center text-sm"
        style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}
      >
        <p>
          © 2026 SCEMS — Smart Campus Event Management System. Built with ❤️
        </p>
      </footer>
    </div>
  );
};

export default Landing;
