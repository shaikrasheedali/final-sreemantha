import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Check,
  Phone,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RichContentRenderer } from '../components/RichContentRenderer';
import { DetailMediaCarousel } from '../components/DetailMediaCarousel';
import { Treatment, Doctor } from '../types';
import { api } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export const TreatmentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const phone = settings.hospital_info?.phone || '+91 96667 81779';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await api.get<{ treatment: Treatment; relatedDoctors?: Doctor[] }>(`/treatments/${slug}`);
        if (res.treatment) {
          setTreatment(res.treatment);
          if (res.relatedDoctors && res.relatedDoctors.length > 0) {
            setDoctors(res.relatedDoctors);
          } else {
            const docRes = await api.get<{ doctors: Doctor[] }>('/doctors?featured=true');
            if (docRes.doctors) setDoctors(docRes.doctors.slice(0, 3));
          }
        }
      } catch (err: any) {
        console.error('Failed to load treatment detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="sr-section text-center">
        <div className="sr-container">
          <p className="sr-copy">Loading treatment details...</p>
        </div>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="sr-section text-center">
        <div className="sr-container">
          <h2 className="sr-display text-2xl mb-4">Treatment Not Found</h2>
          <Link to="/treatments" className="sr-button sr-button--outline text-xs">
            Return to all treatments
          </Link>
        </div>
      </div>
    );
  }

  const howItWorks: any[] = Array.isArray(treatment.how_it_works)
    ? treatment.how_it_works
    : typeof treatment.how_it_works === 'string'
    ? treatment.how_it_works.split('\n').map((s) => s.trim()).filter(Boolean)
    : [];

  const whoRequires: any[] = Array.isArray(treatment.who_requires)
    ? treatment.who_requires
    : typeof treatment.who_requires === 'string'
    ? treatment.who_requires.split('\n').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container">
        <Breadcrumbs
          items={[
            { label: 'Treatments', path: '/treatments' },
            { label: treatment.title },
          ]}
        />

        {/* Hero Header */}
        <div className="mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="sr-kicker">
              {treatment.category || 'Clinical Procedure'} · Sreemantha Hospital
            </span>
            {treatment.typical_duration && (
              <span className="sr-pill text-xs">
                <Clock size={12} className="text-[var(--coral)]" />
                Typical duration: {treatment.typical_duration}
              </span>
            )}
            {treatment.success_rate && (
              <span className="sr-pill text-xs font-semibold text-[var(--ink)]">
                <Sparkles size={12} className="text-[var(--coral)]" />
                Success benchmark: {treatment.success_rate}
              </span>
            )}
          </div>
          <h1 className="sr-display sr-heading mt-2 mb-6">
            {treatment.title}
          </h1>
          <p className="sr-copy max-w-3xl text-lg leading-relaxed">
            {treatment.short_description || treatment.overview}
          </p>
        </div>

        {/* At a Glance Summary Strip */}
        <div className="p-6 mb-12 rounded-xl bg-white border border-[rgba(22,55,76,0.12)] flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-1">
              At a Glance
            </span>
            <p className="text-xs text-[#5a7d92] m-0">
              Department: <strong className="text-[var(--ink)]">{treatment.category || 'Clinical Care'}</strong> · Duration: <strong className="text-[var(--ink)]">{treatment.typical_duration || 'Case dependent'}</strong>
            </p>
          </div>
          <Link
            to={`/book-appointment?treatment=${encodeURIComponent(treatment.title)}`}
            className="sr-button text-xs"
          >
            <Calendar size={14} />
            Book Consultation
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Media 4:3 Showcase / Carousel */}
        <DetailMediaCarousel
          media={treatment.image_url}
          title={treatment.title}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Main Clinical Information */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview / Content */}
            <div className="p-8 sm:p-10 rounded-xl bg-white border border-[rgba(22,55,76,0.12)]">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-3">
                Overview &amp; Clinical Protocol
              </span>
              <h2 className="sr-display text-2xl mb-6 text-[var(--ink)]">
                What to expect from this treatment
              </h2>
              {treatment.content ? (
                <div className="sr-copy space-y-4">
                  <RichContentRenderer content={treatment.content} />
                </div>
              ) : (
                <p className="sr-copy leading-relaxed">
                  {treatment.overview ||
                    'At Sreemantha Hospital, every medical procedure is carried out with clear clinical rationale, sterile conditions, and step-by-step patient guidance from our medical specialists.'}
                </p>
              )}
            </div>

            {/* How it works: Step-by-Step */}
            {howItWorks.length > 0 && (
              <div className="p-8 sm:p-10 rounded-xl bg-white border border-[rgba(22,55,76,0.12)]">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-3">
                  Clinical Protocol
                </span>
                <h3 className="sr-display text-2xl mb-6 text-[var(--ink)]">
                  Step-by-step pathway
                </h3>
                <ol className="space-y-4 list-none p-0 m-0">
                  {howItWorks.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span className="w-7 h-7 rounded-full bg-[var(--mint)] text-[var(--ink)] font-serif font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[rgba(22,55,76,0.12)]">
                        {idx + 1}
                      </span>
                      <div className="sr-copy text-sm leading-relaxed m-0 text-[var(--ink)]">
                        {typeof step === 'object' && step !== null ? (
                          <>
                            {step.title && <strong className="block text-[var(--ink)] font-semibold mb-0.5">{step.title}</strong>}
                            <span className="text-xs text-[#5a7d92]">{step.desc || step.description || step.text || ''}</span>
                          </>
                        ) : (
                          <span>{String(step)}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Who Requires this treatment */}
            {whoRequires.length > 0 && (
              <div className="p-8 sm:p-10 rounded-xl bg-white border border-[rgba(22,55,76,0.12)]">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-3">
                  Indications &amp; Eligibility
                </span>
                <h3 className="sr-display text-2xl mb-6 text-[var(--ink)]">
                  When is this procedure recommended?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {whoRequires.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[var(--ink)]">
                      <div className="w-5 h-5 rounded-full bg-[var(--mint)] flex items-center justify-center text-[var(--ink)] shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <span className="leading-relaxed font-medium">
                        {typeof item === 'object' && item !== null
                          ? item.title || item.name || item.text || JSON.stringify(item)
                          : String(item)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preparation & Aftercare */}
            {(treatment.preparation || treatment.aftercare) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {treatment.preparation && (
                  <div className="p-6 rounded-xl bg-white border border-[rgba(22,55,76,0.12)]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-2">
                      Before Your Visit
                    </span>
                    <h4 className="text-base font-semibold text-[var(--ink)] mb-3">Preparation Guidelines</h4>
                    <p className="sr-copy text-xs leading-relaxed">{treatment.preparation}</p>
                  </div>
                )}
                {treatment.aftercare && (
                  <div className="p-6 rounded-xl bg-white border border-[rgba(22,55,76,0.12)]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-2">
                      Following Treatment
                    </span>
                    <h4 className="text-base font-semibold text-[var(--ink)] mb-3">Recovery &amp; Aftercare</h4>
                    <p className="sr-copy text-xs leading-relaxed">{treatment.aftercare}</p>
                  </div>
                )}
              </div>
            )}

            {/* Related Specialists */}
            {doctors.length > 0 && (
              <div>
                <div className="sr-heading-row mb-6">
                  <div>
                    <span className="sr-kicker">Clinical Specialists</span>
                    <h3 className="sr-display text-2xl mt-1 text-[var(--ink)]">
                      Doctors who oversee this care
                    </h3>
                  </div>
                  <Link to="/doctors" className="sr-text-link">
                    All specialists
                    <ArrowUpRight size={15} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {doctors.map((doc) => (
                    <Link
                      key={doc.id}
                      to={`/doctors/${doc.slug}`}
                      className="p-5 rounded-xl bg-white border border-[rgba(22,55,76,0.12)] hover:border-[var(--teal)] hover:shadow-md transition text-decoration-none text-inherit group"
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-[var(--mint)] mb-3 border border-[rgba(22,55,76,0.12)]">
                        {doc.photo_url ? (
                          <img src={doc.photo_url} alt={doc.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#5a7d92]">
                            <Stethoscope size={20} />
                          </div>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--coral)] transition mb-1">
                        {doc.name}
                      </h4>
                      <p className="text-[11px] text-[var(--coral)] font-medium line-clamp-1 mb-1">
                        {doc.designation}
                      </p>
                      <span className="text-[10px] text-[#5a7d92]">
                        {doc.experience_years ? `${doc.experience_years}+ yrs exp` : doc.department}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Consultation Booking Box */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-8 rounded-xl bg-[var(--deep)] text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--lime)] block mb-2">
                Consultation Request
              </span>
              <h3 className="font-serif text-2xl text-white mb-3">
                Book a consultation for this procedure
              </h3>
              <p className="text-xs text-[var(--mint)] leading-relaxed mb-6">
                Meet our senior specialists to evaluate your case, review previous medical reports, and receive a customized clinical recommendation.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to={`/book-appointment?treatment=${encodeURIComponent(treatment.title)}`}
                  className="sr-button sr-button--light text-xs w-full justify-center"
                >
                  <Calendar size={15} />
                  Book Consultation
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
                Transparent Guidance
              </div>
              <p className="sr-copy text-xs leading-relaxed m-0">
                You will receive a clear explanation of success likelihood, duration, safety protocols, and associated costs before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
