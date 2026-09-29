import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
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
    return <div className="py-24 text-center text-slate-500 font-medium">Loading specialty details...</div>;
  }

  if (!specialty) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-[#073d59]">Specialty Not Found</h2>
        <Link to="/specialties" className="text-sm font-semibold text-[#006c93] underline mt-3 inline-block">
          ← Back to All Specialties
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Specialties', path: '/specialties' },
            { label: specialty.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-6 sm:p-10 mb-8">
              <span className="eyebrow mb-2">{specialty.category}</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#073d59] font-heading mb-4">
                {specialty.title}
              </h1>
              <p className="text-sm sm:text-base text-[#637371] leading-relaxed mb-6">
                {specialty.short_description}
              </p>

              {/* Hero Image */}
              <div className="rounded-2xl overflow-hidden mb-8 max-h-[420px] shadow-md">
                <img
                  src={specialty.image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80'}
                  alt={specialty.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Conditions Addressed */}
              {(() => {
                const condList: string[] = Array.isArray(specialty.conditions)
                  ? (specialty.conditions as string[])
                  : typeof specialty.conditions === 'string'
                  ? (specialty.conditions as string).split(',').map((s) => s.trim())
                  : [];
                return condList.length > 0 ? (
                  <div className="mb-8 p-6 rounded-2xl bg-[#fdf1f8] border border-pink-200">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#bc1169] mb-3 font-heading">
                      Conditions Evaluated & Addressed
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {condList.map((cond: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#073d59] font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-[#bc1169] shrink-0" />
                          <span>{cond}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Clinical Overview */}
              <div>
                <h3 className="text-xl font-bold text-[#073d59] mb-4 font-heading border-b border-slate-100 pb-2">
                  Comprehensive Specialty Overview
                </h3>
                <RichContentRenderer content={specialty.overview || specialty.short_description} />
              </div>

              {/* Associated Treatments */}
              {relatedTreatments.length > 0 && (
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-[#073d59] mb-4 font-heading">
                    Associated Treatments & Services
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedTreatments.map((t) => (
                      <Link
                        key={t.id}
                        to={`/treatments/${t.slug}`}
                        className="p-4 rounded-xl border border-slate-200 hover:border-[#006c93] hover:shadow-md transition flex flex-col justify-between group"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-[#073d59] group-hover:text-[#006c93] font-heading">
                            {t.title}
                          </h4>
                          <p className="text-xs text-[#637371] mt-1 line-clamp-2">
                            {t.short_description}
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-[#006c93] mt-3 flex items-center gap-1">
                          View Treatment <ArrowRight className="w-3 h-3" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/specialties"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#006c93] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Specialties</span>
            </Link>
          </div>

          {/* Right Sidebar Action Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col gap-6">
              <div>
                <span className="text-[11px] font-bold text-[#006c93] uppercase tracking-wider block mb-1">
                  Consultation
                </span>
                <h3 className="text-lg font-bold text-[#073d59] font-heading">
                  Schedule Specialist Visit
                </h3>
                <p className="text-xs text-[#637371] mt-1 leading-relaxed">
                  Book an in-person consultation with our senior specialists at Nehru Nagar, Khammam.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to="/book-appointment"
                  className="btn-primary py-3 rounded-full text-center text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </Link>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="btn-outline py-3 rounded-full text-center text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#006c93]" />
                  <span>Call: {phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
