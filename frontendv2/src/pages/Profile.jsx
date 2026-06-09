import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Shield, Zap, Edit2, CheckCircle, AlertTriangle, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

function Field({ label, value, children }) {
  return (
    <div>
      <div className="text-white/40 text-xs mb-1">{label}</div>
      {children || <div className="text-white text-sm">{value || '—'}</div>}
    </div>
  );
}

function Alert({ type, message }) {
  if (!message) return null;
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
      type === 'error'
        ? 'bg-red-500/10 border border-red-500/30 text-red-400'
        : 'bg-green-500/10 border border-green-500/30 text-green-400'
    }`}>
      {type === 'error' ? <AlertTriangle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
      {message}
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
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
    setMsg({ type: '', text: '' });
    try {
      const res = await apiService.updateProfile(form);
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setMsg({ type: 'success', text: 'Profile updated.' });
        setEditing(false);
      } else {
        const data = await res.json();
        setMsg({ type: 'error', text: data.error || 'Update failed.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Could not reach server.' });
    } finally {
      setSaving(false);
    }
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

  const inputCls = 'w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7c3aed] placeholder-white/30 transition-colors';

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

        {/* Profile info card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <User className="w-4 h-4 text-[#a78bfa]" />
              <span className="font-semibold">Personal Info</span>
            </div>
            {!editing && (
              <button
                onClick={() => { setEditing(true); setMsg({ type: '', text: '' }); }}
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
                  <input
                    className={inputCls}
                    value={form.first_name}
                    onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                    placeholder="First"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Last name</label>
                  <input
                    className={inputCls}
                    value={form.last_name}
                    onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                    placeholder="Last"
                  />
                </div>
              </div>
              <Alert type={msg.type} message={msg.text} />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setEditing(false); setMsg({ type: '', text: '' }); }}
                  className="px-4 py-2 text-white/40 hover:text-white text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#7c3aed] text-white text-sm rounded-lg hover:bg-[#6d28d9] disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {msg.text && <Alert type={msg.type} message={msg.text} />}
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
        </div>

        {/* Daily usage */}
        {profile && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <Zap className="w-4 h-4 text-[#a78bfa]" />
              <span className="font-semibold">Usage</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/40 text-xs mb-1">AI generations today</div>
                <div className="text-white font-medium">
                  {profile.ai_gens_today ?? 0}
                  <span className="text-white/30 font-normal"> / {tier === 'free' ? '10' : '∞'}</span>
                </div>
              </div>
              <div>
                <div className="text-white/40 text-xs mb-1">Credits remaining</div>
                <div className="text-white font-medium">{profile.credits ?? 0}</div>
              </div>
            </div>
          </div>
        )}

        {/* Security link */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#a78bfa]" />
              <span className="text-white font-semibold text-sm">Security & Account</span>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#a78bfa] transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Account Settings
            </button>
          </div>
          <p className="text-white/30 text-xs mt-2">
            Change your password, manage your API key, or upgrade your plan.
          </p>
        </div>

      </div>
    </div>
  );
}
