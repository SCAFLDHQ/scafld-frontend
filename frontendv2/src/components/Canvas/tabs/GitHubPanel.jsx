import { useState, useEffect, useRef } from 'react';
import { Github, Lock, ExternalLink, AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import apiService from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const TIER_RANK = { free: 0, pro: 1, max: 2 };
function tierAtLeast(userTier, required) {
  return (TIER_RANK[userTier] ?? 0) >= (TIER_RANK[required] ?? 0);
}

export default function GitHubPanel({ projectId, projectName }) {
  const { user } = useAuth();
  const canUse = tierAtLeast(user?.tier, 'pro');

  const [ghStatus, setGhStatus] = useState(null); // null = loading, { connected, username, avatar }
  const [connecting, setConnecting] = useState(false);

  const [repoName, setRepoName] = useState(
    projectName ? projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') : ''
  );
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const popupRef = useRef(null);
  const listenerRef = useRef(null);

  useEffect(() => {
    if (!canUse) return;
    apiService.githubStatus().then(async res => {
      const data = await res.json();
      setGhStatus(data);
    }).catch(() => setGhStatus({ connected: false }));
  }, [canUse]);

  // Clean up popup + listener on unmount
  useEffect(() => {
    return () => {
      if (listenerRef.current) window.removeEventListener('message', listenerRef.current);
      popupRef.current?.close();
    };
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    setError('');
    try {
      const configRes = await apiService.getGitHubOAuthConfig();
      const config = await configRes.json();

      const state = 'connect_' + Math.random().toString(36).slice(2);
      const params = new URLSearchParams({
        client_id: config.client_id,
        redirect_uri: config.redirect_uri,
        scope: 'repo,user:email',
        state,
      });
      const authUrl = `${config.authorize_url}?${params.toString()}`;

      const w = 600, h = 700;
      const left = window.screenX + (window.outerWidth - w) / 2;
      const top = window.screenY + (window.outerHeight - h) / 2;
      popupRef.current = window.open(authUrl, 'gh_connect', `width=${w},height=${h},left=${left},top=${top},scrollbars=yes`);

      // Listen for result from the popup
      const handler = (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type === 'github_connected') {
          setGhStatus({ connected: true, username: event.data.username, avatar: event.data.avatar });
          setConnecting(false);
          window.removeEventListener('message', handler);
        } else if (event.data?.type === 'github_connect_error') {
          setError(event.data.error || 'GitHub connection failed. Please try again.');
          setConnecting(false);
          window.removeEventListener('message', handler);
        }
      };
      listenerRef.current = handler;
      window.addEventListener('message', handler);
    } catch {
      setError('Could not start GitHub OAuth. Check your connection.');
      setConnecting(false);
    }
  };

  const handlePush = async () => {
    if (!repoName.trim()) { setError('Repository name is required.'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await apiService.githubPush(projectId, {
        repo_name: repoName.trim(),
        private: isPrivate,
        description: description.trim(),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Push failed.'); return; }
      setResult(data);
    } catch {
      setError('Failed to connect. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!canUse) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-white/20" />
        </div>
        <h2 className="text-white text-xl font-semibold mb-2">Pro Feature</h2>
        <p className="text-white/40 text-sm max-w-sm mb-6">
          GitHub push is available on Pro and Max plans. Upgrade to push generated code directly to a new GitHub repository.
        </p>
        <a href="/settings" className="flex items-center gap-2 px-5 py-2.5 bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 text-sm rounded-lg hover:bg-[#7c3aed]/30 transition-colors">
          Upgrade to Pro
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-white text-2xl font-semibold mb-1 flex items-center gap-3">
          <Github className="w-6 h-6" /> GitHub Push
        </h2>
        <p className="text-white/40 text-sm">Push your generated code to a new GitHub repository</p>
      </div>

      {result ? (
        <div className="max-w-lg space-y-4">
          <div className="flex items-start gap-4 px-5 py-5 rounded-2xl bg-green-500/8 border border-green-500/20">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-green-400 font-medium mb-0.5">Successfully pushed!</div>
              <div className="text-green-400/60 text-sm">{result.files_pushed} files → {result.owner}/{result.repo_name}</div>
            </div>
          </div>
          <a
            href={result.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-4 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Github className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 truncate text-sm">{result.repo_url}</span>
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
          </a>
          <button
            onClick={() => setResult(null)}
            className="px-5 py-2.5 border border-white/10 text-white/50 text-sm rounded-lg hover:text-white hover:bg-white/5 transition-colors"
          >
            Push to another repo
          </button>
        </div>
      ) : (
        <div className="max-w-lg space-y-6">
          {error && (
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* GitHub connection status */}
          {ghStatus === null ? (
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl border border-white/8 bg-white/3">
              <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
              <span className="text-white/40 text-sm">Checking GitHub connection…</span>
            </div>
          ) : ghStatus.connected ? (
            <div className="flex items-center gap-4 px-5 py-4 rounded-xl border border-green-500/20 bg-green-500/5">
              {ghStatus.avatar ? (
                <img src={ghStatus.avatar} alt={ghStatus.username} className="w-9 h-9 rounded-full border border-white/10 flex-shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#29142e] border border-[#a78bfa]/20 flex items-center justify-center flex-shrink-0">
                  <Github className="w-4 h-4 text-[#a78bfa]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white/80 text-sm font-medium">@{ghStatus.username}</div>
                <div className="text-green-400/70 text-xs">Connected</div>
              </div>
              <button
                onClick={() => { setGhStatus({ connected: false }); }}
                title="Disconnect"
                className="text-white/20 hover:text-white/50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-[#161b22] border border-white/12 text-white hover:bg-[#21262d] disabled:opacity-50 transition-colors"
            >
              {connecting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Github className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{connecting ? 'Waiting for GitHub…' : 'Connect with GitHub'}</span>
            </button>
          )}

          {/* Repo form — only show when connected */}
          {ghStatus?.connected && (
            <>
              <div>
                <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">Repository Name</label>
                <input
                  type="text"
                  value={repoName}
                  onChange={e => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                  placeholder="my-project"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#a78bfa]/50 placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                  Description <span className="normal-case text-white/25">(optional)</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="A brief description of the repository"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#a78bfa]/50 placeholder:text-white/20"
                />
              </div>

              <div className="flex items-center justify-between px-1">
                <div>
                  <div className="text-white/70 text-sm">Private repository</div>
                  <div className="text-white/30 text-xs">Repository visibility on GitHub</div>
                </div>
                <button
                  onClick={() => setIsPrivate(p => !p)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${isPrivate ? 'bg-[#7c3aed]' : 'bg-white/15'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isPrivate ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <button
                onClick={handlePush}
                disabled={loading || !repoName.trim()}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#29142e] text-white text-sm rounded-xl hover:bg-[#3a1f4a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Pushing code…</>
                ) : (
                  <><Github className="w-4 h-4" /> Create Repo & Push Code</>
                )}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
