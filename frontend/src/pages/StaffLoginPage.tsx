import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
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
    if (!username.trim() || !password) {
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
      setError(err?.message || 'Invalid credentials. Please verify your staff credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-[#183f3d] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 text-decoration-none">
            <div className="w-12 h-12 rounded-full bg-[#e8eee5] p-2 flex items-center justify-center border border-[#cbd7c6] shadow-md">
              <img src="/favicon.svg" alt="Sreemantha Emblem" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif text-2xl text-white font-medium">Sreemantha</span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-[#d0ddc2] font-bold">Hospital · Khammam</span>
            </div>
          </Link>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#234c49] text-[#d0ddc2] text-[11px] font-semibold">
            <ShieldCheck size={14} /> Clinical &amp; Administrative CMS
          </div>
          <h2 className="mt-3 font-serif text-2xl text-white">Hospital Staff Sign In</h2>
          <p className="text-xs text-[#d3dfdb] mt-1">Authorized hospital personnel and administrators only.</p>
        </div>

        {/* Card */}
        <div className="bg-[#fffefb] p-8 sm:p-10 rounded-2xl border border-[#cbd7c6] shadow-xl">
          {error && (
            <div className="p-3.5 mb-6 rounded-lg bg-[#f9e9ec] border border-[#f0c2cd] text-[#8f4160] text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="sr-label">Staff Username</label>
              <div className="relative">
                <User size={15} className="text-[#596966] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="admin or staff username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="sr-input pl-10 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="sr-label">Password</label>
              <div className="relative">
                <KeyRound size={15} className="text-[#596966] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="sr-input pl-10 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="sr-button w-full justify-center"
            >
              <Lock size={15} />
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          {/* Quick preset credentials helper for administrator */}
          <div className="mt-8 pt-6 border-t border-[#e0e5dd]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#596966] block mb-2">
              Quick Personnel Sign-In
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('superadmin', 'SuperAdmin@2026')}
                className="px-2.5 py-1.5 rounded bg-[#f4f2e8] hover:bg-[#e8eee5] text-[11px] font-medium text-[#183f3d] border border-[#e0e5dd] transition text-left cursor-pointer"
              >
                Superadmin
              </button>
              <button
                id="quick-login-admin"
                type="button"
                onClick={() => handleQuickLogin('admin', 'Admin@2026')}
                className="px-2.5 py-1.5 rounded bg-[#f4f2e8] hover:bg-[#e8eee5] text-[11px] font-medium text-[#183f3d] border border-[#e0e5dd] transition text-left cursor-pointer"
              >
                Administrator
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-[#d0ddc2] hover:text-white transition inline-flex items-center gap-1">
            ← Return to Hospital Website
          </Link>
        </div>
      </div>
    </div>
  );
};
