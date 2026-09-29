import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building, Activity, Stethoscope, Users,
  Image as ImageIcon, BookOpen, Calendar, MessageSquare,
  ArrowRight, ShieldCheck, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get<any>('/dashboard/stats');
        setStats(res);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    { title: 'Facilities', count: stats?.counts?.facilities || 0, icon: Building, color: 'text-sky-400', link: '/admin/facilities' },
    { title: 'Specialties', count: stats?.counts?.specialties || 0, icon: Activity, color: 'text-emerald-400', link: '/admin/specialties' },
    { title: 'Treatments', count: stats?.counts?.treatments || 0, icon: Stethoscope, color: 'text-amber-400', link: '/admin/treatments' },
    { title: 'Doctors', count: stats?.counts?.doctors || 0, icon: Users, color: 'text-purple-400', link: '/admin/doctors' },
    { title: 'Gallery Items', count: stats?.counts?.gallery || 0, icon: ImageIcon, color: 'text-pink-400', link: '/admin/gallery' },
    { title: 'Insights / Blogs', count: stats?.counts?.insights || 0, icon: BookOpen, color: 'text-blue-400', link: '/admin/insights' },
    { title: 'Appointments', count: stats?.counts?.appointments || 0, icon: Calendar, color: 'text-orange-400', link: '/admin/appointments' },
    { title: 'Contact Enquiries', count: stats?.counts?.enquiries || 0, icon: MessageSquare, color: 'text-teal-400', link: '/admin/enquiries' },
  ];

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#073d59] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#fa7830] block mb-1">
            Clinical Portal & Content Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Welcome back, {user?.name || user?.username}!
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Role: <span className="capitalize font-semibold text-emerald-400">{user?.role}</span> • Sreemantha Hospital, Khammam
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/treatments"
            className="px-4 py-2 rounded-xl bg-[#006c93] hover:bg-[#073d59] text-white text-xs font-bold transition-all shadow-md"
          >
            + Add Treatment
          </Link>
          <Link
            to="/admin/doctors"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all"
          >
            + Add Doctor
          </Link>
          <Link
            to="/admin/gallery"
            className="px-4 py-2 rounded-xl bg-[#fa7830] hover:bg-[#e06622] text-white text-xs font-bold transition-all"
          >
            + Upload Media
          </Link>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Hospital Platform Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Link
                key={i}
                to={c.link}
                className="bg-slate-800/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700/80 transition-all hover:border-slate-600 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-medium">{c.title}</span>
                  <Icon className={`w-5 h-5 ${c.color} group-hover:scale-110 transition-transform`} />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-white">
                    {loading ? '...' : c.count}
                  </span>
                  <span className="text-[11px] text-slate-500 group-hover:text-slate-300 flex items-center gap-0.5">
                    Manage <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointment Requests */}
        <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#fa7830]" /> Recent Appointment Requests
            </h3>
            <Link to="/admin/appointments" className="text-xs text-[#006c93] hover:underline font-bold">
              View All →
            </Link>
          </div>

          {stats?.recentAppointments?.length ? (
            <div className="space-y-3">
              {stats.recentAppointments.slice(0, 5).map((app: any) => (
                <div key={app.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{app.name}</h4>
                    <p className="text-[11px] text-slate-400">{app.department} • {app.phone}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    app.status === 'confirmed'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : app.status === 'contacted'
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {app.status || 'new'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No recent appointment requests.</p>
          )}
        </div>

        {/* Recent Enquiries */}
        <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Recent Contact Inquiries
            </h3>
            <Link to="/admin/enquiries" className="text-xs text-[#006c93] hover:underline font-bold">
              View All →
            </Link>
          </div>

          {stats?.recentEnquiries?.length ? (
            <div className="space-y-3">
              {stats.recentEnquiries.slice(0, 5).map((enq: any) => (
                <div key={enq.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{enq.name}</h4>
                    <p className="text-[11px] text-slate-400">{enq.subject || 'General'} • {enq.phone}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    enq.status === 'responded'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {enq.status || 'new'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No recent contact inquiries.</p>
          )}
        </div>
      </div>
    </div>
  );
};
