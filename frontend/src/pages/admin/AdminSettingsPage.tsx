import React, { useEffect, useState, useRef } from 'react';
import {
  Settings,
  Save,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Globe,
  ShieldCheck,
  Check,
  Upload,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Laptop,
  Smartphone,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../utils/api';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshSettings, updateFaviconInHead } = useSettings();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.get<{ settings: Record<string, any> }>('/settings');
        if (res.settings) {
          setFormData(res.settings);
        } else if (settings) {
          setFormData(settings);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [settings]);

  // Current active favicon URL
  const activeFavicon =
    formData.favicon_url ||
    formData.hospital_info?.favicon_url ||
    settings.favicon_url ||
    settings.hospital_info?.favicon_url ||
    '/favicon.svg';

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFavicon(true);
      const res = await api.upload(file);
      if (res && res.url) {
        const newFaviconUrl = res.url;
        setFormData((prev) => ({
          ...prev,
          favicon_url: newFaviconUrl,
          hospital_info: {
            ...(prev.hospital_info || {}),
            favicon_url: newFaviconUrl,
          },
        }));
        // Live update in browser tab immediately
        updateFaviconInHead(newFaviconUrl);
        setNotice('Favicon uploaded successfully! Click "Save Configuration Changes" to persist across all visitor sessions.');
        setTimeout(() => setNotice(null), 5000);
      }
    } catch (err: any) {
      console.error('Favicon upload error:', err);
      alert('Failed to upload favicon image: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingFavicon(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetDefaultFavicon = () => {
    const defaultUrl = '/favicon.svg';
    setFormData((prev) => ({
      ...prev,
      favicon_url: defaultUrl,
      hospital_info: {
        ...(prev.hospital_info || {}),
        favicon_url: defaultUrl,
      },
    }));
    updateFaviconInHead(defaultUrl);
    setNotice('Favicon reset to standard Sreemantha hospital emblem. Save to confirm.');
    setTimeout(() => setNotice(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/settings', formData);
      await refreshSettings();
      if (formData.favicon_url) {
        updateFaviconInHead(formData.favicon_url);
      }
      setNotice('Hospital settings, branding & floating contact numbers updated successfully!');
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      console.error('Settings update error:', err);
      alert('Failed to update settings: ' + (err.message || 'Server error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-[#96aaa4] text-xs">
        Loading hospital configuration...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {notice && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm font-semibold shadow-sm flex items-center gap-2">
          <Check size={18} className="text-emerald-700" /> {notice}
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-xs font-bold text-[var(--coral)] uppercase tracking-wider block mb-1">
          Hospital Configuration &amp; Branding
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] font-display">
          Hospital Settings &amp; Favicon Editor
        </h1>
        <p className="text-sm text-[#5a7d92] mt-1">
          Manage your browser favicon, identity emblem, contact helplines, WhatsApp links, and hospital OPD details in real-time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Favicon & Brand Identity Manager Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[rgba(22,55,76,0.12)] shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(22,55,76,0.12)]">
            <h2 className="text-base font-bold text-[var(--ink)] font-display flex items-center gap-2">
              <Sparkles size={18} className="text-[var(--coral)]" /> Favicon &amp; Browser Head Identity
            </h2>
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[var(--mint)] text-[var(--teal)] border border-[var(--teal)]/20 uppercase tracking-wider">
              Live Browser Sync
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Preview Box: Browser Tab & Mobile App Icons */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] block">
                Live Simulated Previews
              </span>

              {/* Browser Tab Simulation */}
              <div className="p-4 bg-[var(--cream)] rounded-2xl border border-[rgba(22,55,76,0.12)] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5a7d92]">
                  <Laptop size={14} />
                  <span>Desktop Browser Tab</span>
                </div>
                <div className="bg-white rounded-xl px-3.5 py-2.5 border border-[rgba(22,55,76,0.12)] flex items-center gap-2.5 max-w-sm shadow-xs">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 overflow-hidden bg-white p-0.5 border border-[rgba(22,55,76,0.12)]">
                    <img
                      src={activeFavicon}
                      alt="Active Favicon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-bold text-[var(--ink)] truncate">
                    {formData.hospital_info?.hospital_name || 'Sreemantha Hospital | Khammam'}
                  </span>
                  <span className="ml-auto text-xs text-[#5a7d92]">×</span>
                </div>
              </div>

              {/* Mobile Home Screen Simulation */}
              <div className="p-4 bg-[var(--cream)] rounded-2xl border border-[rgba(22,55,76,0.12)] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5a7d92]">
                  <Smartphone size={14} />
                  <span>Mobile &amp; Apple Touch App Icon</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-white p-2.5 border border-[rgba(22,55,76,0.14)] shadow-md flex items-center justify-center shrink-0">
                    <img
                      src={activeFavicon}
                      alt="Mobile App Favicon Icon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <strong className="text-sm font-bold text-[var(--ink)] block">Sreemantha</strong>
                    <span className="text-xs text-[#5a7d92]">Home screen web app bookmark</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Upload & URL Options */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] block">
                Change Favicon File or URL
              </span>

              {/* Upload Input */}
              <div className="p-6 bg-[var(--cream)] rounded-2xl border-2 border-dashed border-[rgba(22,55,76,0.18)] text-center space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="favicon-file-input"
                  accept=".svg,.png,.ico,.webp,.jpg,.jpeg"
                  onChange={handleFaviconUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-[var(--mint)] text-[var(--teal)] flex items-center justify-center mx-auto shadow-xs">
                  <Upload size={20} />
                </div>
                <div>
                  <label
                    htmlFor="favicon-file-input"
                    className="btn btn-primary text-xs py-2.5 px-5 cursor-pointer inline-flex items-center gap-2 shadow-md"
                  >
                    {uploadingFavicon ? 'Uploading icon...' : 'Upload New Favicon File'}
                  </label>
                  <p className="text-xs text-[#5a7d92] mt-2">
                    Supports SVG, PNG, ICO, WEBP (SVG or 512x512 PNG recommended for maximum crispness).
                  </p>
                </div>
              </div>

              {/* Reset to Default Action */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#5a7d92]">Need to revert to default logo icon?</span>
                <button
                  type="button"
                  onClick={handleResetDefaultFavicon}
                  className="btn btn-soft text-xs whitespace-nowrap shrink-0 flex items-center gap-1.5 font-bold"
                  title="Restore default /favicon.svg"
                >
                  <RotateCcw size={14} />
                  Reset to Default Favicon
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Floating Contact Buttons Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[rgba(22,55,76,0.12)] shadow-xl space-y-6">
          <h2 className="text-base font-bold text-[var(--ink)] font-display flex items-center gap-2 pb-4 border-b border-[rgba(22,55,76,0.12)]">
            <Phone size={18} className="text-[var(--coral)]" /> Floating Contact Buttons (Bottom Corner)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 bg-[var(--cream)] rounded-2xl border border-[rgba(22,55,76,0.12)] space-y-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                WhatsApp Floating Button
              </span>
              <div>
                <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formData.contact_whatsapp || '+91 96667 81779'}
                  onChange={(e) => setFormData({ ...formData, contact_whatsapp: e.target.value })}
                  placeholder="+91 96667 81779"
                  className="sr-input text-sm w-full px-4 py-2.5 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none block"
                />
              </div>
              <p className="text-xs text-[#5a7d92]">
                Target link: https://wa.me/919666781779
              </p>
            </div>

            <div className="p-5 bg-[var(--cream)] rounded-2xl border border-[rgba(22,55,76,0.12)] space-y-3">
              <span className="text-xs font-bold text-[var(--coral)] uppercase tracking-wider block">
                Direct Phone Call Button
              </span>
              <div>
                <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                  Direct Phone Call Number
                </label>
                <input
                  type="text"
                  value={formData.contact_phone || '+91 96667 81779'}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+91 96667 81779"
                  className="sr-input text-sm w-full px-4 py-2.5 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none block"
                />
              </div>
              <p className="text-xs text-[#5a7d92]">
                Target link: tel:+919666781779
              </p>
            </div>
          </div>
        </div>

        {/* 3. General Hospital Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[rgba(22,55,76,0.12)] shadow-xl space-y-6">
          <h2 className="text-base font-bold text-[var(--ink)] font-display flex items-center gap-2 pb-4 border-b border-[rgba(22,55,76,0.12)]">
            <Globe size={18} className="text-[var(--teal)]" /> Hospital Identity &amp; Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                Hospital Full Name
              </label>
              <input
                type="text"
                value={formData.hospital_name || 'Sreemantha Hospital'}
                onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
                className="sr-input text-sm w-full px-4 py-2.5 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none block"
              />
            </div>

            <div>
              <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                Hospital Tagline
              </label>
              <input
                type="text"
                value={formData.hospital_tagline || 'Fertility, Women & Child Care'}
                onChange={(e) => setFormData({ ...formData, hospital_tagline: e.target.value })}
                className="sr-input text-sm w-full px-4 py-2.5 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none block"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contact_email || 'care@sreemanthahospital.com'}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="sr-input text-sm w-full px-4 py-2.5 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none block"
              />
            </div>

            <div>
              <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                Emergency 24/7 Helpline
              </label>
              <input
                type="text"
                value={formData.emergency_phone || '+91 88007 73362'}
                onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                className="sr-input text-sm w-full px-4 py-2.5 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none block"
              />
            </div>
          </div>

          <div>
            <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
              Physical Address (Khammam Facility)
            </label>
            <textarea
              rows={2}
              value={formData.address || 'Priyadarshini Degree College Road, Nehru Nagar, Khammam, Telangana 507001'}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="sr-textarea text-sm w-full px-4 py-3 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none resize-y block"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                OPD Working Hours
              </label>
              <input
                type="text"
                value={formData.working_hours || 'Mon - Sat: 09:00 AM - 08:00 PM'}
                onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                className="sr-input text-sm w-full px-4 py-2.5 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none block"
              />
            </div>

            <div>
              <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                Emergency / Casualty Hours
              </label>
              <input
                type="text"
                value={formData.emergency_hours || '24/7 All Days & Holidays'}
                onChange={(e) => setFormData({ ...formData, emergency_hours: e.target.value })}
                className="sr-input text-sm w-full px-4 py-2.5 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none block"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center gap-2 cursor-pointer hover:shadow-xl transition-all"
          >
            <Save size={18} />
            {saving ? 'Saving changes...' : 'Save Configuration Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
