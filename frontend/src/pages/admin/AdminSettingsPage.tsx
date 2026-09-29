import React, { useEffect, useState } from 'react';
import { Settings, Save, Phone, MessageSquare, MapPin, Clock, Globe, ShieldCheck, Check } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../utils/api';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/settings', formData);
      await refreshSettings();
      setNotice('Hospital settings & floating contact numbers updated successfully!');
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      console.error('Settings update error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-400 text-xs">
        Loading hospital configuration...
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-6">
      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4" /> {notice}
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-[10px] font-bold text-[#fa7830] uppercase tracking-wider block mb-1">
          Hospital Configuration & Helplines
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
          Website & Contact Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Update phone numbers, WhatsApp links, hospital address, and floating quick-contact buttons without touching code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Floating Contact Buttons Section */}
        <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-700">
            <Phone className="w-4 h-4 text-[#fa7830]" /> Floating Quick Contact Buttons (Bottom-Left)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 space-y-3">
              <span className="text-xs font-bold text-emerald-400 block">WhatsApp Floating Button</span>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  value={formData.contact_whatsapp || '+91 96667 81779'}
                  onChange={(e) => setFormData({ ...formData, contact_whatsapp: e.target.value })}
                  placeholder="+91 96667 81779"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Target link: https://wa.me/919666781779
              </p>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 space-y-3">
              <span className="text-xs font-bold text-sky-400 block">Direct Call Floating Button</span>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Direct Phone Call Number
                </label>
                <input
                  type="text"
                  value={formData.contact_phone || '+91 96667 81779'}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+91 96667 81779"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Target link: tel:+919666781779
              </p>
            </div>
          </div>
        </div>

        {/* General Hospital Information */}
        <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-700">
            <Globe className="w-4 h-4 text-[#006c93]" /> Hospital Identity & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Hospital Full Name
              </label>
              <input
                type="text"
                value={formData.hospital_name || 'Sreemantha Hospital'}
                onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Hospital Tagline
              </label>
              <input
                type="text"
                value={formData.hospital_tagline || 'Fertility, Women & Child Care'}
                onChange={(e) => setFormData({ ...formData, hospital_tagline: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contact_email || 'care@sreemanthahospital.com'}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Emergency 24/7 Helpline
              </label>
              <input
                type="text"
                value={formData.emergency_phone || '+91 96667 81779'}
                onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Physical Address (Khammam Facility)
            </label>
            <textarea
              rows={2}
              value={formData.address || 'Beside Priyadarshini Degree College, Nehru Nagar, Khammam, Telangana 507002'}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                OPD Hours
              </label>
              <input
                type="text"
                value={formData.working_hours || 'Mon - Sat: 10:00 AM - 08:30 PM'}
                onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Emergency Casualty Hours
              </label>
              <input
                type="text"
                value={formData.emergency_hours || '24/7 All Days & Holidays'}
                onChange={(e) => setFormData({ ...formData, emergency_hours: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-[#006c93] hover:bg-[#073d59] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Configuration Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
