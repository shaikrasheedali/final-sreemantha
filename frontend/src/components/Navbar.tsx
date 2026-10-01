import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Calendar, Menu, X, Clock, MapPin, User, LogOut, ArrowUpRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';

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

  return (
    <header className="w-full relative z-40 bg-[var(--deep)] text-white">
      {/* Top hospital operational bar */}
      <div className="topbar">
        <div className="container">
          <span>
            <Clock size={13} className="text-[var(--lime)] inline-block mr-1.5" />
            Open 24 hours · 7 days a week
          </span>
          <div className="topbar-right">
            <span>
              <MapPin size={13} className="text-[var(--lime)] inline-block mr-1.5" />
              Nehru Nagar, Khammam
            </span>
            <a href={emergencyHref} className="text-[var(--lime)] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--pink)] animate-pulse" />
              Emergency: {emergency}
            </a>
            <a href={phoneHref} className="hover:text-[var(--lime)] transition">
              {phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="navbar">
        <div className="container">
          {/* Brand Logo */}
          <Link
            to="/"
            className="brand brand-home focus:outline-none"
            aria-label="Sreemantha Hospital — Home"
          >
            <BrandLogo />
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className="transition-colors hover:text-[var(--lime)]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action CTAs */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="btn btn-soft text-xs"
                >
                  <User size={14} />
                  <span>Admin ({user?.role})</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="round-btn text-white"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/staff-login"
                className="btn btn-outline text-xs hidden lg:inline-flex"
              >
                Staff Login
              </Link>
            )}

            <Link
              to="/book-appointment"
              className="btn btn-primary"
            >
              <span>Book Appointment</span>
              <ArrowUpRight size={16} />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="round-btn menu-btn xl:hidden text-white"
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-navigation"
          id="mobile-navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-[var(--line)] flex flex-col gap-2 mt-2">
            <Link
              to="/book-appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary w-full justify-center"
            >
              <Calendar size={15} />
              Book Appointment
            </Link>

            <a
              href={phoneHref}
              className="btn btn-dark w-full justify-center"
            >
              <Phone size={14} />
              Call Hospital: {phone}
            </a>

            {isAuthenticated ? (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-soft w-full justify-center"
              >
                Go to Admin Dashboard ({user?.role})
              </Link>
            ) : (
              <Link
                to="/staff-login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-outline text-xs text-[var(--deep)] border-[var(--line)] w-full justify-center"
              >
                Staff Login →
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
