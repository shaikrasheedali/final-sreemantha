import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Calendar, Menu, X, ShieldAlert, Clock, MapPin, User, LogOut } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const { user, isAuthenticated, logout } = useAuth();

  const hospitalInfo = settings.hospital_info || {};
  const phone = hospitalInfo.phone || '+91 96667 81779';
  const emergency = hospitalInfo.emergency_hotline || '+91 88007 73362';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About us', path: '/about' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Specialties', path: '/specialties' },
    { name: 'Treatments', path: '/treatments' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Insights', path: '/insights' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="w-full relative z-40">
      {/* Top operational bar */}
      <div className="bg-[#073d59] text-white text-xs py-2 px-4 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-cyan-200">
              <MapPin className="w-3.5 h-3.5 text-[#05a5ea]" />
              Nehru Nagar, Khammam (24/7 Available)
            </span>
            <span className="flex items-center gap-1.5 text-slate-200">
              <Clock className="w-3.5 h-3.5 text-pink-300" />
              OPD: 9:00 AM - 8:00 PM | Emergency: 24/7
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={`tel:${emergency.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-rose-300 hover:text-white font-semibold transition"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Emergency: {emergency}
            </a>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-cyan-100 hover:text-white transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#05a5ea]" />
              {phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-[#16374c]/10 sticky top-0 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.svg"
              alt="Sreemantha Hospital Khammam"
              className="h-11 sm:h-12 w-auto transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Nav Buttons */}
          <div className="hidden xl:flex items-center gap-1 lg:gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-full text-[13.5px] font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-[#006c93] text-white shadow-sm'
                    : 'text-[#16374c] hover:text-[#006c93] hover:bg-[#f1f7fc]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/book-appointment"
              className="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#e0f3fc] text-[#006c93] hover:bg-[#bfeaff] transition flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Admin ({user?.role})</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 rounded-full hover:bg-slate-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/staff-login"
                className="px-3 py-2 rounded-full text-xs font-semibold text-[#073d59] border border-slate-200 hover:border-[#006c93] hover:text-[#006c93] transition"
              >
                Staff Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <Link
              to="/book-appointment"
              className="btn-primary text-xs px-3 py-1.5 rounded-full font-bold md:hidden"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#073d59] rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    isActive(link.path)
                      ? 'bg-[#006c93] text-white'
                      : 'text-[#16374c] hover:bg-[#f1f7fc]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-100 mt-2 flex flex-col gap-2">
                <Link
                  to="/book-appointment"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary py-2.5 text-center rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </Link>

                {isAuthenticated ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center rounded-xl text-sm font-bold bg-[#e0f3fc] text-[#006c93]"
                  >
                    Go to Admin Dashboard ({user?.role})
                  </Link>
                ) : (
                  <Link
                    to="/staff-login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center text-xs font-semibold text-slate-600 hover:text-[#006c93]"
                  >
                    Hospital Staff Portal Login →
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
