import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/Auth/AuthLayout';
import apiService from '../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Email is required');
    setLoading(true);
    setError('');
    try {
      await apiService.requestPasswordReset(email.trim());
      setSent(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Reset your password</h1>
          <p className="text-white/60 text-sm">Enter your email and we'll send a reset link.</p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-green-400 text-2xl">✓</span>
            </div>
            <p className="text-white/70 text-sm">If that email is registered, a reset link has been sent. Check your inbox.</p>
            <button onClick={() => navigate('/login')} className="text-[#a78bfa] text-sm hover:underline">Back to login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-white text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#29142e] rounded-lg text-sm"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-[#29142e] text-white rounded-lg font-medium text-sm hover:bg-[#3a1f4a] transition-colors disabled:opacity-50">
              {loading ? 'Sending…' : 'Send reset link'}
            </motion.button>
            <div className="text-center">
              <button type="button" onClick={() => navigate('/login')} className="text-white/40 text-sm hover:text-white transition-colors">
                Back to login
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </AuthLayout>
  );
}
