import React, { useEffect, useState } from 'react';
import { FileText, Clock, User, ShieldCheck } from 'lucide-react';
import { api } from '../../utils/api';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        const res = await api.get<{ logs: any[] }>('/audit-logs');
        if (res.logs) setLogs(res.logs);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold text-[var(--coral)] uppercase tracking-wider block mb-1">
          Security & Traceability
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] font-display">
          System Audit Trail
        </h1>
        <p className="text-xs text-[#5a7d92] mt-1">
          Chronological record of clinical content updates, appointment status changes, and administrative actions.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.12)] overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-[#5a7d92] text-xs animate-pulse">
            Loading audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center text-[#5a7d92]">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#5a7d92]">No audit logs recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--cream)] text-[#5a7d92] uppercase tracking-wider text-[10px] font-bold border-b border-[rgba(22,55,76,0.12)]">
                <tr>
                  <th className="px-6 py-3.5">Action & Entity</th>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Details</th>
                  <th className="px-6 py-3.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--cream)]/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--cream)] text-[var(--ink)] border border-[rgba(22,55,76,0.12)] uppercase mr-2">
                        {log.action}
                      </span>
                      <span className="font-semibold text-white capitalize">{log.entity_type}</span>
                      {log.entity_id && (
                        <span className="text-[10px] text-[#5a7d92] ml-1.5">#{log.entity_id}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-[#5a7d92]">
                        <User className="w-3.5 h-3.5 text-[#5a7d92]" />
                        <span>{log.username || `User #${log.user_id}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#5a7d92] max-w-xs truncate text-[11px]">
                      {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details || '—'}
                    </td>
                    <td className="px-6 py-4 text-right text-[#5a7d92] text-[11px]">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
