import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building, Activity, Stethoscope, Users,
  Image as ImageIcon, BookOpen, Calendar, MessageSquare,
  Settings, ShieldAlert, FileText, LogOut, Menu, X, ExternalLink, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    { label: 'Insights (Blog)', path: '/admin/insights', icon: BookOpen },
    { header: 'PATIENT OPERATIONS' },
    { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { label: 'Contact Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { header: 'SYSTEM & SETTINGS' },
    { label: 'Hospital Settings', path: '/admin/settings', icon: Settings },
    ...(user?.role === 'superadmin'
      ? [{ label: 'Users & Roles', path: '/admin/users', icon: ShieldAlert }]
      : []),
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-50">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Sreemantha Logo" className="h-7 w-auto" />
          <span className="font-bold text-sm tracking-tight text-white">Sreemantha CMS</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Sreemantha Logo" className="h-8 w-auto" />
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">Sreemantha</span>
              <span className="text-[10px] text-slate-400 font-medium block">Healthcare CMS</span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item, idx) => {
            if ('header' in item) {
              return (
                <div key={idx} className="pt-4 pb-1.5 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#006c93] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs font-bold text-white truncate">{user?.name || user?.username}</p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5 ${
                user?.role === 'superadmin'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : user?.role === 'admin'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}>
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-[11px] font-medium text-slate-300 transition-colors"
          >
            <span>View Public Site</span> <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-slate-900 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
