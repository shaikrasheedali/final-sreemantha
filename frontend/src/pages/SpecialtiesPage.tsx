import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, Stethoscope } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Specialty } from '../types';
import { api } from '../utils/api';

export const SpecialtiesPage: React.FC = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Fertility', 'Maternity', 'Pediatrics', 'Gynecology'];

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
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container">
        <Breadcrumbs items={[{ label: 'Specialties' }]} />

        {/* Heading Row */}
        <div className="sr-heading-row">
          <div>
            <span className="sr-kicker">Every chapter, thoughtfully cared for</span>
            <h1 className="sr-display sr-heading mt-2">
              Clinical specialties,<br />
              <em>tailored to your journey.</em>
            </h1>
          </div>
          <p className="sr-copy max-w-md">
            From fertility medicine to advanced high-risk obstetrics and neonatal intensive care, discover the dedicated departments at Sreemantha Hospital.
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
            <Search size={15} className="text-[#5a7d92] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search specialties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sr-input sr-search-input text-xs rounded-full"
              style={{ paddingLeft: '44px' }}
            />
          </div>
        </div>

        {/* Specialties Grid */}
        {loading ? (
          <div className="sr-grid sr-grid--four">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="sr-skeleton">
                <div className="sr-skeleton-image" />
                <div className="sr-skeleton-line" />
                <div className="sr-skeleton-line" />
              </div>
            ))}
          </div>
        ) : specialties.length === 0 ? (
          <div className="sr-empty">
            <div>
              <h3>No specialties found</h3>
              <p>Try selecting another category or clearing your search filter.</p>
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
          <div className="sr-grid sr-grid--four">
            {specialties.map((spec) => (
              <Link key={spec.id} to={`/specialties/${spec.slug}`} className="sr-card">
                <div className="sr-media">
                  {spec.image_url ? (
                    <img src={spec.image_url} alt={spec.title} loading="lazy" />
                  ) : (
                    <div className="sr-image-placeholder">
                      <Stethoscope size={36} />
                    </div>
                  )}
                </div>
                <div className="sr-card-body">
                  {spec.category && <span className="sr-card-category">{spec.category}</span>}
                  <h3>{spec.title}</h3>
                  <p className="sr-copy sr-clamp">{spec.short_description || spec.overview}</p>
                  <span className="sr-card-footer">
                    Explore specialty
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
