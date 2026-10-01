import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Phone,
  ArrowRight,
  ArrowUpRight,
  Stethoscope,
  GraduationCap,
  Award,
  Globe,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RichContentRenderer } from '../components/RichContentRenderer';
import { Doctor } from '../types';
import { api } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export const DoctorDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const phone = settings.hospital_info?.phone || '+91 96667 81779';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;

  useEffect(() => {
    async function loadDoctor() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await api.get<{ doctor: Doctor }>(`/doctors/${slug}`);
        if (res.doctor) {
          setDoctor(res.doctor);
        }
      } catch (err) {
        console.error('Failed to load doctor profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [slug]);

  if (loading) {
    return (
      <div className="sr-section text-center">
        <div className="sr-container">
          <p className="sr-copy">Loading physician profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="sr-section text-center">
        <div className="sr-container">
          <h2 className="sr-display text-2xl mb-4">Doctor Profile Not Found</h2>
          <Link to="/doctors" className="sr-button sr-button--outline text-xs">
            Return to all doctors
          </Link>
        </div>
      </div>
    );
  }

  const qualificationsStr = Array.isArray(doctor.qualifications)
    ? doctor.qualifications.join(', ')
    : doctor.qualifications || '';

  const languagesList = Array.isArray(doctor.languages)
    ? doctor.languages
    : typeof doctor.languages === 'string'
    ? doctor.languages.split(',').map((l) => l.trim()).filter(Boolean)
    : ['Telugu', 'English', 'Hindi'];

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container">
        <Breadcrumbs
          items={[
            { label: 'Doctors', path: '/doctors' },
            { label: doctor.name },
          ]}
        />

        {/* Doctor Header Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Portrait Column */}
          <div className="lg:col-span-4">
            <div className="sr-card overflow-hidden sticky top-28">
              <div className="sr-media" style={{ height: 380 }}>
                {doctor.photo_url ? (
                  <img
                    src={doctor.photo_url}
                    alt={doctor.name}
                    style={{ objectPosition: 'center top' }}
                  />
                ) : (
                  <div className="sr-image-placeholder">
                    <Stethoscope size={48} />
                  </div>
                )}
              </div>

              <div className="p-6 bg-[#fffefb] space-y-4">
                <div>
                  <h1 className="text-xl font-medium text-[#183f3d] mb-1">{doctor.name}</h1>
                  <p className="text-xs text-[#8f4160] font-semibold">{doctor.designation}</p>
                  {doctor.department && (
                    <span className="inline-block mt-2 px-2.5 py-1 rounded bg-[#e8eee5] text-[#183f3d] text-[10px] font-semibold">
                      {doctor.department}
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-[#e0e5dd] space-y-2 text-xs text-[#596966]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8f4160] block mb-1">
                    Consultation Schedule
                  </span>
                  {doctor.experience_years && (
                    <div className="flex items-center justify-between">
                      <span>Experience:</span>
                      <strong className="text-[#183f3d]">{doctor.experience_years}+ Years</strong>
                    </div>
                  )}
                  {doctor.opd_timings && (
                    <div className="flex items-center justify-between">
                      <span>OPD Timings:</span>
                      <strong className="text-[#183f3d]">{doctor.opd_timings}</strong>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Consultation Languages:</span>
                    <strong className="text-[#183f3d]">{languagesList.join(', ')}</strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e0e5dd] flex flex-col gap-2.5">
                  <Link
                    to={`/book-appointment?doctor=${encodeURIComponent(doctor.name)}`}
                    className="sr-button text-xs w-full justify-center"
                  >
                    <Calendar size={15} />
                    Book Appointment
                    <ArrowUpRight size={14} />
                  </Link>
                  <a
                    href={phoneHref}
                    className="sr-button sr-button--outline text-xs w-full justify-center"
                  >
                    <Phone size={14} />
                    Call Hospital
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Biography & Approach */}
            <div className="p-8 sm:p-10 rounded-xl bg-[#fffefb] border border-[#e0e5dd]">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f4160] block mb-2">
                Professional Overview
              </span>
              <h2 className="sr-display text-2xl mb-6 text-[#183f3d]">
                Clinical experience &amp; patient philosophy
              </h2>
              {doctor.full_bio || doctor.bio || doctor.short_bio ? (
                <div className="sr-copy space-y-4">
                  <RichContentRenderer content={doctor.full_bio || doctor.bio || doctor.short_bio || ''} />
                </div>
              ) : (
                <p className="sr-copy leading-relaxed">
                  With over {doctor.experience_years || 12} years of dedicated patient care in Khammam, {doctor.name} combines rigorous scientific training with personal warmth and open communication for every family.
                </p>
              )}
            </div>

            {/* Qualifications & Medical Credentials */}
            {qualificationsStr && (
              <div className="p-8 sm:p-10 rounded-xl bg-[#fffefb] border border-[#e0e5dd]">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f4160] block mb-2">
                  Academic &amp; Clinical Credentials
                </span>
                <h3 className="sr-display text-2xl mb-5 text-[#183f3d]">
                  Qualifications &amp; Degrees
                </h3>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#faf8f3] border border-[#e0e5dd]">
                  <GraduationCap size={20} className="text-[#8f4160] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm text-[#183f3d] block">{qualificationsStr}</strong>
                    <span className="text-xs text-[#596966]">Medical Council Registered Specialist</span>
                  </div>
                </div>
              </div>
            )}

            {/* Clinical Commitment Card */}
            <div className="p-8 rounded-xl bg-[#e8eee5] border border-[#cbd7c6] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#183f3d] block mb-1">
                  At Sreemantha Hospital, Khammam
                </span>
                <h4 className="font-serif text-xl text-[#183f3d]">
                  Ready to discuss your medical questions?
                </h4>
                <p className="sr-copy text-xs mt-1 mb-0">
                  First consultations include a comprehensive history review and tailored guidance.
                </p>
              </div>
              <Link
                to={`/book-appointment?doctor=${encodeURIComponent(doctor.name)}`}
                className="sr-button shrink-0"
              >
                <Calendar size={15} />
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
