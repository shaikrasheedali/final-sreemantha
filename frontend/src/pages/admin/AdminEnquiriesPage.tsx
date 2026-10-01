import React, { useEffect, useState } from 'react';
import { Search, MessageSquare, Phone, Mail, CheckCircle2, X, Trash2, MessageCircle, AlertTriangle } from 'lucide-react';
import { api } from '../../utils/api';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState('new');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ enquiries: any[] }>('/enquiries');
      if (res.enquiries) setEnquiries(res.enquiries);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdate = async () => {
    if (!selectedEnquiry) return;
    try {
      setSaving(true);
      await api.put(`/enquiries/${selectedEnquiry.id}`, { status });
      showToast(`Enquiry #${selectedEnquiry.id} updated.`);
      setSelectedEnquiry(null);
      await loadEnquiries();
    } catch (err) {
      console.error('Enquiry update error:', err);
      showToast('Failed to update enquiry status.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleting(true);
      await api.delete(`/enquiries/${id}`);
      showToast(`Enquiry #${id} permanently deleted.`);
      setDeleteConfirmId(null);
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      await loadEnquiries();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete enquiry.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = enquiries.filter((e) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (e.name || '').toLowerCase().includes(term) ||
      (e.phone || '').toLowerCase().includes(term) ||
      (e.email || '').toLowerCase().includes(term) ||
      (e.subject || '').toLowerCase().includes(term);
    const itemStatus = (e.status || 'new').toLowerCase();
    const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
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
            Contact &amp; Support Enquiries
          </h2>
          <p className="text-xs text-[#5a7d92] mt-0.5">
            Incoming patient questions, clinical inquiries, direct WhatsApp and call assistance, and resolved ticket management.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#8ba2b1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search enquiries by name, phone, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[rgba(22,55,76,0.12)] rounded-full pl-10 pr-4 py-2 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'new', 'contacted', 'closed'].map((st) => (
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

      {/* Enquiries Table */}
      <div className="bg-white rounded-2xl border border-[rgba(22,55,76,0.12)] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-[#5a7d92] text-xs animate-pulse">
            Loading enquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[#5a7d92]">
            <MessageSquare className="w-12 h-12 text-[#9bb0bc] mx-auto mb-2" />
            <p className="text-sm font-bold text-[var(--ink)]">No enquiries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--cream)] text-[#5a7d92] uppercase tracking-wider text-xs font-bold border-b border-[rgba(22,55,76,0.1)]">
                <tr>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Subject &amp; Message</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Direct Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(22,55,76,0.06)]">
                {filtered.map((enq) => {
                  const cleanPhone = (enq.phone || '').replace(/\D/g, '');
                  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${enq.name}, contacting you from Sreemantha Hospital regarding your enquiry "${enq.subject || 'Clinical Enquiry'}".`
                  )}`;
                  const telUrl = `tel:${(enq.phone || '').replace(/\s+/g, '')}`;

                  return (
                    <tr key={enq.id} className="hover:bg-[var(--cream)]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[var(--ink)] text-sm">{enq.name}</div>
                        {enq.phone && (
                          <div className="text-xs text-[#5a7d92] flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-[var(--teal)]" /> {enq.phone}
                          </div>
                        )}
                        {enq.email && (
                          <div className="text-xs text-[#8ba2b1] flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3.5 h-3.5" /> {enq.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <div className="font-bold text-[var(--ink)] text-sm">{enq.subject || 'General Enquiry'}</div>
                        <div className="text-xs text-[#5a7d92] line-clamp-2 mt-0.5 leading-relaxed">
                          {enq.message}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block text-xs font-bold px-3 py-1 rounded-full capitalize ${
                            enq.status === 'contacted'
                              ? 'bg-sky-100 text-sky-800'
                              : enq.status === 'closed'
                              ? 'bg-[var(--cream)] text-[#5a7d92]'
                              : 'bg-[#fcebf3] text-[var(--coral)]'
                          }`}
                        >
                          {enq.status || 'new'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#5a7d92] text-xs">
                        {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Button */}
                          {cleanPhone && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white flex items-center justify-center transition-all shadow-xs"
                              title={`Chat with ${enq.name} on WhatsApp`}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}

                          {/* Call Button */}
                          {enq.phone && (
                            <a
                              href={telUrl}
                              className="w-8 h-8 rounded-lg bg-[var(--deep)]/10 hover:bg-[var(--deep)] text-[var(--deep)] hover:text-white flex items-center justify-center transition-all shadow-xs"
                              title={`Call ${enq.name} (${enq.phone})`}
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}

                          {/* Review Modal Trigger */}
                          <button
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setStatus(enq.status || 'new');
                            }}
                            className="btn btn-soft text-xs font-bold py-1.5 px-3"
                            title="Review Enquiry Details"
                          >
                            Review
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteConfirmId(enq.id)}
                            className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                            title="Delete Enquiry Record"
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
                Delete Enquiry?
              </h3>
            </div>
            <p className="text-xs text-[#5a7d92] leading-relaxed">
              Are you sure you want to permanently remove Enquiry #{deleteConfirmId}? This item will be permanently erased from the database.
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

      {/* Review Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-[rgba(7,61,89,0.6)] backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.15)] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(22,55,76,0.1)]">
              <h3 className="text-base font-bold text-[var(--ink)] font-display">
                Enquiry #{selectedEnquiry.id}
              </h3>
              <button onClick={() => setSelectedEnquiry(null)} className="text-[#8ba2b1] hover:text-[var(--ink)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[var(--cream)] rounded-xl space-y-1.5 border border-[rgba(22,55,76,0.06)]">
                <p className="text-[var(--ink)]"><strong>From:</strong> {selectedEnquiry.name}</p>
                <p className="text-[var(--ink)]"><strong>Phone:</strong> {selectedEnquiry.phone || 'N/A'}</p>
                <p className="text-[var(--ink)]"><strong>Email:</strong> {selectedEnquiry.email || 'N/A'}</p>
                <p className="text-[var(--ink)]"><strong>Subject:</strong> {selectedEnquiry.subject || 'General'}</p>
                <div className="pt-2 border-t border-[rgba(22,55,76,0.08)]">
                  <strong className="block text-[var(--ink)] mb-0.5">Message:</strong>
                  <p className="text-[#5a7d92] leading-relaxed whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </p>
                </div>
              </div>

              {/* Direct Quick Contact Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {selectedEnquiry.phone && (
                  <>
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hello ${selectedEnquiry.name}, regarding your enquiry at Sreemantha Hospital.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-bold transition-all shadow-sm"
                    >
                      <MessageCircle size={15} /> WhatsApp
                    </a>
                    <a
                      href={`tel:${selectedEnquiry.phone.replace(/\s+/g, '')}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#073d59] hover:bg-[#006c93] text-white font-bold transition-all shadow-sm"
                    >
                      <Phone size={14} /> Call
                    </a>
                  </>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1">
                  Enquiry Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-white border border-[rgba(22,55,76,0.18)] rounded-xl px-4 py-2 text-xs text-[var(--ink)]"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[rgba(22,55,76,0.1)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmId(selectedEnquiry.id);
                }}
                className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="btn btn-soft text-xs py-2 px-4"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={saving}
                  className="btn btn-primary text-xs py-2 px-4"
                >
                  {saving ? 'Updating...' : 'Save Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiriesPage;
