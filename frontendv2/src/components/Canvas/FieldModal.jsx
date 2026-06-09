import { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/[\s\-]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/^_+/, '')
    .replace(/_+/g, '_');
}

const FIELD_TYPES = [
  'CharField', 'TextField', 'EmailField', 'URLField', 'SlugField',
  'IntegerField', 'FloatField', 'DecimalField', 'PositiveIntegerField',
  'BooleanField', 'DateField', 'TimeField', 'DateTimeField',
  'FileField', 'ImageField', 'JSONField', 'UUIDField',
];

export default function FieldModal({ model, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    field_type: 'CharField',
    null: false,
    blank: false,
    unique: false,
    db_index: false,
    default: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    const name = toSnakeCase(form.name.trim());
    if (!name) return setError('Field name is required');

    setSaving(true);
    setError('');

    const options = {};
    if (form.field_type === 'CharField') options.max_length = 200;
    if (form.field_type === 'DecimalField') { options.max_digits = 10; options.decimal_places = 2; }

    await onSave({
      model: model.id,
      name,
      field_type: form.field_type,
      null: form.null,
      blank: form.blank,
      unique: form.unique,
      db_index: form.db_index,
      default: form.default,
      options,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-[#111] border border-white/10 rounded-xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-medium">Add field to <span className="text-[#a78bfa]">{model.name}</span></h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs mb-1">Field name</label>
            <input
              autoFocus
              value={form.name}
              onChange={e => set('name', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="e.g. First Name, userEmail, order-date…"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm focus:outline-none focus:border-[#7c3aed]"
            />
            {form.name.trim() && (
              <p className="text-white/40 text-xs mt-1">
                Will be saved as <span className="text-[#a78bfa] font-mono">{toSnakeCase(form.name.trim()) || '…'}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-white/60 text-xs mb-1">Field type</label>
            <select
              value={form.field_type}
              onChange={e => set('field_type', e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 text-white rounded-lg text-sm focus:outline-none focus:border-[#7c3aed]"
            >
              {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-white/60 text-xs mb-1">Default value (optional)</label>
            <input
              value={form.default}
              onChange={e => set('default', e.target.value)}
              placeholder="Leave blank for none"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm focus:outline-none focus:border-[#7c3aed]"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            {[['null', 'Null'], ['blank', 'Blank'], ['unique', 'Unique'], ['db_index', 'Index']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={e => set(key, e.target.checked)}
                  className="accent-[#7c3aed]"
                />
                <span className="text-white/60 text-xs">{label}</span>
              </label>
            ))}
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-white/10 text-white/60 rounded-lg text-sm hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-[#29142e] text-white rounded-lg text-sm hover:bg-[#3a1f4a] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Add Field'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
