import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/Auth/AuthLayout';
import apiService from '../services/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center space-y-4">
          <p className="text-red-400">Invalid or missing reset token.</p>
          <button onClick={() => navigate('/forgot-password')} className="text-[#a78bfa] text-sm hover:underline">Request a new link</button>
        </div>
      </AuthLayout>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return setError('Password must be at least 8 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    setError('');
    try {
      const res = await apiService.confirmPasswordReset(token, password);
      if (res.ok) {
        setDone(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Reset failed. The link may have expired.');
      }
    } catch {
      setError('Reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Set new password</h1>
          <p className="text-white/60 text-sm">Enter your new password below.</p>
        </div>

        {done ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-green-400 text-2xl">✓</span>
            </div>
            <p className="text-white/70 text-sm">Password reset successfully.</p>
            <button onClick={() => navigate('/login')} className="px-6 py-2 bg-[#29142e] text-white rounded-lg text-sm hover:bg-[#3a1f4a] transition-colors">
              Sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-white text-sm">New password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#29142e] rounded-lg text-sm" />
            </div>
            <div className="space-y-2">
              <label className="block text-white text-sm">Confirm password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#29142e] rounded-lg text-sm" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-[#29142e] text-white rounded-lg font-medium text-sm hover:bg-[#3a1f4a] transition-colors disabled:opacity-50">
              {loading ? 'Resetting…' : 'Reset password'}
            </motion.button>
          </form>
        )}
      </motion.div>
    </AuthLayout>
  );
}
