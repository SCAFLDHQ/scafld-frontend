import { Zap, Crown, Check } from 'lucide-react';

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
      'GitHub push',
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
  return (
    <div className="space-y-4">
      {/* Coming soon banner */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#7c3aed]/30 bg-[#29142e]/30"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        <span className="text-[#a78bfa] text-[10px] leading-relaxed">
          Paid plans — coming soon
        </span>
        <span
          className="text-[#a78bfa] text-xs"
          style={{ animation: 'blink 1s steps(1) infinite' }}
        >▮</span>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      {/* Plan preview cards — display only, buttons disabled */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentTier === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative border rounded-xl p-5 space-y-4 opacity-60 ${
                isCurrent ? 'border-[#7c3aed] bg-[#7c3aed]/5' : 'border-white/10 bg-white/5'
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
                disabled
                className="w-full py-2.5 rounded-lg text-sm font-medium bg-white/5 text-white/20 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-white/20 text-xs text-center">
        Pricing finalised before launch. Follow us for updates.
      </p>
    </div>
  );
}
