import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  GraduationCap, Award, Globe, Clock, Calendar, CheckCircle2,
  ShieldAlert, ArrowLeft, Stethoscope, Phone, Mail, Building
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RichContentRenderer } from '../components/RichContentRenderer';
import { Doctor } from '../types';
import { api } from '../utils/api';

export const DoctorDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDoctor() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await api.get<{ doctor: Doctor }>(`/doctors/${slug}`);
        if (res.doctor) {
          setDoctor(res.doctor);
        } else {
          setError('Doctor profile not found.');
        }
      } catch (err) {
        console.error('Failed to load doctor profile:', err);
        setError('Unable to load doctor profile at this moment.');
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#006c93] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-500 font-medium">Loading clinician profile...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Doctor Profile Not Found</h2>
          <p className="text-sm text-slate-600 mt-2 mb-6">
            The requested physician profile could not be retrieved.
          </p>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#006c93] text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Medical Team
          </Link>
        </div>
      </div>
    );
  }

  // Parse arrays if stringified
  const qualifications: string[] = Array.isArray(doctor.qualifications)
    ? (doctor.qualifications as string[])
    : typeof doctor.qualifications === 'string'
    ? (doctor.qualifications as string).split(',').map((q: string) => q.trim())
    : [];

  const languages: string[] = Array.isArray(doctor.languages)
    ? (doctor.languages as string[])
    : typeof doctor.languages === 'string'
    ? (doctor.languages as string).split(',').map((l: string) => l.trim())
    : ['English', 'Telugu', 'Hindi'];

  const education: any[] = Array.isArray(doctor.education)
    ? doctor.education
    : typeof doctor.education === 'string'
    ? JSON.parse((doctor.education as string) || '[]')
    : [];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Doctors', path: '/doctors' },
            { label: doctor.name }
          ]}
        />

        {/* Doctor Header Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md mb-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="relative shrink-0">
            <img
              src={doctor.profile_photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'}
              alt={doctor.name}
              className="w-48 h-56 sm:w-56 sm:h-64 rounded-2xl object-cover object-top border-4 border-slate-50 shadow-md"
            />
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#006c93] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase whitespace-nowrap shadow-sm">
              {doctor.specialty}
            </span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Consultant
              </span>
              {doctor.experience && (
                <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> {doctor.experience}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#073d59] font-heading">
              {doctor.name}
            </h1>
            <p className="text-sm font-semibold text-[#006c93] mt-1">
              {doctor.designation || 'Senior Consultant'}
            </p>

            {/* Qualifications */}
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-1.5 text-xs text-slate-600">
              <GraduationCap className="w-4 h-4 text-slate-400 mr-1" />
              {qualifications.map((q, idx) => (
                <span key={idx} className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-medium">
                  {q}
                </span>
              ))}
            </div>

            {/* Languages */}
            <div className="mt-4 flex items-center justify-center md:justify-start gap-2 text-xs text-slate-500">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Languages spoken: </span>
              <span className="font-semibold text-slate-700">{languages.join(', ')}</span>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link
                to={`/book-appointment?doctor=${encodeURIComponent(doctor.name)}`}
                className="px-6 py-2.5 rounded-full bg-[#fa7830] hover:bg-[#e06622] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Book Appointment
              </Link>
              <a
                href="tel:+919666781779"
                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-600" /> Call for OPD Timing
              </a>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            {/* Bio / Overview */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-bold text-[#073d59] font-heading mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#006c93]" /> Professional Overview
              </h2>
              <RichContentRenderer content={doctor.bio || doctor.short_bio || '<p>Detailed profile information coming soon.</p>'} />
            </div>

            {/* Education Timeline (if present) */}
            {education.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                <h2 className="text-xl font-bold text-[#073d59] font-heading mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#006c93]" /> Education & Fellowships
                </h2>
                <div className="space-y-4">
                  {education.map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-[#006c93]/10 text-[#006c93] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.degree || item.title}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">{item.institution || item.college}</p>
                        {item.year && <span className="text-[11px] text-slate-400 font-medium">Year: {item.year}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: OPD / Schedule */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#006c93]" /> Consultation Schedule
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Days</span>
                  <span className="font-bold text-slate-900">Monday – Saturday</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Morning OPD</span>
                  <span className="font-bold text-slate-900">10:00 AM – 02:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Evening OPD</span>
                  <span className="font-bold text-slate-900">05:00 PM – 08:30 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Sunday</span>
                  <span className="font-bold text-rose-600">On Call / Emergency</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Location</span>
                  <span className="font-bold text-slate-900">Sreemantha Hospital, Khammam</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  to={`/book-appointment?doctor=${encodeURIComponent(doctor.name)}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#006c93] hover:bg-[#073d59] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  <Calendar className="w-4 h-4" /> Book Consultation
                </Link>
              </div>
            </div>

            <div className="bg-[#f0f9ff] border border-[#bae6fd] p-6 rounded-3xl">
              <h4 className="text-xs font-bold text-[#073d59] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#006c93]" /> Hospital OPD Desk
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Walk-ins are accommodated based on emergency triage. We strongly recommend prior booking to minimize waiting times.
              </p>
              <div className="mt-3 text-xs font-semibold text-[#006c93]">
                Front Desk: +91 96667 81779
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
