import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/BrandLogo';

export const StaffLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="login-screen">
      {/* Left visual column */}
      <section className="login-visual">
        <img
          src="/images/hospital-exterior.webp"
          alt="Sreemantha Hospital Campus"
        />
        <BrandLogo theme="dark" />
        <div className="login-quote">
          <div className="eyebrow text-[var(--lime)]">Care, coordinated</div>
          <h1>Better tools for better care.</h1>
          <p>
            Manage hospital content, patient enquiries, clinical collections, and appointment requests from a secure, unified workspace.
          </p>
        </div>
      </section>

      {/* Right form panel */}
      <section className="login-panel relative">
        <Link
          to="/"
          className="round-btn back-site text-[var(--ink)]"
          aria-label="Back to website"
          title="Back to website"
        >
          <ArrowLeft size={18} />
        </Link>

        <div className="login-box">
          <div className="eyebrow mb-2">Admin Portal</div>
          <h2 className="mb-2">Hospital Staff Sign In</h2>
          <p className="sub mb-6 text-sm text-[#4e6373]">
            Authorized hospital personnel and administrators only.
          </p>

          {error && (
            <div className="error-message mb-5 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field mb-4">
              <label>Staff Username</label>
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="admin or staff username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="field mb-4">
              <label>Password</label>
              <div className="password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="login-options mb-6">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <span>Show password</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-dark form-submit w-full justify-center"
            >
              <Lock size={15} />
              <span>{loading ? 'Authenticating…' : 'Sign In to Portal'}</span>
            </button>
          </form>

          {/* Preset test credentials */}
          <div className="mt-8 pt-6 border-t border-[var(--line)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4e6373] block mb-2">
              Quick Personnel Sign-In (For Testing &amp; Review)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('superadmin', 'SuperAdmin@2026')}
                className="btn btn-soft text-xs justify-center py-2"
              >
                Superadmin
              </button>
              <button
                id="quick-login-admin"
                type="button"
                onClick={() => handleQuickLogin('admin', 'Admin@2026')}
                className="btn btn-soft text-xs justify-center py-2"
              >
                Administrator
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StaffLoginPage;
