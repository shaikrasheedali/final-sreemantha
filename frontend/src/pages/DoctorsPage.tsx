import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, Stethoscope } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Doctor } from '../types';
import { api } from '../utils/api';

export const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [department, setDepartment] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const departments = ['All', 'Fertility & Reproductive Medicine', 'Obstetrics & High-Risk Pregnancy', 'Pediatrics & Level III NICU'];

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const queryParams = new URLSearchParams();
        if (department !== 'All') queryParams.append('department', department);
        if (search) queryParams.append('search', search);

        const res = await api.get<{ doctors: Doctor[] }>(`/doctors?${queryParams.toString()}`);
        if (res.doctors) setDoctors(res.doctors);
      } catch (err) {
        console.error('Failed to load doctors:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, [department, search]);

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container">
        <Breadcrumbs items={[{ label: 'Our Medical Team' }]} />

        {/* Heading Row */}
        <div className="sr-heading-row">
          <div>
            <span className="sr-kicker">The people behind your care</span>
            <h1 className="sr-display sr-heading mt-2">
              Our Doctors &amp; Specialists.<br />
              <em>Reassuring hearts.</em>
            </h1>
          </div>
          <p className="sr-copy max-w-md">
            Meet the senior reproductive endocrinologists, high-risk obstetricians, embryologists, and neonatologists who lead your care at Sreemantha Hospital.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[rgba(22,55,76,0.12)]">
          <div className="flex flex-wrap items-center gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setDepartment(dept)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                  department === dept
                    ? 'bg-[var(--deep)] text-white'
                    : 'bg-white text-[#5a7d92] border border-[rgba(22,55,76,0.12)] hover:border-[var(--teal)]'
                }`}
              >
                {dept === 'All' ? 'All Departments' : dept}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={15} className="text-[#5a7d92] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sr-input sr-search-input text-xs rounded-full"
              style={{ paddingLeft: '44px' }}
            />
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="sr-grid sr-grid--four">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="sr-skeleton">
                <div className="sr-skeleton-image" style={{ height: 220 }} />
                <div className="sr-skeleton-line" />
                <div className="sr-skeleton-line" />
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="sr-empty">
            <div>
              <h3>No specialists found</h3>
              <p>Try clearing your search query or selecting a different department.</p>
            </div>
            <button
              onClick={() => {
                setDepartment('All');
                setSearch('');
              }}
              className="sr-button sr-button--outline text-xs"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="sr-grid sr-grid--four">
            {doctors.map((doctor) => (
              <Link
                key={doctor.id}
                to={`/doctors/${doctor.slug}`}
                className="sr-card"
                style={{ border: '1px solid var(--sr-line)' }}
              >
                <div className="sr-media" style={{ height: 280 }}>
                  {doctor.photo_url ? (
                    <img
                      src={doctor.photo_url}
                      alt={doctor.name}
                      style={{ objectPosition: 'center top' }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="sr-image-placeholder">
                      <Stethoscope size={40} />
                    </div>
                  )}
                  {doctor.department && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 12,
                        right: 12,
                        bottom: 12,
                        padding: '7px 10px',
                        borderRadius: 6,
                        background: 'rgba(255, 254, 251, 0.94)',
                        fontSize: 10,
                        fontWeight: 600,
                        color: 'var(--sr-ink)',
                      }}
                    >
                      {doctor.department}
                    </div>
                  )}
                </div>

                <div className="sr-card-body" style={{ padding: 22 }}>
                  <h3 style={{ fontSize: 17 }}>{doctor.name}</h3>
                  {doctor.designation && (
                    <p style={{ color: 'var(--sr-rose)', marginTop: 6, fontSize: 12, fontWeight: 500 }}>
                      {doctor.designation}
                    </p>
                  )}
                  {doctor.qualifications && (
                    <p className="sr-copy" style={{ fontSize: 11, marginTop: 4 }}>
                      {Array.isArray(doctor.qualifications)
                        ? doctor.qualifications.join(', ')
                        : doctor.qualifications}
                    </p>
                  )}
                  {doctor.certifications && doctor.certifications.length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 10, color: 'var(--teal)', fontWeight: 600 }}>
                      {doctor.certifications[0]}
                    </div>
                  )}

                  <span
                    className="sr-card-footer"
                    style={{
                      marginTop: 20,
                      paddingTop: 14,
                      borderTop: '1px solid var(--sr-line)',
                      fontSize: 11,
                    }}
                  >
                    <span>
                      {doctor.experience_years != null
                        ? `${doctor.experience_years}+ yrs experience`
                        : 'Meet specialist'}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[var(--coral)]">
                      View profile
                      <ArrowUpRight size={13} />
                    </span>
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
