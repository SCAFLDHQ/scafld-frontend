import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Terminal, Code2, Globe, Check, Clock, ChevronRight,
  Download, ArrowRight, Zap, RefreshCw, GitBranch,
  FileCode2, Layers, Search, Plus, Package,
} from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────

const MCP_CURRENT = [
  { label: 'Authenticate with your Scafld account via API key', done: true },
  { label: 'Pull the active project\'s live spec into VS Code context', done: true },
  { label: 'Inject full schema into every AI prompt automatically', done: true },
  { label: 'Auto-refresh schema when the canvas is updated', done: true },
  { label: 'Works with Claude, Copilot, Gemini — any MCP-compatible assistant', done: true },
  { label: 'sync_changes — push canvas updates to editor context in real time', done: true },
  { label: 'generate_code — trigger code generation without leaving VS Code', done: true },
  { label: 'Schema diff notifications — see exactly what changed on each sync', done: true },
];

const MCP_UPCOMING = [
  { label: 'get_requirements — pull FR/NFR requirements into editor context', done: false },
  { label: 'get_architecture — pull system design layers into context', done: false },
  { label: 'create_model — add a new model to the canvas from VS Code', done: false },
  { label: 'add_field — add a field to an existing model from the terminal', done: false },
];

const CLI_COMMANDS = [
  { cmd: 'scafld login', desc: 'Authenticate with your Scafld account', badge: null },
  { cmd: 'scafld init', desc: 'Create a new Scafld project from the terminal', badge: null },
  { cmd: 'scafld generate', desc: 'Describe your backend and generate schema from CLI', badge: null },
  { cmd: 'scafld canvas', desc: 'Open the project canvas in the browser', badge: null },
  { cmd: 'scafld export', desc: 'Export the structured spec as JSON or YAML', badge: null },
  { cmd: 'scafld codegen', desc: 'Generate code for chosen framework, download zip', badge: null },
  { cmd: 'scafld push', desc: 'Push generated code directly to GitHub', badge: null },
  { cmd: 'scafld deploy', desc: 'One-click deploy to cloud provider', badge: 'soon' },
  { cmd: 'scafld status', desc: 'Show current project schema summary in terminal', badge: null },
  { cmd: 'scafld sync', desc: 'Sync latest canvas changes to local context', badge: null },
  { cmd: 'scafld projects', desc: 'List all your Scafld projects', badge: null },
  { cmd: 'scafld switch [project]', desc: 'Switch active project context', badge: null },
];

