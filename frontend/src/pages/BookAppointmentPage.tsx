import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Check,
  Phone,
  AlertCircle,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { api } from '../utils/api';
import { Doctor } from '../types';
import { useSettings } from '../context/SettingsContext';

const TODAY_ISO = new Date().toISOString().split('T')[0];

export const BookAppointmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedDoctor = searchParams.get('doctor') || '';
  const preselectedDept = searchParams.get('department') || '';
  const preselectedTreatment = searchParams.get('treatment') || '';

  const { settings } = useSettings();
  const phone = settings.hospital_info?.phone || '+91 96667 81779';
  const emergency = settings.hospital_info?.emergency_hotline || '+91 88007 73362';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: preselectedDept || 'Fertility & Reproductive Medicine',
    doctor: preselectedDoctor,
    preferred_date: '',
    preferred_time: 'Morning (09:30 AM – 01:00 PM)',
    message: preselectedTreatment ? `Inquiring about ${preselectedTreatment}` : '',
    consent: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await api.get<{ doctors: Doctor[] }>('/doctors');
        if (res.doctors) setDoctors(res.doctors);
      } catch (err) {
        console.error('Failed to load doctors list:', err);
      }
    }
    loadDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide your name and contact phone number.');
      return;
    }
    if (!formData.consent) {
      setError('Please confirm your consent for our hospital team to contact you.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.post('/appointments', formData);
      setSuccess(true);
    } catch (err: any) {
      console.error('Appointment booking error:', err);
      setError(err.message || 'Unable to register your appointment request. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container">
        <Breadcrumbs items={[{ label: 'Book a Consultation' }]} />

        {/* Heading */}
        <div className="sr-heading-row mb-12">
          <div>
            <span className="sr-kicker">Schedule Your Visit</span>
            <h1 className="sr-display sr-heading mt-2">
              Schedule an OPD Consultation<br />
              <em>with our medical specialists.</em>
            </h1>
          </div>
          <p className="sr-copy max-w-md">
            Whether you are taking your very first step in fertility care or scheduling maternal or pediatric follow-up, our hospital team is here to coordinate your appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Form / Success Column */}
          <div className="lg:col-span-8">
            {success ? (
              <div className="p-10 sm:p-14 rounded-2xl bg-white border border-[rgba(22,55,76,0.12)] text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[var(--mint)] text-[var(--ink)] flex items-center justify-center mx-auto border border-[rgba(22,55,76,0.12)]">
                  <Check size={32} />
                </div>
                <div>
                  <span className="sr-kicker">Request Received</span>
                  <h2 className="sr-display text-3xl mt-2 text-[var(--ink)]">
                    Thank You, {formData.name}!
                  </h2>
                  <p className="sr-copy max-w-lg mx-auto mt-3">
                    Your consultation request has been registered with the clinical reception at Sreemantha Hospital, Khammam. Our team will call you at <strong className="text-[var(--ink)]">{formData.phone}</strong> shortly to confirm your exact time slot and preparation guidelines.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] max-w-md mx-auto text-left text-xs space-y-2 text-[#5a7d92]">
                  <div className="flex justify-between">
                    <span>Department:</span>
                    <strong className="text-[var(--ink)]">{formData.department}</strong>
                  </div>
                  {formData.doctor && (
                    <div className="flex justify-between">
                      <span>Doctor:</span>
                      <strong className="text-[var(--ink)]">{formData.doctor}</strong>
                    </div>
                  )}
                  {formData.preferred_date && (
                    <div className="flex justify-between">
                      <span>Requested Date:</span>
                      <strong className="text-[var(--ink)]">{formData.preferred_date}</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Time Preference:</span>
                    <strong className="text-[var(--ink)]">{formData.preferred_time}</strong>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        department: 'Fertility & Reproductive Medicine',
                        doctor: '',
                        preferred_date: '',
                        preferred_time: 'Morning (09:30 AM – 01:00 PM)',
                        message: '',
                        consent: true,
                      });
                    }}
                    className="sr-button sr-button--outline text-xs"
                  >
                    Book another consultation
                  </button>
                  <Link to="/" className="sr-button text-xs">
                    Return to home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 sm:p-12 rounded-2xl bg-white border border-[rgba(22,55,76,0.12)] space-y-8">
                {error && (
                  <div className="p-4 rounded-lg bg-[#f9e9ec] border border-[#f0c2cd] text-[var(--coral)] text-xs font-semibold flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-1">
                    Step 1 · Patient Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                    <div>
                      <label htmlFor="appointment-name" className="sr-label">Full Name *</label>
                      <input
                        id="appointment-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="sr-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="appointment-phone" className="sr-label">Mobile Phone Number *</label>
                      <input
                        id="appointment-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="sr-input"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="appointment-email" className="sr-label">Email Address (Optional)</label>
                    <input
                      id="appointment-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="sr-input"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-[rgba(22,55,76,0.12)]">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-1">
                    Step 2 · Care Preference
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                    <div>
                      <label htmlFor="appointment-department" className="sr-label">Clinical Department</label>
                      <select
                        id="appointment-department"
                        name="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="sr-select"
                      >
                        <option value="Fertility & Reproductive Medicine">Fertility &amp; Reproductive Medicine (IVF / IUI)</option>
                        <option value="Obstetrics & High-Risk Maternity">Obstetrics &amp; High-Risk Maternity</option>
                        <option value="Pediatrics & Neonatal Care (NICU)">Pediatrics &amp; Neonatal Care (NICU)</option>
                        <option value="Advanced Laparoscopic Gynecology">Advanced Laparoscopic Gynecology</option>
                        <option value="Fetal Medicine & Diagnostics">Fetal Medicine &amp; Ultrasound</option>
                        <option value="General Health Consultation">General Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="appointment-doctor" className="sr-label">Specific Specialist (Optional)</label>
                      <select
                        id="appointment-doctor"
                        name="doctor"
                        value={formData.doctor}
                        onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                        className="sr-select"
                      >
                        <option value="">Any Available Specialist</option>
                        {doctors.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name} ({d.designation?.split('&')[0] || d.department})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                    <div>
                      <label htmlFor="appointment-date" className="sr-label">Preferred Date</label>
                      <input
                        id="appointment-date"
                        name="preferred_date"
                        type="date"
                        value={formData.preferred_date}
                        min={TODAY_ISO}
                        onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                        className="sr-input"
                      />
                    </div>

                    <div>
                      <label htmlFor="appointment-time" className="sr-label">Preferred Time Slot</label>
                      <select
                        id="appointment-time"
                        name="preferred_time"
                        value={formData.preferred_time}
                        onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                        className="sr-select"
                      >
                        <option value="Morning (09:30 AM – 01:00 PM)">Morning: 09:30 AM – 01:00 PM</option>
                        <option value="Afternoon (02:00 PM – 05:00 PM)">Afternoon: 02:00 PM – 05:00 PM</option>
                        <option value="Evening (05:00 PM – 08:00 PM)">Evening: 05:00 PM – 08:00 PM</option>
                        <option value="Flexible / First Available">Flexible / First Available</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[rgba(22,55,76,0.12)]">
                  <label htmlFor="appointment-message" className="sr-label">Notes or Previous History (Optional)</label>
                  <textarea
                    id="appointment-message"
                    name="message"
                    rows={3}
                    placeholder="Briefly describe your symptoms, medical history, or consultation questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="sr-textarea"
                  />

                  <div className="mt-5 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 accent-[var(--coral)] cursor-pointer"
                    />
                    <label htmlFor="consent" className="text-xs text-[#5a7d92] leading-relaxed cursor-pointer">
                      I agree to allow Sreemantha Hospital clinical staff to contact me via phone or WhatsApp to coordinate this consultation.
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <span className="text-xs text-[#5a7d92] hidden sm:inline">
                    No advance payment required for request
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="sr-button"
                  >
                    <Calendar size={16} />
                    {loading ? 'Submitting request...' : 'Confirm Appointment Request'}
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Sidebar Information */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-xl bg-[var(--deep)] text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--lime)] block mb-2">
                Need Immediate Help?
              </span>
              <h3 className="font-serif text-2xl text-white mb-2">
                Call our reception directly
              </h3>
              <p className="text-xs text-[var(--mint)] leading-relaxed mb-6">
                Our front desk coordinators can assist you immediately with today’s OPD availability and emergency care.
              </p>
              <div className="space-y-3">
                <a
                  href={phoneHref}
                  className="sr-button sr-button--light text-xs w-full justify-center"
                >
                  <Phone size={15} />
                  Call: {phone}
                </a>
                <a
                  href={`tel:${emergency.replace(/[^+\d]/g, '')}`}
                  className="sr-button sr-button--outline text-xs w-full justify-center border-white/30 text-white hover:bg-white/10"
                >
                  Emergency: {emergency}
                </a>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[rgba(22,55,76,0.12)] space-y-4">
              <h4 className="text-sm font-semibold text-[var(--ink)]">What to bring to your visit</h4>
              <ul className="space-y-2 text-xs text-[#5a7d92] list-none p-0 m-0">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[var(--coral)] shrink-0 mt-0.5" />
                  <span>Previous medical files, prescriptions, or surgery notes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[var(--coral)] shrink-0 mt-0.5" />
                  <span>Recent blood investigations and ultrasound scan films</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[var(--coral)] shrink-0 mt-0.5" />
                  <span>Government photo ID and insurance policy card if applicable</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-[var(--mint)] border border-[rgba(22,55,76,0.12)]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-2">
                <MapPin size={15} className="text-[var(--coral)]" />
                Hospital Location
              </div>
              <p className="sr-copy text-xs leading-relaxed m-0">
                Priyadarshini Degree College Road, Nehru Nagar, Khammam, Telangana 507001. Free patient parking available on site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
