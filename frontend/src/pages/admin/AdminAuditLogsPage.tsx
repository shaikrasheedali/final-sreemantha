import React, { useEffect, useState } from 'react';
import { FileText, User } from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const mentionsSuperAdmin = (log: any): boolean => {
  let serialized = '';
  try {
    serialized = JSON.stringify(log);
  } catch {
    serialized = `${log?.user_name || log?.username || ''} ${log?.details || ''}`;
  }
  return serialized.toLowerCase().replace(/[^a-z0-9]+/g, '').includes('superadmin');
};

export const AdminAuditLogsPage: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const visibleLogs =
    user?.role === 'superadmin' ? logs : logs.filter((log) => !mentionsSuperAdmin(log));

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get<{ auditLogs?: any[]; logs?: any[] }>('/audit-logs');
        setLogs(res.auditLogs || res.logs || []);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
        setError('Audit history is not available for this account.');
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
        ) : error ? (
          <div className="py-20 text-center text-[#5a7d92]">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#5a7d92]">{error}</p>
          </div>
        ) : visibleLogs.length === 0 ? (
          <div className="py-20 text-center text-[#5a7d92]">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#5a7d92]">No audit logs recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--cream)] text-[#5a7d92] uppercase tracking-wider text-xs font-bold border-b border-[rgba(22,55,76,0.12)]">
                <tr>
                  <th className="px-6 py-4">Action &amp; Entity</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(22,55,76,0.08)]">
                {visibleLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--cream)]/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[var(--mint)] text-[var(--teal)] border border-[var(--teal)]/20 uppercase mr-2">
                        {log.action}
                      </span>
                      <span className="font-bold text-[var(--ink)] text-sm capitalize">{log.entity_type}</span>
                      {log.entity_id && (
                        <span className="text-xs text-[#5a7d92] ml-1.5">#{log.entity_id}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-[var(--ink)] text-sm">
                        <User className="w-4 h-4 text-[var(--teal)]" />
                        <span>{log.user_name || log.username || 'System'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#5a7d92] max-w-xs truncate text-xs">
                      {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details || '—'}
                    </td>
                    <td className="px-6 py-4 text-right text-[#5a7d92] text-xs">
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
