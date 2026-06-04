import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, CalendarDays, Users, BarChart2, ChevronLeft, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ collapsed, setCollapsed, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'events', label: 'Events', icon: <CalendarDays size={20} /> },
    { id: 'registrations', label: 'Registrations', icon: <Users size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
  ];

  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col"
      style={{
        width: collapsed ? '72px' : '240px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        transition: 'width 0.3s ease',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 h-16 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          S
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <span className="font-clash font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Admin Panel
            </span>
          </motion.div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border-none"
            style={{
              backgroundColor: activeTab === item.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: activeTab === item.id ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer border-none"
          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)' }}
        >
          <ChevronLeft
            size={18}
            style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>

      {/* Admin info + logout */}
      <div
        className="px-3 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: 'var(--accent-danger)', color: '#fff' }}
          >
            {user?.name?.charAt(0) || 'A'}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.name}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Admin</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer border-none transition-all"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)' }}
          >
            <LogOut size={16} />
            Logout
          </button>
        )}
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
