import { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, Loader2, Layers, X, ChevronRight, Plus } from 'lucide-react';
import apiService from '../../../services/api';

function inferServiceType(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('cache') || t.includes('redis') || t.includes('memcache')) return 'cache';
  if (t.includes('queue') || t.includes('kafka') || t.includes('rabbit') || t.includes('sqs')) return 'queue';
  if (t.includes('storage') || t.includes('s3') || t.includes('blob') || t.includes('cdn')) return 'storage';
  if (t.includes('database') || t.includes(' db') || t.includes('postgres') || t.includes('mysql') || t.includes('mongo')) return 'database';
  return 'api';
}

const SERVICE_COLORS = {
  api:      { bg: 'bg-violet-500/10', border: 'border-violet-500/25', text: 'text-violet-400', dot: 'bg-violet-400' },
  database: { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25',   text: 'text-cyan-400',   dot: 'bg-cyan-400'   },
  cache:    { bg: 'bg-orange-500/10', border: 'border-orange-500/25', text: 'text-orange-400', dot: 'bg-orange-400' },
  queue:    { bg: 'bg-yellow-500/10', border: 'border-yellow-500/25', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  storage:  { bg: 'bg-green-500/10',  border: 'border-green-500/25',  text: 'text-green-400',  dot: 'bg-green-400'  },
};
const fallbackColor = { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white/50', dot: 'bg-white/40' };

function getColor(type) { return SERVICE_COLORS[type] || fallbackColor; }

function FlowArrow() {
  return (
    <div className="flex flex-col items-center my-0.5 flex-shrink-0">
      <div className="w-px h-7 bg-gradient-to-b from-white/20 to-white/8" />
      <svg width="12" height="8" viewBox="0 0 12 8" className="text-white/15">
        <path d="M6 8 L0 0 L12 0 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

function LayerCard({ layer, isSelected, onClick }) {
  return (
    <button
      onClick={() => onClick({ kind: 'layer', ...layer })}
      className={`w-full max-w-sm text-left rounded-2xl border px-6 py-5 transition-all duration-150 group ${
        isSelected
          ? 'border-[#a78bfa] bg-[#1a0f28] shadow-[0_0_30px_rgba(167,139,250,0.08)]'
          : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-white/80'}`}>{layer.name}</span>
        <ChevronRight className={`w-4 h-4 transition-colors ${isSelected ? 'text-[#a78bfa]' : 'text-white/20 group-hover:text-white/40'}`} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(layer.components || []).map((c, i) => (
          <span key={i} className={`text-[11px] px-2 py-0.5 rounded-full transition-colors ${
            isSelected ? 'bg-[#a78bfa]/15 text-[#a78bfa]/90' : 'bg-white/8 text-white/45'
          }`}>{c}</span>
        ))}
      </div>
    </button>
  );
}

function ServiceChip({ svc, isSelected, onClick }) {
  const c = getColor(svc.type);
  return (
    <button
      onClick={() => onClick({ kind: 'service', ...svc })}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
        isSelected
          ? `${c.bg} ${c.border} ${c.text} shadow-sm`
          : 'bg-white/3 border-white/8 text-white/45 hover:border-white/15 hover:text-white/70'
      }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSelected ? c.dot : 'bg-white/25'}`} />
      {svc.name}
      {svc.tech && <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-black/20' : 'bg-white/8'} text-white/40`}>{svc.tech}</span>}
    </button>
  );
}

