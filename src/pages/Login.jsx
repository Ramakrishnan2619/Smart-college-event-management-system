import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Shield, ArrowLeft, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { loginAsStudent, loginAsAdmin, signup, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [isSignup, setIsSignup] = useState(false);
  
  // Student Auth State
  const [studentRoll, setStudentRoll] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentDept, setStudentDept] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  
  // Admin Auth State
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [devTaps, setDevTaps] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/events', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleStudentAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isSignup) {
        if (!studentRoll || !studentPassword || !studentName || !studentDept || !studentEmail) {
          setAuthError('Please fill in all fields');
          return;
        }
        await signup({
          role: 'student',
          rollNo: studentRoll,
          password: studentPassword,
          name: studentName,
          department: studentDept,
          email: studentEmail
        });
        toast.success(`Welcome, ${studentName}! 🎉`);
      } else {
        if (!studentRoll || !studentPassword) {
          setAuthError('Please enter your roll number and password');
          return;
        }
        const user = await loginAsStudent(studentRoll, studentPassword);
        toast.success(`Welcome back, ${user.name}! 👋`);
      }
      navigate('/events');
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
      toast.error('Authentication failed');
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setAuthError('Please enter both username and password');
      return;
    }
    try {
      const admin = await loginAsAdmin(adminUsername, adminPassword);
      toast.success(`Welcome, ${admin.name}! 🔐`);
      navigate('/admin');
    } catch {
      setAuthError('Invalid username or password');
      toast.error('Login failed — check credentials');
    }
  };

  if (isAuthenticated) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: 'var(--accent)', top: '20%', right: '20%' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="glass rounded-2xl p-8 sm:p-10"
          style={{ boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)' }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 cursor-pointer"
              style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)' }}
              whileHover={{ rotate: 10 }}
              onClick={() => setDevTaps((p) => p + 1)}
            >
              <span className="text-3xl font-clash font-bold" style={{ color: 'var(--accent)' }}>
                S
              </span>
            </motion.div>
            <h1 className="font-clash font-bold text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
              SCEMS
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Smart Campus Event Management System
            </p>
          </div>

          {/* Tab switcher */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            {['student', 'admin'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setAuthError(''); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer border-none capitalize"
                style={{
                  backgroundColor: activeTab === tab ? 'var(--accent)' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : 'var(--text-muted)',
                }}
              >
                {tab === 'student' ? <GraduationCap size={18} /> : <Shield size={18} />}
                {tab}
              </button>
            ))}
          </div>

          {/* Student Login / Signup */}
          {activeTab === 'student' && (
            <motion.div
              key="student"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <form onSubmit={handleStudentAuth}>
                {isSignup && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Full Name</label>
                      <input
                        type="text"
                        placeholder="Arjun Kumar"
                        value={studentName}
                        onChange={(e) => { setStudentName(e.target.value); setAuthError(''); }}
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: authError ? '2px solid var(--accent-danger)' : '1px solid var(--border)' }}
                      />
                    </div>
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Department</label>
                        <input
                          type="text"
                          placeholder="CSE"
                          value={studentDept}
                          onChange={(e) => { setStudentDept(e.target.value); setAuthError(''); }}
                          className="w-full px-4 py-3 rounded-xl text-sm"
                          style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: authError ? '2px solid var(--accent-danger)' : '1px solid var(--border)' }}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email</label>
                        <input
                          type="email"
                          placeholder="arjun@college.edu"
                          value={studentEmail}
                          onChange={(e) => { setStudentEmail(e.target.value); setAuthError(''); }}
                          className="w-full px-4 py-3 rounded-xl text-sm"
                          style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: authError ? '2px solid var(--accent-danger)' : '1px solid var(--border)' }}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Roll Number</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="e.g. 21CS045"
                      value={studentRoll}
                      onChange={(e) => { setStudentRoll(e.target.value); setAuthError(''); }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                      style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: authError ? '2px solid var(--accent-danger)' : '1px solid var(--border)' }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={studentPassword}
                      onChange={(e) => { setStudentPassword(e.target.value); setAuthError(''); }}
                      className="w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                      style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: authError ? '2px solid var(--accent-danger)' : '1px solid var(--border)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent border-none p-0"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {authError && <div className="text-sm font-medium mb-4" style={{ color: 'var(--accent-danger)' }}>{authError}</div>}

                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer border-none mb-4"
                  style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <GraduationCap size={22} />
                  {isSignup ? 'Create Account' : 'Login as Student'}
                </motion.button>
                
                <div className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  {isSignup ? "Already have an account?" : "Don't have an account?"}{' '}
                  <button type="button" onClick={() => { setIsSignup(!isSignup); setAuthError(''); }} className="font-semibold cursor-pointer border-none bg-transparent" style={{ color: 'var(--accent)' }}>
                    {isSignup ? 'Login' : 'Sign Up'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Admin Login */}
          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleAdminLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Username
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Enter admin username"
                      value={adminUsername}
                      onChange={(e) => { setAdminUsername(e.target.value); setAuthError(''); }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        border: authError ? '2px solid var(--accent-danger)' : '1px solid var(--border)',
                      }}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter admin password"
                      value={adminPassword}
                      onChange={(e) => { setAdminPassword(e.target.value); setAuthError(''); }}
                      className="w-full pl-10 pr-12 py-3 rounded-xl text-sm"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        border: authError ? '2px solid var(--accent-danger)' : '1px solid var(--border)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <p className="text-xs font-medium mb-4" style={{ color: 'var(--accent-danger)' }}>
                    ⚠️ {authError}
                  </p>
                )}

                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer border-none"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: '#ffffff',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Shield size={22} />
                  Login as Admin
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Quick Test Logins — hidden until logo tapped 5 times */}
          {devTaps >= 5 && (
          <div
            className="mt-6 pt-4"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <p className="text-[10px] text-center uppercase tracking-widest mb-3 font-semibold" style={{ color: 'var(--text-muted)' }}>
              ⚡ Quick Test Login
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const user = await loginAsStudent('21CS045', 'student123');
                    toast.success(`Test login: ${user.name} 👋`);
                    navigate('/events');
                  } catch { toast.error('Start backend first!'); }
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer border-none transition-all hover:scale-[1.02]"
                style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)' }}
              >
                🎓 Student Demo
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const admin = await loginAsAdmin('Rama', 'vtu24465');
                    toast.success(`Test login: ${admin.name} 🔐`);
                    navigate('/admin');
                  } catch { toast.error('Start backend first!'); }
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer border-none transition-all hover:scale-[1.02]"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)' }}
              >
                🛡️ Admin Demo
              </button>
            </div>
          </div>
          )}

          {/* Back link */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-6 text-sm font-medium transition-colors hover:opacity-80 no-underline"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
