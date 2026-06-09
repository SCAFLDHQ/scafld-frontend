import { useState } from 'react';
import { motion } from 'motion/react';
import { X, ArrowRight, GitBranch } from 'lucide-react';

const REL_TYPES = [
  { value: 'ForeignKey', label: 'ForeignKey', abbr: 'FK', desc: 'Many-to-one', color: 'text-[#a78bfa]' },
  { value: 'ManyToManyField', label: 'ManyToManyField', abbr: 'M2M', desc: 'Many-to-many', color: 'text-cyan-400' },
  { value: 'OneToOneField', label: 'OneToOneField', abbr: 'O2O', desc: 'One-to-one', color: 'text-emerald-400' },
];

const ON_DELETE_OPTS = [
  { value: 'CASCADE', label: 'CASCADE', desc: 'Delete related objects' },
  { value: 'PROTECT', label: 'PROTECT', desc: 'Prevent deletion' },
  { value: 'SET_NULL', label: 'SET_NULL', desc: 'Set to null' },
  { value: 'SET_DEFAULT', label: 'SET_DEFAULT', desc: 'Set to default' },
  { value: 'DO_NOTHING', label: 'DO_NOTHING', desc: 'No action' },
];

function toSnakeCase(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
    .replace(/[\s\-]+/g, '_').replace(/[^a-z0-9_]/g, '')
    .replace(/^_+/, '').replace(/_+/g, '_');
}

export default function RelationshipModal({ sourceModel, targetModel, sourceField, onSave, onClose }) {
  const defaultFieldName = sourceField?.name || toSnakeCase(targetModel.name);
  const [relType, setRelType] = useState('ForeignKey');
  const [onDelete, setOnDelete] = useState('CASCADE');
  const [fieldName, setFieldName] = useState(defaultFieldName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    const name = toSnakeCase(fieldName.trim());
    if (!name) return setError('Field name is required');
    setSaving(true);
    setError('');
    try {
      await onSave({
        relationship_type: relType,
        field_name: name,
        on_delete: relType !== 'ManyToManyField' ? onDelete : 'CASCADE',
      });
    } catch (e) {
      setError(e.message || 'Failed to create relationship');
      setSaving(false);
    }
  };

  const selected = REL_TYPES.find(r => r.value === relType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-[#111] border border-white/10 rounded-xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#a78bfa]" />
            <h3 className="text-white font-medium">Add Relationship</h3>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        {/* Connection preview */}
        <div className="flex items-center gap-2 mb-5 px-3 py-2.5 bg-white/5 rounded-lg border border-white/5">
          <div className="text-center flex-1 min-w-0">
            <div className="text-[#a78bfa] font-medium text-sm truncate">{sourceModel.name}</div>
            {sourceField && (
              <div className="text-white/40 text-xs font-mono mt-0.5 truncate">.{sourceField.name}</div>
            )}
          </div>
          <div className="flex flex-col items-center flex-shrink-0 px-1">
            <ArrowRight className={`w-4 h-4 ${selected?.color || 'text-white/40'}`} />
            <span className={`text-[10px] font-mono mt-0.5 ${selected?.color || 'text-white/40'}`}>{selected?.abbr}</span>
          </div>
          <div className="text-center flex-1 min-w-0">
            <div className="text-white/80 font-medium text-sm truncate">{targetModel.name}</div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Relationship type */}
          <div>
            <label className="block text-white/60 text-xs mb-2">Relationship type</label>
            <div className="grid grid-cols-3 gap-2">
              {REL_TYPES.map(r => (
                <button
                  key={r.value}
                  onClick={() => setRelType(r.value)}
                  className={`px-2 py-2 rounded-lg border text-center transition-all ${
                    relType === r.value
                      ? 'border-[#7c3aed] bg-[#29142e]/60'
                      : 'border-white/10 hover:border-white/20 bg-white/3'
                  }`}
                >
                  <div className={`font-mono text-xs font-bold ${r.color}`}>{r.abbr}</div>
                  <div className="text-white/40 text-[10px] mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Field name */}
          <div>
            <label className="block text-white/60 text-xs mb-1">Field name on <span className="text-[#a78bfa]">{sourceModel.name}</span></label>
            <input
              autoFocus
              value={fieldName}
              onChange={e => setFieldName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="e.g. user, author, category"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm focus:outline-none focus:border-[#7c3aed] font-mono"
            />
            {fieldName.trim() && fieldName !== toSnakeCase(fieldName.trim()) && (
              <p className="text-white/40 text-xs mt-1">
                Will be saved as <span className="text-[#a78bfa] font-mono">{toSnakeCase(fieldName.trim())}</span>
              </p>
            )}
          </div>

          {/* on_delete — hidden for M2M */}
          {relType !== 'ManyToManyField' && (
            <div>
              <label className="block text-white/60 text-xs mb-1">on_delete</label>
              <select
                value={onDelete}
                onChange={e => setOnDelete(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 text-white rounded-lg text-sm focus:outline-none focus:border-[#7c3aed]"
              >
                {ON_DELETE_OPTS.map(o => (
                  <option key={o.value} value={o.value}>{o.label} — {o.desc}</option>
                ))}
              </select>
            </div>
          )}

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
            {saving ? 'Adding…' : 'Add Relationship'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
