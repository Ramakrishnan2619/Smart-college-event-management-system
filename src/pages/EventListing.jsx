import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { getEventsByCategory } from '../api/events';
import { CATEGORIES, DEPARTMENTS } from '../data/mockData';
import EventCard from '../components/EventCard';
import SkeletonCard from '../components/SkeletonCard';

const EventListing = () => {
  const { categoryId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [sort, setSort] = useState('newest');

  const category = CATEGORIES.find((c) => c.id === categoryId);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getEventsByCategory(categoryId);
      setEvents(data);
      setLoading(false);
    };
    fetch();
  }, [categoryId]);

  const filtered = useMemo(() => {
    let result = [...events];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) => {
          const tags = Array.isArray(e.tags) ? e.tags : (e.tags || '').split(',');
          return e.title.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q) ||
            tags.some((t) => t.toLowerCase().includes(q));
        }
      );
    }

    if (deptFilter) {
      result = result.filter((e) => e.department === deptFilter);
    }

    if (sort === 'popular') {
      result.sort((a, b) => b.registeredCount - a.registeredCount);
    } else if (sort === 'seats') {
      result.sort((a, b) => (b.maxSeats - b.registeredCount) - (a.maxSeats - a.registeredCount));
    } else {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return result;
  }, [events, searchQuery, deptFilter, sort]);

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          className="flex items-center gap-2 text-sm mb-6 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link to="/" className="no-underline hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
            Home
          </Link>
          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          <Link to="/events" className="no-underline hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
            Events
          </Link>
          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--accent)' }} className="font-medium">
            {category?.name || categoryId}
          </span>
        </motion.div>

        {/* Category hero banner */}
        <motion.div
          className="rounded-2xl p-8 sm:p-10 mb-8 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, var(--accent), var(--accent-em))`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <span className="text-4xl mb-3 block">{category?.emoji}</span>
            <h1 className="font-clash font-bold text-3xl sm:text-4xl text-white mb-2">
              {category?.name || 'Events'}
            </h1>
            <p className="text-white/80 text-sm">
              {category?.tagline} · {events.length} event{events.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </motion.div>

        {/* Filter bar */}
        <motion.div
          className="glass rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border-none"
              style={{
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg text-sm cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-lg text-sm cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="seats">Seats Available</option>
          </select>
        </motion.div>

        {/* Events grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-clash font-semibold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
              No events found
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Try adjusting your search or filters
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <EventCard key={event.eventId || event.id} event={event} index={i} categoryId={categoryId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListing;
