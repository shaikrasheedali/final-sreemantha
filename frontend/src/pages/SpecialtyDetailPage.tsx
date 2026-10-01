import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Phone,
  Check,
  ArrowRight,
  ArrowUpRight,
  Stethoscope,
  ShieldCheck,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RichContentRenderer } from '../components/RichContentRenderer';
import { Specialty, Treatment } from '../types';
import { api } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export const SpecialtyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [specialty, setSpecialty] = useState<Specialty | null>(null);
  const [relatedTreatments, setRelatedTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const phone = settings.hospital_info?.phone || '+91 96667 81779';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await api.get<{ specialty: Specialty; relatedTreatments: Treatment[] }>(`/specialties/${slug}`);
        if (res.specialty) {
          setSpecialty(res.specialty);
          setRelatedTreatments(res.relatedTreatments || []);
        }
      } catch (err) {
        console.error('Failed to load specialty:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="sr-section text-center">
        <div className="sr-container">
          <p className="sr-copy">Loading specialty details...</p>
        </div>
      </div>
    );
  }

  if (!specialty) {
    return (
      <div className="sr-section text-center">
        <div className="sr-container">
          <h2 className="sr-display text-2xl mb-4">Specialty Not Found</h2>
          <Link to="/specialties" className="sr-button sr-button--outline text-xs">
            Return to all specialties
          </Link>
        </div>
      </div>
    );
  }

  const conditionsList: string[] = Array.isArray(specialty.conditions)
    ? specialty.conditions
    : typeof specialty.conditions === 'string'
    ? specialty.conditions.split(',').map((c) => c.trim()).filter(Boolean)
    : [];

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container">
        <Breadcrumbs
          items={[
            { label: 'Specialties', path: '/specialties' },
            { label: specialty.title },
          ]}
        />

        {/* Hero Banner */}
        <div className="mb-14">
          <span className="sr-kicker">
            {specialty.category || 'Clinical Specialty'} · Sreemantha Hospital
          </span>
          <h1 className="sr-display sr-heading mt-3 mb-6">
            {specialty.title}
          </h1>
          <p className="sr-copy max-w-3xl text-lg leading-relaxed">
            {specialty.short_description || specialty.overview}
          </p>
        </div>

        {/* Media Banner */}
        {specialty.image_url && (
          <div className="sr-media rounded-2xl h-[360px] sm:h-[450px] mb-16 overflow-hidden">
            <img src={specialty.image_url} alt={specialty.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview / Body Content */}
            <div className="p-8 sm:p-10 rounded-xl bg-white border border-[rgba(22,55,76,0.12)]">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-3">
                Clinical Overview
              </span>
              <h2 className="sr-display text-2xl mb-6 text-[var(--ink)]">
                Care philosophy &amp; clinical approach
              </h2>
              {specialty.content ? (
                <div className="sr-copy space-y-4">
                  <RichContentRenderer content={specialty.content} />
                </div>
              ) : (
                <p className="sr-copy leading-relaxed">
                  {specialty.overview ||
                    'Our dedicated department brings together specialist physicians, state-of-the-art diagnostic imaging, and compassionate nursing care to ensure you receive clear answers and personalized clinical treatment.'}
                </p>
              )}
            </div>

            {/* Conditions Treated */}
            {conditionsList.length > 0 && (
              <div className="p-8 sm:p-10 rounded-xl bg-white border border-[rgba(22,55,76,0.12)]">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-3">
                  Clinical Scope
                </span>
                <h3 className="sr-display text-2xl mb-6 text-[var(--ink)]">
                  Conditions &amp; indications addressed
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {conditionsList.map((cond, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-[var(--ink)] font-medium">
                      <div className="w-5 h-5 rounded-full bg-[var(--mint)] flex items-center justify-center text-[var(--ink)] shrink-0">
                        <Check size={12} />
                      </div>
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Treatments / Procedures */}
            {relatedTreatments.length > 0 && (
              <div>
                <div className="sr-heading-row mb-6">
                  <div>
                    <span className="sr-kicker">Comprehensive Options</span>
                    <h3 className="sr-display text-2xl mt-1 text-[var(--ink)]">
                      Associated treatments &amp; procedures
                    </h3>
                  </div>
                  <Link to="/treatments" className="sr-text-link">
                    All treatments
                    <ArrowUpRight size={15} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {relatedTreatments.map((t, idx) => (
                    <Link
                      key={t.id}
                      to={`/treatments/${t.slug}`}
                      className="p-6 rounded-xl bg-white border border-[rgba(22,55,76,0.12)] hover:border-[var(--teal)] hover:shadow-md transition flex flex-col justify-between text-decoration-none text-inherit group"
                    >
                      <div>
                        <span className="font-serif text-xl text-[#8a9b90] block mb-2">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="text-base font-semibold text-[var(--ink)] group-hover:text-[var(--coral)] transition mb-2">
                          {t.title}
                        </h4>
                        <p className="sr-copy text-xs line-clamp-2 mb-4">
                          {t.short_description || t.overview}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-[var(--ink)] flex items-center gap-1 mt-auto">
                        Understand options <ArrowUpRight size={13} />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar CTA & Doctor Booking */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-8 rounded-xl bg-[var(--deep)] text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--lime)] block mb-2">
                Specialist Consultation
              </span>
              <h3 className="font-serif text-2xl text-white mb-3">
                Discuss your care with our doctors
              </h3>
              <p className="text-xs text-[var(--mint)] leading-relaxed mb-6">
                Receive personalized guidance, clinical evaluation, and an open conversation about the best next steps.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to={`/book-appointment?department=${encodeURIComponent(specialty.title)}`}
                  className="sr-button sr-button--light text-xs w-full justify-center"
                >
                  <Calendar size={15} />
                  Book appointment
                  <ArrowUpRight size={14} />
                </Link>
                <a
                  href={phoneHref}
                  className="sr-button sr-button--outline text-xs w-full justify-center border-white/30 text-white hover:bg-white/10"
                >
                  <Phone size={14} />
                  Call: {phone}
                </a>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[var(--mint)] border border-[rgba(22,55,76,0.12)]">
              <div className="flex items-center gap-2 text-[var(--ink)] text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck size={16} className="text-[var(--coral)]" />
                NABH Standards
              </div>
              <p className="sr-copy text-xs leading-relaxed m-0">
                All consultations and protocols in our {specialty.title} division follow strict quality benchmarks and sterile hygiene regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
