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
  ArrowUpRight,
  MessageCircle,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
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
          <div className="p-6 rounded-xl bg-[#fffefb] border border-[#e0e5dd] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#e8eee5] flex items-center justify-center text-[#183f3d] mb-4">
                <Phone size={18} />
              </div>
              <h3 className="text-sm font-semibold text-[#183f3d] mb-1">Direct Helplines</h3>
              <p className="sr-copy text-xs mb-3">Appointments &amp; general enquiries</p>
            </div>
            <div>
              <a href={phoneHref} className="text-sm font-bold text-[#183f3d] hover:text-[#8f4160] transition block">
                {phone}
              </a>
              <span className="text-[10px] text-[#596966]">Mon – Sat: 9 AM to 8 PM</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#fffefb] border border-[#e0e5dd] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#f4e7e9] flex items-center justify-center text-[#8f4160] mb-4">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-sm font-semibold text-[#183f3d] mb-1">24/7 Emergency Care</h3>
              <p className="sr-copy text-xs mb-3">Labor, casualty &amp; Level-III NICU</p>
            </div>
            <div>
              <a href={emergencyHref} className="text-sm font-bold text-[#8f4160] hover:underline transition block">
                {emergency}
              </a>
              <span className="text-[10px] text-[#596966]">Available 24 Hours / 365 Days</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#fffefb] border border-[#e0e5dd] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#e8eee5] flex items-center justify-center text-[#183f3d] mb-4">
                <Mail size={18} />
              </div>
              <h3 className="text-sm font-semibold text-[#183f3d] mb-1">Email Correspondence</h3>
              <p className="sr-copy text-xs mb-3">Patient queries &amp; medical records</p>
            </div>
            <div>
              <a href={`mailto:${email}`} className="text-xs font-semibold text-[#183f3d] hover:text-[#8f4160] transition truncate block">
                {email}
              </a>
              <span className="text-[10px] text-[#596966]">Responses within 24 hours</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#fffefb] border border-[#e0e5dd] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#e8eee5] flex items-center justify-center text-[#183f3d] mb-4">
                <Clock size={18} />
              </div>
              <h3 className="text-sm font-semibold text-[#183f3d] mb-1">Visiting Hours</h3>
              <p className="sr-copy text-xs mb-3">Inpatient &amp; maternity wards</p>
            </div>
            <div>
              <span className="text-xs font-bold text-[#183f3d] block">
                04:00 PM – 07:00 PM
              </span>
              <span className="text-[10px] text-[#596966]">Attendant passes provided</span>
            </div>
          </div>
        </div>

        {/* Form and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-12 rounded-2xl bg-[#fffefb] border border-[#e0e5dd]">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f4160] block mb-2">
                Send a Message
              </span>
              <h2 className="sr-display text-2xl mb-6 text-[#183f3d]">
                Ask our clinical coordinator
              </h2>

              {success ? (
                <div className="p-8 rounded-xl bg-[#faf8f3] border border-[#cbd7c6] text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#e8eee5] text-[#183f3d] flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h3 className="font-serif text-xl text-[#183f3d]">Message Received</h3>
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
                    <div className="p-3.5 rounded-lg bg-[#f9e9ec] border border-[#f0c2cd] text-[#8f4160] text-xs font-semibold flex items-center gap-2">
                      <AlertCircle size={15} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="sr-label">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Reddy"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="sr-input"
                      />
                    </div>
                    <div>
                      <label className="sr-label">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 96667 81779"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="sr-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="sr-label">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="e.g. ramesh@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="sr-input"
                      />
                    </div>
                    <div>
                      <label className="sr-label">Area of Interest</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="sr-select"
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
                    <label className="sr-label">Your Message or Question *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please let us know your requirements or medical queries..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="sr-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="sr-button w-full sm:w-auto"
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
            <div className="p-8 rounded-2xl bg-[#fffefb] border border-[#e0e5dd] space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8f4160]">
                <MapPin size={16} />
                Facility Location
              </div>

              <div>
                <h3 className="font-serif text-xl text-[#183f3d] mb-2">
                  Sreemantha Hospital, Khammam
                </h3>
                <p className="sr-copy text-xs leading-relaxed">
                  {address}
                </p>
                <p className="text-[11px] text-[#596966] mt-2">
                  Landmark: Beside Priyadarshini Degree College, Nehru Nagar.
                </p>
              </div>

              {/* Map embed / link */}
              <div className="rounded-xl overflow-hidden border border-[#e0e5dd] h-56 bg-[#e8eee5] relative flex items-center justify-center">
                <iframe
                  title="Sreemantha Hospital Khammam Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3809.5262744781446!2d80.1487661!3d17.2415177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3459c3bf79a059%3A0xe6bf446cf055c5df!2sSreemantha%20Hospital!5e0!3m2!1sen!2sin!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Sreemantha+Hospital+Khammam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sr-button sr-button--outline text-xs w-full justify-center"
                >
                  <MapPin size={14} />
                  Open in Google Maps
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
