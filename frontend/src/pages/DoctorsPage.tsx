import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Award, GraduationCap, Calendar, Clock, Stethoscope } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Doctor } from '../types';
import { api } from '../utils/api';

export const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialty, setSpecialty] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const specialties = ['All', 'Fertility & Reproductive Medicine', 'Obstetrics & Gynecology', 'Pediatrics & Neonatology', 'Fetal Medicine'];

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const queryParams = new URLSearchParams();
        if (specialty !== 'All') queryParams.append('specialty', specialty);
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
  }, [specialty, search]);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Our Medical Team' }]} />

        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="eyebrow mb-2">Dedicated Clinical Experts</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073d59] font-heading">
              Our Doctors & Specialists
            </h1>
            <p className="text-sm text-[#637371] max-w-2xl mt-2 leading-relaxed">
              Meet our team of board-certified reproductive endocrinologists, high-risk obstetricians, neonatologists, and pediatricians dedicated to clinical excellence and patient care in Khammam.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctors by name or qualification..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 rounded-full text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006c93]"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSpecialty(spec)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                specialty === spec
                  ? 'bg-[#006c93] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-white rounded-3xl animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No doctors found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No medical professionals matched your filter criteria. Try choosing another specialty or resetting search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-72 overflow-hidden bg-slate-100">
                  <img
                    src={doc.profile_photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#006c93] px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm">
                    {doc.specialty}
                  </span>
                  {doc.experience && (
                    <span className="absolute bottom-3 left-4 text-white text-[11px] font-medium flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> {doc.experience}
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#006c93] transition-colors font-heading">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#006c93] mt-0.5">
                      {doc.designation || 'Consultant Specialist'}
                    </p>

                    <div className="mt-3 flex items-start gap-2 text-slate-600 text-xs">
                      <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {Array.isArray(doc.qualifications)
                          ? doc.qualifications.join(', ')
                          : typeof doc.qualifications === 'string'
                          ? doc.qualifications
                          : 'MBBS, MD'}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {doc.short_bio || (typeof doc.bio === 'string' ? doc.bio.replace(/<[^>]+>/g, '').slice(0, 130) + '...' : '')}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-6">
                    <Link
                      to={`/book-appointment?doctor=${encodeURIComponent(doc.name)}`}
                      className="text-[11px] font-bold text-[#fa7830] hover:text-[#e06622] flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Book OPD
                    </Link>
                    <Link
                      to={`/doctors/${doc.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#006c93] group-hover:text-[#073d59]"
                    >
                      Full Profile <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
