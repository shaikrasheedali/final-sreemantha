import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  Calendar,
  Menu,
  X,
  Clock,
  MapPin,
  User,
  LogOut,
  ArrowUpRight,
  ChevronDown,
  Languages,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { SITE_LANGUAGES, useTranslation } from '../context/TranslationContext';
import { BrandLogo } from './BrandLogo';
import { AppointmentDrawer } from './AppointmentDrawer';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, status: translationStatus } = useTranslation();

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

  const openAppointmentDrawer = () => {
    setMobileMenuOpen(false);
    setAppointmentOpen(true);
  };

  return (
    <>
      <header className="w-full relative z-40 bg-[var(--deep)] text-white">
        {/* Top hospital operational bar */}
        <div className="topbar">
          <div className="container topbar-inner">
            <span className="topbar-status">
              <Clock size={13} className="text-[var(--lime)] shrink-0" aria-hidden="true" />
              <span className="topbar-status__desktop">Open 24 hours · 7 days a week</span>
            </span>

            <div className="topbar-right">
              <span className="topbar-location">
                <MapPin size={13} className="text-[var(--lime)] shrink-0" aria-hidden="true" />
                <span className="topbar-location__full">Nehru Nagar, Khammam</span>
                <span className="topbar-location__short">Khammam</span>
              </span>

              <a
                href={emergencyHref}
                className="topbar-emergency"
                aria-label={`Emergency hotline ${emergency}`}
              >
                <span className="topbar-emergency__pulse" aria-hidden="true" />
                <span className="topbar-emergency__label">Emergency:</span>
                <span>{emergency}</span>
              </a>

              <a
                href={phoneHref}
                className="topbar-phone"
                aria-label={`Call hospital at ${phone}`}
              >
                <Phone size={12} className="topbar-phone__icon" aria-hidden="true" />
                <span>{phone}</span>
              </a>

              <div className="topbar-separator" aria-hidden="true" />

              <label className="topbar-language notranslate" translate="no">
                <Languages size={14} className="topbar-language__icon" aria-hidden="true" />
                <span className="sr-only">Website language</span>
                <select
                  value={language}
                  onChange={(event) =>
                    setLanguage(event.target.value as (typeof SITE_LANGUAGES)[number]['code'])
                  }
                  aria-label="Website language"
                  title="Change website language"
                >
                  {SITE_LANGUAGES.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.nativeLabel}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="topbar-language__chevron" aria-hidden="true" />
                {translationStatus === 'translating' && (
                  <span className="topbar-language__spinner" aria-hidden="true" />
                )}
              </label>

              <button
                id="topbar-appointment"
                type="button"
                className="topbar-appointment notranslate"
                translate="no"
                onClick={openAppointmentDrawer}
                aria-haspopup="dialog"
                aria-label="Open appointment booking"
                title="Book an appointment"
              >
                <Calendar size={14} aria-hidden="true" />
                <span className="topbar-appointment__label">Book</span>
              </button>
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

            {/* Desktop Nav Links (Single horizontal layer) */}
            <div className="nav-links hidden xl:flex items-center gap-3.5 2xl:gap-6 whitespace-nowrap">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className="transition-colors hover:text-[var(--lime)] py-1 font-semibold text-xs 2xl:text-sm whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Action CTAs */}
            <div className="nav-actions flex items-center gap-1.5 sm:gap-2 shrink-0">
              {isAuthenticated ? (
                <div className="navbar-desktop-admin items-center gap-1.5 shrink-0 hidden md:flex">
                  {/* Desktop Admin Pill */}
                  <Link to="/admin" className="btn btn-soft text-xs">
                    <User size={14} />
                    <span>Admin ({user?.role})</span>
                  </Link>
                  {/* Desktop Logout Button */}
                  <button onClick={logout} title="Logout" className="round-btn text-white">
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/staff-login"
                  className="btn btn-outline text-xs hidden lg:inline-flex nav-staff-login"
                >
                  Staff Login
                </Link>
              )}

              <Link
                to="/book-appointment"
                className="btn btn-primary whitespace-nowrap shrink-0 text-xs sm:text-sm"
                style={{ padding: '7px 12px' }}
              >
                <span className="hidden sm:inline font-semibold">Book Appointment</span>
                <span className="sm:hidden font-semibold text-xs">Book</span>
                <ArrowUpRight size={13} className="shrink-0" />
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="round-btn menu-btn xl:hidden text-white shrink-0"
                aria-label="Toggle navigation"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-navigation" id="mobile-navigation">
            <div className="mobile-nav-links flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isActive(link.path)
                      ? 'bg-[var(--deep)] text-white'
                      : 'text-[var(--ink)] hover:bg-[var(--cream)]'
                  }`}
                >
                  <span>{link.name}</span>
                  <span
                    aria-hidden="true"
                    className={`text-xs ${
                      isActive(link.path) ? 'text-[var(--lime)]' : 'text-gray-400'
                    }`}
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-[rgba(22,55,76,0.12)] flex flex-col gap-2 mt-2">
              <button
                type="button"
                onClick={openAppointmentDrawer}
                className="btn btn-primary w-full justify-center py-2.5"
              >
                <Calendar size={15} />
                Book Appointment
              </button>

              <a href={phoneHref} className="btn btn-dark w-full justify-center py-2.5">
                <Phone size={14} />
                Call Hospital: {phone}
              </a>

              {isAuthenticated ? (
                <div className="flex flex-col gap-1.5 pt-1">
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-soft w-full justify-center py-2 text-xs"
                  >
                    <User size={14} />
                    <span>Go to Admin Dashboard ({user?.role})</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="btn btn-outline text-xs text-[var(--coral)] border-[var(--coral)]/30 hover:bg-[var(--coral)]/10 w-full justify-center py-2"
                  >
                    <LogOut size={14} />
                    <span>Log out ({user?.role})</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/staff-login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-outline text-xs text-[var(--deep)] border-[rgba(22,55,76,0.15)] w-full justify-center py-2"
                >
                  Staff Login / Admin Portal →
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <AppointmentDrawer
        isOpen={appointmentOpen}
        onClose={() => setAppointmentOpen(false)}
      />
    </>
  );
};

export default Navbar;
