import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Loader2, RotateCcw } from 'lucide-react';
import apiService from '../../services/api';

const SUGGESTIONS = [
  'A multi-tenant SaaS with users, workspaces, billing, and file uploads',
  'An e-commerce API with products, orders, cart, and payments',
  'A social app with users, posts, comments, likes, and followers',
  'A task management app with users, teams, projects, and tasks',
  'A blog platform with authors, posts, categories, and comments',
];

const HISTORY_KEY = 'scafld_prompt_history';
const MAX_HISTORY = 5;

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
function saveHistory(prompt) {
  const h = [prompt, ...loadHistory().filter(p => p !== prompt)].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
}

export default function AIPromptInput({ onGenerating }) {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [framework, setFramework] = useState('django');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history] = useState(loadHistory);
  const formRef = useRef(null);

  const historyMatches = history.filter(h => prompt.length === 0 || h.toLowerCase().includes(prompt.toLowerCase()));
  const suggestionMatches = SUGGESTIONS.filter(s =>
    !history.includes(s) && (prompt.length === 0 || s.toLowerCase().includes(prompt.toLowerCase()))
  );
  const filtered = [...historyMatches, ...suggestionMatches];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError('');
    if (onGenerating) onGenerating(true);

    try {
      const res = await apiService.generateWithAI(prompt.trim(), framework);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Generation failed. Please try again.');
        return;
      }

      saveHistory(prompt.trim());
      navigate(`/project/${data.project_id}`);
    } catch (err) {
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setLoading(false);
      if (onGenerating) onGenerating(false);
    }
  };

  return (
    <div className="relative">
      {error && (
        <div className="mb-3 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => { setError(''); formRef.current?.requestSubmit(); }}
            className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-300 transition-colors flex-shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            Try again
          </button>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/5 border border-white/10 p-3 sm:p-4 focus-within:border-[#29142e] transition-colors rounded-lg">
          <div className="flex items-center gap-3 flex-1">
            {loading
              ? <Loader2 className="w-5 h-5 text-[#29142e] flex-shrink-0 animate-spin" />
              : <Sparkles className="w-5 h-5 text-[#29142e] flex-shrink-0" />
            }
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              disabled={loading}
              placeholder="Describe your backend in plain English…"
              className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm sm:text-base min-w-0 disabled:opacity-50"
            />
          </div>

          {/* Framework picker */}
          <select
            value={framework}
            onChange={e => setFramework(e.target.value)}
            disabled={loading}
            className="bg-white/5 border border-white/10 text-white/70 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#29142e] disabled:opacity-50"
          >
            <option value="django">Django</option>
            <option value="express">Express.js</option>
          </select>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!prompt.trim() || loading}
            className="px-5 py-2 bg-[#29142e] text-white flex items-center justify-center gap-2 hover:bg-[#3a1f4a] disabled:opacity-50 disabled:cursor-not-allowed text-sm rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating…</span>
              </>
            ) : (
              <>
                <span>Generate</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {showSuggestions && filtered.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg z-20 overflow-hidden"
          >
            <div className="p-2">
              {historyMatches.length > 0 && (
                <>
                  <div className="text-white/40 text-xs px-3 py-1.5">Recent</div>
                  {historyMatches.map((s, i) => (
                    <button key={`h${i}`} onMouseDown={() => { setPrompt(s); setShowSuggestions(false); }}
                      className="w-full text-left px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white transition-colors text-sm rounded flex items-center gap-2">
                      <span className="text-white/30 text-[10px]">↑</span>{s}
                    </button>
                  ))}
                </>
              )}
              {suggestionMatches.length > 0 && (
                <>
                  <div className="text-white/40 text-xs px-3 py-1.5 mt-1">Try one of these</div>
                  {suggestionMatches.map((s, i) => (
                    <button key={`s${i}`} onMouseDown={() => { setPrompt(s); setShowSuggestions(false); }}
                      className="w-full text-left px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white transition-colors text-sm rounded">
                      {s}
                    </button>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
