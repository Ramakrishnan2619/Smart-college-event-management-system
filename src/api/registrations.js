import api from './axios';

export const registerForEvent = async (eventId, data) => {
  const res = await api.post('/registrations', {
    eventId,
    studentId: data.studentId || 'S001',
    paymentId: data.paymentId || null,
    amountPaid: data.amountPaid || null,
  });
  return res.data;
};

export const getMyRegistrations = async () => {
  const userStr = localStorage.getItem('scems-user');
  const user = userStr ? JSON.parse(userStr) : null;
  const studentId = user?.id || 'S001';
  const res = await api.get(`/registrations/student/${studentId}`);
  return res.data;
};

export const submitFeedback = async (regId, data) => {
  const res = await api.post(`/registrations/${regId}/feedback`, data);
  return res.data;
};

export const isRegistered = async (eventId) => {
  const userStr = localStorage.getItem('scems-user');
  const user = userStr ? JSON.parse(userStr) : null;
  const studentId = user?.id || 'S001';
  try {
    const res = await api.get(`/registrations/check?eventId=${eventId}&studentId=${studentId}`);
    return res.data.registered;
  } catch {
    return false;
  }
};

export const getRegistrationsForEvent = async (eventId) => {
  const res = await api.get(`/registrations/event/${eventId}`);
  return res.data;
};

export const getAllRegistrations = async () => {
  const res = await api.get('/registrations');
  return res.data;
};
