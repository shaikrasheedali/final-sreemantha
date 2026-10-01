import React, { useEffect, useState } from 'react';
import { ShieldCheck, Plus, Trash2, User, KeyRound, Mail, AlertCircle, X, Check } from 'lucide-react';
import { api } from '../../utils/api';
import { User as UserType } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    role: 'staff'
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ users: UserType[] }>('/auth/users');
      if (res.users) setUsers(res.users);
    } catch (err: any) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await api.post('/auth/users', formData);
      setNotice(`User ${formData.username} created with secure Argon2 credentials.`);
      setTimeout(() => setNotice(null), 3000);
      setIsCreating(false);
      setFormData({ username: '', email: '', name: '', password: '', role: 'staff' });
      await loadUsers();
    } catch (err: any) {
      setError(err?.message || 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (!window.confirm(`Are you sure you want to delete user account "${username}"?`)) return;
    try {
      await api.delete(`/auth/users/${id}`);
      setNotice(`User ${username} removed.`);
      setTimeout(() => setNotice(null), 3000);
      await loadUsers();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-6">
      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-[var(--ink)] text-xs font-bold shadow-lg">
          {notice}
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-600 text-[var(--ink)] text-xs font-bold shadow-lg">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
            Access Control & RBAC
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] font-display">
            Staff & System User Accounts
          </h1>
          <p className="text-xs text-[#5a7d92] mt-1">
            Manage permissions and access levels: <strong>superadmin</strong>, <strong>admin</strong>, and <strong>staff</strong>.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#006c93] hover:bg-[#073d59] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            <Plus className="w-4 h-4 text-white" /> Add User Account
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.12)] p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(22,55,76,0.12)] mb-6">
            <h2 className="text-lg font-bold text-[var(--ink)] font-display">Create New Staff User</h2>
            <button onClick={() => setIsCreating(false)} className="text-[#5a7d92] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                  Username <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. dr_priya"
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Priya Rao"
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. priya@sreemanthahospital.com"
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                  Password (Hashed via Argon2) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Strong password"
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                Role & Permissions
              </label>
              <select
                value={formData.role}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2 text-xs text-white"
              >
                <option value="staff">Staff (Clinical Content Editor)</option>
                <option value="admin">Administrator (CMS & Operations)</option>
                <option value="superadmin">Superadmin (All Privileges)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[rgba(22,55,76,0.12)] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl bg-[var(--cream)] text-[#5a7d92] border border-[rgba(22,55,76,0.12)] text-[#5a7d92] text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-xl bg-[#006c93] hover:bg-[#073d59] text-[var(--ink)] text-xs font-bold"
              >
                {saving ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.12)] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--cream)] text-[#5a7d92] uppercase tracking-wider text-xs font-bold border-b border-[rgba(22,55,76,0.12)]">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(22,55,76,0.08)]">
                {users.map((u: UserType) => (
                  <tr key={u.id} className="hover:bg-[var(--cream)]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--ink)] text-sm">{u.name || u.username}</div>
                      <span className="text-xs text-[#5a7d92]">@{u.username}</span>
                    </td>
                    <td className="px-6 py-4 text-[var(--ink)] text-sm font-medium">{u.email || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        u.role === 'superadmin'
                          ? 'bg-[#fcebf3] text-[var(--coral)] border border-[var(--coral)]/20'
                          : u.role === 'admin'
                          ? 'bg-[var(--mint)] text-[var(--teal)] border border-[var(--teal)]/20'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#5a7d92] text-xs">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'System'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.username !== 'superadmin' && (
                        <button
                          onClick={() => handleDelete(u.id, u.username)}
                          title="Delete user"
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[var(--coral)] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
