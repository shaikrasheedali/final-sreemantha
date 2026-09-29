import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar, Clock, CheckCircle2, Phone, ShieldCheck,
  AlertCircle, ArrowRight, UserCheck, Stethoscope
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { api } from '../utils/api';
import { Doctor } from '../types';

export const BookAppointmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedDoctor = searchParams.get('doctor') || '';

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: 'Fertility & Reproductive Medicine',
    doctor: preselectedDoctor,
    preferred_date: '',
    preferred_time: 'Morning (10:00 AM - 01:00 PM)',
    message: '',
    consent: false
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
    if (!formData.name || !formData.phone) {
      setError('Please provide your name and phone number.');
      return;
    }
    if (!formData.consent) {
      setError('Please agree to allow Sreemantha Hospital staff to contact you regarding this appointment.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.post('/appointments', formData);
      setSuccess(true);
    } catch (err: any) {
      console.error('Appointment booking error:', err);
      setError(err?.message || 'Failed to submit appointment request. Please call our hospital directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Book Appointment' }]} />

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow mb-2">Priority Consultation Booking</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073d59] font-heading">
            Schedule an OPD Consultation
          </h1>
          <p className="text-sm text-[#637371] mt-2 leading-relaxed">
            Fill in your preferred date and department. Our patient care coordinators will call you within 30 minutes to confirm your slot.
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-100 shadow-xl text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Request Received
            </span>
            <h2 className="text-2xl font-bold text-slate-900 font-heading mt-1 mb-3">
              Thank You, {formData.name}!
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Your appointment request for <strong>{formData.department}</strong> has been logged. Our hospital reception will contact you on <strong>{formData.phone}</strong> to confirm your exact token number and consultation time.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 mb-8 space-y-1">
              <p><strong>Hospital Address:</strong> Beside Priyadarshini Degree College, Nehru Nagar, Khammam</p>
              <p><strong>Emergency / Direct Line:</strong> +91 96667 81779</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/"
                className="px-6 py-2.5 rounded-full bg-[#006c93] hover:bg-[#073d59] text-white text-xs font-bold transition-all"
              >
                Return to Homepage
              </Link>
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
                    preferred_time: 'Morning (10:00 AM - 01:00 PM)',
                    message: '',
                    consent: false
                  });
                }}
                className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md">
              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#006c93] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#006c93] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#006c93] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Preferred Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#006c93] focus:outline-none bg-white"
                    >
                      <option value="Fertility & Reproductive Medicine">Fertility & Reproductive Medicine</option>
                      <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                      <option value="Pediatrics & Neonatal Care (NICU)">Pediatrics & Neonatal Care (NICU)</option>
                      <option value="Fetal Medicine & High-Risk Pregnancy">Fetal Medicine & High-Risk Pregnancy</option>
                      <option value="General Health / Consultation">General Health / Consultation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Specific Doctor (Optional)
                    </label>
                    <select
                      value={formData.doctor}
                      onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#006c93] focus:outline-none bg-white"
                    >
                      <option value="">Any Available Specialist</option>
                      {doctors.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} ({d.specialty})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferred_date}
                      onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#006c93] focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Preferred Time Window
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Morning (10:00 AM - 01:00 PM)', 'Evening (05:00 PM - 08:30 PM)'].map((t) => (
                      <label
                        key={t}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                          formData.preferred_time === t
                            ? 'bg-[#006c93]/10 border-[#006c93] text-[#073d59]'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="timeWindow"
                          checked={formData.preferred_time === t}
                          onChange={() => setFormData({ ...formData, preferred_time: t })}
                          className="accent-[#006c93]"
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Reason for Visit / Symptoms (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your medical query or symptoms to help us prepare..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#006c93] focus:outline-none"
                  />
                </div>

                {/* Consent */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#006c93] focus:ring-[#006c93]"
                  />
                  <label htmlFor="consent" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                    I authorize Sreemantha Hospital clinical coordinators to contact me via phone or WhatsApp regarding this appointment enquiry.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#fa7830] hover:bg-[#e06622] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? 'Submitting Enquiry...' : 'Confirm Appointment Request'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#073d59] text-white p-6 sm:p-8 rounded-3xl shadow-xl">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-2">
                  24/7 Clinical Helplines
                </span>
                <h3 className="text-lg font-bold font-heading mb-2">Urgent Consultation?</h3>
                <p className="text-slate-200 text-xs leading-relaxed mb-6">
                  For active labor, high fever in infants, or acute obstetric distress, please proceed directly to our emergency casualty or call immediately.
                </p>

                <div className="space-y-3">
                  <a
                    href="tel:+919666781779"
                    className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-xs font-bold"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" /> +91 96667 81779
                  </a>
                  <a
                    href="https://wa.me/919666781779?text=Hello%20Sreemantha%20Hospital,%20I%20need%20urgent%20appointment%20assistance."
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors text-xs font-bold"
                  >
                    <CheckCircle2 className="w-4 h-4" /> WhatsApp Helpline
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#006c93]" /> What to Bring
                </h4>
                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
                  <li>Previous ultrasound reports and semen analysis (for fertility consultations)</li>
                  <li>Maternal health record and prescription files (for antenatal visits)</li>
                  <li>Baby's immunization / birth record card (for pediatric check-ups)</li>
                  <li>Government photo ID and Insurance policy card (for cashless processing)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
