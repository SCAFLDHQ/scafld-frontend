import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, User, Mail, Calendar, Shield, Zap, Edit2,
  CheckCircle, AlertTriangle, Settings, BarChart3,
  Lock, Trash2, Key, Copy, RefreshCw, CreditCard,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import PricingUpgrade from '../components/billing/PricingUpgrade';

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 text-white">
        <Icon className="w-4 h-4 text-[#a78bfa]" />
        <span className="font-semibold">{title}</span>
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

function Field({ label, value, children }) {
  return (
    <div>
      <div className="text-white/40 text-xs mb-1">{label}</div>
      {children || <div className="text-white text-sm">{value || '—'}</div>}
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user: authUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '' });
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [paymentMsg, setPaymentMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const payment = searchParams.get('payment');
    const reference = searchParams.get('reference');
    const tier = searchParams.get('tier');

    if (payment === 'success' && reference) {
      apiService.verifyPayment(reference).then(res => res.json()).then(data => {
        if (data.tier) {
          setPaymentMsg({ type: 'success', text: `Payment confirmed! You're now on the ${data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} plan.` });
          setProfile(p => p ? { ...p, tier: data.tier } : p);
        }
      }).catch(() => {
        setPaymentMsg({ type: 'error', text: 'Payment received but verification failed. Contact support.' });
      });
    } else if (payment === 'success' && tier) {
      setPaymentMsg({ type: 'success', text: `Upgrade to ${tier} initiated. Verifying payment…` });
    }

    apiService.getProfile()
      .then(r => r.json())
      .then(d => {
        setProfile(d);
        setForm({ first_name: d.first_name || '', last_name: d.last_name || '' });
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await apiService.updateProfile(form);
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setProfileMsg({ type: 'success', text: 'Profile updated.' });
        setEditing(false);
      } else {
        const data = await res.json();
        setProfileMsg({ type: 'error', text: data.error || 'Update failed.' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Could not reach server.' });
    } finally {
      setSaving(false);
    }
  };

  // API Key state
  const [apiKey, setApiKey] = useState(null);
  const [apiKeyLoading, setApiKeyLoading] = useState(true);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [apiKeyMsg, setApiKeyMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (profile?.tier !== 'max') { setApiKeyLoading(false); return; }
    apiService.getApiKey().then(res => res.json()).then(d => {
      if (d.has_key) setApiKey('sk-scafld-••••••••••••••••••••••••');
    }).catch(() => {}).finally(() => setApiKeyLoading(false));
  }, [profile?.tier]);

  const handleGenerateApiKey = async () => {
    setApiKeyMsg({ type: '', text: '' });
    setApiKeyLoading(true);
    try {
      const res = await apiService.generateApiKey();
      const data = await res.json();
      if (res.ok) {
        setApiKey(data.api_key);
        setApiKeyMsg({ type: 'success', text: "Key generated. Copy it now — it won't be shown again in full." });
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

  // Password state
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

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

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState({ type: '', text: '' });
  const [showDeletePanel, setShowDeletePanel] = useState(false);

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

  const displayUser = profile || authUser;
  const initials = [displayUser?.first_name, displayUser?.last_name]
    .filter(Boolean)
    .map(n => n[0].toUpperCase())
    .join('') || displayUser?.email?.[0]?.toUpperCase() || '?';

  const joinDate = profile?.date_joined
    ? new Date(profile.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

  const tierColors = {
    max: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    pro: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    free: 'bg-white/10 text-white/50 border-white/10',
  };
  const tier = profile?.tier || 'free';
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  const inputCls = 'w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#7c3aed] placeholder-white/30 transition-colors';

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="max-w-xl mx-auto px-4 py-12 space-y-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Avatar + header */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#29142e] border border-[#a78bfa]/30 flex items-center justify-center text-2xl font-bold text-[#a78bfa] flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold truncate">
              {[displayUser?.first_name, displayUser?.last_name].filter(Boolean).join(' ') || displayUser?.email || 'Your Profile'}
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${tierColors[tier] || tierColors.free}`}>
                {tierLabel}
              </span>
              {tier === 'free' && profile?.credits != null && (
                <span className="text-white/30 text-xs flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {profile.credits} credits
                </span>
              )}
              {joinDate && (
                <span className="text-white/25 text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined {joinDate}
                </span>
              )}
            </div>
          </div>
        </div>

        {paymentMsg.text && <Alert type={paymentMsg.type} message={paymentMsg.text} />}

        {/* Personal Info */}
        <Section title="Personal Info" icon={User}>
          <div className="flex justify-end -mt-2">
            {!editing && (
              <button
                onClick={() => { setEditing(true); setProfileMsg({ type: '', text: '' }); }}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#a78bfa] transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>
          {editing ? (
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs mb-1 block">First name</label>
                  <input className={inputCls} value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} placeholder="First" />
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Last name</label>
                  <input className={inputCls} value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Last" />
                </div>
              </div>
              <Alert type={profileMsg.type} message={profileMsg.text} />
              <div className="flex gap-2">
                <button type="button" onClick={() => { setEditing(false); setProfileMsg({ type: '', text: '' }); }} className="px-4 py-2 text-white/40 hover:text-white text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-[#7c3aed] text-white text-sm rounded-lg hover:bg-[#6d28d9] disabled:opacity-50 transition-colors">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {profileMsg.text && <Alert type={profileMsg.type} message={profileMsg.text} />}
              <div className="grid grid-cols-2 gap-4">
                <Field label="First name" value={displayUser?.first_name} />
                <Field label="Last name" value={displayUser?.last_name} />
              </div>
              <Field label="Email">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                  <span className="text-sm text-white">{displayUser?.email}</span>
                </div>
              </Field>
            </div>
          )}
        </Section>

        {/* Plan & Stats */}
        {profile && (
          <Section title="Plan & Stats" icon={BarChart3}>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/40 text-xs mb-1">Subscription</div>
                <div className="text-white font-medium capitalize">
                  {profile.subscription_tier?.name || tierLabel}
                </div>
              </div>
              <div>
                <div className="text-white/40 text-xs mb-1">Credits remaining</div>
                <div className="text-white font-medium">
                  {['pro', 'max'].includes(tier) ? '∞' : (profile.credits ?? 0)}
                </div>
              </div>
              <div>
                <div className="text-white/40 text-xs mb-1">Total projects</div>
                <div className="text-white font-medium">{profile.total_projects ?? '—'}</div>
              </div>
              <div>
                <div className="text-white/40 text-xs mb-1">Projects limit</div>
                <div className="text-white font-medium">
                  {profile.projects_limit || profile.project_limit || '∞'}
                </div>
              </div>
              <div>
                <div className="text-white/40 text-xs mb-1">AI generations today</div>
                <div className="text-white font-medium">
                  {profile.ai_gens_today ?? 0}
                  <span className="text-white/30 font-normal"> / {tier === 'free' ? '10' : '∞'}</span>
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* Plan & Billing */}
        <Section title="Plan & Billing" icon={CreditCard}>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-white/50 text-sm">Current plan:</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${tierColors[tier] || tierColors.free}`}>
              {tierLabel}
            </span>
            {tier === 'free' && (
              <span className="text-white/30 text-xs">{profile?.credits ?? 0} credits remaining</span>
            )}
          </div>
          {tier === 'max' ? (
            <p className="text-white/40 text-sm">You're on the Max plan — you have everything.</p>
          ) : (
            <PricingUpgrade currentTier={tier} />
          )}
        </Section>

        {/* Change Password */}
        <Section title="Change Password" icon={Lock}>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <Alert type={pwMsg.type} message={pwMsg.text} />
            <div>
              <label className="text-white/50 text-xs mb-1 block">Current password</label>
              <input type="password" className={inputCls} value={pwForm.old_password} onChange={e => setPwForm(f => ({ ...f, old_password: e.target.value }))} placeholder="••••••••" required />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">New password</label>
              <input type="password" className={inputCls} value={pwForm.new_password} onChange={e => setPwForm(f => ({ ...f, new_password: e.target.value }))} placeholder="••••••••" required />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">Confirm new password</label>
              <input type="password" className={inputCls} value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="••••••••" required />
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={pwLoading}
              className="px-5 py-2 bg-[#7c3aed] text-white text-sm rounded-lg hover:bg-[#6d28d9] disabled:opacity-50 transition-colors">
              {pwLoading ? 'Updating…' : 'Update Password'}
            </motion.button>
          </form>
        </Section>

        {/* VS Code Extension — Max only */}
        <Section title="VS Code Extension" icon={Key}>
          {tier !== 'max' ? (
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
                <input type="password" className={inputCls} value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Type <span className="text-red-400 font-mono">delete my account</span> to confirm</label>
                <input type="text" className={inputCls} value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="delete my account" required />
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