const SURFACES = [
  {
    icon: Globe,
    color: '#7c3aed',
    name: 'Browser Canvas',
    tagline: 'Design visually',
    desc: 'The home base. Build your schema, iterate with AI, manage collaborators. Everything starts here.',
    status: 'live',
  },
  {
    icon: Code2,
    color: '#22d3ee',
    name: 'VS Code Extension',
    tagline: 'Code with full context',
    desc: 'MCP server that injects your live schema into every AI conversation inside VS Code. No copy-paste.',
    status: 'live',
  },
  {
    icon: Terminal,
    color: '#f59e0b',
    name: 'CLI (Go / Cobra)',
    tagline: 'Automate everything',
    desc: 'The full Scafld workflow from the terminal. Generate, export, push, deploy — no browser needed.',
    status: 'soon',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function FeatureRow({ label, done, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0"
    >
      {done ? (
        <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
      ) : (
        <Clock className="w-4 h-4 text-[#f59e0b] flex-shrink-0 mt-0.5" />
      )}
      <span className={`text-sm ${done ? 'text-white/70' : 'text-white/40'}`}>{label}</span>
    </motion.div>
  );
}

function Terminal_({ lines, title = 'bash' }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 bg-white/3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-white/20 text-xs ml-2">{title}</span>
      </div>
      <div className="p-4 space-y-1.5">
        {lines.map((line, i) => (
          <div key={i} className={line.type === 'cmd' ? 'text-green-400' : line.type === 'out' ? 'text-white/50' : 'text-[#a78bfa]'}>
            {line.type === 'cmd' && <span className="text-white/30 mr-2">$</span>}
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Tools() {
  const [activeCmd, setActiveCmd] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-white/8">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#29142e] flex items-center justify-center rounded-lg">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-white font-bold tracking-tight">SCAFLD</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/pricing" className="text-white/50 hover:text-white text-sm transition-colors">Pricing</Link>
            <Link to="/dashboard" className="text-white/50 hover:text-white text-sm transition-colors">Dashboard</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pb-24">

        {/* Hero */}
        <section className="text-center pt-20 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7c3aed]/40 bg-[#7c3aed]/10 text-[#a78bfa] text-xs mb-6">
              <Layers className="w-3 h-3" />
              Three surfaces. One schema.
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              Your whole workflow.<br />
              <span className="text-[#a78bfa]">One platform.</span>
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Design on the canvas. Code with full context in VS Code. Automate everything from the terminal.
              Change something in one place — it syncs everywhere instantly.
            </p>
          </motion.div>
        </section>

        {/* Three surfaces */}
        <section className="grid md:grid-cols-3 gap-5 mb-24">
          {SURFACES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative border border-white/10 bg-white/3 rounded-2xl p-6 hover:border-white/20 transition-colors"
              >
                {s.status === 'soon' && (
                  <span className="absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
                    Coming soon
                  </span>
                )}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${s.color}18` }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div className="text-xs text-white/30 mb-1">{s.tagline}</div>
                <div className="text-white font-semibold text-lg mb-2">{s.name}</div>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </section>

        {/* VS Code Extension */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold">VS Code Extension</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">Live</span>
          </div>
          <p className="text-white/40 text-sm mb-8 ml-11">
            MCP server that keeps your schema in context without you lifting a finger.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Feature lists */}
            <div className="space-y-6">
              {/* Current */}
              <div>
                <div className="text-xs text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" /> What it does now
                </div>
                <div className="border border-white/8 rounded-xl bg-white/2 px-4 divide-y divide-white/5">
                  {MCP_CURRENT.map((f, i) => (
                    <FeatureRow key={i} label={f.label} done={f.done} delay={i * 0.04} />
                  ))}
                </div>
              </div>

              {/* Upcoming */}
              <div>
                <div className="text-xs text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-[#f59e0b]" /> Next sprint
                </div>
                <div className="border border-white/8 rounded-xl bg-white/2 px-4 divide-y divide-white/5">
                  {MCP_UPCOMING.map((f, i) => (
                    <FeatureRow key={i} label={f.label} done={f.done} delay={i * 0.04} />
                  ))}
                </div>
              </div>
            </div>

            {/* Terminal demos */}
            <div className="space-y-4">
              <Terminal_
                title="MCP tools/list"
                lines={[
                  { type: 'comment', text: '// Tools available to your AI assistant' },
                  { type: 'out', text: 'get_schema       → full IR schema' },
                  { type: 'out', text: 'get_models       → models + fields + types' },
                  { type: 'out', text: 'get_endpoints    → REST endpoints per model' },
                  { type: 'out', text: 'get_spec         → human-readable summary' },
                  { type: 'out', text: 'sync_changes     → push canvas → VS Code' },
                  { type: 'out', text: 'generate_code    → write files to workspace' },
                ]}
              />

              <Terminal_
                title="mcp-config.json"
                lines={[
                  { type: 'comment', text: '// Add to your Claude Desktop / Cursor config' },
                  { type: 'out', text: '{' },
                  { type: 'out', text: '  "scafld": {' },
                  { type: 'out', text: '    "command": "node",' },
                  { type: 'out', text: '    "args": ["out/mcpRunner.js",' },
                  { type: 'out', text: '      "--api-key", "<your-key>",' },
                  { type: 'out', text: '      "--project-id", "<project-id>"' },
                  { type: 'out', text: '    ]' },
                  { type: 'out', text: '  }' },
                  { type: 'out', text: '}' },
                ]}
              />

              <div className="flex gap-3">
                <a
                  href="https://marketplace.visualstudio.com/publishers/kodedlabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/15 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Install from Marketplace
                </a>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:text-white transition-colors"
                >
                  Get API Key
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CLI */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/15 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <h2 className="text-2xl font-bold">CLI</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20">Coming soon</span>
            <span className="text-xs text-white/20">Built with Go (Cobra)</span>
          </div>
          <p className="text-white/40 text-sm mb-8 ml-11">
            The developer who lives in the terminal shouldn't need to open a browser at all.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Command reference */}
            <div className="border border-white/8 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/8 bg-white/2 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-[#f59e0b]" />
                <span className="text-sm text-white/60">Command reference</span>
              </div>
              <div className="divide-y divide-white/5">
                {CLI_COMMANDS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCmd(activeCmd === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-white/3 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <code className="text-[#f59e0b] text-xs font-mono whitespace-nowrap">{c.cmd}</code>
                      {c.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 flex-shrink-0">
                          {c.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs text-white/30 group-hover:text-white/50 transition-colors text-right ml-4 ${activeCmd === i ? 'text-white/60' : ''}`}>
                      {activeCmd === i ? c.desc : <ChevronRight className="w-3 h-3 ml-auto" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal preview */}
            <div className="space-y-4">
              <Terminal_
                title="scafld — quick start"
                lines={[
                  { type: 'cmd', text: 'scafld login' },
                  { type: 'out', text: '✓ Authenticated as you@email.com' },
                  { type: 'out', text: '' },
                  { type: 'cmd', text: 'scafld generate' },
                  { type: 'out', text: '? Describe your backend: multi-tenant SaaS with billing' },
                  { type: 'out', text: '⠸ Generating schema…' },
                  { type: 'out', text: '✓ 9 models · 42 fields · 11 endpoints' },
                  { type: 'out', text: '→ Canvas: scafld.kodedlabs.com/project/…' },
                ]}
              />
              <Terminal_
                title="scafld — codegen + push"
                lines={[
                  { type: 'cmd', text: 'scafld codegen --framework django' },
                  { type: 'out', text: '✓ Generated 14 files (Django REST Framework)' },
                  { type: 'out', text: '→ Saved to ./generated/saas-api.zip' },
                  { type: 'out', text: '' },
                  { type: 'cmd', text: 'scafld push --repo my-saas-api --private' },
                  { type: 'out', text: '✓ Repository created: github.com/you/my-saas-api' },
                  { type: 'out', text: '✓ 14 files pushed to main' },
                ]}
              />
              <Terminal_
                title="scafld — status"
                lines={[
                  { type: 'cmd', text: 'scafld status' },
                  { type: 'out', text: 'Project : my-saas-api (django)' },
                  { type: 'out', text: 'Models  : 9  · Fields : 42  · Endpoints : 11' },
                  { type: 'out', text: 'Version : v4  · Last synced : 2 minutes ago' },
                  { type: 'out', text: 'Credits : 38/50 daily  · Pack : 120' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Integration — how all three connect */}
        <section className="rounded-3xl border border-white/8 bg-white/2 p-10 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How all three work together</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              The moat nobody else has. All three surfaces talk to the same project, the same schema, the same spec.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector lines (decorative) */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-[#7c3aed]/40 via-[#22d3ee]/40 to-[#f59e0b]/40" />

            {[
              {
                icon: Globe,
                color: '#7c3aed',
                title: 'Canvas',
                steps: [
                  'Design schema visually',
                  'Iterate with AI chat',
                  'Invite collaborators',
                  'Every change broadcasts instantly',
                ],
              },
              {
                icon: Code2,
                color: '#22d3ee',
                title: 'VS Code',
                steps: [
                  'Schema auto-injected into context',
                  'AI knows your exact models + fields',
                  'sync_changes keeps it live',
                  'generate_code writes files in place',
                ],
              },
              {
                icon: Terminal,
                color: '#f59e0b',
                title: 'Terminal',
                steps: [
                  'Generate and export from CLI',
                  'Push to GitHub in one command',
                  'Switch projects with scafld switch',
                  'No browser ever needed',
                ],
              },
            ].map((surface, i) => {
              const Icon = surface.icon;
              return (
                <motion.div
                  key={surface.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.4 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${surface.color}18`, border: `1px solid ${surface.color}30` }}>
                    <Icon className="w-6 h-6" style={{ color: surface.color }} />
                  </div>
                  <div className="text-white font-semibold mb-4">{surface.title}</div>
                  <ul className="space-y-2 text-left inline-block">
                    {surface.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/50">
                        <span style={{ color: surface.color }} className="mt-0.5 flex-shrink-0">›</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-white/8 text-center">
            <p className="text-white/30 text-sm max-w-lg mx-auto">
              Change something on the canvas — it syncs to VS Code and the CLI instantly.
              That tight integration across all three surfaces is the moat nobody else has.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Start with the canvas.</h2>
          <p className="text-white/40 mb-6">Wire in the extension when you're ready. CLI drops soon.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="px-6 py-3 bg-[#29142e] border border-[#7c3aed]/40 text-white rounded-xl hover:bg-[#3a1f4a] transition-colors font-medium"
            >
              Get started free
            </Link>
            <Link
              to="/pricing"
              className="px-6 py-3 border border-white/10 text-white/60 rounded-xl hover:text-white hover:border-white/20 transition-colors text-sm"
            >
              View pricing
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <div>© 2026 Scafld. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="mailto:support@scafld.dev" className="hover:text-white/60 transition-colors">Support</a>
            <Link to="/pricing" className="hover:text-white/60 transition-colors">Pricing</Link>
            <Link to="/" className="hover:text-white/60 transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
