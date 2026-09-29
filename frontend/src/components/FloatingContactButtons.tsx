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
  const waMsg = encodeURIComponent(waBtn?.default_message || 'Hello Sreemantha Hospital, I would like to enquire about fertility and maternity care.');
  const waLabel = waBtn?.label || 'WhatsApp';

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3 pointer-events-auto"
      role="region"
      aria-label="Instant Contact Options"
    >
      {/* WhatsApp Button */}
      {waEnabled && (
        <a
          href={`https://wa.me/${waNumber}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-2xl hover:scale-105 hover:shadow-emerald-500/40 transition-all duration-300 group"
          title="Chat with Patient Care on WhatsApp"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline whitespace-nowrap">
            {waLabel}
          </span>
        </a>
      )}

      {/* Phone Button */}
      {phoneEnabled && (
        <a
          href={`tel:${phoneNumber}`}
          className="flex items-center gap-2.5 bg-[#006c93] hover:bg-[#073d59] text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-2xl hover:scale-105 hover:shadow-cyan-500/40 transition-all duration-300 group"
          title={`Call Sreemantha Hospital at ${phoneNumber}`}
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline whitespace-nowrap">
            {phoneLabel}
          </span>
        </a>
      )}
    </div>
  );
};
