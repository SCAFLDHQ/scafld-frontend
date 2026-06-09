import { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

function toPascalCase(str) {
  return str
    .replace(/[_\-\s]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^(.)/, c => c.toUpperCase());
}

export default function AddModelModal({ onSave, onClose }) {
  const [raw, setRaw] = useState('');
  const [saving, setSaving] = useState(false);

  const preview = toPascalCase(raw);

  const handleSave = async () => {
    if (!preview) return;
    setSaving(true);
    await onSave(preview);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-[#111] border border-white/10 rounded-xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-medium">Add Model</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-white/60 text-xs mb-1">Model name</label>
            <input
              autoFocus
              value={raw}
              onChange={e => setRaw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="e.g. blog post, user_profile, Order…"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm focus:outline-none focus:border-[#7c3aed]"
            />
          </div>
          {raw.trim() && (
            <p className="text-white/40 text-xs">
              Will be saved as <span className="text-[#a78bfa] font-mono">{preview || '…'}</span>
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-white/10 text-white/60 rounded-lg text-sm hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !preview}
            className="flex-1 px-4 py-2 bg-[#29142e] text-white rounded-lg text-sm hover:bg-[#3a1f4a] transition-colors disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create Model'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
