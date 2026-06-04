import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('scems-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('scems-user');
      }
    }
    setLoading(false);
  }, []);

  const loginAsStudent = async (rollNo, password) => {
    try {
      const student = await apiLogin('student', { username: rollNo, password });
      setUser(student);
      return student;
    } catch (err) {
      throw new Error('Invalid student credentials');
    }
  };

  const signup = async (data) => {
    try {
      const user = await apiSignup(data);
      setUser(user);
      return user;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Signup failed');
    }
  };

  const loginAsAdmin = async (username, password) => {
    try {
      const admin = await apiLogin('admin', { username, password });
      setUser(admin);
      return admin;
    } catch (err) {
      throw new Error('Invalid admin credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('scems-user');
    localStorage.removeItem('scems-token');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loginAsStudent, loginAsAdmin, signup, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
