import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const FloatingContactButtons: React.FC = () => {
  const { settings } = useSettings();
  const contactButtons = settings.contact_buttons || {};
  const phoneBtn = contactButtons.phone_button;
  const waBtn = contactButtons.whatsapp_button;

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
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto"
      role="region"
      aria-label="Patient Quick Assistance"
    >
      {/* WhatsApp Button */}
      {waEnabled && (
        <a
          href={`https://wa.me/${waNumber}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#128C7E] px-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all border border-white/30 text-decoration-none"
          title="Chat with Patient Care on WhatsApp"
          style={{ color: '#ffffff' }}
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle size={15} className="text-white fill-white" />
          </div>
          <span
            className="text-[13px] font-bold tracking-wide whitespace-nowrap"
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
          className="group flex items-center gap-2.5 bg-[#073d59] hover:bg-[#006c93] px-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all border border-white/30 text-decoration-none"
          title={`Call Sreemantha Hospital at ${phoneNumber}`}
          style={{ color: '#ffffff' }}
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Phone size={14} className="text-white fill-white" />
          </div>
          <span
            className="text-[13px] font-bold tracking-wide whitespace-nowrap"
            style={{ color: '#ffffff' }}
          >
            {phoneLabel}
          </span>
        </a>
      )}
    </div>
  );
};
