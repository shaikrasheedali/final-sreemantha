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
  ArrowRight,
  ShieldCheck,
  Clock,
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
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#183f3d] text-white p-8 sm:p-10 rounded-2xl border border-[#2b5a57] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d0ddc2] block mb-1">
            Clinical Administration &amp; Hospital CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal">
            Welcome back, {user?.name || user?.username}
          </h1>
          <p className="text-xs text-[#d3dfdb] mt-1.5">
            Role: <span className="capitalize font-semibold text-[#d0ddc2]">{user?.role}</span> · Sreemantha Hospital, Khammam
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/settings"
            className="sr-button sr-button--light text-xs"
          >
            <Sparkles size={14} /> Favicon &amp; Settings
          </Link>
          <Link
            to="/admin/appointments"
            className="sr-button sr-button--outline text-xs text-white border-[#dce1d7] hover:bg-[#285854]"
          >
            <Calendar size={14} /> View Appointments
          </Link>
        </div>
      </div>

      {/* Collection Stats Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#183f3d]">
            Hospital Platform Overview
          </h2>
          <span className="text-xs text-[#596966]">Live Database Counters</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                to={card.link}
                className="p-5 rounded-xl bg-[#fffefb] border border-[#e0e5dd] hover:border-[#183f3d] hover:shadow-sm transition text-decoration-none group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e8eee5] flex items-center justify-center text-[#183f3d]">
                    <Icon size={16} />
                  </div>
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:text-[#8f4160] transition" />
                </div>
                <span className="font-serif text-2xl font-bold text-[#183f3d] block">
                  {loading ? '…' : card.count}
                </span>
                <span className="text-xs text-[#596966] font-medium block mt-0.5">
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
        <div className="p-6 rounded-2xl bg-[#fffefb] border border-[#e0e5dd] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e0e5dd]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#183f3d] flex items-center gap-2">
              <Calendar size={15} className="text-[#8f4160]" /> Recent Patient Bookings
            </h3>
            <Link to="/admin/appointments" className="text-xs font-semibold text-[#8f4160] hover:underline">
              View all →
            </Link>
          </div>

          {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
            <div className="space-y-2.5">
              {stats.recentAppointments.slice(0, 5).map((apt: any) => (
                <div key={apt.id} className="p-3 rounded-lg bg-[#faf8f3] border border-[#e0e5dd] flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[#183f3d] block">{apt.name}</strong>
                    <span className="text-[11px] text-[#596966]">{apt.department || 'Consultation'} · {apt.phone}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#e8eee5] text-[#183f3d]">
                    {apt.status || 'new'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#596966] py-6 text-center">No recent appointments to display.</p>
          )}
        </div>

        {/* Recent Enquiries */}
        <div className="p-6 rounded-2xl bg-[#fffefb] border border-[#e0e5dd] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e0e5dd]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#183f3d] flex items-center gap-2">
              <MessageSquare size={15} className="text-[#8f4160]" /> Inquiries &amp; Messages
            </h3>
            <Link to="/admin/enquiries" className="text-xs font-semibold text-[#8f4160] hover:underline">
              View all →
            </Link>
          </div>

          {stats?.recentEnquiries && stats.recentEnquiries.length > 0 ? (
            <div className="space-y-2.5">
              {stats.recentEnquiries.slice(0, 5).map((enq: any) => (
                <div key={enq.id} className="p-3 rounded-lg bg-[#faf8f3] border border-[#e0e5dd] flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[#183f3d] block">{enq.name}</strong>
                    <span className="text-[11px] text-[#596966] truncate max-w-xs block">{enq.subject || enq.message}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#f4e7e9] text-[#8f4160]">
                    {enq.status || 'new'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#596966] py-6 text-center">No recent inquiries to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};
