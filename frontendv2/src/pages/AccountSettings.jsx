import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Trash2, ArrowLeft, CheckCircle, AlertTriangle, Key, Copy, RefreshCw, CreditCard } from 'lucide-react';
import apiService from '../services/api';
import PricingUpgrade from '../components/billing/PricingUpgrade';

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 text-white">
        <Icon className="w-5 h-5 text-[#a78bfa]" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Alert({ type, message }) {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
      isError
        ? 'bg-red-500/10 border border-red-500/30 text-red-400'
        : 'bg-green-500/10 border border-green-500/30 text-green-400'
    }`}>
      {isError ? <AlertTriangle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
      {message}
    </div>
  );
}

export default function AccountSettings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [userProfile, setUserProfile] = useState(null);
  const [paymentMsg, setPaymentMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const payment = searchParams.get('payment');
    const reference = searchParams.get('reference');
    const tier = searchParams.get('tier');

    if (payment === 'success' && reference) {
      apiService.verifyPayment(reference).then(res => res.json()).then(data => {
        if (data.tier) {
          setPaymentMsg({ type: 'success', text: `Payment confirmed! You're now on the ${data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} plan.` });
          setUserProfile(p => p ? { ...p, tier: data.tier } : p);
        }
      }).catch(() => {
        setPaymentMsg({ type: 'error', text: 'Payment received but verification failed. Contact support.' });
      });
    } else if (payment === 'success' && tier) {
      setPaymentMsg({ type: 'success', text: `Upgrade to ${tier} initiated. Verifying payment…` });
    }

    apiService.getProfile().then(r => r.json()).then(d => setUserProfile(d)).catch(() => {});
  }, []);

  const [apiKey, setApiKey] = useState(null);
  const [apiKeyLoading, setApiKeyLoading] = useState(true);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [apiKeyMsg, setApiKeyMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (userProfile?.tier !== 'max') { setApiKeyLoading(false); return; }
    apiService.getApiKey().then(res => res.json()).then(d => {
      if (d.has_key) setApiKey('sk-scafld-••••••••••••••••••••••••');
    }).catch(() => {}).finally(() => setApiKeyLoading(false));
  }, [userProfile?.tier]);

  const handleGenerateApiKey = async () => {
    setApiKeyMsg({ type: '', text: '' });
    setApiKeyLoading(true);
    try {
      const res = await apiService.generateApiKey();
      const data = await res.json();
      if (res.ok) {
        setApiKey(data.api_key);
        setApiKeyMsg({ type: 'success', text: 'Key generated. Copy it now — it won\'t be shown again in full.' });
      } else {
        setApiKeyMsg({ type: 'error', text: data.error || 'Failed to generate key.' });
      }
    } catch {
      setApiKeyMsg({ type: 'error', text: 'Could not reach the server.' });
    } finally {
      setApiKeyLoading(false);
    }
  };

  const handleRevokeApiKey = async () => {
    if (!window.confirm('Revoke your API key? The VS Code extension will stop working until you generate a new one.')) return;
    const res = await apiService.revokeApiKey();
    if (res.ok) { setApiKey(null); setApiKeyMsg({ type: 'success', text: 'API key revoked.' }); }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey || '');
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState({ type: '', text: '' });
  const [showDeletePanel, setShowDeletePanel] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg({ type: '', text: '' });
    if (pwForm.new_password !== pwForm.confirm) { setPwMsg({ type: 'error', text: 'New passwords do not match.' }); return; }
    if (pwForm.new_password.length < 8) { setPwMsg({ type: 'error', text: 'New password must be at least 8 characters.' }); return; }
    setPwLoading(true);
    try {
      const res = await apiService.changePassword(pwForm.old_password, pwForm.new_password);
      const data = await res.json();
      if (!res.ok) { setPwMsg({ type: 'error', text: data.error || data.detail || 'Failed to change password.' }); }
      else { setPwMsg({ type: 'success', text: 'Password updated successfully.' }); setPwForm({ old_password: '', new_password: '', confirm: '' }); }
    } catch { setPwMsg({ type: 'error', text: 'Could not reach the server.' }); }
    finally { setPwLoading(false); }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteMsg({ type: '', text: '' });
    if (deleteConfirm !== 'delete my account') { setDeleteMsg({ type: 'error', text: 'Type "delete my account" exactly to confirm.' }); return; }
    setDeleteLoading(true);
    try {
      const res = await apiService.deleteAccount(deletePassword);
      if (!res.ok) { const data = await res.json(); setDeleteMsg({ type: 'error', text: data.error || 'Failed to delete account.' }); }
      else { apiService.clearTokens(); navigate('/'); }
    } catch { setDeleteMsg({ type: 'error', text: 'Could not reach the server.' }); }
    finally { setDeleteLoading(false); }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#7c3aed] placeholder-white/30 transition-colors";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-white/50 text-sm mt-1">Manage your password and account.</p>
        </div>

        {paymentMsg.text && <Alert type={paymentMsg.type} message={paymentMsg.text} />}

        {/* Billing */}
        <Section title="Plan & Billing" icon={CreditCard}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-white/50 text-sm">Current plan:</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              userProfile?.tier === 'max' ? 'bg-amber-500/20 text-amber-400' :
              userProfile?.tier === 'pro' ? 'bg-purple-500/20 text-purple-400' :
              'bg-white/10 text-white/50'
            }`}>
              {userProfile?.tier ? userProfile.tier.charAt(0).toUpperCase() + userProfile.tier.slice(1) : 'Free'}
            </span>
            {userProfile?.tier === 'free' && (
              <span className="text-white/30 text-xs">{userProfile?.credits ?? 0} credits remaining</span>
            )}
          </div>
          {userProfile?.tier === 'max' ? (
            <p className="text-white/40 text-sm">You're on the Max plan — you have everything.</p>
          ) : (
            <PricingUpgrade currentTier={userProfile?.tier || 'free'} />
          )}
        </Section>

        {/* Change Password */}
        <Section title="Change Password" icon={Lock}>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <Alert type={pwMsg.type} message={pwMsg.text} />
            <div>
              <label className="text-white/50 text-xs mb-1 block">Current password</label>
              <input type="password" className={inputClass} value={pwForm.old_password} onChange={e => setPwForm(f => ({ ...f, old_password: e.target.value }))} placeholder="••••••••" required />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">New password</label>
              <input type="password" className={inputClass} value={pwForm.new_password} onChange={e => setPwForm(f => ({ ...f, new_password: e.target.value }))} placeholder="••••••••" required />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">Confirm new password</label>
              <input type="password" className={inputClass} value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="••••••••" required />
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={pwLoading}
              className="px-5 py-2 bg-[#7c3aed] text-white text-sm rounded-lg hover:bg-[#6d28d9] disabled:opacity-50 transition-colors">
              {pwLoading ? 'Updating…' : 'Update Password'}
            </motion.button>
          </form>
        </Section>

        {/* VS Code Extension — Max only */}
        <Section title="VS Code Extension" icon={Key}>
          {userProfile?.tier !== 'max' ? (
            <div className="space-y-3">
              <p className="text-white/50 text-sm">
                Connect the Scafld VS Code extension to pull your live schema directly into your editor via MCP — compatible with Claude, Gemini, and Copilot.
              </p>
              <div className="flex items-center gap-3 px-4 py-3 bg-[#29142e]/40 border border-[#a78bfa]/20 rounded-lg">
                <Lock className="w-4 h-4 text-[#a78bfa] flex-shrink-0" />
                <div>
                  <div className="text-white text-sm font-medium">Max plan required</div>
                  <div className="text-white/40 text-xs mt-0.5">Upgrade to Max to use the VS Code MCP extension.</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-white/50 text-sm">
                Use this API key to authenticate the Scafld VS Code extension. It gives read-only access to your schemas.
              </p>
              <Alert type={apiKeyMsg.type} message={apiKeyMsg.text} />
              {apiKeyLoading ? (
                <div className="text-white/30 text-sm">Loading…</div>
              ) : apiKey ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5">
                    <span className="font-mono text-sm text-white/70 flex-1 truncate">{apiKey}</span>
                    <button onClick={handleCopyApiKey} className="text-white/40 hover:text-white transition-colors flex-shrink-0" title="Copy">
                      {apiKeyCopied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGenerateApiKey}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/60 text-sm rounded-lg hover:text-white hover:border-white/20 transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" />
                      Regenerate
                    </motion.button>
                    <button onClick={handleRevokeApiKey} className="px-4 py-2 text-red-400/70 hover:text-red-400 text-sm transition-colors">Revoke</button>
                  </div>
                </div>
              ) : (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGenerateApiKey}
                  className="flex items-center gap-2 px-5 py-2 bg-[#7c3aed] text-white text-sm rounded-lg hover:bg-[#6d28d9] transition-colors">
                  <Key className="w-4 h-4" />
                  Generate API Key
                </motion.button>
              )}
            </div>
          )}
        </Section>

        {/* Delete Account */}
        <Section title="Delete Account" icon={Trash2}>
          <p className="text-white/50 text-sm">Permanently delete your account and all associated projects. This cannot be undone.</p>
          {!showDeletePanel ? (
            <button onClick={() => setShowDeletePanel(true)} className="px-5 py-2 border border-red-500/40 text-red-400 text-sm rounded-lg hover:bg-red-500/10 transition-colors">
              Delete my account
            </button>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-3 border border-red-500/20 rounded-lg p-4 bg-red-500/5">
              <Alert type={deleteMsg.type} message={deleteMsg.text} />
              <div>
                <label className="text-white/50 text-xs mb-1 block">Your password</label>
                <input type="password" className={inputClass} value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Type <span className="text-red-400 font-mono">delete my account</span> to confirm</label>
                <input type="text" className={inputClass} value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="delete my account" required />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowDeletePanel(false); setDeleteMsg({ type: '', text: '' }); }} className="px-4 py-2 text-white/50 text-sm hover:text-white transition-colors">Cancel</button>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={deleteLoading}
                  className="px-5 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
                  {deleteLoading ? 'Deleting…' : 'Permanently Delete Account'}
                </motion.button>
              </div>
            </form>
          )}
        </Section>
      </div>
    </div>
  );
}
