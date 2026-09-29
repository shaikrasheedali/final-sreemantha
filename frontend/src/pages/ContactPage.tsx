import React, { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2,
  AlertCircle, MessageSquare, ShieldCheck
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSettings } from '../context/SettingsContext';
import { api } from '../utils/api';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setError('Please provide your name, contact phone number, and query message.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.post('/enquiries', formData);
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (err: any) {
      console.error('Contact enquiry error:', err);
      setError(err?.message || 'Failed to submit enquiry. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const hospitalInfo = settings?.hospital_info || {};
  const phone = hospitalInfo.phone || settings?.contact_phone || '+91 96667 81779';
  const whatsapp = hospitalInfo.whatsapp || settings?.contact_whatsapp || '+91 96667 81779';
  const email = hospitalInfo.email || settings?.contact_email || 'care@sreemanthahospital.com';
  const address = hospitalInfo.address || settings?.address || 'Beside Priyadarshini Degree College, Nehru Nagar, Khammam, Telangana 507002';

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="eyebrow mb-2">Connect With Our Team</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073d59] font-heading">
            Get in Touch with Sreemantha Hospital
          </h1>
          <p className="text-sm text-[#637371] mt-2 leading-relaxed">
            Have questions about IVF treatment plans, prenatal checkups, pediatric admissions, or cashless insurance? Reach out to our front desk or visit our facility in Khammam.
          </p>
        </div>

        {/* 3-Column Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#006c93]/10 text-[#006c93] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Call & Helplines</h3>
              <p className="text-xs text-slate-500 mt-1">24/7 Casualty & OPD Reception</p>
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="block text-xs font-bold text-[#006c93] mt-2 hover:underline">
                {phone}
              </a>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Sreemantha%20Hospital,%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-[11px] font-semibold text-emerald-600 mt-1 hover:underline"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#fa7830]/10 text-[#fa7830] flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Email Inquiries</h3>
              <p className="text-xs text-slate-500 mt-1">Corporate & Patient Communications</p>
              <a href={`mailto:${email}`} className="block text-xs font-bold text-[#006c93] mt-2 hover:underline">
                {email}
              </a>
              <span className="text-[11px] text-slate-400 block mt-1">Responses within 24 business hours</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/60 text-emerald-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Working Hours</h3>
              <p className="text-xs text-slate-500 mt-1">OPD: Mon – Sat: 10:00 AM – 8:30 PM</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Emergency & NICU: 24/7
              </div>
            </div>
          </div>
        </div>

        {/* Form and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Enquiry Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#073d59] font-heading">Send Us a Message</h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill out the form below and our patient care team will get back to you promptly.
              </p>
            </div>

            {success ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-emerald-900">Enquiry Received</h3>
                <p className="text-xs text-emerald-700 mt-1 mb-4 leading-relaxed">
                  Thank you for reaching out. We have logged your enquiry and our support staff will call or email you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anjali Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#006c93] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9666781779"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#006c93] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. anjali@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#006c93] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Topic / Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#006c93] focus:outline-none bg-white"
                  >
                    <option value="General Inquiry">General Hospital Inquiry</option>
                    <option value="Fertility / IVF Counseling">Fertility / IVF Counseling</option>
                    <option value="Obstetrics & Maternity Packages">Obstetrics & Maternity Packages</option>
                    <option value="Pediatrics & NICU Admission">Pediatrics & NICU Admission</option>
                    <option value="Insurance Cashless Queries">Insurance Cashless Queries</option>
                    <option value="Feedback / Complaints">Feedback / Complaints</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#006c93] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl bg-[#006c93] hover:bg-[#073d59] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Location & Map */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-[#fa7830] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">Hospital Location</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{address}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Landmark: Beside Priyadarshini Degree & PG College, Nehru Nagar</p>
                  </div>
                </div>

                {/* Google Map Embed */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 h-64 sm:h-72 w-full mt-4">
                  <iframe
                    title="Sreemantha Hospital Khammam Location Map"
                    src="https://maps.google.com/maps?q=Priyadarshini+Degree+College+Nehru+Nagar+Khammam+Telangana&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Parking: Ample 2-wheeler & 4-wheeler available</span>
                <a
                  href="https://maps.google.com/maps?q=Priyadarshini+Degree+College+Nehru+Nagar+Khammam+Telangana"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#006c93] hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
