import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Users, Building2, Star, Plus, Search, Pencil, Trash2,
  X, Download, ChevronDown,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';
import { CATEGORIES as MOCK_CATEGORIES, DEPARTMENTS } from '../data/mockData';
import { getAllEvents, searchEvents } from '../api/events';
import { getAllRegistrations } from '../api/registrations';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const AdminPanel = () => {
  const { isDark } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [CATEGORIES] = useState(MOCK_CATEGORIES);
  const [allRegistrations, setAllRegistrations] = useState([]);

  // Events state
  const [events, setEvents] = useState([]);
  const [eventSearch, setEventSearch] = useState('');
  const [eventDeptFilter, setEventDeptFilter] = useState('');
  const [eventCatFilter, setEventCatFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Event form state
  const [formData, setFormData] = useState({
    title: '', categoryId: '', department: '', date: '', time: '',
    venue: '', duration: '', maxSeats: '', description: '', bannerColor: '#6366F1', tags: '',
  });

  // Registrations state
  const [selectedEventForRegs, setSelectedEventForRegs] = useState('');

  const sidebarWidth = collapsed ? '72px' : '240px';

  // Fetch data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await getAllEvents();
        setEvents(eventsData);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        toast.error('Failed to load events from server');
      }
      try {
        const regsData = await getAllRegistrations();
        setAllRegistrations(regsData);
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
      }
    };
    fetchData();
  }, []);

  // Filtered events
  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (eventSearch) {
      const q = eventSearch.toLowerCase();
      result = result.filter((e) => e.title.toLowerCase().includes(q));
    }
    if (eventDeptFilter) result = result.filter((e) => e.department === eventDeptFilter);
    if (eventCatFilter) result = result.filter((e) => e.categoryId === eventCatFilter);
    return result;
  }, [events, eventSearch, eventDeptFilter, eventCatFilter]);

  // Event CRUD
  const openAddModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '', categoryId: '', department: '', date: '', time: '',
      venue: '', duration: '', maxSeats: '', description: '', bannerColor: '#6366F1', tags: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (ev) => {
    setEditingEvent(ev);
    setFormData({
      title: ev.title, categoryId: ev.categoryId, department: ev.department,
      date: ev.date, time: ev.time, venue: ev.venue, duration: ev.duration,
      maxSeats: ev.maxSeats.toString(), description: ev.description,
      bannerColor: ev.bannerColor, tags: ev.tags.join(', '),
    });
    setModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!formData.title || !formData.categoryId || !formData.department) {
      toast.error('Fill in required fields');
      return;
    }
    const eventData = {
      ...formData,
      maxSeats: parseInt(formData.maxSeats) || 100,
      tags: typeof formData.tags === 'string' ? formData.tags : formData.tags.join(','),
      registeredCount: editingEvent?.registeredCount || 0,
      organizer: editingEvent?.organizer || 'Admin',
      organizerAvatar: '',
      isTrending: editingEvent?.isTrending || false,
    };

    try {
      if (editingEvent) {
        const evId = editingEvent.eventId || editingEvent.id;
        await api.put(`/events/${evId}`, eventData);
        const refreshed = await getAllEvents();
        setEvents(refreshed);
        toast.success('Event updated! ✏️');
      } else {
        await api.post('/events', eventData);
        const refreshed = await getAllEvents();
        setEvents(refreshed);
        toast.success('Event added! 🎉');
      }
    } catch (err) {
      toast.error('Failed to save event');
      console.error(err);
    }
    setModalOpen(false);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      const refreshed = await getAllEvents();
      setEvents(refreshed);
      toast.success('Event deleted');
    } catch (err) {
      toast.error('Failed to delete event');
      console.error(err);
    }
    setDeleteConfirm(null);
  };

  // Registrations for selected event
  const eventRegs = useMemo(() => {
    if (!selectedEventForRegs) return [];
    return allRegistrations.filter((r) => r.eventId === selectedEventForRegs);
  }, [selectedEventForRegs, allRegistrations]);

  // Excel CSV export (admin only)
  const handleExportExcel = () => {
    const ev = events.find((e) => e.eventId === selectedEventForRegs);
    const headers = 'Student ID\tStudent Name\tRoll No\tDepartment\tYear\tEvent\tStatus\tRegistered On\tPayment\tFeedback Rating\n';
    const rows = eventRegs.map((r) => {
      const student = r.studentId === 'S001' ? 'Arjun Kumar\t21CS045\tCSE\t3' : `Student ${r.studentId}\t${r.studentId}XX\tCSE\t2`;
      return `${r.studentId}\t${student}\t${ev?.title || r.eventId}\t${r.status}\t${r.registeredOn}\t₹149 Paid\t${r.feedback ? r.feedback.rating + '★' : 'N/A'}`;
    }).join('\n');
    const content = headers + rows;
    // BOM for Excel UTF-8 compatibility
    const bom = '\uFEFF';
    const blob = new Blob([bom + content], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SCEMS_Registrations_${ev?.title?.replace(/\s/g, '_') || selectedEventForRegs}.xls`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Excel file downloaded! 📊');
  };

  // Analytics data
  const areaData = events.slice(0, 8).map((e) => ({
    name: e.title.length > 15 ? e.title.substring(0, 15) + '...' : e.title,
    registrations: e.registeredCount,
  }));

  const deptData = DEPARTMENTS.map((dept) => ({
    name: dept,
    value: events.filter((e) => e.department === dept).reduce((sum, e) => sum + e.registeredCount, 0) || Math.floor(Math.random() * 100 + 30),
  }));

  const PIE_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#0EA5E9'];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main
        className="transition-all duration-300 min-h-screen p-6 sm:p-8"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* ============ DASHBOARD TAB ============ */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-clash font-bold text-2xl mb-6" style={{ color: 'var(--text-primary)' }}>
              Dashboard
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Events', value: events.length, icon: <CalendarDays size={22} />, color: 'var(--accent)' },
                { label: 'Total Registrations', value: '500+', icon: <Users size={22} />, color: 'var(--accent-em)' },
                { label: 'Departments', value: DEPARTMENTS.length, icon: <Building2 size={22} />, color: 'var(--accent-warn)' },
                { label: 'Avg Rating', value: '4.2★', icon: <Star size={22} />, color: 'var(--accent-danger)' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="glass rounded-xl p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="font-clash font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
                    {stat.value}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass rounded-xl p-5">
              <h3 className="font-clash font-semibold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {allRegistrations.slice(0, 5).map((reg) => {
                  const ev = reg.event || events.find((e) => (e.eventId || e.id) === reg.eventId);
                  return (
                    <div
                      key={reg.id}
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm"
                      style={{ backgroundColor: 'var(--bg-surface)' }}
                    >
                      <div>
                        <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                          Student {reg.studentId}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}> registered for </span>
                        <span style={{ color: 'var(--accent)' }} className="font-medium">
                          {ev?.title || reg.eventId}
                        </span>
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{reg.registeredOn}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ============ EVENTS TAB ============ */}
        {activeTab === 'events' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h1 className="font-clash font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
                Events Management
              </h1>
              <button onClick={openAddModal} className="btn-base btn-filled text-sm">
                <Plus size={16} /> Add Event
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                />
              </div>
              <select
                value={eventDeptFilter}
                onChange={(e) => setEventDeptFilter(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm cursor-pointer"
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                <option value="">All Depts</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={eventCatFilter}
                onChange={(e) => setEventCatFilter(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm cursor-pointer"
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Table */}
            <div className="glass rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Event Name', 'Category', 'Date', 'Dept', 'Seats', 'Registered', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((ev) => {
                    const cat = CATEGORIES.find((c) => c.id === ev.categoryId);
                    return (
                      <tr key={ev.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ev.bannerColor }} />
                            <span className="truncate max-w-[200px]">{ev.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{cat?.name || ev.categoryId}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{formatDate(ev.date)}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{ev.department}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{ev.maxSeats}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }} className="font-medium">{ev.registeredCount}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(ev)}
                              className="p-1.5 rounded-lg cursor-pointer border-none transition-colors"
                              style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)' }}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(ev.eventId)}
                              className="p-1.5 rounded-lg cursor-pointer border-none transition-colors"
                              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Delete confirm dialog */}
            <AnimatePresence>
              {deleteConfirm && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="rounded-2xl p-6 w-full max-w-sm"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                  >
                    <h3 className="font-clash font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                      Delete Event?
                    </h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                      This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => setDeleteConfirm(null)} className="btn-base btn-outlined text-sm">
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(deleteConfirm)}
                        className="btn-base text-sm"
                        style={{ backgroundColor: 'var(--accent-danger)', color: '#fff' }}
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add/Edit Modal */}
            <AnimatePresence>
              {modalOpen && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-clash font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                        {editingEvent ? 'Edit Event' : 'Add New Event'}
                      </h3>
                      <button onClick={() => setModalOpen(false)} className="p-1 cursor-pointer border-none bg-transparent" style={{ color: 'var(--text-muted)' }}>
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'title', label: 'Title *', type: 'text' },
                        { key: 'date', label: 'Date *', type: 'date' },
                        { key: 'time', label: 'Time *', type: 'text', placeholder: 'e.g., 10:00 AM' },
                        { key: 'venue', label: 'Venue *', type: 'text' },
                        { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g., 6 hours' },
                        { key: 'maxSeats', label: 'Max Seats', type: 'number' },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            value={formData[field.key]}
                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 rounded-lg text-sm"
                            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                          />
                        </div>
                      ))}

                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Category *</label>
                        <select
                          value={formData.categoryId}
                          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg text-sm cursor-pointer"
                          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                        >
                          <option value="">Select Category</option>
                          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Department *</label>
                        <select
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg text-sm cursor-pointer"
                          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                        >
                          <option value="">Select Dept</option>
                          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                        />
                      </div>

                      <div className="flex gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Banner Color</label>
                          <input
                            type="color"
                            value={formData.bannerColor}
                            onChange={(e) => setFormData({ ...formData, bannerColor: e.target.value })}
                            className="w-12 h-10 rounded-lg cursor-pointer border-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Tags (comma separated)</label>
                          <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="coding, hackathon, tech"
                            className="w-full px-3 py-2 rounded-lg text-sm"
                            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                      <button onClick={() => setModalOpen(false)} className="btn-base btn-outlined text-sm">Cancel</button>
                      <button onClick={handleSaveEvent} className="btn-base btn-filled text-sm">
                        {editingEvent ? 'Update Event' : 'Add Event'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ============ REGISTRATIONS TAB ============ */}
        {activeTab === 'registrations' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-clash font-bold text-2xl mb-6" style={{ color: 'var(--text-primary)' }}>
              Registrations
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <select
                value={selectedEventForRegs}
                onChange={(e) => setSelectedEventForRegs(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm cursor-pointer"
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                <option value="">Select an event to view registrations</option>
                {events.map((e) => <option key={e.eventId} value={e.eventId}>{e.title}</option>)}
              </select>
              {eventRegs.length > 0 && (
                <button onClick={handleExportExcel} className="btn-base btn-filled text-sm">
                  <Download size={16} /> Download Excel
                </button>
              )}
            </div>

            {selectedEventForRegs ? (
              eventRegs.length > 0 ? (
                <div className="glass rounded-xl overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['Student ID', 'Event ID', 'Status', 'Registered On', 'Feedback'].map((h) => (
                          <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {eventRegs.map((reg) => (
                        <tr key={reg.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{reg.studentId}</td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{reg.eventId}</td>
                          <td className="px-4 py-3">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{
                                backgroundColor: reg.status === 'upcoming' ? 'rgba(99,102,241,0.15)' : reg.status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                                color: reg.status === 'upcoming' ? 'var(--accent)' : reg.status === 'completed' ? 'var(--accent-em)' : 'var(--accent-danger)',
                              }}
                            >
                              {reg.status}
                            </span>
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{reg.registeredOn}</td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>
                            {reg.feedback ? `${reg.feedback.rating}★` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">📭</div>
                  <p style={{ color: 'var(--text-muted)' }}>No registrations for this event</p>
                </div>
              )
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">👆</div>
                <p style={{ color: 'var(--text-muted)' }}>Select an event above to view registrations</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ============ ANALYTICS TAB ============ */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-clash font-bold text-2xl mb-6" style={{ color: 'var(--text-primary)' }}>
              Analytics
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Area Chart */}
              <div className="glass rounded-xl p-5">
                <h3 className="font-clash font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
                  Registrations by Event
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="colorRegs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <Area type="monotone" dataKey="registrations" stroke="var(--accent)" fillOpacity={1} fill="url(#colorRegs)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="glass rounded-xl p-5">
                <h3 className="font-clash font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
                  Registrations by Department
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deptData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {deptData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