function DetailPanel({ item, onClose, onAddSuggestion }) {
  const isLayer = item.kind === 'layer';
  const isSuggestion = item.kind === 'suggestion';
  const c = (!isLayer && !isSuggestion) ? getColor(item.type) : null;

  const priorityColor = {
    high: 'text-red-400 bg-red-500/10 border-red-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    low: 'text-green-400 bg-green-500/10 border-green-500/20',
  }[item.priority] || 'text-white/40 bg-white/5 border-white/10';

  return (
    <div className="w-72 flex-shrink-0 flex flex-col border-l border-white/8 bg-[#0a0a0a] overflow-y-auto">
      <div className="flex items-start justify-between px-5 py-5 border-b border-white/8">
        <div>
          {!isLayer && !isSuggestion && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.bg} ${c.text} ${c.border} border mb-2 inline-block`}>
              {item.type}
            </span>
          )}
          {isSuggestion && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border mb-2 inline-block ${priorityColor}`}>
              {item.priority}
            </span>
          )}
          <h3 className="text-white text-base font-semibold">{item.name || item.title}</h3>
          {item.tech && <p className="text-white/35 text-xs mt-0.5">{item.tech}</p>}
        </div>
        <button onClick={onClose} className="text-white/25 hover:text-white transition-colors mt-0.5 flex-shrink-0 ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 py-5 space-y-5">
        {item.description && (
          <div>
            <div className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Description</div>
            <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
          </div>
        )}

        {isLayer && (item.components || []).length > 0 && (
          <div>
            <div className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Components</div>
            <div className="flex flex-wrap gap-1.5">
              {item.components.map((c, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white/6 border border-white/8 text-white/55">{c}</span>
              ))}
            </div>
          </div>
        )}

        {isSuggestion && (
          <button
            onClick={() => { onAddSuggestion(item); onClose(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#29142e] border border-[#a78bfa]/20 text-white text-sm rounded-xl hover:bg-[#3a1f4a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add to Services
          </button>
        )}
      </div>
    </div>
  );
}

export default function ArchitecturePanel({ projectId, savedData, onSaved }) {
  const [arch, setArch] = useState(savedData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (savedData) setArch(savedData);
  }, [savedData]);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setSelected(null);
    try {
      const res = await apiService.generateArchitecture(projectId);
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Generation failed.'); return; }
      const data = await res.json();
      setArch(data.architecture);
      onSaved?.(data.architecture);
    } catch { setError('Failed to connect.'); }
    finally { setLoading(false); }
  };

  const handleSelect = (item) => {
    setSelected(prev => (prev?.name === item.name && prev?.kind === item.kind) ? null : item);
  };

  const handleAddSuggestion = (suggestion) => {
    const name = suggestion.title || suggestion.name;
    setArch(prev => ({
      ...prev,
      services: [
        ...(prev.services || []),
        { name, type: inferServiceType(name), description: suggestion.description, tech: '' },
      ],
      suggestions: (prev.suggestions || []).filter(s => s.title !== suggestion.title),
    }));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/8 flex-shrink-0">
        <div>
          <h2 className="text-white text-xl font-semibold">Architecture</h2>
          <p className="text-white/35 text-xs mt-0.5">Click any node to inspect it</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#29142e] text-white text-sm rounded-lg hover:bg-[#3a1f4a] disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {arch ? 'Regenerate' : 'Generate'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {/* Empty state */}
      {!arch && !loading && !error && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/4 flex items-center justify-center mb-4">
            <Layers className="w-7 h-7 text-white/20" />
          </div>
          <p className="text-white/35 text-sm mb-5 max-w-xs">Generate an interactive architecture diagram showing your system layers and services.</p>
          <button onClick={handleGenerate} className="flex items-center gap-2 px-5 py-2.5 bg-[#29142e] text-white text-sm rounded-lg hover:bg-[#3a1f4a] transition-colors">
            <Sparkles className="w-4 h-4" /> Generate Architecture
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-[#a78bfa] animate-spin mx-auto mb-3" />
            <p className="text-white/35 text-sm">Designing architecture…</p>
          </div>
        </div>
      )}

      {/* Diagram */}
      {arch && !loading && (
        <div className="flex-1 flex overflow-hidden">
          {/* Flowchart column */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="flex flex-col items-center">

              {/* Layers as flowchart nodes */}
              {(arch.layers || []).map((layer, i) => (
                <div key={i} className="flex flex-col items-center w-full max-w-sm">
                  <LayerCard
                    layer={layer}
                    isSelected={selected?.kind === 'layer' && selected?.name === layer.name}
                    onClick={handleSelect}
                  />
                  {i < arch.layers.length - 1 && <FlowArrow />}
                </div>
              ))}

              {/* Services grid below layers */}
              {(arch.services || []).length > 0 && (
                <>
                  {(arch.layers || []).length > 0 && <FlowArrow />}
                  <div className="w-full max-w-sm">
                    <div className="text-white/20 text-[10px] uppercase tracking-widest text-center mb-3">Services</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {arch.services.map((svc, i) => (
                        <ServiceChip
                          key={i}
                          svc={svc}
                          isSelected={selected?.kind === 'service' && selected?.name === svc.name}
                          onClick={handleSelect}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Suggestions row at bottom */}
              {(arch.suggestions || []).length > 0 && (
                <div className="w-full max-w-sm mt-8 space-y-2">
                  <div className="text-white/20 text-[10px] uppercase tracking-widest mb-3">Suggestions — click to add</div>
                  {arch.suggestions.map((s, i) => {
                    const colorClass = s.priority === 'high' ? 'text-red-400' : s.priority === 'medium' ? 'text-yellow-400' : 'text-green-400';
                    const isSelSuggestion = selected?.kind === 'suggestion' && selected?.title === s.title;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect({ kind: 'suggestion', ...s })}
                        className={`w-full text-left border rounded-xl px-4 py-3 transition-all ${
                          isSelSuggestion
                            ? 'border-[#a78bfa]/40 bg-[#1a0f28]'
                            : 'border-white/8 bg-white/2 hover:border-white/16 hover:bg-white/4'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-semibold uppercase ${colorClass}`}>{s.priority}</span>
                          <span className="text-white/60 text-xs font-medium">{s.title}</span>
                          <Plus className="w-3 h-3 text-white/20 ml-auto flex-shrink-0" />
                        </div>
                        <p className="text-white/35 text-xs leading-relaxed">{s.description}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Detail side panel */}
          {selected && (
            <DetailPanel item={selected} onClose={() => setSelected(null)} onAddSuggestion={handleAddSuggestion} />
          )}
        </div>
      )}
    </div>
  );
}
