// src/pages/GitHubCallback.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';

const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Processing GitHub authentication...');
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      handleGitHubCallback();
    }
  }, []);

  const handleGitHubCallback = async () => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      setError(`GitHub authentication failed: ${error}`);
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (!code) {
      setError('No authorization code received from GitHub');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    try {
      setStatus('Verifying with GitHub...');
      const response = await authAPI.githubCallback(code, state || '');

      // Store tokens
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));

      setStatus('GitHub connected successfully! Redirecting...');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      console.error('GitHub callback error:', err);
      setError(err.response?.data?.error || 'Failed to authenticate with GitHub');
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div className="dark bg-background-dark font-sans text-[#E0E0E0] min-h-screen">
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="glassmorphism w-full max-w-md rounded-xl p-8 text-center space-y-6">
          {error ? (
            <>
              <div className="flex justify-center">
                <svg 
                  className="w-16 h-16 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-400">Authentication Failed</h2>
              <p className="text-gray-400">{error}</p>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              </div>
              <h2 className="text-2xl font-bold">{status}</h2>
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.218.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.086.636-1.336-2.22-.252-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.336 1.909-1.296 2.747-1.026 2.747-1.026.546 1.376.202 2.393.1 2.646.64.698 1.027 1.59 1.027 2.682 0 3.841-2.338 4.687-4.566 4.935.359.308.678.92.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.577.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" fillRule="evenodd"/>
                </svg>
                <span>GitHub</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubCallback;