import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Check, X, Zap, Crown, Sparkles, Package, ArrowRight,
  RefreshCw, CheckCircle, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

// ── Data ─────────────────────────────────────────────────────────────────────

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: '₦0',
    period: '/month',
    icon: Sparkles,
    color: '#6b7280',
    highlight: false,
    cta: 'Get started',
    description: 'Perfect for exploring and learning.',
    credits: 10,
    features: {
      'Credits/day': '10',
      'Projects': '3',
      'Code generation': false,
      'GitHub push': false,
      'VS Code MCP': false,
      'Team collaboration': false,
      'Private projects': false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₦10,000',
    period: '/month',
    icon: Zap,
    color: '#7c3aed',
    highlight: true,
    cta: 'Upgrade to Pro',
    description: 'For developers who build seriously.',
    credits: 50,
    features: {
      'Credits/day': '50',
      'Projects': '25',
      'Code generation': true,
      'GitHub push': true,
      'VS Code MCP': false,
      'Team collaboration': false,
      'Private projects': true,
    },
  },
  {
    id: 'max',
    name: 'Max',
    price: '₦25,000',
    period: '/month',
    icon: Crown,
    color: '#f59e0b',
    highlight: false,
    cta: 'Upgrade to Max',
    description: 'For teams shipping production-grade systems.',
    credits: 100,
    features: {
      'Credits/day': '100',
      'Projects': 'Unlimited',
      'Code generation': true,
      'GitHub push': true,
      'VS Code MCP': true,
      'Team collaboration': true,
      'Private projects': true,
    },
  },
];

const FEATURE_ROWS = [
  'Credits/day',
  'Projects',
  'Code generation',
  'GitHub push',
  'VS Code MCP',
  'Team collaboration',
  'Private projects',
];

const PACKS = [
  { id: 'pack_50',  credits: 50,  price: '₦2,500',  label: '50 credits' },
  { id: 'pack_150', credits: 150, price: '₦6,000',  label: '150 credits', badge: 'Popular' },
  { id: 'pack_500', credits: 500, price: '₦15,000', label: '500 credits', badge: 'Best value' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function FeatureCell({ value }) {
  if (value === true)  return <Check className="w-4 h-4 text-green-400 mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-white/20 mx-auto" />;
  return <span className="text-white/80 text-sm">{value}</span>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Pricing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState('');
  const [toast, setToast] = useState(null); // { type: 'success'|'error', text }

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 5000);
  };

  // Fetch profile for logged-in users
  useEffect(() => {
    if (!user) return;
    apiService.getProfile()
      .then(r => r.json())
      .then(d => setProfile(d))
      .catch(() => {});
  }, [user]);

  // Handle Paystack callback redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment = params.get('payment');
    const reference = params.get('reference');

    if (payment === 'success' && reference) {
      // Clear params from URL
      navigate('/pricing', { replace: true });
      // Verify the payment
      apiService.verifyPayment(reference)
        .then(async r => {
          const data = await r.json();
          if (!r.ok) throw new Error(data.error || `Verification failed (${r.status})`);
          return data;
        })
        .then(data => {
          if (data.tier) {
            showToast('success', `Welcome to ${data.tier.charAt(0).toUpperCase() + data.tier.slice(1)}! Your plan has been upgraded.`);
          } else if (data.pack_credits !== undefined) {
            showToast('success', data.message || 'Credits added to your account!');
          }
          return apiService.getProfile().then(r => r.json());
        })
        .then(d => setProfile(d))
        .catch(err => showToast('error', err.message || 'Payment verification failed. Contact support if charged.'));
    }
  }, [location.search]);

  const handleSubscribe = async (tierId) => {
    if (!user) { navigate('/register'); return; }
    if (profile?.tier === tierId) return;
    if (tierId === 'free') return;

    setPaymentLoading(tierId);
    try {
      const callbackUrl = `${window.location.origin}/pricing?payment=success&type=subscription`;
      const res = await apiService.initiatePayment(tierId, callbackUrl);
      const data = await res.json();
      if (!res.ok) { showToast('error', data.error || 'Could not start payment.'); return; }
      window.location.href = data.authorization_url;
    } catch {
      showToast('error', 'Could not reach the payment server.');
    } finally {
      setPaymentLoading('');
    }
  };

  const handleBuyPack = async (packId) => {
    if (!user) { navigate('/register'); return; }

    setPaymentLoading(packId);
    try {
      const callbackUrl = `${window.location.origin}/pricing?payment=success&type=credit_pack`;
      const res = await apiService.initiatePackPurchase(packId, callbackUrl);
      const data = await res.json();
      if (!res.ok) { showToast('error', data.error || 'Could not start payment.'); return; }
      window.location.href = data.authorization_url;
    } catch {
      showToast('error', 'Could not reach the payment server.');
    } finally {
      setPaymentLoading('');
    }
  };

  const currentTier = profile?.tier || 'free';

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-white/8">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#29142e] flex items-center justify-center rounded-lg">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-white font-bold tracking-tight">SCAFLD</span>
          </Link>
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-white/60 hover:text-white text-sm transition-colors">Dashboard</Link>
                <Link to="/settings" className="text-white/60 hover:text-white text-sm transition-colors">Settings</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white/60 hover:text-white text-sm transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-1.5 bg-[#29142e] text-white text-sm rounded-lg hover:bg-[#3a1f4a] transition-colors">
                  Sign up free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm max-w-sm ${
          toast.type === 'success'
            ? 'bg-green-950 border-green-500/30 text-green-300'
            : 'bg-red-950 border-red-500/30 text-red-300'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
          {toast.text}
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 pb-24">

        {/* Hero */}
        <section className="text-center pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7c3aed]/40 bg-[#7c3aed]/10 text-[#a78bfa] text-xs mb-6">
              <Sparkles className="w-3 h-3" />
              Simple, transparent pricing
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              Build more.<br />
              <span className="text-[#a78bfa]">Pay less.</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Credits reset daily. No hidden fees. Buy packs anytime to keep building when your daily limit runs out.
            </p>
          </motion.div>

          {/* Current plan badge for logged-in users */}
          {profile && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
              <span className="text-white/40">Current plan:</span>
              <span className="text-white font-medium capitalize">{profile.tier}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/60">{profile.credits} daily credits left</span>
              {profile.pack_credits > 0 && (
                <>
                  <span className="text-white/30">·</span>
                  <span className="text-[#a78bfa]">{profile.pack_credits} pack credits</span>
                </>
              )}
            </div>
          )}
        </section>

        {/* Tier Cards */}
        <section className="grid md:grid-cols-3 gap-6 mb-20">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            const isCurrent = currentTier === tier.id;
            const isLoading = paymentLoading === tier.id;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  tier.highlight
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 ring-1 ring-[#7c3aed]/30'
                    : 'border-white/10 bg-white/3'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#7c3aed] text-white text-xs rounded-full font-medium">
                    Most popular
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 bg-white/10 text-white/60 text-xs rounded-full border border-white/10">
                    Current plan
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${tier.color}20` }}>
                    <Icon className="w-4 h-4" style={{ color: tier.color }} />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{tier.name}</div>
                    <div className="text-white/40 text-xs">{tier.description}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{tier.price}</span>
                    <span className="text-white/40 text-sm">{tier.period}</span>
                  </div>
                  <div className="text-white/40 text-xs mt-1">{tier.credits} credits/day included</div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {FEATURE_ROWS.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      {tier.features[f] === true && <Check className="w-4 h-4 text-green-400 flex-shrink-0" />}
                      {tier.features[f] === false && <X className="w-4 h-4 text-white/20 flex-shrink-0" />}
                      {typeof tier.features[f] === 'string' && (
                        <span className="w-4 h-4 text-center text-[#a78bfa] flex-shrink-0 font-medium text-xs leading-4">
                          {tier.features[f] === 'Unlimited' ? '∞' : tier.features[f]}
                        </span>
                      )}
                      <span className={tier.features[f] === false ? 'text-white/30' : 'text-white/70'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={isCurrent || tier.id === 'free' || isLoading}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    isCurrent || tier.id === 'free'
                      ? 'bg-white/5 text-white/30 cursor-not-allowed'
                      : tier.highlight
                        ? 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : isCurrent ? (
                    'Current plan'
                  ) : tier.id === 'free' ? (
                    'Free forever'
                  ) : (
                    <>
                      {tier.cta}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </section>

        {/* Feature Comparison Table */}
        <section className="mb-20">
          <h2 className="text-xl font-semibold text-white mb-6">Full comparison</h2>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-white/40 font-normal">Feature</th>
                  {TIERS.map(t => (
                    <th key={t.id} className="py-4 px-4 text-center">
                      <span className="text-white font-semibold">{t.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((row, i) => (
                  <tr key={row} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
                    <td className="py-3 px-6 text-white/60">{row}</td>
                    {TIERS.map(t => (
                      <td key={t.id} className="py-3 px-4 text-center">
                        <FeatureCell value={t.features[row]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Credit Packs */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#fbbf24] text-xs mb-4">
              <Package className="w-3 h-3" />
              Credit Packs
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Need more credits today?</h2>
            <p className="text-white/50 max-w-md mx-auto">
              Top up anytime on any plan. Pack credits never expire and get used before your daily allocation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {PACKS.map((pack, i) => {
              const isLoading = paymentLoading === pack.id;
              return (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  className="relative border border-white/10 bg-white/3 rounded-2xl p-6 hover:border-white/20 transition-colors group"
                >
                  {pack.badge && (
                    <div className="absolute -top-2.5 left-5 px-2.5 py-0.5 bg-[#f59e0b] text-black text-xs rounded-full font-semibold">
                      {pack.badge}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/15 flex items-center justify-center">
                      <Package className="w-5 h-5 text-[#f59e0b]" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{pack.label}</div>
                      <div className="text-white/40 text-xs">One-time, never expires</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-5">{pack.price}</div>
                  <button
                    onClick={() => handleBuyPack(pack.id)}
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-medium bg-white/8 hover:bg-white/15 text-white border border-white/10 transition-all flex items-center justify-center gap-2 group-hover:border-[#f59e0b]/40"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Buy {pack.label}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How credits work */}
        <section className="rounded-2xl border border-white/8 bg-white/3 p-8 mb-20">
          <h2 className="text-lg font-semibold text-white mb-4">How credits work</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-sm text-white/60">
            <div>
              <div className="text-white font-medium mb-1">Daily allocation</div>
              Each plan includes a fixed number of credits that reset at midnight every day — Free (10), Pro (50), Max (100).
            </div>
            <div>
              <div className="text-white font-medium mb-1">Pack credits come first</div>
              Purchased pack credits are consumed before your daily allocation, so your daily credits carry over to the next day.
            </div>
            <div>
              <div className="text-white font-medium mb-1">What uses a credit?</div>
              Each AI schema generation or iteration consumes one credit. Browsing, exporting, and code generation are free once the schema exists.
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <div>© 2026 Scafld. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="mailto:support@scafld.dev" className="hover:text-white/60 transition-colors">Support</a>
            <Link to="/" className="hover:text-white/60 transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
