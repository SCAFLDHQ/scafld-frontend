import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Crown, Check, ArrowRight, RefreshCw } from 'lucide-react';
import apiService from '../../services/api';

const PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    price: '₦10,000',
    period: '/month',
    icon: Zap,
    color: '#7c3aed',
    dailyCredits: 50,
    features: [
      '50 credits/day',
      'Unlimited projects',
      'Code generation',
      'GitHub push',
      'Private projects',
    ],
  },
  {
    id: 'max',
    name: 'Max',
    price: '₦25,000',
    period: '/month',
    icon: Crown,
    color: '#f59e0b',
    dailyCredits: 100,
    features: [
      '100 credits/day',
      'Everything in Pro',
      'VS Code MCP extension',
      'Team collaboration',
      'Dedicated support',
    ],
  },
];

export default function PricingUpgrade({ currentTier = 'free', onUpgraded }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const handleUpgrade = async (tierId) => {
    setError('');
    setLoading(tierId);
    try {
      const callbackUrl = `${window.location.origin}/pricing?payment=success&type=subscription`;
      const res = await apiService.initiatePayment(tierId, callbackUrl);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Could not start payment.'); return; }
      window.location.href = data.authorization_url;
    } catch {
      setError('Could not reach the payment server. Try again.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentTier === plan.id;
          const isLoading = loading === plan.id;

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
                  Current
                </span>
              )}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${plan.color}20` }}>
                  <Icon className="w-5 h-5" style={{ color: plan.color }} />
                </div>
                <div>
                  <div className="text-white font-semibold">{plan.name}</div>
                  <div className="text-white/50 text-sm">
                    <span className="text-white font-bold">{plan.price}</span>{plan.period}
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

              <button
                onClick={() => isCurrent ? null : handleUpgrade(plan.id)}
                disabled={isCurrent || isLoading}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  isCurrent
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : plan.id === 'pro'
                      ? 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                }`}
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : isCurrent ? (
                  'Current plan'
                ) : (
                  <>
                    Upgrade to {plan.name}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-white/30 text-xs text-center">
        Payments processed by Paystack · Cancel anytime · <button onClick={() => navigate('/pricing')} className="underline hover:text-white/50 transition-colors">View full pricing</button>
      </p>
    </div>
  );
}
