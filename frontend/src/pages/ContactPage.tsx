import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Check,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LocationMap } from '../components/LocationMap';
import { useSettings } from '../context/SettingsContext';
import { api } from '../utils/api';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const info = settings.hospital_info || {};
  const phone = info.phone || '+91 96667 81779';
  const emergency = info.emergency_hotline || '+91 88007 73362';
  const email = info.email || 'care@sreemanthahospital.com';
  const address = info.address || 'Priyadarshini Degree College Road, Nehru Nagar, Khammam, Telangana 507001';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;
  const emergencyHref = `tel:${emergency.replace(/[^+\d]/g, '')}`;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Consultation Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError('Please provide your name, phone number, and inquiry message.');
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
        subject: 'General Consultation Inquiry',
        message: '',
      });
    } catch (err: any) {
      console.error('Contact inquiry error:', err);
      setError(err?.message || 'Unable to submit your inquiry at this moment. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container">
        <Breadcrumbs items={[{ label: 'Contact & Location' }]} />

        {/* Heading */}
        <div className="sr-heading-row mb-12">
          <div>
            <span className="sr-kicker">Start a Conversation</span>
            <h1 className="sr-display sr-heading mt-2">
              We’re here to listen<br />
              and <em>answer your questions.</em>
            </h1>
          </div>
          <p className="sr-copy max-w-md">
            Have a question about fertility options, maternity admission, insurance cashless approval, or pediatric care? Our team is always ready to guide you.
          </p>
        </div>

        {/* 4 Contact Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-xl bg-white border border-[rgba(22,55,76,0.12)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[var(--mint)] flex items-center justify-center text-[var(--ink)] mb-4">
                <Phone size={18} />
              </div>
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-1">Direct Helplines</h3>
              <p className="sr-copy text-xs mb-3">Appointments &amp; general enquiries</p>
            </div>
            <div>
              <a href={phoneHref} className="text-sm font-bold text-[var(--ink)] hover:text-[var(--coral)] transition block">
                {phone}
              </a>
              <span className="text-[10px] text-[#5a7d92]">Mon – Sat: 9 AM to 8 PM</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[rgba(22,55,76,0.12)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#fcebf3] flex items-center justify-center text-[var(--coral)] mb-4">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-1">24/7 Emergency Care</h3>
              <p className="sr-copy text-xs mb-3">Labor, casualty &amp; Level-III NICU</p>
            </div>
            <div>
              <a href={emergencyHref} className="text-sm font-bold text-[var(--coral)] hover:underline transition block">
                {emergency}
              </a>
              <span className="text-[10px] text-[#5a7d92]">Available 24 Hours / 365 Days</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[rgba(22,55,76,0.12)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[var(--mint)] flex items-center justify-center text-[var(--ink)] mb-4">
                <Mail size={18} />
              </div>
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-1">Email Correspondence</h3>
              <p className="sr-copy text-xs mb-3">Patient queries &amp; medical records</p>
            </div>
            <div>
              <a href={`mailto:${email}`} className="text-xs font-semibold text-[var(--ink)] hover:text-[var(--coral)] transition truncate block">
                {email}
              </a>
              <span className="text-[10px] text-[#5a7d92]">Responses within 24 hours</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[rgba(22,55,76,0.12)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[var(--mint)] flex items-center justify-center text-[var(--ink)] mb-4">
                <Clock size={18} />
              </div>
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-1">Visiting Hours</h3>
              <p className="sr-copy text-xs mb-3">Inpatient &amp; maternity wards</p>
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--ink)] block">
                04:00 PM – 07:00 PM
              </span>
              <span className="text-[10px] text-[#5a7d92]">Attendant passes provided</span>
            </div>
          </div>
        </div>

        {/* Form and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[rgba(22,55,76,0.12)]">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-2">
                Send a Message
              </span>
              <h2 className="sr-display text-2xl mb-6 text-[var(--ink)]">
                Ask our clinical coordinator
              </h2>

              {success ? (
                <div className="p-8 rounded-xl bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--mint)] text-[var(--ink)] flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h3 className="font-serif text-xl text-[var(--ink)]">Message Received</h3>
                  <p className="sr-copy text-xs max-w-sm mx-auto">
                    Thank you. Your message has been routed to our patient care desk. We will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="sr-button sr-button--outline text-xs mt-2"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3.5 rounded-lg bg-[#f9e9ec] border border-[#f0c2cd] text-[var(--coral)] text-xs font-semibold flex items-center gap-2">
                      <AlertCircle size={15} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Reddy"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="sr-input w-full px-4 py-3 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] text-sm shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none block"
                      />
                    </div>
                    <div>
                      <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 96667 81779"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="sr-input w-full px-4 py-3 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] text-sm shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none block"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. ramesh@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="sr-input w-full px-4 py-3 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] text-sm shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none block"
                      />
                    </div>
                    <div>
                      <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                        Area of Interest
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="sr-select w-full px-4 py-3 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] text-sm shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none cursor-pointer block"
                      >
                        <option value="Fertility & IVF Inquiry">Fertility &amp; IVF Inquiry</option>
                        <option value="Maternity Admission & Delivery Packages">Maternity &amp; Delivery Packages</option>
                        <option value="Level-III NICU & Pediatric Inquiry">NICU &amp; Pediatric Care</option>
                        <option value="Cashless Insurance TPA Help">Cashless Insurance Desk</option>
                        <option value="General Consultation Inquiry">General Consultation Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="sr-label block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                      Your Message or Question *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please let us know your requirements or medical queries..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="sr-textarea w-full px-4 py-3 rounded-xl border border-[rgba(22,55,76,0.18)] bg-white text-[var(--ink)] text-sm shadow-xs focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)] outline-none resize-y block"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="sr-button btn btn-primary w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={15} />
                    {loading ? 'Submitting inquiry...' : 'Send inquiry message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Location & Map Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-white border border-[rgba(22,55,76,0.12)] space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--coral)]">
                <MapPin size={16} />
                Facility Location
              </div>

              <div>
                <h3 className="font-serif text-xl text-[var(--ink)] mb-2">
                  Sreemantha Hospital, Khammam
                </h3>
                <p className="sr-copy text-xs leading-relaxed">
                  {address}
                </p>
                <p className="text-[11px] text-[#5a7d92] mt-2">
                  Landmark: Beside Priyadarshini Degree College, Nehru Nagar.
                </p>
              </div>

              {/* Map embed / link */}
              <LocationMap
                compact
                className="rounded-xl overflow-hidden border border-[rgba(22,55,76,0.12)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
