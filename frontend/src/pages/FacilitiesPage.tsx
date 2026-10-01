import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, Building2 } from 'lucide-react';
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
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container">
        <Breadcrumbs items={[{ label: 'Hospital Spaces & Labs' }]} />

        {/* Heading Row */}
        <div className="sr-heading-row">
          <div>
            <span className="sr-kicker">Thoughtful spaces. Purposeful technology.</span>
            <h1 className="sr-display sr-heading mt-2">
              Hospital Facilities &amp; Spaces,<br />
              <em>where your care comes first.</em>
            </h1>
          </div>
          <p className="sr-copy max-w-md">
            Explore the cleanroom embryology laboratories, Level-III NICU suites, advanced laparoscopic operation theatres, and peaceful recovery spaces at Sreemantha Hospital, Khammam.
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-end mb-10 pb-6 border-b border-[rgba(22,55,76,0.12)]">
          <div className="relative w-full md:w-80">
            <Search size={15} className="text-[#5a7d92] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hospital spaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sr-input pl-10 text-xs rounded-full"
            />
          </div>
        </div>

        {/* Facilities Grid */}
        {loading ? (
          <div className="sr-grid sr-grid--two">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="sr-skeleton" style={{ height: 340 }}>
                <div className="sr-skeleton-image" style={{ height: 200 }} />
                <div className="sr-skeleton-line" />
                <div className="sr-skeleton-line" />
              </div>
            ))}
          </div>
        ) : facilities.length === 0 ? (
          <div className="sr-empty">
            <div>
              <h3>No facilities found</h3>
              <p>Try searching for cleanroom, NICU, laboratory or operating theatre.</p>
            </div>
            <button
              onClick={() => setSearch('')}
              className="sr-button sr-button--outline text-xs"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="sr-grid sr-grid--two">
            {facilities.map((facility, index) => (
              <Link
                key={facility.id}
                to={`/facilities/${facility.slug}`}
                className="relative rounded-2xl overflow-hidden text-white block group text-decoration-none"
                style={{
                  minHeight: 360,
                  background: 'var(--deep)',
                }}
              >
                <div className="absolute inset-0">
                  {facility.image_url ? (
                    <img
                      src={facility.image_url}
                      alt={facility.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="sr-image-placeholder h-full text-white/50">
                      <Building2 size={48} />
                    </div>
                  )}
                </div>
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(7,61,89,0.1) 15%, rgba(7,61,89,0.75) 65%, rgba(7,61,89,0.95))',
                  }}
                />

                <div className="relative z-10 flex flex-col justify-end h-full p-8 min-h-[360px]">
                  <div className="flex items-center justify-between mb-auto">
                    <span className="text-[11px] font-mono tracking-widest text-[var(--lime)] uppercase font-bold">
                      OUR SPACES / {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[var(--pink)] group-hover:text-white transition-colors">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl text-white font-bold mt-12 mb-2 leading-snug">
                    {facility.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed line-clamp-2 max-w-md m-0 text-white drop-shadow-sm" style={{ color: '#ffffff' }}>
                    {facility.short_description || facility.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
