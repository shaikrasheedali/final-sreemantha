import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  Activity,
  Stethoscope,
  Users,
  Image as ImageIcon,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  ShieldAlert,
  FileText,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/BrandLogo';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/staff-login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { header: 'CONTENT COLLECTIONS' },
    { label: 'Facilities', path: '/admin/facilities', icon: Building },
    { label: 'Specialties', path: '/admin/specialties', icon: Activity },
    { label: 'Treatments', path: '/admin/treatments', icon: Stethoscope },
    { label: 'Doctors', path: '/admin/doctors', icon: Users },
    { label: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { label: 'Health Journal', path: '/admin/insights', icon: BookOpen },
    { header: 'PATIENT OPERATIONS' },
    { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { label: 'Contact Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { header: 'SYSTEM & SETTINGS' },
    { label: 'Hospital Settings & Favicon', path: '/admin/settings', icon: Settings },
    ...(user?.role === 'superadmin'
      ? [{ label: 'Users & Roles', path: '/admin/users', icon: ShieldAlert }]
      : []),
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
  ];

  return (
    <div className="dashboard">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[var(--deep)] px-4 py-3 border-b border-[rgba(255,255,255,0.15)] flex items-center justify-between sticky top-0 z-50 text-white col-span-2">
        <Link to="/admin" className="inline-flex items-center">
          <BrandLogo theme="dark" className="w-36" />
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="round-btn text-white w-9 h-9"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        <Link to="/admin" className="brand block px-2 mb-6" onClick={() => setSidebarOpen(false)}>
          <BrandLogo theme="dark" />
        </Link>

        {/* Navigation list */}
        <nav className="sidebar-nav">
          {navItems.map((item, idx) => {
            if ('header' in item) {
              return (
                <div
                  key={idx}
                  className="pt-3.5 pb-1 px-3 text-[10px] font-bold text-[var(--lime)]/80 uppercase tracking-[0.15em]"
                >
                  {item.header}
                </div>
              );
            }

            const IconComp = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `side-link ${isActive ? 'active' : ''}`
                }
              >
                <IconComp size={16} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="mt-auto shrink-0 space-y-1 pt-3 border-t border-[rgba(255,255,255,0.12)]">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="side-link"
          >
            <ExternalLink size={15} />
            <span>View Live Website</span>
          </a>

          <button
            onClick={handleLogout}
            className="side-link w-full text-left"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* User badge */}
        <div className="user-mini">
          <div className="user-avatar text-white font-bold">
            {user?.username ? user.username.slice(0, 2).toUpperCase() : 'SH'}
          </div>
          <div className="min-w-0">
            <strong className="truncate text-white font-semibold">
              {user?.name || user?.username || 'Staff'}
            </strong>
            <span className="capitalize block text-xs opacity-75">
              {user?.role || 'authorized staff'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dash-main">
        {/* Connection status banner matching design spec */}
        <div className="connection-banner connected">
          <span className="connection-dot" />
          <strong>Sreemantha Live SQLite Platform</strong>
          <span className="text-xs">
            Argon2-secured CMS · Hospital Records &amp; Clinical Catalog Connected
          </span>
        </div>

        <Outlet />
      </main>

      {/* Scrim backdrop for mobile */}
      {sidebarOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
