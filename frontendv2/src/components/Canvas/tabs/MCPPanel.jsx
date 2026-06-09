import { useState } from 'react';
import { Copy, CheckCircle2, ExternalLink, Terminal, Cpu } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function MCPPanel({ projectId }) {
  const mcpUrl = `${API_BASE}/mcp/schema/?project=${projectId}`;
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedClaude, setCopiedClaude] = useState(false);
  const [copiedVSCode, setCopiedVSCode] = useState(false);

  const claudeConfig = JSON.stringify({
    mcpServers: {
      scafld: {
        command: "npx",
        args: ["-y", "@scafld/mcp-server", "--project", projectId]
      }
    }
  }, null, 2);

  const vsCodeConfig = JSON.stringify({
    mcpServers: {
      scafld: {
        command: "npx",
        args: ["-y", "@scafld/mcp-server"],
        env: {
          SCAFLD_PROJECT_ID: projectId,
          SCAFLD_API_URL: API_BASE,
        }
      }
    }
  }, null, 2);

  const copy = async (text, setter) => {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-white text-2xl font-semibold mb-1 flex items-center gap-3">
          <Cpu className="w-6 h-6" />
          MCP Server
        </h2>
        <p className="text-white/40 text-sm">Connect your schema to Claude, Cursor, VS Code, and other AI tools via the Model Context Protocol</p>
      </div>

      <div className="max-w-2xl space-y-8">

        {/* Schema endpoint */}
        <section>
          <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">Schema Endpoint</h3>
          <div className="flex items-center gap-3 bg-white/3 border border-white/10 rounded-xl px-5 py-3.5">
            <code className="text-[#a78bfa] text-sm flex-1 truncate font-mono">{mcpUrl}</code>
            <button
              onClick={() => copy(mcpUrl, setCopiedUrl)}
              className="flex-shrink-0 flex items-center gap-1.5 text-white/30 hover:text-white transition-colors text-xs"
            >
              {copiedUrl ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copiedUrl ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-white/30 text-sm mt-2">Returns your full project schema in MCP-compatible JSON format. Refreshes in real-time as you edit.</p>
        </section>

        {/* What you get */}
        <section>
          <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">What Your AI Gets</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Models & fields', 'All your data models with field types and constraints'],
              ['Relationships', 'Foreign keys, many-to-many, one-to-one connections'],
              ['API endpoints', 'URL paths, authentication rules, pagination settings'],
              ['Framework context', 'Django or Express.js conventions and patterns'],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-start gap-3 border border-white/8 rounded-xl bg-white/3 px-4 py-3.5">
                <CheckCircle2 className="w-4 h-4 text-green-400/60 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white/70 text-sm font-medium">{title}</div>
                  <div className="text-white/30 text-xs mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Claude Desktop config */}
        <section>
          <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">Claude Code / Desktop</h3>
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-white/3 border-b border-white/8">
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <Terminal className="w-4 h-4" />
                <span>claude_desktop_config.json</span>
              </div>
              <button
                onClick={() => copy(claudeConfig, setCopiedClaude)}
                className="flex items-center gap-1.5 text-white/30 hover:text-white transition-colors text-xs"
              >
                {copiedClaude ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedClaude ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="text-sm text-white/50 font-mono px-5 py-4 overflow-x-auto bg-[#0a0a0a]">{claudeConfig}</pre>
          </div>
        </section>

        {/* VS Code config */}
        <section>
          <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">VS Code / Cursor</h3>
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-white/3 border-b border-white/8">
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <Terminal className="w-4 h-4" />
                <span>.vscode/mcp.json</span>
              </div>
              <button
                onClick={() => copy(vsCodeConfig, setCopiedVSCode)}
                className="flex items-center gap-1.5 text-white/30 hover:text-white transition-colors text-xs"
              >
                {copiedVSCode ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedVSCode ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="text-sm text-white/50 font-mono px-5 py-4 overflow-x-auto bg-[#0a0a0a]">{vsCodeConfig}</pre>
          </div>
        </section>

        <a
          href="https://docs.scafld.dev/mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white/30 text-sm hover:text-white/50 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          MCP documentation
        </a>
      </div>
    </div>
  );
}
