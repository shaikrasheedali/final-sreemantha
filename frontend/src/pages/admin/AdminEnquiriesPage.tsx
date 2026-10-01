import React, { useEffect, useState } from 'react';
import { Search, MessageSquare, Phone, Mail, CheckCircle2, X } from 'lucide-react';
import { api } from '../../utils/api';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [status, setStatus] = useState('new');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

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

  const handleUpdate = async () => {
    if (!selectedEnquiry) return;
    try {
      setSaving(true);
      await api.put(`/enquiries/${selectedEnquiry.id}`, { status });
      setNotice(`Enquiry #${selectedEnquiry.id} updated.`);
      setTimeout(() => setNotice(null), 3000);
      setSelectedEnquiry(null);
      await loadEnquiries();
    } catch (err) {
      console.error('Enquiry update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const filtered = enquiries.filter((e) => {
    const term = search.toLowerCase();
    return (
      (e.name || '').toLowerCase().includes(term) ||
      (e.phone || '').toLowerCase().includes(term) ||
      (e.subject || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {notice && (
        <div className="p-4 rounded-xl bg-[var(--teal)] text-[var(--ink)] text-xs font-bold shadow-md flex items-center gap-2">
          <CheckCircle2 size={16} /> {notice}
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-[11px] font-extrabold text-[var(--coral)] uppercase tracking-[0.16em] block mb-1">
          Communications &amp; Patient Support
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--ink)] tracking-tight">
          Contact Enquiries
        </h1>
        <p className="text-xs text-[#5a7d92] mt-1">
          Patient messages submitted via the public contact forms.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[rgba(22,55,76,0.12)] shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8ba2b1] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search enquiries by name, phone, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-2xl border border-[rgba(22,55,76,0.12)] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-[#5a7d92] text-xs animate-pulse">
            Loading contact enquiries...
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
                  <th className="px-6 py-4">Received</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(22,55,76,0.06)]">
                {filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[var(--cream)]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--ink)] text-sm">{enq.name}</div>
                      <div className="text-xs text-[#5a7d92] flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-[var(--teal)]" /> {enq.phone}
                      </div>
                      {enq.email && (
                        <div className="text-xs text-[#8ba2b1] flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3.5 h-3.5" /> {enq.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--ink)] text-sm">{enq.subject || 'General Enquiry'}</div>
                      <div className="text-xs text-[#5a7d92] line-clamp-1 mt-0.5">
                        {enq.message}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full capitalize ${
                        enq.status === 'contacted'
                          ? 'bg-sky-100 text-sky-800'
                          : enq.status === 'closed'
                          ? 'bg-[var(--cream)] text-[#5a7d92]'
                          : 'bg-[#fcebf3] text-[var(--coral)]'
                      }`}>
                        {enq.status || 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#5a7d92] text-xs">
                      {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedEnquiry(enq);
                          setStatus(enq.status || 'new');
                        }}
                        className="btn btn-soft text-xs font-bold py-1.5 px-3.5"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
                <p className="text-[var(--ink)]"><strong>Phone:</strong> {selectedEnquiry.phone}</p>
                <p className="text-[var(--ink)]"><strong>Email:</strong> {selectedEnquiry.email || 'N/A'}</p>
                <p className="text-[var(--ink)]"><strong>Subject:</strong> {selectedEnquiry.subject || 'General'}</p>
                <div className="pt-2 border-t border-[rgba(22,55,76,0.08)]">
                  <strong className="block text-[var(--ink)] mb-0.5">Message:</strong>
                  <p className="text-[#5a7d92] leading-relaxed whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </p>
                </div>
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

            <div className="pt-3 border-t border-[rgba(22,55,76,0.1)] flex justify-end gap-2">
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
                {saving ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiriesPage;
