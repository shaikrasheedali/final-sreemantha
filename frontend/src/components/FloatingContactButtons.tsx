import React, { useEffect, useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export const FloatingContactButtons: React.FC = () => {
  const { settings } = useSettings();
  const { pathname } = useLocation();
  const [heroVisible, setHeroVisible] = useState(false);
  const contactButtons = settings.contact_buttons || {};
  const phoneBtn = contactButtons.phone_button;
  const waBtn = contactButtons.whatsapp_button;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const media = window.matchMedia('(max-width: 1023px)');
    let observer: IntersectionObserver | null = null;
    let frame = 0;

    const disconnect = () => {
      observer?.disconnect();
      observer = null;
    };

    const observeHero = () => {
      disconnect();

      if (pathname !== '/' || !media.matches) {
        setHeroVisible(false);
        return;
      }

      const hero = document.querySelector('.hero');
      if (!hero) {
        setHeroVisible(false);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => setHeroVisible(entry.isIntersecting),
        { threshold: [0, 0.03, 0.15] }
      );
      observer.observe(hero);
    };

    frame = window.requestAnimationFrame(observeHero);

    const handleViewportChange = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(observeHero);
    };

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleViewportChange);
    } else {
      media.addListener(handleViewportChange);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      disconnect();
      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', handleViewportChange);
      } else {
        media.removeListener(handleViewportChange);
      }
    };
  }, [pathname]);

  const phoneEnabled = phoneBtn?.enabled ?? true;
  const phoneNumber = (phoneBtn?.number || '+91 96667 81779').replace(/\s+/g, '');
  const phoneLabel = phoneBtn?.label || 'Call Us';

  const waEnabled = waBtn?.enabled ?? true;
  const waNumber = (waBtn?.number || '919666781779').replace(/\D/g, '');
  const waMsg = encodeURIComponent(
    waBtn?.default_message || 'Hello Sreemantha Hospital, I would like to book a consultation.'
  );
  const waLabel = waBtn?.label || 'WhatsApp Us';

  return (
    <div
      className={`floating-contact fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-auto${
        heroVisible ? ' is-hero-hidden' : ''
      }`}
      role="region"
      aria-label="Patient Quick Assistance"
      aria-hidden={heroVisible || undefined}
    >
      {/* WhatsApp Button */}
      {waEnabled && (
        <a
          href={`https://wa.me/${waNumber}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 sm:gap-2.5 bg-[#25D366] hover:bg-[#128C7E] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all border border-white/30 text-decoration-none"
          title="Chat with Patient Care on WhatsApp"
          style={{ color: '#ffffff' }}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle size={14} className="text-white fill-white" />
          </div>
          <span
            className="text-xs sm:text-[13px] font-bold tracking-wide whitespace-nowrap"
            style={{ color: '#ffffff' }}
          >
            {waLabel}
          </span>
        </a>
      )}

      {/* Phone Button */}
      {phoneEnabled && (
        <a
          href={`tel:${phoneNumber}`}
          className="group flex items-center gap-2 sm:gap-2.5 bg-[#073d59] hover:bg-[#006c93] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all border border-white/30 text-decoration-none"
          title={`Call Sreemantha Hospital at ${phoneNumber}`}
          style={{ color: '#ffffff' }}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Phone size={13} className="text-white fill-white" />
          </div>
          <span
            className="text-xs sm:text-[13px] font-bold tracking-wide whitespace-nowrap"
            style={{ color: '#ffffff' }}
          >
            {phoneLabel}
          </span>
        </a>
      )}
    </div>
  );
};
