import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import InputField from '../../../components/ui/InputField';
import Button from '../../../components/ui/Button';
import GlassCard from '../../../components/ui/GlassCard';
import { Lock, Mail, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';
import authService from '../../../services/authService';

export const AdminLoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Please enter your institutional email address.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      setError('Invalid email or password. Please check your credentials and try again.');
      setPassword('');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        email: normalizedEmail,
        password,
      });

      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;

      if (!token) {
        throw new Error('No authentication token received from server.');
      }

      localStorage.setItem('shs_admin_token', token);
      dispatch({
        type: 'auth/loginSuccess',
        payload: {
          token,
          user,
        },
      });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please check your credentials and try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="w-full max-w-md p-8 border-slate-200 shadow-2xl bg-white/95">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 shadow-md flex items-center justify-center mb-3">
          <img src="/assets/logo.png" alt="Siddhant High School" className="w-full h-full object-contain" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Siddhant Admin OS</h2>
        <p className="text-xs text-slate-500 mt-1">
          Shubham Education &amp; Welfare Society &bull; Management Gateway
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-[10px] text-xs text-rose-700 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4" noValidate>
        <InputField
          label="Institutional Staff Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          leftIcon={Mail}
          placeholder="name@example.com"
        />

        <div className="relative">
          <InputField
            label="Master Key Password"
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            leftIcon={Lock}
            rightAction={(
              <button
                type="button"
                onClick={() => setPasswordVisible((visible) => !visible)}
                className="text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-interactive rounded"
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                aria-pressed={passwordVisible}
              >
                {passwordVisible ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
              </button>
            )}
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon={ArrowRight}
          iconPosition="right"
          className="w-full justify-center h-11"
        >
          Authenticate &amp; Launch Console
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400">
          Public parent and student portals do not exist on this domain.
        </p>
      </div>
    </GlassCard>
  );
};

export default AdminLoginCard;
