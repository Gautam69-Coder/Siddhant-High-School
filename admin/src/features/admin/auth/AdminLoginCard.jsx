import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import InputField from '../../../components/ui/InputField';
import Button from '../../../components/ui/Button';
import GlassCard from '../../../components/ui/GlassCard';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export const AdminLoginCard = () => {
  const [email, setEmail] = useState('admin@siddhanthighschool.edu');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (email && password) {
        const dummyToken = 'shs_demo_jwt_token_super_admin';
        localStorage.setItem('shs_admin_token', dummyToken);
        dispatch({
          type: 'auth/loginSuccess',
          payload: {
            token: dummyToken,
            user: { email, role: 'SUPER_ADMIN', name: 'Dr. Katherine Price' },
          },
        });
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials. Access restricted to authorized school officials.');
      }
      setLoading(false);
    }, 600);
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

      <form onSubmit={handleLogin} className="space-y-4">
        <InputField
          label="Institutional Staff Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={Mail}
          placeholder="admin@siddhanthighschool.edu"
        />

        <InputField
          label="Master Key Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={Lock}
          placeholder="••••••••"
        />

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
