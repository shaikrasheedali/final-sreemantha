import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Activity, CheckCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Specialty } from '../types';
import { api } from '../utils/api';

export const SpecialtiesPage: React.FC = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Fertility', 'Obstetrics & Gynecology', 'Pediatrics & Neonatology', 'Fetal Medicine'];

  useEffect(() => {
    async function fetchSpecialties() {
      try {
        const queryParams = new URLSearchParams();
        if (category !== 'All') queryParams.append('category', category);
        if (search) queryParams.append('search', search);

        const res = await api.get<{ specialties: Specialty[] }>(`/specialties?${queryParams.toString()}`);
        if (res.specialties) setSpecialties(res.specialties);
      } catch (err) {
        console.error('Failed to load specialties:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSpecialties();
  }, [category, search]);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Specialties' }]} />

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="eyebrow mb-2">Areas of Medical Excellence</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073d59] font-heading">
              Our Medical Specialties
            </h1>
            <p className="text-sm text-[#637371] max-w-2xl mt-2 leading-relaxed">
              Explore our core domains of healthcare expertise: Reproductive Medicine & IVF, High-Risk Obstetrics, Level-III Neonatology, and Pediatric Care in Khammam.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search specialties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 rounded-full text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006c93]"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                category === cat
                  ? 'bg-[#006c93] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Specialties Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">Loading medical specialties...</div>
        ) : specialties.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500">
            No specialties found matching your filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialties.map((spec) => (
              <div
                key={spec.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition duration-300 flex flex-col group"
              >
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={spec.image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'}
                    alt={spec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-white/90 text-[#073d59] shadow-sm">
                    {spec.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#073d59] group-hover:text-[#bc1169] transition font-heading">
                      {spec.title}
                    </h3>
                    <p className="text-xs text-[#637371] mt-2 line-clamp-3 leading-relaxed">
                      {spec.short_description}
                    </p>

                    {/* Conditions Treated */}
                    {(() => {
                      const condList: string[] = Array.isArray(spec.conditions)
                        ? (spec.conditions as string[])
                        : typeof spec.conditions === 'string'
                        ? (spec.conditions as string).split(',').map((s) => s.trim())
                        : [];
                      return condList.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {condList.slice(0, 3).map((cond: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold bg-[#effaff] text-[#006c93] px-2 py-0.5 rounded-full flex items-center gap-1"
                            >
                              <CheckCircle className="w-2.5 h-2.5 text-[#006c93]" />
                              {cond}
                            </span>
                          ))}
                        </div>
                      ) : null;
                    })()}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" /> Clinical Guidance
                    </span>
                    <Link
                      to={`/specialties/${spec.slug}`}
                      className="text-xs font-bold text-[#006c93] hover:text-[#bc1169] flex items-center gap-1"
                    >
                      <span>Explore Specialty</span>
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
