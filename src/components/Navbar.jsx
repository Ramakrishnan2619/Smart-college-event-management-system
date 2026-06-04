import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, LogOut, User, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'font-semibold'
        : 'hover:opacity-80'
    }`;

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--accent)' : 'var(--text-primary)',
  });

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
  ];

  if (isAuthenticated && !isAdmin) {
    navItems.push({ to: '/dashboard', label: 'Dashboard' });
  }
  if (isAuthenticated && isAdmin) {
    navItems.push({ to: '/admin', label: 'Admin Panel' });
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled
          ? isDark
            ? 'rgba(15, 15, 19, 0.85)'
            : 'rgba(248, 248, 252, 0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span
              className="text-2xl font-bold font-clash tracking-tight"
              style={{ color: 'var(--accent)' }}
            >
              SCEMS
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navLinkClass}
                style={navLinkStyle}
                end={item.to === '/'}
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--accent)' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Cart icon */}
            {!isAdmin && (
              <button
                onClick={() => navigate('/cart')}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 relative"
                style={{ color: 'var(--text-muted)' }}
                aria-label="View cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: 'var(--accent-danger)' }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Auth section - desktop */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {user.name}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold w-fit"
                        style={{
                          backgroundColor: isAdmin ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: isAdmin ? 'var(--accent-danger)' : 'var(--accent)',
                        }}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{ color: 'var(--accent-danger)' }}
                    aria-label="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-base btn-filled text-sm no-underline">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: 'var(--text-primary)' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden"
            style={{
              backgroundColor: isDark ? 'rgba(15, 15, 19, 0.95)' : 'rgba(248, 248, 252, 0.95)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors no-underline"
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                    backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  })}
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {user.name}
                        </p>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            backgroundColor: isAdmin ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                            color: isAdmin ? 'var(--accent-danger)' : 'var(--accent)',
                          }}
                        >
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                      style={{ color: 'var(--accent-danger)' }}
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center btn-base btn-filled text-sm no-underline"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
