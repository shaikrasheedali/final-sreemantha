import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Clock, ShieldAlert, CheckCircle2,
  ChevronRight, ArrowLeft, HeartHandshake, UserCheck, Stethoscope, HelpCircle
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RichContentRenderer } from '../components/RichContentRenderer';
import { Treatment, Doctor } from '../types';
import { api } from '../utils/api';

export const TreatmentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await api.get<{ treatment: Treatment; relatedDoctors?: Doctor[] }>(`/treatments/${slug}`);
        if (res.treatment) {
          setTreatment(res.treatment);
          if (res.relatedDoctors) {
            setDoctors(res.relatedDoctors);
          } else {
            // Load doctors by specialty or default
            const docRes = await api.get<{ doctors: Doctor[] }>('/doctors');
            if (docRes.doctors) setDoctors(docRes.doctors.slice(0, 3));
          }
        } else {
          setError('Treatment not found.');
        }
      } catch (err: any) {
        console.error('Failed to load treatment detail:', err);
        setError('Unable to load treatment details at this moment.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#006c93] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-500 font-medium">Loading clinical procedure details...</p>
        </div>
      </div>
    );
  }

  if (error || !treatment) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Treatment Not Found</h2>
          <p className="text-sm text-slate-600 mt-2 mb-6">
            The requested medical procedure or treatment guide could not be located.
          </p>
          <Link
            to="/treatments"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#006c93] text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Treatments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Treatments & Services', path: '/treatments' },
            { label: treatment.title }
          ]}
        />

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-xl bg-slate-900 text-white">
          <div className="h-80 sm:h-96 md:h-[420px] w-full relative">
            <img
              src={treatment.hero_media || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80'}
              alt={treatment.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12">
            <div className="max-w-3xl">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#006c93]/80 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase mb-3">
                {treatment.category || 'Specialized Procedure'}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
                {treatment.title}
              </h1>
              {treatment.short_description && (
                <p className="text-sm sm:text-base text-slate-200 mt-3 leading-relaxed">
                  {treatment.short_description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview / Clinical Explanation */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-bold text-[#073d59] font-heading mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#006c93]" /> Overview & Clinical Protocol
              </h2>
              <RichContentRenderer content={treatment.content} />
            </div>

            {/* How It Works Steps (if parsed or available) */}
            {treatment.how_it_works && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                <h2 className="text-xl font-bold text-[#073d59] font-heading mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> How It Works — Step-by-Step Procedure
                </h2>
                <RichContentRenderer
                  content={
                    Array.isArray(treatment.how_it_works)
                      ? treatment.how_it_works.join('<br/>')
                      : treatment.how_it_works || ''
                  }
                />
              </div>
            )}

            {/* Preparation & Recovery */}
            {(treatment.preparation || treatment.aftercare) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {treatment.preparation && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 font-heading mb-3 text-[#006c93] flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Preparation Protocol
                    </h3>
                    <RichContentRenderer content={treatment.preparation} />
                  </div>
                )}
                {treatment.aftercare && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 font-heading mb-3 text-emerald-700 flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4" /> Recovery & Aftercare
                    </h3>
                    <RichContentRenderer content={treatment.aftercare} />
                  </div>
                )}
              </div>
            )}

            {/* FAQs Accordion / Section */}
            {treatment.faqs && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                <h2 className="text-xl font-bold text-[#073d59] font-heading mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#006c93]" /> Frequently Asked Questions
                </h2>
                <RichContentRenderer content={treatment.faqs} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* At a Glance Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                At a Glance
              </h3>
              <dl className="space-y-3.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <dt className="text-slate-500 font-medium">Category</dt>
                  <dd className="text-slate-900 font-bold">{treatment.category || 'Clinical Care'}</dd>
                </div>
                {treatment.typical_duration && (
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <dt className="text-slate-500 font-medium">Typical Duration</dt>
                    <dd className="text-slate-900 font-bold">{treatment.typical_duration}</dd>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <dt className="text-slate-500 font-medium">Consultation</dt>
                  <dd className="text-emerald-700 font-bold">Required Prior to Admission</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <dt className="text-slate-500 font-medium">Admission Type</dt>
                  <dd className="text-slate-900 font-bold">Daycare / Inpatient</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-slate-500 font-medium">Emergency Availability</dt>
                  <dd className="text-emerald-600 font-bold">24/7 On-Call</dd>
                </div>
              </dl>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  to="/book-appointment"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#fa7830] hover:bg-[#e06622] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  <Calendar className="w-4 h-4" /> Book Consultation
                </Link>
              </div>
            </div>

            {/* Specialists for this Treatment */}
            {doctors.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#006c93]" /> Associated Specialists
                </h3>
                <div className="space-y-4">
                  {doctors.map((doc) => (
                    <Link
                      key={doc.id}
                      to={`/doctors/${doc.slug}`}
                      className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group"
                    >
                      <img
                        src={doc.profile_photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'}
                        alt={doc.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#006c93] truncate">
                          {doc.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">{doc.designation || 'Senior Consultant'}</p>
                        <p className="text-[10px] text-[#006c93] font-semibold">{doc.specialty}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#006c93] shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Patient Support card */}
            <div className="bg-gradient-to-br from-[#073d59] to-[#006c93] p-6 rounded-3xl text-white shadow-lg">
              <h4 className="font-bold text-sm font-heading mb-2">Have questions about this procedure?</h4>
              <p className="text-slate-200 text-xs leading-relaxed mb-4">
                Our clinical support team is here to assist with treatment roadmaps, estimated stay, and insurance cashless pre-authorization.
              </p>
              <div className="space-y-2">
                <a
                  href="tel:+919666781779"
                  className="block text-center py-2.5 px-4 rounded-xl bg-white text-[#073d59] text-xs font-bold transition-all hover:bg-slate-100"
                >
                  Call +91 96667 81779
                </a>
                <a
                  href="https://wa.me/919666781779?text=Hello%20Sreemantha%20Hospital,%20I%20would%20like%20to%20know%20more%20about%20your%20treatments."
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                >
                  WhatsApp Inquiry
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
