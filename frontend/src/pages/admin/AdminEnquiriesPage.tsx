import React, { useEffect, useState } from 'react';
import { Search, MessageSquare, Phone, Mail, Clock, CheckCircle2, AlertCircle, X } from 'lucide-react';
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
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-lg">
          {notice}
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-[10px] font-bold text-[#fa7830] uppercase tracking-wider block mb-1">
          Communications & Patient Support
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
          Contact Enquiries
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Patient messages submitted via the public contact forms.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-800/90 rounded-3xl p-4 sm:p-6 border border-slate-700 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search enquiries by name, phone, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#006c93]"
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
            Loading contact enquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">No enquiries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3.5">Sender</th>
                  <th className="px-6 py-3.5">Subject & Message</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Received</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-xs">{enq.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-400" /> {enq.phone}
                      </div>
                      {enq.email && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {enq.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-sm">
                      <span className="inline-block text-[10px] font-bold text-[#006c93] uppercase tracking-wider">
                        {enq.subject || 'General Inquiry'}
                      </span>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{enq.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        enq.status === 'responded'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : enq.status === 'read'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {enq.status || 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-[11px]">
                      {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedEnquiry(enq);
                          setStatus(enq.status || 'new');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                      >
                        View & Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white font-heading">
                Message from {selectedEnquiry.name}
              </h3>
              <button onClick={() => setSelectedEnquiry(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl space-y-1">
                <p className="text-slate-400"><strong>Phone:</strong> {selectedEnquiry.phone}</p>
                {selectedEnquiry.email && <p className="text-slate-400"><strong>Email:</strong> {selectedEnquiry.email}</p>}
                <p className="text-slate-400"><strong>Subject:</strong> {selectedEnquiry.subject}</p>
                <div className="pt-2 border-t border-slate-800 text-slate-200">
                  <strong className="block text-slate-400 mb-1">Message Content:</strong>
                  <p className="leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300">
                    {selectedEnquiry.message}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Enquiry Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                >
                  <option value="new">New</option>
                  <option value="read">Read / In Review</option>
                  <option value="responded">Responded / Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-[#006c93] hover:bg-[#073d59] text-white text-xs font-bold"
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
