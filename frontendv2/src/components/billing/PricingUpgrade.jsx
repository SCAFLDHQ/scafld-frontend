import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Crown, Check } from 'lucide-react';
import apiService from '../../services/api';

const PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    price: '₦15,000',
    period: '/month',
    icon: Zap,
    color: '#7c3aed',
    features: [
      'Unlimited projects',
      'Unlimited AI generations',
      'Code generation (Django + Express)',
      'Private projects',
      'Priority support',
    ],
  },
  {
    id: 'max',
    name: 'Max',
    price: '₦30,000',
    period: '/month',
    icon: Crown,
    color: '#f59e0b',
    features: [
      'Everything in Pro',
      'VS Code MCP extension',
      'Team collaboration',
      'Early access to new features',
      'Dedicated support',
    ],
  },
];

export default function PricingUpgrade({ currentTier = 'free' }) {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');

  const handleUpgrade = async (tier) => {
    setError('');
    setLoading(tier);
    try {
      const callbackUrl = `${window.location.origin}/settings?payment=success&tier=${tier}`;
      const res = await apiService.initiatePayment(tier, callbackUrl);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to start payment.');
        return;
      }

      // Redirect to Paystack checkout
      window.location.href = data.authorization_url;
    } catch {
      setError('Could not reach payment server. Try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentTier === plan.id;
          const isBelow = currentTier === 'max' && plan.id === 'pro';

          return (
            <div
              key={plan.id}
              className={`relative border rounded-xl p-5 space-y-4 transition-colors ${
                isCurrent
                  ? 'border-[#7c3aed] bg-[#7c3aed]/5'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              {isCurrent && (
                <span className="absolute top-3 right-3 text-xs bg-[#7c3aed] text-white px-2 py-0.5 rounded-full">
                  Current plan
                </span>
              )}

              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: `${plan.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: plan.color }} />
                </div>
                <div>
                  <div className="text-white font-semibold">{plan.name}</div>
                  <div className="text-white/50 text-sm">
                    <span className="text-white font-bold">{plan.price}</span>
                    {plan.period}
                  </div>
                </div>
              </div>

              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-white/60 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: isCurrent || isBelow ? 1 : 1.02 }}
                whileTap={{ scale: isCurrent || isBelow ? 1 : 0.98 }}
                disabled={isCurrent || isBelow || loading === plan.id}
                onClick={() => handleUpgrade(plan.id)}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isCurrent || isBelow
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'text-white disabled:opacity-50'
                }`}
                style={
                  !isCurrent && !isBelow
                    ? { background: plan.color }
                    : {}
                }
              >
                {loading === plan.id
                  ? 'Redirecting…'
                  : isCurrent
                  ? 'Active'
                  : isBelow
                  ? 'Included in Max'
                  : `Upgrade to ${plan.name}`}
              </motion.button>
            </div>
          );
        })}
      </div>

      <p className="text-white/30 text-xs text-center">
        Payments secured by Paystack. Cancel anytime.
      </p>
    </div>
  );
}
