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
  const waLabel = waBtn?.label || 'WhatsApp';

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2.5 pointer-events-auto"
      role="region"
      aria-label="Patient Quick Assistance"
    >
      {/* WhatsApp Button */}
      {waEnabled && (
        <a
          href={`https://wa.me/${waNumber}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#1f7a55] hover:bg-[#165a3f] text-white px-3.5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-decoration-none"
          title="Chat with Patient Care on WhatsApp"
        >
          <MessageCircle size={16} className="text-white fill-white" />
          <span className="text-[12px] font-semibold hidden sm:inline whitespace-nowrap">
            {waLabel}
          </span>
        </a>
      )}

      {/* Phone Button */}
      {phoneEnabled && (
        <a
          href={`tel:${phoneNumber}`}
          className="flex items-center gap-2 bg-[var(--deep)] hover:bg-white/10 text-white px-3.5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-decoration-none"
          title={`Call Sreemantha Hospital at ${phoneNumber}`}
        >
          <Phone size={15} className="text-white" />
          <span className="text-[12px] font-semibold hidden sm:inline whitespace-nowrap">
            {phoneLabel}
          </span>
        </a>
      )}
    </div>
  );
};
