import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeft, Download, FileJson, FileText,
  Copy, LogOut, Lock, Bot,
  ClipboardList, Network, Github, Cpu, Database, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TIER_RANK = { free: 0, pro: 1, max: 2 };
function tierAtLeast(userTier, required) {
  return (TIER_RANK[userTier] ?? 0) >= (TIER_RANK[required] ?? 0);
}

const VIEWS = [
  { id: 'overview',     icon: LayoutDashboard, label: 'Overview'     },
  { id: 'schema',       icon: Database,        label: 'Schema'       },
  { id: 'requirements', icon: ClipboardList,   label: 'Requirements' },
  { id: 'architecture', icon: Network,         label: 'Architecture' },
  { id: 'github',       icon: Github,          label: 'GitHub'       },
  { id: 'mcp',          icon: Cpu,             label: 'MCP'          },
];

export default function CanvasSidebar({
  project,
  nodes,
  activeTab,
  onTabChange,
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
  collapsed,
  onCollapsedChange,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const tier = user?.tier || 'free';
  const canGenerate = tierAtLeast(tier, 'pro');

  const handleLogout = () => { logout(); navigate('/login'); };

  const getUserInitials = () => {
    const parts = [user?.first_name, user?.last_name].filter(Boolean);
    if (parts.length) return parts.map(n => n[0].toUpperCase()).join('');
    return user?.email?.[0]?.toUpperCase() || '?';
  };

  return (
    <aside
      className={`flex-shrink-0 flex flex-col h-full bg-[#0d0d0d] border-r border-white/8 transition-all duration-300 overflow-hidden ${
        collapsed ? 'w-[60px]' : 'w-60'
      }`}
    >
      {/* Brand / Project header + close button */}
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-5 border-b border-white/8 ${collapsed ? 'justify-center px-0' : ''}`}>
        {!collapsed ? (
          <>
            <div className="w-8 h-8 rounded-lg bg-[#29142e] border border-[#a78bfa]/25 flex items-center justify-center flex-shrink-0">
              <span className="text-[#a78bfa] text-xs font-bold">S</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white text-sm font-semibold truncate">{project?.name || 'Project'}</div>
              <div className="text-white/30 text-[10px]">{project?.framework || 'django'} · {tier}</div>
            </div>
            <button
              onClick={() => onCollapsedChange(true)}
              title="Close sidebar"
              className="flex-shrink-0 text-white/25 hover:text-white transition-colors p-1 rounded"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onCollapsedChange(false)}
            title="Open sidebar"
            className="text-white/25 hover:text-white transition-colors p-1 rounded"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Back to Dashboard */}
      <div className="flex-shrink-0 px-2 pt-2 pb-0">
        <button
          onClick={() => navigate('/dashboard')}
          title="Back to Dashboard"
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/35 hover:text-white hover:bg-white/5 transition-colors relative group ${collapsed ? 'justify-center' : ''}`}
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-xs">Dashboard</span>}
          {collapsed && (
            <div className="absolute left-full ml-2.5 px-2 py-1 bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
              Back to Dashboard
            </div>
          )}
        </button>
      </div>

      {/* Main nav — view switchers */}
      <nav className="flex-shrink-0 px-2 py-2 space-y-0.5">
        {!collapsed && (
          <div className="text-white/20 text-[9px] uppercase tracking-widest px-2 mb-2 mt-1">Views</div>
        )}
        {VIEWS.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          const isGitHub = id === 'github';
          const locked = isGitHub && !tierAtLeast(tier, 'pro');
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium relative group ${
                isActive
                  ? 'bg-[#1e0f23] text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4),inset_-1px_-1px_3px_rgba(255,255,255,0.03)]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#a78bfa]' : ''}`} />
              {!collapsed && (
                <>
                  <span className="truncate flex-1 text-left">{label}</span>
                  {locked && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#7c3aed]/15 text-[#a78bfa]/70 border border-[#7c3aed]/20">
                      Pro
                    </span>
                  )}
                </>
              )}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2.5 px-2 py-1 bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
                  {label}{locked ? ' (Pro)' : ''}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-white/8" />

      {/* Quick actions (schema-only tools) */}
      <div className="px-2 py-3 space-y-0.5">
        {!collapsed && (
          <div className="text-white/20 text-[9px] uppercase tracking-widest px-2 mb-2">Actions</div>
        )}
        <NavAction icon={<Copy className="w-4 h-4" />} label={copied ? 'Copied!' : 'Copy Spec'} onClick={onCopySpec} active={copied} collapsed={collapsed} />
        <NavAction icon={<FileJson className="w-4 h-4" />} label="Export JSON" onClick={onExportJson} disabled={exporting} collapsed={collapsed} />
        <NavAction icon={<FileText className="w-4 h-4" />} label="Export YAML" onClick={onExportYaml} disabled={exporting} collapsed={collapsed} />
        <NavAction
          icon={<Bot className="w-4 h-4" />}
          label={promptCopied ? 'Copied!' : 'Copy Prompt'}
          onClick={onCopyPrompt}
          active={promptCopied}
          collapsed={collapsed}
          title="Copy a ready-made AI prompt (Claude, Gemini, Cursor)"
        />
        {canGenerate ? (
          <NavAction
            icon={<Download className="w-4 h-4" />}
            label={generating ? 'Generating…' : 'Generate Code'}
            onClick={onGenerateCode}
            disabled={generating}
            accent
            collapsed={collapsed}
          />
        ) : (
          <NavAction
            icon={<Lock className="w-4 h-4" />}
            label="Generate Code"
            onClick={() => navigate('/settings')}
            locked
            lockLabel="Pro"
            collapsed={collapsed}
            title="Upgrade to Pro to download generated code"
          />
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User footer */}
      <div className="flex-shrink-0 border-t border-white/8 px-3 py-3">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <button
            onClick={() => navigate('/settings')}
            title="Account Settings"
            className={`flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity ${collapsed ? '' : 'flex-1'}`}
          >
            <div className="w-7 h-7 rounded-full bg-[#29142e] border border-[#a78bfa]/30 flex items-center justify-center text-[10px] font-bold text-[#a78bfa] flex-shrink-0">
              {getUserInitials()}
            </div>
            {!collapsed && (
              <div className="min-w-0 text-left">
                <div className="text-white/70 text-xs truncate leading-tight">
                  {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'Profile'}
                </div>
                <div className="text-white/20 text-[9px] leading-tight">SCAFLD</div>
              </div>
            )}
          </button>
          {!collapsed && (
            <button
              onClick={handleLogout}
              title="Sign out"
              className="flex-shrink-0 text-white/20 hover:text-red-400 transition-colors p-1 rounded"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

function NavAction({ icon, label, onClick, disabled, accent, active, locked, lockLabel, collapsed, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={collapsed ? label : (title || undefined)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-40 relative group ${
        locked
          ? 'text-white/20 hover:text-white/35 hover:bg-white/3 cursor-not-allowed'
          : accent
          ? 'bg-[#29142e] text-white hover:bg-[#3a1f4a]'
          : active
          ? 'text-green-400 bg-white/5'
          : 'text-white/45 hover:text-white hover:bg-white/5'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && (
        <>
          <span className="truncate flex-1 text-left text-xs">{label}</span>
          {locked && lockLabel && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#7c3aed]/15 text-[#a78bfa]/70 border border-[#7c3aed]/20 flex-shrink-0">
              {lockLabel}
            </span>
          )}
        </>
      )}
      {collapsed && (
        <div className="absolute left-full ml-2.5 px-2 py-1 bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
          {label}
        </div>
      )}
    </button>
  );
}
