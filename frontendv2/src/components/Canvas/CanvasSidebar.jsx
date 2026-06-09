import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Settings, Download, FileJson, FileText,
  Copy, ChevronLeft, ChevronRight, Layers, Zap, CheckCircle2,
  ExternalLink, LogOut, Lock, Sparkles, Bot,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TIER_RANK = { free: 0, pro: 1, max: 2 };

function tierAtLeast(userTier, required) {
  return (TIER_RANK[userTier] ?? 0) >= (TIER_RANK[required] ?? 0);
}

export default function CanvasSidebar({
  project,
  nodes,
  onExportJson,
  onExportYaml,
  onCopySpec,
  onGenerateCode,
  onCopyPrompt,
  copied,
  promptCopied,
  generating,
  exporting,
  onOpenProjectSettings,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const tier = user?.tier || 'free';
  const canGenerate = tierAtLeast(tier, 'pro');

  const modelCount = nodes.length;
  const fieldCount = nodes.reduce((s, n) => s + (n.data.model?.fields?.length || 0), 0);
  const relCount = nodes.reduce((s, n) => s + (n.data.model?.relationships?.length || 0), 0);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleLockedGenerate = () => {
    navigate('/settings');
  };

  return (
    <div className={`flex flex-col h-full bg-[#0a0a0a] border-r border-white/10 transition-all duration-200 ${collapsed ? 'w-12' : 'w-56'} flex-shrink-0`}>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="flex items-center justify-end p-3 text-white/30 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Project info */}
      {!collapsed && (
        <div className="px-3 pb-3 border-b border-white/10">
          <div className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Project</div>
          <div className="text-white text-sm font-medium truncate">{project?.name || '…'}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white/30 text-xs">{project?.framework || 'django'}</span>
            {!canGenerate && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/10">Free</span>
            )}
          </div>
        </div>
      )}

      {/* Schema stats */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-white/10 space-y-1.5">
          <div className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Schema</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50 flex items-center gap-1.5"><Layers className="w-3 h-3" /> Models</span>
            <span className="text-white font-medium">{modelCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Fields</span>
            <span className="text-white font-medium">{fieldCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50 flex items-center gap-1.5"><ExternalLink className="w-3 h-3" /> Relations</span>
            <span className="text-white font-medium">{relCount}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {!collapsed && <div className="text-white/30 text-[10px] uppercase tracking-wider px-1 mb-2">Export</div>}

        <SidebarBtn
          icon={<Copy className="w-4 h-4" />}
          label={copied ? 'Copied!' : 'Copy Spec'}
          collapsed={collapsed}
          onClick={onCopySpec}
          active={copied}
        />
        <SidebarBtn
          icon={<FileJson className="w-4 h-4" />}
          label="Export JSON"
          collapsed={collapsed}
          onClick={onExportJson}
          disabled={exporting}
        />
        <SidebarBtn
          icon={<FileText className="w-4 h-4" />}
          label="Export YAML"
          collapsed={collapsed}
          onClick={onExportYaml}
          disabled={exporting}
        />

        {/* Copy AI Prompt — available to all tiers */}
        <SidebarBtn
          icon={<Bot className="w-4 h-4" />}
          label={promptCopied ? 'Prompt Copied!' : 'Copy AI Prompt'}
          collapsed={collapsed}
          onClick={onCopyPrompt}
          active={promptCopied}
          title="Copy a ready-made prompt for Claude/Gemini to generate code"
        />

        {/* Generate Code — Pro+ only */}
        {canGenerate ? (
          <SidebarBtn
            icon={<Download className="w-4 h-4" />}
            label={generating ? 'Generating…' : 'Generate Code'}
            collapsed={collapsed}
            onClick={onGenerateCode}
            disabled={generating}
            accent
          />
        ) : (
          <SidebarBtn
            icon={<Lock className="w-4 h-4" />}
            label="Generate Code"
            collapsed={collapsed}
            onClick={handleLockedGenerate}
            locked
            lockLabel="Pro"
            title="Upgrade to Pro to download generated code"
          />
        )}

        <div className="pt-2" />

        {!collapsed && <div className="text-white/30 text-[10px] uppercase tracking-wider px-1 mb-2">Navigate</div>}

        <SidebarBtn
          icon={<LayoutDashboard className="w-4 h-4" />}
          label="Dashboard"
          collapsed={collapsed}
          onClick={() => navigate('/dashboard')}
        />
        <SidebarBtn
          icon={<Settings className="w-4 h-4" />}
          label="Project Settings"
          collapsed={collapsed}
          onClick={onOpenProjectSettings}
        />
        <SidebarBtn
          icon={<LogOut className="w-4 h-4" />}
          label="Sign Out"
          collapsed={collapsed}
          onClick={handleLogout}
          danger
        />
      </div>

      {/* Profile button at bottom */}
      <div className={`border-t border-white/10 ${collapsed ? 'p-2' : 'p-3'}`}>
        <button
          onClick={() => navigate('/profile')}
          title="Go to profile"
          className={`w-full flex items-center gap-2.5 rounded-lg hover:bg-white/5 transition-colors ${collapsed ? 'justify-center p-1.5' : 'px-2 py-2'}`}
        >
          <div className="w-6 h-6 rounded-full bg-[#29142e] border border-[#a78bfa]/30 flex items-center justify-center text-[10px] font-bold text-[#a78bfa] flex-shrink-0">
            {[user?.first_name, user?.last_name].filter(Boolean).map(n => n[0].toUpperCase()).join('') || user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          {!collapsed && (
            <div className="min-w-0 text-left">
              <div className="text-white/70 text-xs font-medium truncate leading-tight">
                {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'Profile'}
              </div>
              <div className="text-white/25 text-[10px] tracking-widest font-bold leading-tight">SCAFLD</div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

function SidebarBtn({ icon, label, collapsed, onClick, disabled, accent, danger, active, locked, lockLabel, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={collapsed ? label : (title || undefined)}
      className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs transition-colors disabled:opacity-40
        ${locked ? 'text-white/25 hover:text-white/40 hover:bg-white/5 cursor-not-allowed' :
          accent ? 'bg-[#29142e] text-white hover:bg-[#3a1f4a]' :
          danger ? 'text-red-400/70 hover:text-red-400 hover:bg-white/5' :
          active ? 'text-green-400 bg-white/5' :
          'text-white/50 hover:text-white hover:bg-white/5'}
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && (
        <>
          <span className="truncate flex-1">{label}</span>
          {locked && lockLabel && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/20 flex-shrink-0">
              {lockLabel}
            </span>
          )}
        </>
      )}
    </button>
  );
}
