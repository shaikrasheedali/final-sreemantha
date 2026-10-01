import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Activity,
  Stethoscope,
  Users,
  Image as ImageIcon,
  BookOpen,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
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
    { title: 'Clinical Facilities', count: stats?.counts?.facilities || 0, icon: Building, link: '/admin/facilities' },
    { title: 'Medical Specialties', count: stats?.counts?.specialties || 0, icon: Activity, link: '/admin/specialties' },
    { title: 'Treatments & Protocols', count: stats?.counts?.treatments || 0, icon: Stethoscope, link: '/admin/treatments' },
    { title: 'Doctors & Specialists', count: stats?.counts?.doctors || 0, icon: Users, link: '/admin/doctors' },
    { title: 'Gallery Media', count: stats?.counts?.gallery || 0, icon: ImageIcon, link: '/admin/gallery' },
    { title: 'Health Journal (Blog)', count: stats?.counts?.insights || 0, icon: BookOpen, link: '/admin/insights' },
    { title: 'Appointments Booked', count: stats?.counts?.appointments || 0, icon: Calendar, link: '/admin/appointments' },
    { title: 'Patient Enquiries', count: stats?.counts?.enquiries || 0, icon: MessageSquare, link: '/admin/enquiries' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner matching exact deep blue & pink theme */}
      <div className="bg-[var(--deep)] text-white p-8 sm:p-10 rounded-2xl border border-[rgba(255,255,255,0.12)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--lime)] block mb-1.5">
            Clinical Administration &amp; Hospital CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-display text-white font-bold tracking-tight">
            Welcome back, {user?.name || user?.username}
          </h1>
          <p className="text-xs text-[var(--mint)] mt-1.5 opacity-90">
            Role: <span className="capitalize font-semibold text-white">{user?.role}</span> · Sreemantha Hospital, Khammam
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <Link
            to="/admin/settings"
            className="btn btn-primary text-xs"
          >
            <Sparkles size={14} /> Favicon &amp; Settings
          </Link>
          <Link
            to="/admin/appointments"
            className="btn btn-outline text-xs text-white border-white/30 hover:bg-white/10"
          >
            <Calendar size={14} /> View Appointments
          </Link>
        </div>
      </div>

      {/* Collection Stats Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--ink)]">
            Hospital Platform Overview
          </h2>
          <span className="text-xs text-[#5a7d92] font-medium">Live Database Counters</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                to={card.link}
                className="p-5 rounded-2xl bg-white border border-[rgba(22,55,76,0.12)] hover:border-[var(--teal)] hover:shadow-md transition text-decoration-none group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--mint)] flex items-center justify-center text-[var(--teal)] group-hover:bg-[var(--teal)] group-hover:text-white transition">
                    <Icon size={17} />
                  </div>
                  <ArrowUpRight size={14} className="text-[#89a4b3] group-hover:text-[var(--pink)] transition" />
                </div>
                <span className="font-display text-2xl font-bold text-[var(--ink)] block">
                  {loading ? '…' : card.count}
                </span>
                <span className="text-xs text-[#5a7d92] font-semibold block mt-0.5">
                  {card.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="p-6 rounded-2xl bg-white border border-[rgba(22,55,76,0.12)] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(22,55,76,0.1)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
              <Calendar size={15} className="text-[var(--pink)]" /> Recent Patient Bookings
            </h3>
            <Link to="/admin/appointments" className="text-xs font-bold text-[var(--coral)] hover:underline">
              View all →
            </Link>
          </div>

          {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
            <div className="space-y-2.5">
              {stats.recentAppointments.slice(0, 5).map((apt: any) => (
                <div key={apt.id} className="p-3.5 rounded-xl bg-[var(--cream)] border border-[rgba(22,55,76,0.08)] flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[var(--ink)] font-bold block">{apt.name}</strong>
                    <span className="text-[11px] text-[#5a7d92]">{apt.department || 'Consultation'} · {apt.phone}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-[var(--mint)] text-[var(--teal)]">
                    {apt.status || 'new'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#5a7d92] py-6 text-center">No recent appointments to display.</p>
          )}
        </div>

        {/* Recent Enquiries */}
        <div className="p-6 rounded-2xl bg-white border border-[rgba(22,55,76,0.12)] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(22,55,76,0.1)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
              <MessageSquare size={15} className="text-[var(--pink)]" /> Inquiries &amp; Messages
            </h3>
            <Link to="/admin/enquiries" className="text-xs font-bold text-[var(--coral)] hover:underline">
              View all →
            </Link>
          </div>

          {stats?.recentEnquiries && stats.recentEnquiries.length > 0 ? (
            <div className="space-y-2.5">
              {stats.recentEnquiries.slice(0, 5).map((enq: any) => (
                <div key={enq.id} className="p-3.5 rounded-xl bg-[var(--cream)] border border-[rgba(22,55,76,0.08)] flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[var(--ink)] font-bold block">{enq.name}</strong>
                    <span className="text-[11px] text-[#5a7d92] truncate max-w-xs block">{enq.subject || enq.message}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-[#fcebf3] text-[var(--coral)]">
                    {enq.status || 'new'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#5a7d92] py-6 text-center">No recent inquiries to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
