import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Phone, ArrowRight, ShieldCheck, Heart, Award,
  Sparkles, CheckCircle, Users, Activity, Clock
} from 'lucide-react';
import { TrustBar } from '../components/TrustBar';
import { SlidingInsuranceStrip } from '../components/SlidingInsuranceStrip';
import { useSettings } from '../context/SettingsContext';
import { Facility, Specialty, Treatment, Doctor, Insight } from '../types';
import { api } from '../utils/api';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const info = settings.hospital_info || {};

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [specRes, treatRes, docRes, facRes, insRes] = await Promise.all([
          api.get<{ specialties: Specialty[] }>('/specialties?limit=4'),
          api.get<{ treatments: Treatment[] }>('/treatments?featured=true'),
          api.get<{ doctors: Doctor[] }>('/doctors?featured=true'),
          api.get<{ facilities: Facility[] }>('/facilities?limit=4'),
          api.get<{ insights: Insight[] }>('/insights?limit=3'),
        ]);

        if (specRes.specialties) setSpecialties(specRes.specialties.slice(0, 4));
        if (treatRes.treatments) setTreatments(treatRes.treatments.slice(0, 6));
        if (docRes.doctors) setDoctors(docRes.doctors.slice(0, 4));
        if (facRes.facilities) setFacilities(facRes.facilities.slice(0, 4));
        if (insRes.insights) setInsights(insRes.insights.slice(0, 3));
      } catch (err) {
        console.warn('Failed to load homepage collection previews:', err);
      }
    }
    loadData();
  }, []);

  const phone = info.phone || '+91 96667 81779';

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-gradient-to-br from-[#effaff] via-white to-[#fdf1f8] overflow-hidden pt-12 pb-24">
        {/* Decorative background shapes */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#006c93]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#bc1169]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <span className="eyebrow mb-4">
                Sreemantha Hospital • Khammam
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#073d59] leading-[1.12] mb-5 tracking-tight font-heading">
                Compassionate Care. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bc1169] to-[#006c93]">
                  Advanced Medicine.
                </span>{' '}
                <br />
                A Healthier Tomorrow.
              </h1>

              <p className="text-base sm:text-lg text-[#637371] leading-relaxed max-w-2xl mb-8">
                {info.subtitle ||
                  'Specialized fertility solutions, world-class IVF technology, compassionate maternity care, and dedicated neonatal & pediatric intensive care in Khammam.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link
                  to="/book-appointment"
                  className="btn-primary px-7 py-3.5 rounded-full text-base font-bold flex items-center gap-2.5 shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Consultation</span>
                </Link>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="btn-outline px-6 py-3.5 rounded-full text-base font-semibold flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#006c93]" />
                  <span>Call Hospital</span>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 text-xs text-[#073d59] font-semibold flex-wrap pt-2 border-t border-slate-200/80 w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>NABH Standard Guidelines</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#006c93]" />
                  <span>100% Cashless TPA Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#bc1169]" />
                  <span>24/7 Emergency & Level-III NICU</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80"
                    alt="Sreemantha Hospital Maternity and Pediatric Care"
                    className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="p-6 bg-gradient-to-t from-white via-white to-white/90">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#bc1169]">
                        Center of Clinical Excellence
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Verified 98% Success
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#073d59] font-heading">
                      Bringing the Joy of Parenthood to Your Life
                    </h3>
                    <p className="text-xs text-[#637371] mt-1">
                      Priyadarshini Degree College Road, Nehru Nagar, Khammam.
                    </p>
                  </div>
                </div>

                {/* Floating Stat Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#bc1169]/10 flex items-center justify-center text-[#bc1169] shrink-0">
                    <Heart className="w-6 h-6 fill-[#bc1169]" />
                  </div>
                  <div>
                    <span className="text-xl font-extrabold text-[#073d59] block font-heading leading-tight">
                      15,000+
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Happy Parents & Newborns
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar */}
      <TrustBar />

      {/* 3. Sliding Strip of Supported Insurance Companies */}
      <SlidingInsuranceStrip />

      {/* 4. About Hospital Intro Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80"
                  alt="Doctor with newborn baby at Sreemantha Khammam"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#073d59] text-white p-5 rounded-2xl shadow-xl max-w-xs hidden sm:block">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                    Khammam's Benchmark
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Comprehensive fertility & neonatal ICU under one roof.
                </p>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7">
              <span className="eyebrow mb-3">About Sreemantha</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#073d59] mb-5 font-heading">
                Dedicated to Mothers, New Lives, and Growing Families
              </h2>
              <p className="text-sm sm:text-base text-[#637371] leading-relaxed mb-4">
                Sreemantha Hospital in Khammam is a premier healthcare institution specializing in reproductive medicine, fertility solutions (IVF, ICSI, IUI), comprehensive obstetric care, and advanced neonatology.
              </p>
              <p className="text-sm text-[#637371] leading-relaxed mb-6">
                Our cleanroom embryology laboratory, modular operation theatres, and Level-III Neonatal Intensive Care Unit (NICU) ensure world-class outcomes with warmth, dignity, and clinical excellence.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-[#f1f7fc] border border-[#bfeaff]">
                  <h4 className="text-lg font-bold text-[#073d59] font-heading">Level-III NICU</h4>
                  <p className="text-xs text-[#637371] mt-1">24/7 dedicated neonatologists and life-saving baby warmers.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#fdf1f8] border border-pink-200">
                  <h4 className="text-lg font-bold text-[#bc1169] font-heading">Cleanroom IVF Lab</h4>
                  <p className="text-xs text-[#637371] mt-1">Class-1000 air filtration for optimal embryo development.</p>
                </div>
              </div>

              <Link
                to="/about"
                className="btn-teal px-6 py-3 rounded-full text-sm font-bold inline-flex items-center gap-2"
              >
                <span>Read Hospital Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Specialties Showcase */}
      <section className="py-20 bg-[#f8fafc] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="eyebrow mb-2">Our Medical Specialties</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#073d59] font-heading">
                Specialized Clinical Departments
              </h2>
            </div>
            <Link
              to="/specialties"
              className="text-sm font-bold text-[#006c93] hover:text-[#bc1169] flex items-center gap-1 transition mt-2 sm:mt-0"
            >
              <span>View All Specialties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialties.map((spec) => (
              <Link
                key={spec.id}
                to={`/specialties/${spec.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-slate-200 flex flex-col group"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={spec.image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80'}
                    alt={spec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white/90 text-[#073d59] shadow-sm">
                    {spec.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#073d59] group-hover:text-[#bc1169] transition font-heading">
                      {spec.title}
                    </h3>
                    <p className="text-xs text-[#637371] line-clamp-3 mt-2 leading-relaxed">
                      {spec.short_description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#006c93]">
                    <span>Explore Department</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Treatments & Clinical Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="eyebrow mb-2">Advanced Medical Care</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#073d59] font-heading">
                Key Treatments & Procedures
              </h2>
            </div>
            <Link
              to="/treatments"
              className="text-sm font-bold text-[#006c93] hover:text-[#bc1169] flex items-center gap-1 transition mt-2 sm:mt-0"
            >
              <span>Explore All Treatments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((treatment) => (
              <div
                key={treatment.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#bc1169] bg-[#bc1169]/10 px-2.5 py-0.5 rounded-full">
                      {treatment.category}
                    </span>
                    {treatment.success_rate && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {treatment.success_rate} Success
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#073d59] group-hover:text-[#006c93] transition font-heading">
                    {treatment.title}
                  </h3>
                  <p className="text-xs text-[#637371] mt-2 line-clamp-3 leading-relaxed">
                    {treatment.short_description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Duration: {treatment.typical_duration || 'Consult Specialist'}
                  </span>
                  <Link
                    to={`/treatments/${treatment.slug}`}
                    className="text-xs font-bold text-[#006c93] hover:underline flex items-center gap-1"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Doctors Showcase */}
      <section className="py-20 bg-[#f1f7fc]/60 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="eyebrow mb-2">Our Clinical Leaders</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#073d59] font-heading">
                Meet Our Specialist Doctors
              </h2>
            </div>
            <Link
              to="/doctors"
              className="text-sm font-bold text-[#006c93] hover:text-[#bc1169] flex items-center gap-1 transition mt-2 sm:mt-0"
            >
              <span>View All Doctors</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-slate-200 flex flex-col group"
              >
                <div className="h-60 overflow-hidden bg-slate-100 relative">
                  <img
                    src={doc.photo_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#073d59] shadow-sm">
                    {doc.department}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#073d59] group-hover:text-[#006c93] transition font-heading">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#bc1169] mt-0.5">
                      {doc.designation}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {doc.qualifications}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-600">
                      {doc.experience_years}+ Yrs Exp
                    </span>
                    <Link
                      to={`/doctors/${doc.slug}`}
                      className="text-xs font-bold text-[#006c93] hover:underline"
                    >
                      Profile →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Facilities Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="eyebrow mb-2">Hospital Infrastructure</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#073d59] font-heading">
                State-of-the-Art Facilities
              </h2>
            </div>
            <Link
              to="/facilities"
              className="text-sm font-bold text-[#006c93] hover:text-[#bc1169] flex items-center gap-1 transition mt-2 sm:mt-0"
            >
              <span>All Facilities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac) => (
              <Link
                key={fac.id}
                to={`/facilities/${fac.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-md h-72 flex flex-col justify-end p-5 text-white"
              >
                <img
                  src={fac.image_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'}
                  alt={fac.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="relative z-10">
                  <h3 className="text-base font-bold font-heading mb-1 text-white group-hover:text-cyan-300 transition">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    {fac.short_description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Latest Health Insights */}
      <section className="py-20 bg-[#f8fafc] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="eyebrow mb-2">Patient Education</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#073d59] font-heading">
                Health Insights & Articles
              </h2>
            </div>
            <Link
              to="/insights"
              className="text-sm font-bold text-[#006c93] hover:text-[#bc1169] flex items-center gap-1 transition mt-2 sm:mt-0"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((article) => (
              <Link
                key={article.id}
                to={`/insights/${article.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 border border-slate-200 flex flex-col group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#05a5ea] uppercase tracking-wider block mb-1">
                      {article.category}
                    </span>
                    <h3 className="text-base font-bold text-[#073d59] group-hover:text-[#bc1169] transition font-heading">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#637371] mt-2 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{article.read_time}</span>
                    <span className="font-bold text-[#006c93] group-hover:translate-x-1 transition-transform">Read Article →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Direct Appointment Booking Banner */}
      <section className="py-16 bg-gradient-to-r from-[#073d59] via-[#006c93] to-[#bc1169] text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 font-heading">
            Need Expert Care or Fertility Guidance?
          </h2>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Our experienced team of gynecologists, embryologists, obstetricians, and pediatricians in Khammam are available 24/7 to support you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/book-appointment"
              className="bg-white text-[#073d59] hover:bg-slate-100 px-8 py-3.5 rounded-full font-bold text-sm shadow-xl transition hover:scale-105 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#bc1169]" />
              <span>Book Doctor Appointment</span>
            </Link>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="border border-white/40 hover:bg-white/10 px-7 py-3.5 rounded-full font-semibold text-sm transition"
            >
              Direct Call: {phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
