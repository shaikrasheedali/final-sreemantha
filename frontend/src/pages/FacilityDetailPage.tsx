import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Calendar, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RichContentRenderer } from '../components/RichContentRenderer';
import { Facility } from '../types';
import { api } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export const FacilityDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const phone = settings.hospital_info?.phone || '+91 96667 81779';

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
    return <div className="py-24 text-center text-slate-500 font-medium">Loading facility details...</div>;
  }

  if (!facility) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-[#073d59]">Facility Not Found</h2>
        <Link to="/facilities" className="text-sm font-semibold text-[#006c93] underline mt-3 inline-block">
          ← Back to All Facilities
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Facilities', path: '/facilities' },
            { label: facility.name || facility.title || 'Facility' },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-6 sm:p-10 mb-8">
              <span className="eyebrow mb-2">Facility Details</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#073d59] font-heading mb-4">
                {facility.name || facility.title}
              </h1>
              <p className="text-sm sm:text-base text-[#637371] leading-relaxed mb-6">
                {facility.short_description}
              </p>

              {/* Hero Image */}
              <div className="rounded-2xl overflow-hidden mb-8 max-h-[420px] shadow-md">
                <img
                  src={facility.image_url || facility.hero_media || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80'}
                  alt={facility.name || facility.title || 'Facility'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Equipment Highlighted */}
              {(() => {
                const eqList: string[] = Array.isArray(facility.equipment)
                  ? (facility.equipment as string[])
                  : typeof facility.equipment === 'string'
                  ? (facility.equipment as string).split(',').map((s) => s.trim())
                  : [];
                return eqList.length > 0 ? (
                  <div className="mb-8 p-6 rounded-2xl bg-[#effaff] border border-[#bfeaff]">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#006c93] mb-3 font-heading">
                      Advanced Equipment & Infrastructure Specifications
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {eqList.map((eq: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#073d59] font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-[#006c93] shrink-0" />
                          <span>{eq}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Rich Content Overview */}
              <div>
                <h3 className="text-xl font-bold text-[#073d59] mb-4 font-heading border-b border-slate-100 pb-2">
                  Clinical Overview & Protocol
                </h3>
                <RichContentRenderer content={facility.description || facility.short_description} />
              </div>
            </div>

            <Link
              to="/facilities"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#006c93] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Facilities</span>
            </Link>
          </div>

          {/* Right Sidebar Action Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col gap-6">
              <div>
                <span className="text-[11px] font-bold text-[#bc1169] uppercase tracking-wider block mb-1">
                  Patient Services
                </span>
                <h3 className="text-lg font-bold text-[#073d59] font-heading">
                  Available at Sreemantha
                </h3>
                <p className="text-xs text-[#637371] mt-1 leading-relaxed">
                  Located on Priyadarshini Degree College Road, Nehru Nagar, Khammam.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>NABH clinical protocols and stringent infection control maintained 24/7.</span>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to="/book-appointment"
                  className="btn-primary py-3 rounded-full text-center text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Consultation</span>
                </Link>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="btn-outline py-3 rounded-full text-center text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#006c93]" />
                  <span>Call Hospital: {phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
