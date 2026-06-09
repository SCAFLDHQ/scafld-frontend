import { useNavigate } from 'react-router-dom';
import { Database, Zap, ExternalLink, Download, Copy, Bot, Lock, Layers } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const TIER_RANK = { free: 0, pro: 1, max: 2 };
function tierAtLeast(t, r) { return (TIER_RANK[t] ?? 0) >= (TIER_RANK[r] ?? 0); }

const FW_COLORS = {
  django:  { bg: 'bg-[#0C4B33]/40', text: 'text-[#44B78B]', border: 'border-[#0C4B33]' },
  express: { bg: 'bg-[#1a1a1a]',    text: 'text-[#68A063]', border: 'border-white/10'  },
};

function StatCard({ label, value, sub }) {
  return (
    <div className="border border-white/8 rounded-2xl bg-white/3 px-5 py-4">
      <div className="text-white/30 text-xs mb-1">{label}</div>
      <div className="text-white text-2xl font-bold">{value}</div>
      {sub && <div className="text-white/25 text-[10px] mt-0.5">{sub}</div>}
    </div>
  );
}

function ModelRow({ model }) {
  const fieldCount = model.fields?.length ?? 0;
  const relCount = model.relationships?.length ?? 0;
  return (
    <div className="flex items-center gap-4 border border-white/8 rounded-xl px-4 py-3 bg-white/3 hover:border-white/14 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-[#29142e] flex items-center justify-center flex-shrink-0">
        <Database className="w-4 h-4 text-[#a78bfa]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white/80 text-sm font-medium truncate">{model.name}</div>
        {model.description && <div className="text-white/30 text-xs truncate">{model.description}</div>}
      </div>
      <div className="flex items-center gap-3 text-xs text-white/30 flex-shrink-0">
        <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{fieldCount}</span>
        <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" />{relCount}</span>
      </div>
    </div>
  );
}

export default function OverviewPanel({
  project, nodes,
  onGenerateCode, onCopySpec, onCopyPrompt,
  copied, promptCopied, generating, exporting,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const tier = user?.tier || 'free';
  const canGenerate = tierAtLeast(tier, 'pro');

  const modelCount = nodes.length;
  const fieldCount = nodes.reduce((s, n) => s + (n.data.model?.fields?.length || 0), 0);
  const relCount   = nodes.reduce((s, n) => s + (n.data.model?.relationships?.length || 0), 0);
  const epCount    = nodes.reduce((s, n) => s + (n.data.endpoint ? 1 : 0), 0);

  const fw = project?.framework || 'django';
  const fwStyle = FW_COLORS[fw] || FW_COLORS.django;

  return (
    <div className="flex flex-col h-full overflow-y-auto px-8 py-8 space-y-8">

      {/* Project header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#29142e] border border-[#a78bfa]/20 flex items-center justify-center flex-shrink-0">
          <Layers className="w-6 h-6 text-[#a78bfa]" />
        </div>
        <div>
          <h2 className="text-white text-2xl font-bold">{project?.name || 'Project'}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${fwStyle.bg} ${fwStyle.text} ${fwStyle.border}`}>
              {fw === 'django' ? 'Django' : 'Express.js'}
            </span>
            <span className="text-white/25 text-xs capitalize">{tier} plan</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Models"        value={modelCount} />
        <StatCard label="Fields"        value={fieldCount} />
        <StatCard label="Relationships" value={relCount}   />
        <StatCard label="Endpoints"     value={epCount}    />
      </div>

      {/* Quick actions */}
      <div>
        <div className="text-white/30 text-xs uppercase tracking-wider mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onCopySpec}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm transition-colors ${
              copied
                ? 'border-green-500/30 bg-green-500/8 text-green-400'
                : 'border-white/10 bg-white/3 text-white/60 hover:text-white hover:bg-white/6'
            }`}
          >
            <Copy className="w-4 h-4 flex-shrink-0" />
            {copied ? 'Spec Copied!' : 'Copy Spec'}
          </button>

          <button
            onClick={onCopyPrompt}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm transition-colors ${
              promptCopied
                ? 'border-green-500/30 bg-green-500/8 text-green-400'
                : 'border-white/10 bg-white/3 text-white/60 hover:text-white hover:bg-white/6'
            }`}
          >
            <Bot className="w-4 h-4 flex-shrink-0" />
            {promptCopied ? 'Prompt Copied!' : 'Copy AI Prompt'}
          </button>

          {canGenerate ? (
            <button
              onClick={onGenerateCode}
              disabled={generating}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#29142e] border border-[#a78bfa]/20 text-white text-sm hover:bg-[#3a1f4a] disabled:opacity-40 transition-colors col-span-2"
            >
              <Download className="w-4 h-4 flex-shrink-0" />
              {generating ? 'Generating…' : 'Generate & Download Code'}
            </button>
          ) : (
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/8 text-white/30 text-sm hover:text-white/50 transition-colors col-span-2"
            >
              <Lock className="w-4 h-4 flex-shrink-0" />
              Generate Code
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/20">Pro</span>
            </button>
          )}
        </div>
      </div>

      {/* Models list */}
      {nodes.length > 0 && (
        <div>
          <div className="text-white/30 text-xs uppercase tracking-wider mb-3">
            Schema — {modelCount} model{modelCount !== 1 ? 's' : ''}
          </div>
          <div className="space-y-2">
            {nodes.map(node => (
              <ModelRow key={node.id} model={node.data.model} />
            ))}
          </div>
        </div>
      )}

      {nodes.length === 0 && (
        <div className="border border-dashed border-white/10 rounded-2xl px-6 py-10 text-center">
          <Database className="w-8 h-8 text-white/15 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No models yet.</p>
          <p className="text-white/20 text-xs mt-1">Switch to the Schema tab to start building.</p>
        </div>
      )}
    </div>
  );
}
