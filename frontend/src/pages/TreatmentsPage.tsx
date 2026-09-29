import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, Activity, Clock, CheckCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Treatment } from '../types';
import { api } from '../utils/api';

export const TreatmentsPage: React.FC = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Fertility Treatments', 'Obstetrics & Delivery', 'Neonatal Intensive Care', 'Pediatric Surgery', 'Diagnostics'];

  useEffect(() => {
    async function fetchTreatments() {
      try {
        const queryParams = new URLSearchParams();
        if (category !== 'All') queryParams.append('category', category);
        if (search) queryParams.append('search', search);

        const res = await api.get<{ treatments: Treatment[] }>(`/treatments?${queryParams.toString()}`);
        if (res.treatments) setTreatments(res.treatments);
      } catch (err) {
        console.error('Failed to load treatments:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTreatments();
  }, [category, search]);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Treatments & Services' }]} />

        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="eyebrow mb-2">Evidence-Based Clinical Procedures</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073d59] font-heading">
              Treatments & Clinical Services
            </h1>
            <p className="text-sm text-[#637371] max-w-2xl mt-2 leading-relaxed">
              Explore advanced fertility interventions, obstetric deliveries, NICU care protocols, and specialized pediatric surgeries performed with precision and empathetic patient care.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search treatments (e.g. IVF, NICU)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 rounded-full text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006c93]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-[#006c93] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Listing */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-white rounded-2xl animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : treatments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No treatments found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any treatment matching your search query. Please try searching with a different term or select 'All'.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={t.hero_media || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'}
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#006c93] px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm">
                    {t.category || 'Specialized Care'}
                  </span>
                  {t.typical_duration && (
                    <span className="absolute bottom-3 right-3 text-white text-[11px] flex items-center gap-1 font-medium bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" /> {t.typical_duration}
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#006c93] transition-colors font-heading mb-2">
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {t.short_description || t.content?.replace(/<[^>]+>/g, '').slice(0, 140) + '...'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Safe & Certified
                    </span>
                    <Link
                      to={`/treatments/${t.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006c93] group-hover:text-[#073d59] transition-colors"
                    >
                      View Treatment <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clinical Assurance Section */}
        <div className="mt-16 bg-gradient-to-r from-[#073d59] to-[#006c93] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold mb-3">
              Personalized Consultation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Need a confidential evaluation with our medical specialists?
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm mt-2 leading-relaxed">
              Every fertility journey and pediatric case is unique. Consult our experienced clinicians to explore diagnostic roadmaps, success rates, and transparent pricing.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/book-appointment"
              className="px-6 py-3 rounded-full bg-[#fa7830] hover:bg-[#e06622] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md text-center"
            >
              Book an Appointment
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all text-center"
            >
              Contact Hospital
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
