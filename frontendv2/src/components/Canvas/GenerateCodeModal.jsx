import { useEffect, useRef, useState } from 'react';
import { X, Download, CheckCircle2, AlertCircle, Terminal } from 'lucide-react';
import apiService from '../../services/api';

const FRAMEWORKS = [
  { value: 'django',   label: 'Django',      sub: 'Python' },
  { value: 'fastapi',  label: 'FastAPI',     sub: 'Python' },
  { value: 'flask',    label: 'Flask',       sub: 'Python' },
  { value: 'express',  label: 'Express.js',  sub: 'Node.js' },
  { value: 'nestjs',   label: 'NestJS',      sub: 'TypeScript' },
  { value: 'gin',      label: 'Gin',         sub: 'Go' },
  { value: 'chi',      label: 'Chi',         sub: 'Go' },
  { value: 'axum',     label: 'Axum',        sub: 'Rust' },
  { value: 'actix',    label: 'Actix-Web',   sub: 'Rust' },
  { value: 'spring',   label: 'Spring Boot', sub: 'Java' },
  { value: 'ktor',     label: 'Ktor',        sub: 'Kotlin' },
  { value: 'rails',    label: 'Rails',       sub: 'Ruby' },
  { value: 'laravel',  label: 'Laravel',     sub: 'PHP' },
  { value: 'servant',  label: 'Servant',     sub: 'Haskell' },
  { value: 'phoenix',  label: 'Phoenix',     sub: 'Elixir' },
  { value: 'dotnet',   label: 'ASP.NET',     sub: 'C#' },
];

function buildTerminalLines(framework, modelCount) {
  const f = FRAMEWORKS.find(x => x.value === framework);
  const label = f ? `${f.label} (${f.sub})` : framework;
  return [
    { text: `$ scafld generate --framework ${framework}`, color: 'text-green-400', delay: 0 },
    { text: `▶  target: ${label}`, color: 'text-white/60', delay: 400 },
    { text: `▶  reading schema (${modelCount} model${modelCount !== 1 ? 's' : ''})...`, color: 'text-white/60', delay: 900 },
    { text: `▶  building models & types...`, color: 'text-white/60', delay: 1600 },
    { text: `▶  generating routes...`, color: 'text-white/60', delay: 2400 },
    { text: `▶  adding auth middleware...`, color: 'text-white/60', delay: 3100 },
    { text: `▶  writing dependencies...`, color: 'text-white/60', delay: 3700 },
    { text: `▶  packaging output...`, color: 'text-white/60', delay: 4200 },
  ];
}

export default function GenerateCodeModal({ project, modelCount, onClose, onDone }) {
  const [framework, setFramework] = useState(project?.framework || '');
  const [phase, setPhase] = useState('select'); // select | generating | done | error
  const [termLines, setTermLines] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const termRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [termLines]);

  const handleGenerate = async () => {
    if (!framework) return;
    setPhase('generating');
    setTermLines([]);

    // Save framework to project first
    await apiService.updateProject(project.id, { framework });

    const lines = buildTerminalLines(framework, modelCount);
    lines.forEach(({ text, color, delay }) => {
      const t = setTimeout(() => {
        setTermLines(prev => [...prev, { text, color }]);
      }, delay);
      timers.current.push(t);
    });

    // Start the actual API call in parallel
    let blobResult = null;
    let apiError = null;
    try {
      const res = await apiService.generateCode(project.id);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        apiError = data.error || 'Code generation failed.';
      } else {
        blobResult = await res.blob();
      }
    } catch {
      apiError = 'Could not reach the server.';
    }

    // Wait for the animation to finish before showing result
    const animDuration = lines[lines.length - 1].delay + 600;
    const remaining = animDuration - (Date.now() - Date.now()); // always wait full anim
    const t = setTimeout(() => {
      if (apiError) {
        setTermLines(prev => [...prev, { text: `✗  ${apiError}`, color: 'text-red-400' }]);
        setPhase('error');
        setErrorMsg(apiError);
      } else {
        setTermLines(prev => [...prev, { text: '✓  done! downloading...', color: 'text-green-400' }]);
        // Trigger download
        const url = URL.createObjectURL(blobResult);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project?.name || 'project'}-generated.zip`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setPhase('done');
        onDone?.();
      }
    }, animDuration);
    timers.current.push(t);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#a78bfa]" />
            <span className="text-white font-semibold text-sm">Generate Code</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* Framework picker — always visible */}
          <div className="space-y-3">
            <label className="text-white/50 text-xs uppercase tracking-widest">
              {phase === 'select' ? 'Select language / framework' : 'Language / framework'}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {FRAMEWORKS.map(({ value, label, sub }) => (
                <button
                  key={value}
                  onClick={() => phase === 'select' && setFramework(value)}
                  disabled={phase !== 'select'}
                  className={`p-2.5 rounded-lg border text-left transition-all disabled:cursor-default ${
                    framework === value
                      ? 'bg-[#29142e] border-[#a78bfa]/40 text-white'
                      : phase === 'select'
                      ? 'bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
                      : 'bg-white/3 border-white/5 text-white/25'
                  }`}
                >
                  <div className="text-xs font-medium truncate">{label}</div>
                  <div className="text-[10px] opacity-50 truncate">{sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Terminal — shown during/after generation */}
          {phase !== 'select' && (
            <div
              ref={termRef}
              className="bg-black rounded-xl border border-white/10 p-4 font-mono text-xs space-y-1.5 h-48 overflow-y-auto"
            >
              {termLines.map((line, i) => (
                <div key={i} className={line.color}>{line.text}</div>
              ))}
              {phase === 'generating' && termLines.length < buildTerminalLines(framework, modelCount).length + 1 && (
                <span className="inline-block w-2 h-3.5 bg-white/60 animate-pulse" />
              )}
            </div>
          )}

          {/* Done / error state */}
          {phase === 'done' && (
            <div className="flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-green-400 text-sm">Download started — check your downloads folder.</span>
            </div>
          )}
          {phase === 'error' && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{errorMsg}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            {phase === 'select' && (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-white/40 hover:text-white text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!framework}
                  className="flex items-center gap-2 px-5 py-2 bg-[#29142e] text-white text-sm rounded-lg hover:bg-[#3a1f4a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Generate &amp; Download
                </button>
              </>
            )}
            {(phase === 'done' || phase === 'error') && (
              <button
                onClick={onClose}
                className="px-5 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/15 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
