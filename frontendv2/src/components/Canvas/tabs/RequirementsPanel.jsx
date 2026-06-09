import { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, Loader2, X, ClipboardList } from 'lucide-react';
import apiService from '../../../services/api';

const PRIORITY = {
  high:   { label: 'High',   bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-400',    dot: 'bg-red-400'    },
  medium: { label: 'Medium', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  low:    { label: 'Low',    bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-400',  dot: 'bg-green-400'  },
};

const CATEGORY = {
  performance:     { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-400'   },
  security:        { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  scalability:     { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   text: 'text-cyan-400'   },
  reliability:     { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
  usability:       { bg: 'bg-pink-500/10',   border: 'border-pink-500/20',   text: 'text-pink-400'   },
  maintainability: { bg: 'bg-teal-500/10',   border: 'border-teal-500/20',   text: 'text-teal-400'   },
};
const fallbackCat = { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white/40' };

function ReqCard({ item, type, onClick }) {
  const style = type === 'fr'
    ? (PRIORITY[item.priority] || PRIORITY.medium)
    : (CATEGORY[item.category] || fallbackCat);
  const badge = type === 'fr' ? item.priority : item.category;

  return (
    <button
      onClick={() => onClick(item, type)}
      className="w-full text-left border border-white/8 bg-white/3 rounded-xl px-4 py-3.5 hover:border-white/18 hover:bg-white/5 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-white/25 text-[10px] font-mono">{item.id}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${style.bg} ${style.border} ${style.text} flex-shrink-0`}>
          {badge}
        </span>
      </div>
      <p className="text-white/70 text-sm leading-snug">{item.title}</p>
    </button>
  );
}

function Modal({ item, type, onClose }) {
  const style = type === 'fr'
    ? (PRIORITY[item.priority] || PRIORITY.medium)
    : (CATEGORY[item.category] || fallbackCat);
  const badge = type === 'fr' ? item.priority : item.category;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-[#111] border border-white/12 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-5 border-b border-white/8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-white/30 text-xs font-mono">{item.id}</span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${style.bg} ${style.border} ${style.text}`}>
                {badge}
              </span>
            </div>
            <h3 className="text-white text-base font-semibold leading-snug">{item.title}</h3>
          </div>
          <button onClick={onClose} className="text-white/25 hover:text-white transition-colors ml-4 flex-shrink-0 mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">
          <div className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Description</div>
          <p className="text-white/65 text-sm leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

function KanbanBoard({ items, type }) {
  const [selected, setSelected] = useState(null);

  const columns = type === 'fr'
    ? ['high', 'medium', 'low'].map(p => ({
        key: p,
        label: PRIORITY[p].label,
        style: PRIORITY[p],
        items: items.filter(r => r.priority === p),
      }))
    : [...new Set(items.map(r => r.category || 'other'))].map(cat => ({
        key: cat,
        label: cat,
        style: CATEGORY[cat] || fallbackCat,
        items: items.filter(r => (r.category || 'other') === cat),
      }));

  return (
    <>
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {columns.map(col => (
          <div key={col.key} className="flex-shrink-0 w-64 flex flex-col gap-2">
            {/* Column header */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${col.style.bg} ${col.style.border}`}>
              <div className={`w-2 h-2 rounded-full ${'dot' in col.style ? col.style.dot : 'bg-white/40'}`} />
              <span className={`text-xs font-semibold capitalize ${col.style.text}`}>{col.label}</span>
              <span className="ml-auto text-white/25 text-xs">{col.items.length}</span>
            </div>
            {/* Cards */}
            <div className="flex flex-col gap-2">
              {col.items.map(item => (
                <ReqCard key={item.id} item={item} type={type} onClick={(i) => setSelected(i)} />
              ))}
              {col.items.length === 0 && (
                <div className="border border-dashed border-white/8 rounded-xl px-4 py-6 text-center">
                  <p className="text-white/20 text-xs">No items</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <Modal item={selected} type={type} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

export default function RequirementsPanel({ projectId, savedData, onSaved }) {
  const [requirements, setRequirements] = useState(savedData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeType, setActiveType] = useState('fr');

  useEffect(() => {
    if (savedData) setRequirements(savedData);
  }, [savedData]);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiService.generateRequirements(projectId);
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Generation failed.'); return; }
      const data = await res.json();
      setRequirements(data.requirements);
      onSaved?.(data.requirements);
    } catch { setError('Failed to connect.'); }
    finally { setLoading(false); }
  };

  const fr = requirements?.functional || [];
  const nfr = requirements?.non_functional || [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/8 flex-shrink-0">
        <div>
          <h2 className="text-white text-xl font-semibold">Requirements</h2>
          <p className="text-white/35 text-xs mt-0.5">Click any card to read the full requirement</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#29142e] text-white text-sm rounded-lg hover:bg-[#3a1f4a] disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {requirements ? 'Regenerate' : 'Generate'}
        </button>
      </div>

      {error && (
        <div className="mx-4 mt-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {!requirements && !loading && !error && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/4 flex items-center justify-center mb-4">
            <ClipboardList className="w-7 h-7 text-white/20" />
          </div>
          <p className="text-white/35 text-sm mb-5 max-w-xs">Generate a visual requirements board with priority swim lanes and full descriptions.</p>
          <button onClick={handleGenerate} className="flex items-center gap-2 px-5 py-2.5 bg-[#29142e] text-white text-sm rounded-lg hover:bg-[#3a1f4a] transition-colors">
            <Sparkles className="w-4 h-4" /> Generate Requirements
          </button>
        </div>
      )}

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-[#a78bfa] animate-spin mx-auto mb-3" />
            <p className="text-white/35 text-sm">Analyzing your schema…</p>
          </div>
        </div>
      )}

      {requirements && !loading && (
        <>
          {/* Tab switch */}
          <div className="flex gap-1 px-4 pt-4 pb-0 flex-shrink-0">
            <button
              onClick={() => setActiveType('fr')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeType === 'fr'
                  ? 'bg-white/8 text-white'
                  : 'text-white/35 hover:text-white/60 hover:bg-white/4'
              }`}
            >
              Functional
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/40">{fr.length}</span>
            </button>
            <button
              onClick={() => setActiveType('nfr')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeType === 'nfr'
                  ? 'bg-white/8 text-white'
                  : 'text-white/35 hover:text-white/60 hover:bg-white/4'
              }`}
            >
              Non-Functional
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/40">{nfr.length}</span>
            </button>
          </div>

          {/* Board */}
          <div className="flex-1 overflow-x-auto px-4 py-4">
            {activeType === 'fr' && <KanbanBoard items={fr} type="fr" />}
            {activeType === 'nfr' && <KanbanBoard items={nfr} type="nfr" />}
          </div>
        </>
      )}
    </div>
  );
}
