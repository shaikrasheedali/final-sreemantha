import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, KeyRound, AlertCircle, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StaffLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please provide both username and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login({ username, password });
      navigate('/admin');
    } catch (err: any) {
      console.error('Staff login error:', err);
      setError(err?.message || 'Invalid credentials or account locked. Please check your username and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-radial from-[#006c93]/20 via-transparent to-black pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#fa7830]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/logo.svg" alt="Sreemantha Hospital Logo" className="h-10 w-auto" />
            <span className="text-xl font-extrabold text-white font-heading tracking-tight">
              Sreemantha <span className="text-[#fa7830]">Hospital</span>
            </span>
          </Link>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
            <Lock className="w-3.5 h-3.5 text-[#fa7830]" /> Clinical & Administrative Portal
          </div>
          <h2 className="mt-3 text-2xl font-bold text-white font-heading">
            Hospital Staff Sign In
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Access CMS, appointments, clinical collections, and facility management.
          </p>
        </div>

        <div className="mt-8 bg-slate-800/90 backdrop-blur-md py-8 px-6 sm:px-10 rounded-3xl border border-slate-700 shadow-2xl">
          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Username or Staff ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. superadmin, admin, staff"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#006c93] to-[#073d59] hover:from-[#005a7b] hover:to-[#052e42] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick-Fill Demo Roles for Testing */}
          <div className="mt-8 pt-6 border-t border-slate-700/80">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Quick Fill Demo Accounts (Argon2 + JWT)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="quick-login-superadmin"
                onClick={() => handleQuickLogin('superadmin', 'SuperAdmin@2026')}
                className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600 text-center transition-colors cursor-pointer group"
              >
                <span className="block text-[11px] font-bold text-rose-400 group-hover:text-rose-300">
                  Superadmin
                </span>
                <span className="block text-[9px] text-slate-400">All Modules</span>
              </button>

              <button
                type="button"
                id="quick-login-admin"
                onClick={() => handleQuickLogin('admin', 'Admin@2026')}
                className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600 text-center transition-colors cursor-pointer group"
              >
                <span className="block text-[11px] font-bold text-emerald-400 group-hover:text-emerald-300">
                  Admin
                </span>
                <span className="block text-[9px] text-slate-400">Content & CMS</span>
              </button>

              <button
                type="button"
                id="quick-login-staff"
                onClick={() => handleQuickLogin('staff', 'Staff@2026')}
                className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600 text-center transition-colors cursor-pointer group"
              >
                <span className="block text-[11px] font-bold text-sky-400 group-hover:text-sky-300">
                  Staff
                </span>
                <span className="block text-[9px] text-slate-400">Clinical Editor</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
