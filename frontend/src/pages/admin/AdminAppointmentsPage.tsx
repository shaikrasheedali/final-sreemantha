import React, { useEffect, useState } from 'react';
import { Search, Calendar, Phone, Mail, CheckCircle2, X } from 'lucide-react';
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {notification && (
        <div className="p-4 rounded-xl bg-[var(--teal)] text-[var(--ink)] text-xs font-bold shadow-md flex items-center gap-2">
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-[11px] font-extrabold text-[var(--coral)] uppercase tracking-[0.16em] block mb-1">
          Patient Intake &amp; OPD Schedule
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--ink)] tracking-tight">
          Appointment Requests
        </h1>
        <p className="text-xs text-[#5a7d92] mt-1">
          Review patient appointment enquiries, assign doctors, and update confirmation statuses.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[rgba(22,55,76,0.12)] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8ba2b1] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name, phone, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {['all', 'new', 'contacted', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-[var(--deep)] text-white shadow-xs'
                  : 'bg-[var(--cream)] text-[#5a7d92] hover:text-[var(--ink)] border border-[rgba(22,55,76,0.08)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl border border-[rgba(22,55,76,0.12)] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-[#5a7d92] text-xs animate-pulse">
            Loading appointment records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[#5a7d92]">
            <Calendar className="w-12 h-12 text-[#9bb0bc] mx-auto mb-2" />
            <p className="text-sm font-bold text-[var(--ink)]">No appointment requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--cream)] text-[#5a7d92] uppercase tracking-wider text-[10px] font-bold border-b border-[rgba(22,55,76,0.1)]">
                <tr>
                  <th className="px-6 py-3.5">Patient Details</th>
                  <th className="px-6 py-3.5">Department &amp; Doctor</th>
                  <th className="px-6 py-3.5">Preferred Slot</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(22,55,76,0.06)]">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-[var(--cream)]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--ink)] text-xs">{a.name}</div>
                      <div className="text-[11px] text-[#5a7d92] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[var(--teal)]" /> {a.phone}
                      </div>
                      {a.email && (
                        <div className="text-[10px] text-[#8ba2b1] flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {a.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[var(--ink)]">{a.department}</div>
                      <div className="text-[11px] text-[var(--teal)] font-medium mt-0.5">
                        {a.doctor ? `Dr. ${a.doctor}` : 'Any Specialist'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[var(--ink)] font-medium">
                        {a.preferred_date ? new Date(a.preferred_date).toLocaleDateString() : 'ASAP'}
                      </div>
                      <div className="text-[10px] text-[#8ba2b1]">{a.preferred_time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        a.status === 'confirmed'
                          ? 'bg-[var(--mint)] text-[var(--teal)] border border-[var(--teal)]/20'
                          : a.status === 'contacted'
                          ? 'bg-sky-100 text-sky-800'
                          : a.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-[#fff1d8] text-[#a56a22]'
                      }`}>
                        {a.status || 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(a)}
                        className="btn btn-soft text-xs py-1.5 px-3"
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
        <div className="fixed inset-0 z-50 bg-[rgba(7,61,89,0.6)] backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.15)] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(22,55,76,0.1)]">
              <h3 className="text-base font-bold text-[var(--ink)] font-display">
                Appointment #{selectedApp.id} - {selectedApp.name}
              </h3>
              <button onClick={() => setSelectedApp(null)} className="text-[#8ba2b1] hover:text-[var(--ink)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[var(--cream)] rounded-xl space-y-1 border border-[rgba(22,55,76,0.06)]">
                <p className="text-[var(--ink)]"><strong>Patient:</strong> {selectedApp.name}</p>
                <p className="text-[var(--ink)]"><strong>Phone:</strong> {selectedApp.phone}</p>
                <p className="text-[var(--ink)]"><strong>Department:</strong> {selectedApp.department}</p>
                {selectedApp.message && (
                  <p className="text-[#5a7d92] pt-2 border-t border-[rgba(22,55,76,0.08)]">
                    <strong>Message:</strong> {selectedApp.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  Appointment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-white border border-[rgba(22,55,76,0.18)] rounded-xl px-4 py-2 text-xs text-[var(--ink)]"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  Internal Hospital Staff Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Called patient, token #14 assigned for morning OPD..."
                  className="w-full bg-white border border-[rgba(22,55,76,0.18)] rounded-xl px-4 py-2 text-xs text-[var(--ink)]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[rgba(22,55,76,0.1)] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="btn btn-soft text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={saving}
                className="btn btn-primary text-xs py-2 px-4"
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

export default AdminAppointmentsPage;
