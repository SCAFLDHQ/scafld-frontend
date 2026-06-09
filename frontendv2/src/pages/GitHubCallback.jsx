import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import apiService from '../services/api';

export default function GitHubCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { githubLogin } = useAuth();
  const [status, setStatus] = useState('processing');
  const [errorMessage, setErrorMessage] = useState('');
  const hasProcessed = useRef(false); // Prevent duplicate processing

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent duplicate execution
      if (hasProcessed.current) {
        return;
      }
      hasProcessed.current = true;

      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        const state = params.get('state');

        // Handle OAuth errors from GitHub
        if (error) {
          console.error('GitHub OAuth error:', error, errorDescription);
          setStatus('error');
          setErrorMessage(
            errorDescription || 
            'GitHub authentication was denied or failed. Please try again.'
          );
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        // Validate we have a code
        if (!code) {
          console.error('No authorization code received from GitHub');
          setStatus('error');
          setErrorMessage('No authorization code received. Please try again.');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        // If this is a popup connect flow (state starts with "connect_"), handle separately
        if (state?.startsWith('connect_') && window.opener) {
          try {
            const res = await apiService.githubConnect(code);
            const data = await res.json();
            if (res.ok) {
              window.opener.postMessage({ type: 'github_connected', ...data }, window.location.origin);
            } else {
              window.opener.postMessage({ type: 'github_connect_error', error: data.error || 'Connection failed' }, window.location.origin);
            }
          } catch {
            window.opener.postMessage({ type: 'github_connect_error', error: 'Connection failed' }, window.location.origin);
          }
          window.close();
          return;
        }

        // Optional: Verify state parameter for CSRF protection
        const storedState = sessionStorage.getItem('github_oauth_state');
        if (storedState && state !== storedState) {
          console.error('State mismatch - possible CSRF attack');
          setStatus('error');
          setErrorMessage('Security validation failed. Please try again.');
          sessionStorage.removeItem('github_oauth_state');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        // Clean up stored state
        sessionStorage.removeItem('github_oauth_state');

        // Exchange code for tokens via backend
        setStatus('processing');
        const result = await githubLogin(code);

        if (result.success) {
          setStatus('success');
          // Short delay to show success message
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1000);
        } else {
          setStatus('error');
          setErrorMessage(result.error || 'Failed to complete GitHub authentication');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
        }
      } catch (error) {
        console.error('GitHub callback error:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred. Please try again.');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, []); // Empty deps - only run once

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Processing State */}
        {status === 'processing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto bg-[#29142e]/20 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#29142e] animate-spin" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">
                Completing GitHub Authentication
              </h1>
              <p className="text-white/60">
                Please wait while we securely sign you in...
              </p>
            </div>
            {/* Progress Indicators */}
            <div className="space-y-3 pt-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 text-white/60"
              >
                <div className="w-2 h-2 bg-[#29142e] rounded-full"></div>
                <span className="text-sm">Verifying GitHub credentials</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 text-white/60"
              >
                <div className="w-2 h-2 bg-[#29142e] rounded-full"></div>
                <span className="text-sm">Creating your session</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 text-white/60"
              >
                <div className="w-2 h-2 bg-[#29142e] rounded-full"></div>
                <span className="text-sm">Redirecting to dashboard</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">
                Authentication Successful!
              </h1>
              <p className="text-white/60">
                Redirecting you to your dashboard...
              </p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">
                Authentication Failed
              </h1>
              <p className="text-white/60">
                {errorMessage}
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => navigate('/login', { replace: true })}
                className="px-6 py-3 bg-[#29142e] text-white rounded-lg hover:bg-[#3a1f4a] transition-colors"
              >
                Return to Login
              </button>
            </div>
          </motion.div>
        )}

        {/* SCAFLD Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-white/40">
            <div className="w-6 h-6 bg-[#29142e] flex items-center justify-center rounded">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-sm">SCAFLD</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}