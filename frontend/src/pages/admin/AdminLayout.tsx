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
import { useSettings } from '../../context/SettingsContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeFavicon = settings.hospital_info?.favicon_url || settings.favicon_url || '/favicon.svg';

  const handleLogout = () => {
    logout();
    navigate('/staff-login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
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
    <div className="min-h-screen bg-[#faf8f3] text-[#183f3d] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#183f3d] px-4 py-3 border-b border-[#24514e] flex items-center justify-between sticky top-0 z-50 text-white">
        <Link to="/admin" className="flex items-center gap-2.5 text-decoration-none">
          <div className="w-7 h-7 rounded-full bg-white/20 p-1 flex items-center justify-center">
            <img src={activeFavicon} alt="Emblem" className="w-full h-full object-contain" />
          </div>
          <span className="font-serif text-base text-white">Sreemantha CMS</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-[#204a47] text-white cursor-pointer"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#143735] text-[#f8f5ec] border-r border-[#1f4a47] flex flex-col z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-[#1f4a47] flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3 text-decoration-none">
            <div className="w-8 h-8 rounded-full bg-[#e8eee5] p-1.5 flex items-center justify-center border border-[#cbd7c6] shrink-0">
              <img src={activeFavicon} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-serif text-base tracking-tight text-white block">Sreemantha</span>
              <span className="text-[9px] uppercase tracking-wider text-[#d0ddc2] font-semibold block">Hospital CMS</span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item, idx) => {
            if ('header' in item) {
              return (
                <div key={idx} className="pt-4 pb-1.5 px-3 text-[9px] font-bold text-[#8fa8a2] uppercase tracking-[0.16em]">
                  {item.header}
                </div>
              );
            }
            const Icon = item.icon!;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-decoration-none ${
                    isActive
                      ? 'bg-[#1f5953] text-white font-semibold'
                      : 'text-[#c6d7d3] hover:text-white hover:bg-[#194542]'
                  }`
                }
              >
                <Icon size={15} className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-[#1f4a47] bg-[#102d2c]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs font-semibold text-white truncate">{user?.name || user?.username}</p>
              <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5 bg-[#e8eee5] text-[#183f3d]">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg bg-[#194542] hover:bg-[#8f4160] text-[#c6d7d3] hover:text-white transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>

          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md bg-[#194542] hover:bg-[#205450] text-[11px] font-medium text-[#d0ddc2] transition-colors text-decoration-none"
          >
            <span>View Live Website</span> <ExternalLink size={12} />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-[#faf8f3] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
