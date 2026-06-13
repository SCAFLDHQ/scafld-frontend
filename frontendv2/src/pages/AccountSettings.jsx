import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, User, Mail, Calendar, Shield, Edit2,
  CheckCircle, AlertTriangle, Lock, Trash2, Key, Copy,
  RefreshCw, BarChart3, Github, Chrome, Bug,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const NAV = [
  { id: 'profile',   label: 'Profile' },
  { id: 'stats',     label: 'Plan & Stats' },
  { id: 'security',  label: 'Account Security' },
  { id: 'api-keys',  label: 'API Keys' },
  { id: 'danger',    label: 'Delete Account' },
];

function SectionTitle({ id, icon: Icon, title }) {
  return (
    <div id={id} className="flex items-center gap-2 text-white mb-4 scroll-mt-8">
      <Icon className="w-4 h-4 text-[#a78bfa]" />
      <h2 className="font-semibold">{title}</h2>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
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
  const { user: authUser } = useAuth();
  const contentRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    apiService.getProfile().then(r => r.json()).then(d => {
      setProfile(d);
      setForm({ first_name: d.first_name || '', last_name: d.last_name || '' });
    }).catch(() => {});
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [profile]);

  // Profile editing
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '' });
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

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

  // API Key
  const [apiKey, setApiKey] = useState(null);
  const [apiKeyRevealed, setApiKeyRevealed] = useState(false);
  const [apiKeyLoading, setApiKeyLoading] = useState(true);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [apiKeyMsg, setApiKeyMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (profile?.tier !== 'max') { setApiKeyLoading(false); return; }
    apiService.getApiKey().then(res => res.json()).then(d => {
      if (d.has_key) { setApiKey('sk-scafld-••••••••••••••••••••••••'); setApiKeyRevealed(false); }
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
        setApiKeyRevealed(true);
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

  // Password
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

  // Delete account
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
    .filter(Boolean).map(n => n[0].toUpperCase()).join('')
    || displayUser?.email?.[0]?.toUpperCase() || '?';

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

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-white/40 text-sm mt-1">Manage your profile and security.</p>
        </div>

        <div className="flex gap-14">
          {/* Sidebar TOC */}
          <aside className="hidden md:block w-44 flex-shrink-0 self-start sticky top-8 mr-6">
            <nav className="space-y-0.5">
              {NAV.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === id
                      ? 'text-white bg-white/8 font-medium'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main ref={contentRef} className="flex-1 min-w-0 space-y-10">

            {/* Profile */}
            <section>
              <SectionTitle id="profile" icon={User} title="Profile" />
              <Card>
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#29142e] border border-[#a78bfa]/30 flex items-center justify-center text-xl font-bold text-[#a78bfa] flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {[displayUser?.first_name, displayUser?.last_name].filter(Boolean).join(' ') || displayUser?.email}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${tierColors[tier] || tierColors.free}`}>
                        {tierLabel}
                      </span>
                      {joinDate && <span className="text-white/30 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />{joinDate}</span>}
                    </div>
                  </div>
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
                      <button type="button" onClick={() => { setEditing(false); setProfileMsg({ type: '', text: '' }); }} className="px-4 py-2 text-white/40 hover:text-white text-sm transition-colors">Cancel</button>
                      <button type="submit" disabled={saving} className="px-5 py-2 bg-[#7c3aed] text-white text-sm rounded-lg hover:bg-[#6d28d9] disabled:opacity-50 transition-colors">
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {profileMsg.text && <Alert type={profileMsg.type} message={profileMsg.text} />}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                      <div>
                        <div className="text-white/40 text-xs mb-1">First name</div>
                        <div className="text-white">{displayUser?.first_name || '—'}</div>
                      </div>
                      <div>
                        <div className="text-white/40 text-xs mb-1">Last name</div>
                        <div className="text-white">{displayUser?.last_name || '—'}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-white/40 text-xs mb-1">Email</div>
                        <div className="flex items-center gap-2 text-white">
                          <Mail className="w-3.5 h-3.5 text-white/30" />
                          {displayUser?.email}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => { setEditing(true); setProfileMsg({ type: '', text: '' }); }}
                      className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#a78bfa] transition-colors mt-2">
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit profile
                    </button>
                  </div>
                )}
              </Card>
            </section>

            {/* Plan & Stats */}
            {profile && (
              <section>
                <SectionTitle id="stats" icon={BarChart3} title="Plan & Stats" />
                <Card>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5 text-sm">
                    <div>
                      <div className="text-white/40 text-xs mb-1">Subscription</div>
                      <div className="text-white font-medium capitalize">{tierLabel}</div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs mb-1">Daily credits</div>
                      <div className="text-white font-medium">
                        {profile.credits ?? 0}
                        <span className="text-white/30 font-normal"> / {profile.daily_limit ?? 10}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs mb-1">Pack credits</div>
                      <div className="text-white font-medium">
                        {profile.pack_credits ?? 0}
                        {(profile.pack_credits ?? 0) > 0 && (
                          <span className="text-[#a78bfa] text-xs font-normal ml-1">used first</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs mb-1">AI gens today</div>
                      <div className="text-white font-medium">
                        {profile.ai_gens_today ?? 0}
                        <span className="text-white/30 font-normal"> / {profile.daily_limit ?? 10}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs mb-1">Total projects</div>
                      <div className="text-white font-medium">{profile.total_projects ?? '—'}</div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs mb-1">Projects limit</div>
                      <div className="text-white font-medium">{tier === 'free' ? '3' : tier === 'pro' ? '25' : '∞'}</div>
                    </div>
                  </div>
                </Card>
              </section>
            )}

            {/* Account Security */}
            <section>
              <SectionTitle id="security" icon={Shield} title="Account Security" />
              <div className="space-y-4">

              {/* Password */}
              <Card>
                <div className="text-white/70 text-sm font-medium mb-4 pb-2 border-b border-white/8">Password</div>
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
              </Card>

              {/* Login Methods */}
              {profile && (
                <Card>
                  <div className="text-white/70 text-sm font-medium mb-4 pb-2 border-b border-white/8">Login Methods</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 py-2">
                      <Mail className="w-4 h-4 text-white/40 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-white text-sm">{profile.email}</div>
                        <div className="text-white/30 text-xs">Email & password</div>
                      </div>
                      <span className="text-xs text-green-400/70 bg-green-500/10 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                    {profile.oauth_providers?.includes('github') && (
                      <div className="flex items-center gap-3 py-2">
                        <Github className="w-4 h-4 text-white/40 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-white text-sm">GitHub</div>
                          <div className="text-white/30 text-xs">OAuth connected</div>
                        </div>
                        <span className="text-xs text-green-400/70 bg-green-500/10 px-2 py-0.5 rounded-full">Connected</span>
                      </div>
                    )}
                    {profile.oauth_providers?.includes('google') && (
                      <div className="flex items-center gap-3 py-2">
                        <Chrome className="w-4 h-4 text-white/40 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-white text-sm">Google</div>
                          <div className="text-white/30 text-xs">OAuth connected</div>
                        </div>
                        <span className="text-xs text-green-400/70 bg-green-500/10 px-2 py-0.5 rounded-full">Connected</span>
                      </div>
                    )}
                  </div>
                </Card>
              )}
              </div>
            </section>

            {/* API Keys */}
            <section>
              <SectionTitle id="api-keys" icon={Key} title="API Keys" />
              <Card>
                <p className="text-white/50 text-sm mb-4">
                  Use this API key to authenticate the Scafld VS Code extension. It gives read-only access to your schemas via MCP.
                  {tier !== 'max' && <span className="text-[#a78bfa]"> Requires Max plan.</span>}
                </p>
                {tier !== 'max' ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#29142e]/40 border border-[#a78bfa]/20 rounded-lg">
                    <Lock className="w-4 h-4 text-[#a78bfa] flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm font-medium">Max plan required</div>
                      <div className="text-white/40 text-xs mt-0.5">Upgrade to Max to generate API keys.</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Alert type={apiKeyMsg.type} message={apiKeyMsg.text} />
                    {apiKeyLoading ? (
                      <div className="text-white/30 text-sm">Loading…</div>
                    ) : apiKey ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5">
                          <span className="font-mono text-sm text-white/70 flex-1 truncate">{apiKey}</span>
                          {apiKeyRevealed ? (
                            <button onClick={() => { navigator.clipboard.writeText(apiKey); setApiKeyCopied(true); setTimeout(() => setApiKeyCopied(false), 2000); }}
                              className="text-white/40 hover:text-white transition-colors flex-shrink-0" title="Copy key">
                              {apiKeyCopied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          ) : (
                            <span className="text-white/20 text-xs flex-shrink-0">regenerate to copy</span>
                          )}
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
              </Card>
            </section>

            {/* Delete Account */}
            <section>
              <SectionTitle id="danger" icon={Trash2} title="Delete Account" />
              <Card>
                <p className="text-white/50 text-sm mb-4">Permanently delete your account and all associated projects. This cannot be undone.</p>
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
              </Card>
            </section>

          </main>
        </div>

        {/* Bug Report */}
        <div className="mt-12 pt-8 border-t border-white/8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/2 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Bug className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <div className="text-white text-sm font-medium">Found a bug or have a suggestion?</div>
                <div className="text-white/40 text-xs mt-0.5">We read every report. Takes less than a minute.</div>
              </div>
            </div>
            <a
              href={`mailto:coder0214h@gmail.com?subject=${encodeURIComponent('Scafld Bug Report')}&body=${encodeURIComponent(`Page: ${window.location.origin}/settings\n\nDescription:\n`)}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/15 transition-colors whitespace-nowrap flex-shrink-0"
            >
              <Bug className="w-3.5 h-3.5" />
              Report a bug
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
