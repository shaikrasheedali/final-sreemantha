import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Phone,
  Check,
  Building2,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RichContentRenderer } from '../components/RichContentRenderer';
import { DetailMediaCarousel } from '../components/DetailMediaCarousel';
import { Facility } from '../types';
import { api } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export const FacilityDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const phone = settings.hospital_info?.phone || '+91 96667 81779';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await api.get<{ facility: Facility }>(`/facilities/${slug}`);
        if (res.facility) setFacility(res.facility);
      } catch (err) {
        console.error('Failed to load facility:', err);
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
          <p className="sr-copy">Loading facility details...</p>
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="sr-section text-center">
        <div className="sr-container">
          <h2 className="sr-display text-2xl mb-4">Facility Not Found</h2>
          <Link to="/facilities" className="sr-button sr-button--outline text-xs">
            Return to all facilities
          </Link>
        </div>
      </div>
    );
  }

  const equipmentList: string[] = Array.isArray(facility.equipment)
    ? facility.equipment
    : typeof facility.equipment === 'string'
    ? facility.equipment.split(',').map((e) => e.trim()).filter(Boolean)
    : [];

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container">
        <Breadcrumbs
          items={[
            { label: 'Facilities', path: '/facilities' },
            { label: facility.name || facility.title || 'Facility' },
          ]}
        />

        {/* Hero Header */}
        <div className="mb-14">
          <span className="sr-kicker">
            Hospital Spaces · Sreemantha Khammam
          </span>
          <h1 className="sr-display sr-heading mt-2 mb-4">
            {facility.name || facility.title}
          </h1>
          <p className="sr-copy max-w-3xl text-lg leading-relaxed">
            {facility.short_description || facility.description}
          </p>
        </div>

        {/* Media 4:3 Showcase / Carousel */}
        <DetailMediaCarousel
          media={facility.image_url}
          title={facility.name || facility.title || 'Facility'}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-10">
            <div className="p-8 sm:p-10 rounded-xl bg-white border border-[rgba(22,55,76,0.12)]">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-2">
                Space Specifications &amp; Hygiene Standards
              </span>
              <h2 className="sr-display text-2xl mb-6 text-[var(--ink)]">
                Designed for clinical safety and comfort
              </h2>
              {facility.content ? (
                <div className="sr-copy space-y-4">
                  <RichContentRenderer content={facility.content} />
                </div>
              ) : (
                <p className="sr-copy leading-relaxed">
                  {facility.description ||
                    'Engineered with clinical precision, HEPA filtration, and strict infection control protocols to guarantee a safe, calming environment for mothers, newborns, and families.'}
                </p>
              )}
            </div>

            {/* Equipment & Technology */}
            {equipmentList.length > 0 && (
              <div className="p-8 sm:p-10 rounded-xl bg-white border border-[rgba(22,55,76,0.12)]">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-2">
                  Specialized Infrastructure
                </span>
                <h3 className="sr-display text-2xl mb-6 text-[var(--ink)]">
                  Key equipment &amp; technologies installed
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {equipmentList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-[var(--ink)] font-medium">
                      <div className="w-5 h-5 rounded-full bg-[var(--mint)] flex items-center justify-center text-[var(--ink)] shrink-0">
                        <Check size={12} />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar CTA */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-8 rounded-xl bg-[var(--deep)] text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--lime)] block mb-2">
                Hospital Visit
              </span>
              <h3 className="font-serif text-2xl text-white mb-3">
                Experience our facilities in person
              </h3>
              <p className="text-xs text-[var(--mint)] leading-relaxed mb-6">
                Schedule a consultation or visit Sreemantha Hospital on Priyadarshini Degree College Road, Nehru Nagar, Khammam.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/book-appointment"
                  className="sr-button sr-button--light text-xs w-full justify-center"
                >
                  <Calendar size={15} />
                  Book consultation
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
                Infection Control
              </div>
              <p className="sr-copy text-xs leading-relaxed m-0">
                Regular microbial audits, laminar airflow, and continuous environmental monitoring maintain peak clinical hygiene standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
