import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Facility } from '../types';
import { api } from '../utils/api';

export const FacilitiesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const res = await api.get<{ facilities: Facility[] }>(`/facilities?search=${encodeURIComponent(search)}`);
        if (res.facilities) setFacilities(res.facilities);
      } catch (err) {
        console.error('Failed to load facilities:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFacilities();
  }, [search]);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Facilities' }]} />

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="eyebrow mb-2">Hospital Infrastructure</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073d59] font-heading">
              World-Class Clinical Facilities
            </h1>
            <p className="text-sm text-[#637371] max-w-2xl mt-2 leading-relaxed">
              Explore the advanced embryology cleanroom laboratories, level-III neonatal ICU, laparoscopic surgical suites, and deluxe maternal rooms at Sreemantha Hospital, Khammam.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facilities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 rounded-full text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006c93]"
            />
          </div>
        </div>

        {/* Facilities Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">Loading hospital facilities...</div>
        ) : facilities.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500">
            No facilities found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition duration-300 flex flex-col group"
              >
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={fac.image_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'}
                    alt={fac.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 text-white text-xs font-bold font-heading">
                    Sreemantha Hospital, Khammam
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#073d59] group-hover:text-[#006c93] transition font-heading">
                      {fac.name}
                    </h3>
                    <p className="text-xs text-[#637371] mt-2 line-clamp-3 leading-relaxed">
                      {fac.short_description}
                    </p>

                    {/* Equipment Tags */}
                    {(() => {
                      const eqList: string[] = Array.isArray(fac.equipment)
                        ? (fac.equipment as string[])
                        : typeof fac.equipment === 'string'
                        ? (fac.equipment as string).split(',').map((s) => s.trim())
                        : [];
                      return eqList.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {eqList.slice(0, 3).map((eq: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold bg-[#e0f3fc] text-[#006c93] px-2 py-0.5 rounded-full flex items-center gap-1"
                            >
                              <CheckCircle className="w-2.5 h-2.5" />
                              {eq}
                            </span>
                          ))}
                        </div>
                      ) : null;
                    })()}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Active 24/7
                    </span>
                    <Link
                      to={`/facilities/${fac.slug}`}
                      className="text-xs font-bold text-[#006c93] hover:text-[#bc1169] flex items-center gap-1"
                    >
                      <span>Explore Facility</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
