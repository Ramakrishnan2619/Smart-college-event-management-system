import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import EventCategories from './pages/EventCategories';
import EventListing from './pages/EventListing';
import EventDetail from './pages/EventDetail';
import RegistrationForm from './pages/RegistrationForm';
import StudentDashboard from './pages/StudentDashboard';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Receipt from './pages/Receipt';
import MobilePayment from './pages/MobilePayment';
import Inbox from './pages/Inbox';
import ChatBot from './components/ChatBot';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-lg cursor-pointer border-none transition-transform hover:scale-110"
      style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </motion.button>
  );
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname.startsWith('/mobile-pay') || location.pathname === '/inbox';

  return (
    <>
      <ScrollToTop />
      {/* Hide navbar on full-screen isolated flows */}
      {!hideNavbar && <Navbar />}
      
      {/* Global ChatBot accessible everywhere except isolated screens */}
      {!hideNavbar && <ChatBot />}
      
      <main className={!hideNavbar ? 'pt-16' : ''}>
        <PageTransition>
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events" element={<EventCategories />} />
            <Route path="/events/:categoryId" element={<EventListing />} />
            <Route path="/events/:categoryId/:eventId" element={<EventDetail />} />
            <Route
              path="/register/:eventId"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <RegistrationForm />
                </ProtectedRoute>
              }
            />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/mobile-pay/:txnId/:amount" element={<MobilePayment />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Inbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      </main>
      <ScrollToTopButton />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#fff' },
              },
            }}
          />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
