import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarCheck, Clock, CheckCircle2, XCircle, Star, Send, ChevronRight, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getMyRegistrations, submitFeedback } from '../api/registrations';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [feedbackOpen, setFeedbackOpen] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const data = await getMyRegistrations();
      setRegistrations(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const tabs = ['all', 'upcoming', 'completed', 'cancelled'];

  const filtered = activeTab === 'all'
    ? registrations
    : registrations.filter((r) => r.status === activeTab);

  const stats = {
    registered: registrations.length,
    upcoming: registrations.filter((r) => r.status === 'upcoming').length,
    completed: registrations.filter((r) => r.status === 'completed').length,
    departments: [...new Set(registrations.map((r) => r.event?.department).filter(Boolean))].length,
  };

  const statusConfig = {
    upcoming: { color: 'var(--accent)', bg: 'rgba(99, 102, 241, 0.15)', icon: <Clock size={14} /> },
    completed: { color: 'var(--accent-em)', bg: 'rgba(16, 185, 129, 0.15)', icon: <CheckCircle2 size={14} /> },
    cancelled: { color: 'var(--accent-danger)', bg: 'rgba(239, 68, 68, 0.15)', icon: <XCircle size={14} /> },
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleFeedbackSubmit = async (regId) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    toast.loading('Submitting...');
    await submitFeedback(regId, { rating, comment: feedbackComment });
    toast.dismiss();
    toast.success('Feedback submitted! 🎉');
    setFeedbackOpen(null);
    setRating(0);
    setFeedbackComment('');
    const data = await getMyRegistrations();
    setRegistrations(data);
  };

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="font-clash font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
              Welcome back, {user?.name} 👋
            </h1>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent)' }}
            >
              Student
            </span>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {user?.rollNo} · {user?.department} · Year {user?.year}
            </span>
          </div>
          </div>
          
          <button
            onClick={() => navigate('/inbox')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 border-none cursor-pointer"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)' }}
          >
            <Inbox size={18} />
            MockMail
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Registered', value: stats.registered, color: 'var(--accent)' },
            { label: 'Upcoming', value: stats.upcoming, color: 'var(--accent-warn)' },
            { label: 'Completed', value: stats.completed, color: 'var(--accent-em)' },
            { label: 'Depts Explored', value: stats.departments, color: 'var(--accent-danger)' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass rounded-xl p-5 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-2xl font-clash font-bold mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <h2 className="font-clash font-semibold text-xl mb-4" style={{ color: 'var(--text-primary)' }}>
            My Registered Events
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all cursor-pointer border-none"
                style={{
                  backgroundColor: activeTab === tab ? 'var(--accent)' : 'var(--bg-surface)',
                  color: activeTab === tab ? '#ffffff' : 'var(--text-muted)',
                  border: activeTab === tab ? 'none' : '1px solid var(--border)',
                }}
              >
                {tab} {tab !== 'all' && `(${registrations.filter((r) => tab === 'all' || r.status === tab).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton rounded-xl h-24" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-clash font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
              No {activeTab === 'all' ? '' : activeTab} events
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              {activeTab === 'all' ? "You haven't registered for any events yet." : `No ${activeTab} events found.`}
            </p>
            <Link to="/events" className="btn-base btn-filled text-sm no-underline">
              Browse Events
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filtered.map((reg, i) => {
              const ev = reg.event;
              const sc = statusConfig[reg.status];
              if (!ev) return null;

              return (
                <motion.div
                  key={reg.id}
                  className="glass rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex">
                    {/* Color strip */}
                    <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: ev.bannerColor }} />

                    <div className="flex-1 p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                              {ev.title}
                            </h3>
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                              style={{ backgroundColor: sc.bg, color: sc.color }}
                            >
                              {sc.icon}
                              {reg.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <span>{formatDate(ev.date)}</span>
                            <span>·</span>
                            <span>{ev.venue}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {reg.status === 'upcoming' && (
                            <>
                              <button
                                onClick={async () => {
                                  if (window.confirm('Are you sure you want to unregister from this event?')) {
                                    setRegistrations(registrations.filter(r => r.id !== reg.id));
                                    toast.success('Successfully unregistered.');
                                  }
                                }}
                                className="btn-base text-xs px-3 py-1.5 cursor-pointer border-none"
                                style={{
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  color: 'var(--accent-danger)',
                                  fontSize: '12px',
                                }}
                              >
                                <XCircle size={14} /> Unregister
                              </button>
                              <Link
                                to={`/events/${ev.categoryId}/${ev.id}`}
                                className="btn-base text-xs px-3 py-1.5 no-underline"
                                style={{
                                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                  color: 'var(--accent)',
                                  fontSize: '12px',
                                }}
                              >
                                View Details <ChevronRight size={14} />
                              </Link>
                            </>
                          )}
                          {reg.status === 'completed' && !reg.feedback && (
                            <button
                              onClick={() => setFeedbackOpen(feedbackOpen === reg.id ? null : reg.id)}
                              className="btn-base text-xs px-3 py-1.5 cursor-pointer border-none"
                              style={{
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                color: 'var(--accent-em)',
                                fontSize: '12px',
                              }}
                            >
                              <Star size={14} /> Give Feedback
                            </button>
                          )}
                          {reg.feedback && (
                            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent-warn)' }}>
                              <Star size={14} fill="var(--accent-warn)" />
                              {reg.feedback.rating}/5
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Inline feedback form */}
                      {feedbackOpen === reg.id && (
                        <motion.div
                          className="mt-4 pt-4"
                          style={{ borderTop: '1px solid var(--border)' }}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                          <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-0.5 cursor-pointer border-none bg-transparent transition-transform hover:scale-110"
                              >
                                <Star
                                  size={24}
                                  fill={(hoverRating || rating) >= star ? 'var(--accent-warn)' : 'transparent'}
                                  stroke={(hoverRating || rating) >= star ? 'var(--accent-warn)' : 'var(--text-muted)'}
                                />
                              </button>
                            ))}
                          </div>
                          <textarea
                            placeholder="Share your experience..."
                            value={feedbackComment}
                            onChange={(e) => setFeedbackComment(e.target.value)}
                            rows={2}
                            className="w-full p-3 rounded-lg text-sm resize-none mb-3"
                            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                          />
                          <button
                            onClick={() => handleFeedbackSubmit(reg.id)}
                            className="btn-base btn-filled text-xs px-4 py-2"
                          >
                            <Send size={14} /> Submit
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
