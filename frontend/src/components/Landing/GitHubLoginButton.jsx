// src/components/GitHubLoginButton.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

export const GitHubLoginButton = ({ 
  text = "Sign in with GitHub", 
  redirectTo = "/dashboard",
  onSuccess,
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [githubConfig, setGitHubConfig] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGitHubConfig();
  }, []);

  const fetchGitHubConfig = async () => {
    try {
      const config = await authAPI.getGitHubConfig();
      setGitHubConfig(config);
    } catch (error) {
      console.error('Failed to fetch GitHub config:', error);
    }
  };

  const handleGitHubLogin = () => {
    if (!githubConfig) return;
    
    setIsLoading(true);
    
    // Redirect to GitHub authorization
    window.location.href = githubConfig.authorization_url;
  };

  if (!githubConfig) {
    return (
      <button 
        className="social-button flex w-full items-center justify-center gap-2 md:gap-3 rounded-lg bg-white/10 px-3 py-3 text-white shadow-sm ring-1 ring-inset ring-white/20 transition-colors cursor-not-allowed opacity-50"
        disabled
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span className="text-xs md:text-sm font-semibold leading-6">Loading...</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleGitHubLogin}
      className="social-button flex w-full items-center justify-center gap-2 md:gap-3 rounded-lg bg-white/10 px-3 py-3 text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isLoading}
    >
      <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
        <path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.218.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.086.636-1.336-2.22-.252-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.336 1.909-1.296 2.747-1.026 2.747-1.026.546 1.376.202 2.393.1 2.646.64.698 1.027 1.59 1.027 2.682 0 3.841-2.338 4.687-4.566 4.935.359.308.678.92.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.577.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" fillRule="evenodd"/>
      </svg>
      <span className="text-xs md:text-sm font-semibold leading-6">
        {isLoading ? 'Redirecting...' : text}
      </span>
    </button>
  );
};