import React, { useEffect, useState } from 'react';
import { Search, Calendar, Phone, Mail, Clock, CheckCircle2, XCircle, AlertCircle, X, Check } from 'lucide-react';
import { api } from '../../utils/api';

export const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ appointments: any[] }>('/appointments');
      if (res.appointments) setAppointments(res.appointments);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const openModal = (app: any) => {
    setSelectedApp(app);
    setNotes(app.notes || '');
    setStatus(app.status || 'new');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    try {
      setSaving(true);
      await api.put(`/appointments/${selectedApp.id}`, { status, notes });
      setNotification(`Appointment #${selectedApp.id} updated.`);
      setTimeout(() => setNotification(null), 3000);
      setSelectedApp(null);
      await loadAppointments();
    } catch (err: any) {
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const filtered = appointments.filter((a) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (a.name || '').toLowerCase().includes(term) ||
      (a.phone || '').toLowerCase().includes(term) ||
      (a.department || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-lg">
          {notification}
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-[10px] font-bold text-[#fa7830] uppercase tracking-wider block mb-1">
          Patient Intake & OPD Schedule
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
          Appointment Requests
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review patient appointment enquiries, assign doctors, and update confirmation statuses.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-slate-800/90 rounded-3xl p-4 sm:p-6 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name, phone, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#006c93]"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {['all', 'new', 'contacted', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#006c93] text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
            Loading appointment records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">No appointment requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3.5">Patient Details</th>
                  <th className="px-6 py-3.5">Department & Doctor</th>
                  <th className="px-6 py-3.5">Preferred Slot</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-xs">{a.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-400" /> {a.phone}
                      </div>
                      {a.email && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {a.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200">{a.department}</div>
                      <div className="text-[11px] text-[#006c93] mt-0.5">
                        {a.doctor ? `Dr. ${a.doctor}` : 'Any Specialist'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 font-medium">
                        {a.preferred_date ? new Date(a.preferred_date).toLocaleDateString() : 'ASAP'}
                      </div>
                      <div className="text-[10px] text-slate-400">{a.preferred_time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        a.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : a.status === 'contacted'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : a.status === 'cancelled'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {a.status || 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(a)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Status and Notes */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white font-heading">
                Appointment #{selectedApp.id} - {selectedApp.name}
              </h3>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl space-y-1">
                <p className="text-slate-400"><strong>Patient:</strong> {selectedApp.name}</p>
                <p className="text-slate-400"><strong>Phone:</strong> {selectedApp.phone}</p>
                <p className="text-slate-400"><strong>Department:</strong> {selectedApp.department}</p>
                {selectedApp.message && (
                  <p className="text-slate-300 pt-2 border-t border-slate-800">
                    <strong>Message:</strong> {selectedApp.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Appointment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Internal Hospital Staff Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Called patient, token #14 assigned for morning OPD..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-[#006c93] hover:bg-[#073d59] text-white text-xs font-bold"
              >
                {saving ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
