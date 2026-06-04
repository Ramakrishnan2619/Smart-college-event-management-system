import api from './axios';

export const getCategories = async () => {
  const res = await api.get('/categories');
  return res.data;
};

export const getEventsByCategory = async (categoryId) => {
  const res = await api.get(`/events/category/${categoryId}`);
  return res.data.map(normalizeEvent);
};

export const getEventById = async (id) => {
  const res = await api.get(`/events/${id}`);
  return normalizeEvent(res.data);
};

export const getAllEvents = async () => {
  const res = await api.get('/events');
  return res.data.map(normalizeEvent);
};

export const searchEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.query) params.append('query', filters.query);
  if (filters.department) params.append('department', filters.department);
  if (filters.categoryId) params.append('categoryId', filters.categoryId);
  if (filters.sort) params.append('sort', filters.sort);
  const res = await api.get(`/events/search?${params.toString()}`);
  return res.data.map(normalizeEvent);
};

// Normalize event data from backend format
function normalizeEvent(event) {
  if (typeof event.tags === 'string') {
    event.tags = event.tags.split(',').map(t => t.trim()).filter(Boolean);
  } else if (!Array.isArray(event.tags)) {
    event.tags = [];
  }
  if (typeof event.schedule === 'string') {
    try { event.schedule = JSON.parse(event.schedule); } catch { event.schedule = []; }
  } else if (!Array.isArray(event.schedule)) {
    event.schedule = [];
  }
  if (typeof event.faqs === 'string') {
    try { event.faqs = JSON.parse(event.faqs); } catch { event.faqs = []; }
  } else if (!Array.isArray(event.faqs)) {
    event.faqs = [];
  }
  // Map eventId to id for frontend compatibility
  if (event.eventId && !event.id) {
    event.id = event.eventId;
  }
  return event;
}
