import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, Clock } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Treatment } from '../types';
import { api } from '../utils/api';

export const TreatmentsPage: React.FC = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Fertility', 'Obstetrics & Delivery', 'Neonatal Intensive Care', 'Gynecology'];

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
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container">
        <Breadcrumbs items={[{ label: 'Treatments & Services' }]} />

        {/* Heading Row */}
        <div className="sr-heading-row">
          <div>
            <span className="sr-kicker">Your options, made clearer</span>
            <h1 className="sr-display sr-heading mt-2">
              Clinical Treatments &amp; Care,<br />
              to <em>every clinical procedure.</em>
            </h1>
          </div>
          <p className="sr-copy max-w-md">
            Explore advanced reproductive protocols, maternity support, and newborn neonatal interventions delivered with transparency and gentle care in Khammam.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[rgba(22,55,76,0.12)]">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                  category === cat
                    ? 'bg-[var(--deep)] text-white'
                    : 'bg-white text-[#5a7d92] border border-[rgba(22,55,76,0.12)] hover:border-[var(--teal)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={15} className="text-[#5a7d92] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search procedures..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sr-input pl-10 text-xs rounded-full"
            />
          </div>
        </div>

        {/* Treatments Grid */}
        {loading ? (
          <div className="sr-grid sr-grid--three">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="sr-skeleton">
                <div className="sr-skeleton-image" />
                <div className="sr-skeleton-line" />
                <div className="sr-skeleton-line" />
              </div>
            ))}
          </div>
        ) : treatments.length === 0 ? (
          <div className="sr-empty">
            <div>
              <h3>No treatments found</h3>
              <p>Try modifying your search or choosing a different clinical category.</p>
            </div>
            <button
              onClick={() => {
                setCategory('All');
                setSearch('');
              }}
              className="sr-button sr-button--outline text-xs"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="sr-grid sr-grid--three">
            {treatments.map((treatment, index) => (
              <Link
                key={treatment.id}
                to={`/treatments/${treatment.slug}`}
                className="sr-card"
                style={{ padding: '28px' }}
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-display font-extrabold text-2xl text-[var(--coral)]" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {treatment.category && (
                    <span className="sr-card-category" style={{ margin: 0 }}>
                      {treatment.category}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[var(--ink)] font-display mb-2">
                  {treatment.title}
                </h3>
                <p className="sr-copy sr-clamp text-sm mb-4">
                  {treatment.short_description || treatment.overview}
                </p>

                {treatment.typical_duration && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#5a7d92] mb-4">
                    <Clock size={12} className="text-[var(--coral)]" />
                    <span>Duration: {treatment.typical_duration}</span>
                  </div>
                )}

                <span className="sr-card-footer mt-auto pt-5 border-t border-[rgba(22,55,76,0.12)]">
                  Understand your options
                  <ArrowUpRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
