import React, { useEffect, useState } from 'react';
import { Search, Calendar, Phone, Mail, CheckCircle2, X, Trash2, MessageCircle, AlertTriangle } from 'lucide-react';
import { api } from '../../utils/api';

export const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

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
      showToast(`Appointment #${selectedApp.id} updated.`);
      setSelectedApp(null);
      await loadAppointments();
    } catch (err: any) {
      console.error('Update error:', err);
      showToast('Failed to update appointment.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleting(true);
      await api.delete(`/appointments/${id}`);
      showToast(`Appointment #${id} permanently deleted.`);
      setDeleteConfirmId(null);
      if (selectedApp?.id === id) setSelectedApp(null);
      await loadAppointments();
    } catch (err: any) {
      console.error('Delete error:', err);
      showToast('Failed to delete appointment.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = appointments.filter((a) => {
    const term = search.toLowerCase();
    const patientName = a.patient_name || a.name || '';
    const matchesSearch =
      patientName.toLowerCase().includes(term) ||
      (a.phone || '').toLowerCase().includes(term) ||
      (a.department || '').toLowerCase().includes(term) ||
      (a.doctor_name || a.doctor || '').toLowerCase().includes(term);
    const itemStatus = (a.status || 'new').toLowerCase();
    const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-[var(--teal)] text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(22,55,76,0.1)]">
        <div>
          <h2 className="text-xl font-bold text-[var(--ink)] font-display">
            Appointment Requests
          </h2>
          <p className="text-xs text-[#5a7d92] mt-0.5">
            Review outpatient requests, update triage notes, call or WhatsApp patients directly, or resolve records.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#8ba2b1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by patient name, phone, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[rgba(22,55,76,0.12)] rounded-full pl-10 pr-4 py-2 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--cream)] text-[#5a7d92] uppercase tracking-wider text-xs font-bold border-b border-[rgba(22,55,76,0.1)]">
                <tr>
                  <th className="px-6 py-4">Patient Details</th>
                  <th className="px-6 py-4">Department &amp; Doctor</th>
                  <th className="px-6 py-4">Preferred Slot</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Direct Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(22,55,76,0.06)]">
                {filtered.map((a) => {
                  const patientName = a.patient_name || a.name || 'Anonymous';
                  const cleanPhone = (a.phone || '').replace(/\D/g, '');
                  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${patientName}, regarding your appointment request at Sreemantha Hospital for ${a.department || 'Specialist Consultation'}.`
                  )}`;
                  const telUrl = `tel:${(a.phone || '').replace(/\s+/g, '')}`;

                  return (
                    <tr key={a.id} className="hover:bg-[var(--cream)]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[var(--ink)] text-sm">{patientName}</div>
                        <div className="text-xs text-[#5a7d92] flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-[var(--teal)]" /> {a.phone}
                        </div>
                        {a.email && (
                          <div className="text-xs text-[#8ba2b1] flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3.5 h-3.5" /> {a.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[var(--ink)] text-sm">{a.department || 'General'}</div>
                        <div className="text-xs text-[var(--teal)] font-medium mt-0.5">
                          {a.doctor_name || a.doctor ? `Dr. ${a.doctor_name || a.doctor}` : 'Any Specialist'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[var(--ink)] font-semibold text-sm">
                          {a.preferred_date ? new Date(a.preferred_date).toLocaleDateString() : 'ASAP'}
                        </div>
                        <div className="text-xs text-[#8ba2b1] mt-0.5">{a.preferred_time || 'General Slot'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block text-xs font-bold px-3 py-1 rounded-full capitalize ${
                            a.status === 'confirmed'
                              ? 'bg-[var(--mint)] text-[var(--teal)] border border-[var(--teal)]/20'
                              : a.status === 'contacted'
                              ? 'bg-sky-100 text-sky-800'
                              : a.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : a.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-[#fff1d8] text-[#a56a22]'
                          }`}
                        >
                          {a.status || 'new'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Direct */}
                          {cleanPhone && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white flex items-center justify-center transition-all shadow-xs"
                              title={`Chat with ${patientName} on WhatsApp`}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}

                          {/* Direct Phone Call */}
                          {a.phone && (
                            <a
                              href={telUrl}
                              className="w-8 h-8 rounded-lg bg-[var(--deep)]/10 hover:bg-[var(--deep)] text-[var(--deep)] hover:text-white flex items-center justify-center transition-all shadow-xs"
                              title={`Call ${patientName} (${a.phone})`}
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}

                          {/* Manage Button */}
                          <button
                            onClick={() => openModal(a)}
                            className="btn btn-soft text-xs font-bold py-1.5 px-3"
                            title="Manage Status & Notes"
                          >
                            Manage
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteConfirmId(a.id)}
                            className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                            title="Delete Appointment Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-[rgba(7,61,89,0.6)] backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.15)] p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-[var(--ink)] font-display">
                Delete Appointment?
              </h3>
            </div>
            <p className="text-xs text-[#5a7d92] leading-relaxed">
              Are you sure you want to permanently remove Appointment #{deleteConfirmId}? This action directly updates the database and cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-soft text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Status and Notes */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-[rgba(7,61,89,0.6)] backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.15)] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(22,55,76,0.1)]">
              <h3 className="text-base font-bold text-[var(--ink)] font-display">
                Appointment #{selectedApp.id} - {selectedApp.patient_name || selectedApp.name}
              </h3>
              <button onClick={() => setSelectedApp(null)} className="text-[#8ba2b1] hover:text-[var(--ink)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[var(--cream)] rounded-xl space-y-1.5 border border-[rgba(22,55,76,0.06)]">
                <p className="text-[var(--ink)]"><strong>Patient:</strong> {selectedApp.patient_name || selectedApp.name}</p>
                <p className="text-[var(--ink)]"><strong>Phone:</strong> {selectedApp.phone}</p>
                <p className="text-[var(--ink)]"><strong>Department:</strong> {selectedApp.department}</p>
                {selectedApp.reason && (
                  <p className="text-[#5a7d92] pt-2 border-t border-[rgba(22,55,76,0.08)]">
                    <strong>Reason:</strong> {selectedApp.reason}
                  </p>
                )}
              </div>

              {/* Patient Quick Contact Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`https://wa.me/${(selectedApp.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedApp.patient_name || selectedApp.name}, contacting you from Sreemantha Hospital.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-bold transition-all shadow-sm"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
                <a
                  href={`tel:${(selectedApp.phone || '').replace(/\s+/g, '')}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#073d59] hover:bg-[#006c93] text-white font-bold transition-all shadow-sm"
                >
                  <Phone size={14} /> Call Patient
                </a>
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

            <div className="pt-3 border-t border-[rgba(22,55,76,0.1)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmId(selectedApp.id);
                }}
                className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete
              </button>

              <div className="flex items-center gap-2">
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
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentsPage;
