import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Calendar, Menu, X, Clock, MapPin, User, LogOut, ArrowUpRight } from 'lucide-react';
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
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;
  const emergencyHref = `tel:${emergency.replace(/[^+\d]/g, '')}`;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About us', path: '/about' },
    { name: 'Specialties', path: '/specialties' },
    { name: 'Treatments', path: '/treatments' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Insights', path: '/insights' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const activeFavicon = hospitalInfo.favicon_url || settings.favicon_url || '/favicon.svg';

  return (
    <header className="w-full relative z-40">
      {/* Top hospital operational bar */}
      <div className="bg-[#183f3d] text-[#f8f5ec] text-[11px] py-2 px-4 border-b border-[#285854] hidden lg:block">
        <div className="sr-container flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#d0ddc2]">
              <MapPin size={12} className="text-[#d0ddc2]" />
              Priyadarshini Degree College Road, Nehru Nagar, Khammam
            </span>
            <span className="flex items-center gap-1.5 text-[#d3dfdb]">
              <Clock size={12} className="text-[#e4ebd9]" />
              OPD: 9:00 AM – 8:00 PM · Emergency &amp; NICU: 24/7
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={emergencyHref}
              className="flex items-center gap-1.5 text-[#f4e7e9] hover:text-white font-medium transition"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#f075b5] animate-pulse" />
              Emergency: {emergency}
            </a>
            <a
              href={phoneHref}
              className="flex items-center gap-1.5 text-[#d0ddc2] hover:text-white transition"
            >
              <Phone size={12} />
              {phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-[#faf8f3]/95 backdrop-blur-md border-b border-[#e0e5dd] sticky top-0 transition-all">
        <div className="sr-container h-20 flex items-center justify-between">
          {/* Brand Logo & Logotype */}
          <Link to="/" className="flex items-center gap-3 group text-decoration-none">
            <div className="w-10 h-10 rounded-full bg-[#e8eee5] p-1.5 flex items-center justify-center border border-[#cbd7c6] group-hover:scale-105 transition-transform shrink-0">
              <img
                src={activeFavicon}
                alt="Sreemantha Hospital"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-[21px] leading-tight text-[#183f3d] tracking-tight font-medium">
                Sreemantha
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-[#8f4160] font-bold">
                Hospital · Khammam
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-[#e8eee5] text-[#183f3d] font-semibold'
                    : 'text-[#596966] hover:text-[#183f3d] hover:bg-[#f0f4eb]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/book-appointment"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#183f3d] text-white text-[12px] font-semibold hover:bg-[#285854] transition shadow-sm"
            >
              <Calendar size={14} />
              <span>Book Appointment</span>
              <ArrowUpRight size={13} />
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                <Link
                  to="/admin"
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-[#e8eee5] text-[#183f3d] hover:bg-[#d8e2d4] transition flex items-center gap-1"
                >
                  <User size={13} />
                  <span>Admin ({user?.role})</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-[#596966] hover:text-[#8f4160] rounded-lg hover:bg-[#e8eee5] transition cursor-pointer"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link
                to="/staff-login"
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#596966] hover:text-[#183f3d] hover:bg-[#f0f4eb] transition"
              >
                Staff Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <Link
              to="/book-appointment"
              className="px-3 py-1.5 rounded-lg bg-[#183f3d] text-white text-[11px] font-semibold md:hidden"
            >
              Consult
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#183f3d] rounded-lg hover:bg-[#e8eee5] focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#faf8f3] border-b border-[#e0e5dd] px-6 pt-3 pb-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive(link.path)
                      ? 'bg-[#e8eee5] text-[#183f3d] font-semibold'
                      : 'text-[#596966] hover:bg-[#f0f4eb]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-[#e0e5dd] mt-2 flex flex-col gap-2">
                <Link
                  to="/book-appointment"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-center rounded-lg text-sm font-semibold bg-[#183f3d] text-white flex items-center justify-center gap-2"
                >
                  <Calendar size={15} />
                  Book consultation
                </Link>

                <a
                  href={phoneHref}
                  className="py-2.5 text-center rounded-lg text-xs font-semibold text-[#183f3d] border border-[#cbd7c6] flex items-center justify-center gap-2"
                >
                  <Phone size={14} />
                  Call Hospital: {phone}
                </a>

                {isAuthenticated ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center rounded-lg text-xs font-bold bg-[#e8eee5] text-[#183f3d]"
                  >
                    Go to Admin Dashboard ({user?.role})
                  </Link>
                ) : (
                  <Link
                    to="/staff-login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center text-xs font-medium text-[#596966] hover:text-[#183f3d]"
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
