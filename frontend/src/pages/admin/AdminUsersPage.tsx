import React, { useEffect, useState } from 'react';
import { ShieldCheck, Plus, Trash2, Edit3, KeyRound, Mail, AlertCircle, X, Check, Eye, EyeOff, Lock, UserCheck } from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const isAdmin = currentUser?.role === 'admin';

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Password visibility state by user id
  const [revealedPasswords, setRevealedPasswords] = useState<Record<number, boolean>>({});

  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    role: 'staff',
  });

  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    role: 'staff',
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ users: any[] }>('/auth/users');
      if (res.users) setUsers(res.users);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setError(err?.message || 'Failed to load user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const togglePasswordVisibility = (id: number) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await api.post('/auth/users', {
        ...createForm,
        role: isAdmin ? 'staff' : createForm.role,
      });
      showNotice(`User "${createForm.username}" created successfully with stored password.`);
      setIsCreating(false);
      setCreateForm({ username: '', email: '', name: '', password: '', role: 'staff' });
      await loadUsers();
    } catch (err: any) {
      setError(err?.message || 'Failed to create user account.');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (u: any) => {
    setEditingUser(u);
    setEditForm({
      username: u.username || '',
      email: u.email || '',
      name: u.name || u.fullName || u.full_name || '',
      password: u.stored_password || u.password || '',
      role: u.role || 'staff',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      setSaving(true);
      setError(null);
      await api.put(`/auth/users/${editingUser.id}`, {
        username: editForm.username,
        email: editForm.email,
        name: editForm.name,
        fullName: editForm.name,
        role: isSuperAdmin ? editForm.role : 'staff',
        password: editForm.password,
      });
      showNotice(`User account "${editForm.username}" updated successfully.`);
      setEditingUser(null);
      await loadUsers();
    } catch (err: any) {
      setError(err?.message || 'Failed to update user account.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (!window.confirm(`Are you sure you want to delete user account "${username}"?`)) return;
    try {
      await api.delete(`/auth/users/${id}`);
      showNotice(`User account "${username}" permanently deleted.`);
      await loadUsers();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete user.');
    }
  };

  // Determine if current user can edit a given user
  const canEditUser = (u: any) => {
    if (isSuperAdmin) return true;
    if (isAdmin && u.role === 'staff') return true;
    return false;
  };

  // Determine if current user can delete a given user
  const canDeleteUser = (u: any) => {
    if (String(u.id) === String(currentUser?.id)) return false;
    if (isSuperAdmin && u.username !== 'superadmin') return true;
    if (isAdmin && u.role === 'staff') return true;
    return false;
  };

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-6">
      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-600 text-white text-xs font-bold shadow-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-white hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(22,55,76,0.1)]">
        <div>
          <span className="text-[10px] font-bold text-[var(--coral)] uppercase tracking-wider block mb-1">
            Access Control &amp; RBAC Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] font-display">
            Users &amp; Roles
          </h1>
          <p className="text-xs text-[#5a7d92] mt-1">
            {isSuperAdmin
              ? 'Superadmin view: Manage all system accounts, view currently stored database passwords for admins and staff, and configure credentials.'
              : 'Hospital Administrator view: Create, edit, and view stored credentials for all clinical and operations staff accounts.'}
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#006c93] hover:bg-[#073d59] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" /> Add {isAdmin ? 'Staff Account' : 'User Account'}
          </button>
        )}
      </div>

      {isCreating ? (
        /* Create User Form */
        <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.12)] p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(22,55,76,0.12)] mb-6">
            <h2 className="text-lg font-bold text-[var(--ink)] font-display flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#006c93]" />
              Create New {isAdmin ? 'Staff' : 'System'} Account
            </h2>
            <button onClick={() => setIsCreating(false)} className="text-[#5a7d92] hover:text-[var(--ink)]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                  Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={createForm.username}
                  onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                  placeholder="e.g. dr_ananya"
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. Dr. Ananya K."
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="e.g. ananya@sreemantha.hospital"
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="Set initial password"
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] font-mono font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                Role &amp; Permissions
              </label>
              {isAdmin ? (
                <div className="p-3 rounded-xl bg-slate-100 text-xs font-bold text-[var(--ink)]">
                  Staff (Clinical &amp; Operations Staff) — Pre-assigned for Administrator
                </div>
              ) : (
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] font-medium"
                >
                  <option value="staff">Staff (Clinical Content Editor &amp; Triage)</option>
                  <option value="admin">Administrator (Hospital CMS &amp; Staff Management)</option>
                  <option value="superadmin">Superadmin (Master Authority)</option>
                </select>
              )}
            </div>

            <div className="pt-4 border-t border-[rgba(22,55,76,0.12)] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="btn btn-soft text-xs py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary text-xs py-2 px-6 bg-[#006c93] hover:bg-[#073d59] text-white font-bold shadow-md cursor-pointer disabled:opacity-60"
              >
                {saving ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Users Table */
        <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.12)] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--cream)] text-[#5a7d92] uppercase tracking-wider text-xs font-bold border-b border-[rgba(22,55,76,0.12)]">
                <tr>
                  <th className="px-6 py-4">Account User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Current Database Password</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(22,55,76,0.08)]">
                {users.map((u: any) => {
                  const hasPasswordAccess = Boolean(u.stored_password || u.password);
                  const isRevealed = Boolean(revealedPasswords[u.id]);
                  const canEdit = canEditUser(u);
                  const canDelete = canDeleteUser(u);

                  return (
                    <tr key={u.id} className="hover:bg-[var(--cream)]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[var(--ink)] text-sm">{u.name || u.fullName || u.username}</div>
                        <span className="text-xs text-[#5a7d92]">@{u.username}</span>
                      </td>
                      <td className="px-6 py-4 text-[var(--ink)] text-sm font-medium">{u.email || '—'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            u.role === 'superadmin'
                              ? 'bg-[#fcebf3] text-[var(--coral)] border border-[var(--coral)]/20'
                              : u.role === 'admin'
                              ? 'bg-[var(--mint)] text-[var(--teal)] border border-[var(--teal)]/20'
                              : 'bg-sky-100 text-sky-800 border border-sky-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {hasPasswordAccess ? (
                          <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                            <Lock size={13} className="text-[#006c93]" />
                            <span className="font-mono text-xs font-bold text-[var(--ink)] select-all">
                              {isRevealed ? (u.stored_password || u.password) : '••••••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(u.id)}
                              className="text-[#5a7d92] hover:text-[var(--ink)] p-1 transition-colors cursor-pointer"
                              title={isRevealed ? 'Hide password' : 'Show stored password'}
                            >
                              {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-[#8ba2b1] italic">Restricted</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#5a7d92] text-xs">
                        {u.created_at || u.createdAt ? new Date(u.created_at || u.createdAt).toLocaleDateString() : 'Active'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canEdit && (
                            <button
                              onClick={() => openEditModal(u)}
                              title="Edit user details or reset password"
                              className="p-2 rounded-xl bg-[#006c93]/10 hover:bg-[#006c93]/20 text-[#006c93] transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(u.id, u.username)}
                              title="Delete user"
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[var(--coral)] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-[rgba(7,61,89,0.7)] backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.15)] p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(22,55,76,0.1)]">
              <h3 className="text-base font-bold text-[var(--ink)] font-display flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#006c93]" />
                Edit Account: {editingUser.name || editingUser.username}
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-[#8ba2b1] hover:text-[var(--ink)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full bg-slate-50 border border-[rgba(22,55,76,0.18)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-[rgba(22,55,76,0.18)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-[rgba(22,55,76,0.18)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                  Current / New Password
                </label>
                <input
                  type="text"
                  required
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Enter or update password"
                  className="w-full bg-slate-50 border border-[rgba(22,55,76,0.18)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] font-mono font-medium"
                />
                <p className="text-[11px] text-[#5a7d92] mt-1">
                  Updating this field immediately stores the new password and updates the Argon2 cryptographic hash.
                </p>
              </div>

              {isSuperAdmin && (
                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                    Role &amp; Privilege Level
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full bg-slate-50 border border-[rgba(22,55,76,0.18)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] font-medium"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Administrator</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>
              )}

              <div className="pt-3 border-t border-[rgba(22,55,76,0.1)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="btn btn-soft text-xs py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary text-xs py-2 px-5 bg-[#006c93] hover:bg-[#073d59] text-white font-bold shadow-md cursor-pointer disabled:opacity-60"
                >
                  {saving ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
