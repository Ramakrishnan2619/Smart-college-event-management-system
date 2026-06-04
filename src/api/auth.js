import api from './axios';

export const login = async (role, credentials = {}) => {
  const response = await api.post('/auth/login', {
    role,
    username: credentials.username || '',
    password: credentials.password || '',
  });
  const { user, token } = response.data;
  localStorage.setItem('scems-user', JSON.stringify(user));
  localStorage.setItem('scems-token', token);
  return user;
};

export const logout = async () => {
  localStorage.removeItem('scems-user');
  localStorage.removeItem('scems-token');
  return { success: true };
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem('scems-user');
  return stored ? JSON.parse(stored) : null;
};

export const signup = async (data) => {
  const response = await api.post('/auth/signup', data);
  const { user, token } = response.data;
  localStorage.setItem('scems-user', JSON.stringify(user));
  localStorage.setItem('scems-token', token);
  return user;
};
