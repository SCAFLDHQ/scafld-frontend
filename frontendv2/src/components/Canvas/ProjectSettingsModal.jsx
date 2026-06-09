import { useState, useEffect } from 'react';
import { X, Settings, Trash2, AlertTriangle, CheckCircle, Users, UserPlus, History, Clock } from 'lucide-react';
import apiService from '../../services/api';

function Alert({ type, message }) {
  if (!message) return null;
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
      type === 'error'
        ? 'bg-red-500/10 border border-red-500/30 text-red-400'
        : 'bg-green-500/10 border border-green-500/30 text-green-400'
    }`}>
      {type === 'error' ? <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> : <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />}
      {message}
    </div>
  );
}

const TABS = ['General', 'Team', 'History'];

export default function ProjectSettingsModal({ project, onClose, onDeleted, onUpdated }) {
  const [tab, setTab] = useState('General');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#a78bfa]" />
            <span className="text-white font-semibold">Project Settings</span>
            <span className="text-white/30 text-xs">· {project?.name}</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 flex-shrink-0">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-xs font-medium transition-colors ${
                tab === t
                  ? 'text-[#a78bfa] border-b-2 border-[#a78bfa]'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {tab === 'General' && (
            <GeneralTab project={project} onClose={onClose} onUpdated={onUpdated} onDeleted={onDeleted} />
          )}
          {tab === 'Team' && (
            <TeamTab project={project} />
          )}
          {tab === 'History' && (
            <HistoryTab project={project} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── General Tab ──────────────────────────────────────────────────────────────

function GeneralTab({ project, onClose, onUpdated, onDeleted }) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [framework, setFramework] = useState(project?.framework || 'django');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await apiService.updateProject(project.id, { name: name.trim(), description, framework });
      if (res.ok) {
        const updated = await res.json();
        setMsg({ type: 'success', text: 'Project updated.' });
        onUpdated?.(updated);
      } else {
        const data = await res.json();
        setMsg({ type: 'error', text: data.error || data.name?.[0] || 'Update failed.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Could not reach server.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== project?.name) return;
    setDeleting(true);
    try {
      const res = await apiService.deleteProject(project.id);
      if (res.ok || res.status === 204) onDeleted?.();
      else setMsg({ type: 'error', text: 'Delete failed.' });
    } catch {
      setMsg({ type: 'error', text: 'Could not reach server.' });
    } finally {
      setDeleting(false);
    }
  };

  const inputCls = 'w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7c3aed] placeholder-white/30 transition-colors';

  return (
    <div className="p-5 space-y-5">
      <form onSubmit={handleSave} className="space-y-3">
        <div>
          <label className="text-white/50 text-xs mb-1.5 block">Project name</label>
          <input className={inputCls} value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="text-white/50 text-xs mb-1.5 block">Description</label>
          <textarea className={`${inputCls} resize-none h-20`} value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="text-white/50 text-xs mb-1.5 block">Framework</label>
          <select className={inputCls} value={framework} onChange={e => setFramework(e.target.value)}>
            <option value="django">Django</option>
            <option value="express">Express.js</option>
          </select>
        </div>
        <Alert type={msg.type} message={msg.text} />
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 text-white/40 hover:text-white text-sm transition-colors">Cancel</button>
          <button type="submit" disabled={saving || !name.trim()} className="px-5 py-2 bg-[#7c3aed] text-white text-sm rounded-lg hover:bg-[#6d28d9] disabled:opacity-50 transition-colors">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Danger zone */}
      <div className="border-t border-white/5 pt-4">
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 text-red-400/60 hover:text-red-400 text-sm transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete project
          </button>
        ) : (
          <div className="border border-red-500/20 rounded-lg p-4 bg-red-500/5 space-y-3">
            <p className="text-red-400/80 text-xs">Permanently deletes all models, fields, and relationships.</p>
            <div>
              <label className="text-white/40 text-xs mb-1.5 block">Type <span className="text-red-400 font-mono">{project?.name}</span> to confirm</label>
              <input className={inputCls} value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder={project?.name} />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setShowDelete(false); setDeleteConfirm(''); }} className="px-3 py-1.5 text-white/40 hover:text-white text-xs transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleting || deleteConfirm !== project?.name} className="px-4 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
                {deleting ? 'Deleting…' : 'Delete Project'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Team Tab ─────────────────────────────────────────────────────────────────

function TeamTab({ project }) {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    apiService.getCollaborators(project.id)
      .then(r => r.json())
      .then(d => setCollaborators(Array.isArray(d) ? d : d.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [project.id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setAdding(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await apiService.addCollaborator(project.id, email.trim(), role);
      const data = await res.json();
      if (res.ok) {
        setCollaborators(c => [...c, data]);
        setEmail('');
        setMsg({ type: 'success', text: `${email} added as ${role}.` });
      } else {
        setMsg({ type: 'error', text: data.error || 'Could not add collaborator.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Could not reach server.' });
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (collab) => {
    if (!window.confirm(`Remove ${collab.user_email}?`)) return;
    const res = await apiService.removeCollaborator(project.id, collab.user);
    if (res.ok || res.status === 204) {
      setCollaborators(c => c.filter(x => x.id !== collab.id));
    }
  };

  const inputCls = 'bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7c3aed] placeholder-white/30 transition-colors';
  const ROLE_COLORS = { editor: 'text-[#a78bfa]', viewer: 'text-white/40', owner: 'text-amber-400' };

  return (
    <div className="p-5 space-y-5">
      {/* Invite form */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <UserPlus className="w-4 h-4 text-[#a78bfa]" />
          <span className="text-white text-sm font-medium">Invite Collaborator</span>
        </div>
        <form onSubmit={handleAdd} className="space-y-2">
          <div className="flex gap-2">
            <input
              className={`${inputCls} flex-1`}
              type="email"
              placeholder="teammate@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <select className={inputCls} value={role} onChange={e => setRole(e.target.value)}>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <Alert type={msg.type} message={msg.text} />
          <button type="submit" disabled={adding || !email.trim()} className="w-full py-2 bg-[#29142e] text-white text-sm rounded-lg hover:bg-[#3a1f4a] disabled:opacity-50 transition-colors">
            {adding ? 'Inviting…' : 'Send Invite'}
          </button>
        </form>
      </div>

      {/* Collaborator list */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-[#a78bfa]" />
          <span className="text-white text-sm font-medium">Team</span>
        </div>
        {loading ? (
          <div className="text-white/30 text-xs">Loading…</div>
        ) : collaborators.length === 0 ? (
          <div className="text-white/30 text-xs">No collaborators yet. Invite someone above.</div>
        ) : (
          <div className="space-y-1.5">
            {collaborators.map(c => (
              <div key={c.id} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white text-xs">{c.user_email}</div>
                  <div className={`text-[10px] font-medium ${ROLE_COLORS[c.role] || 'text-white/40'}`}>{c.role}</div>
                </div>
                <button onClick={() => handleRemove(c)} className="text-red-400/40 hover:text-red-400 transition-colors text-xs">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── History Tab ───────────────────────────────────────────────────────────────

function HistoryTab({ project }) {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getSnapshots(project.id)
      .then(r => r.json())
      .then(d => setSnapshots((Array.isArray(d) ? d : d.results || []).slice(0, 10)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [project.id]);

  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-4 h-4 text-[#a78bfa]" />
        <span className="text-white text-sm font-medium">Export History</span>
        <span className="text-white/30 text-xs">(last 10)</span>
      </div>

      {loading ? (
        <div className="text-white/30 text-xs">Loading…</div>
      ) : snapshots.length === 0 ? (
        <div className="text-white/30 text-xs">No exports yet. Export your spec to create a version snapshot.</div>
      ) : (
        <div className="space-y-2">
          {snapshots.map(s => (
            <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 bg-white/5 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs truncate">{s.description || `Version ${s.version}`}</div>
                <div className="text-white/30 text-[10px]">
                  {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  {s.created_by_email && <span> · {s.created_by_email}</span>}
                </div>
              </div>
              <span className="text-white/20 text-[10px] font-mono flex-shrink-0">v{s.version}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
