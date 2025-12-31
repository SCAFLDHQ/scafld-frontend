import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function GitHubCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { githubLogin } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (processedRef.current) return;
      processedRef.current = true;
      
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      if (error) {
        console.error('GitHub OAuth error:', error);
        navigate('/login?error=github_auth_failed', { replace: true });
        return;
      }

      if (code) {
        try {
          const result = await githubLogin(code);
          if (result.success) {
            navigate('/dashboard', { replace: true });
          } else {
            console.error('GitHub auth failed:', result.error);
            navigate('/login?error=github_auth_failed', { replace: true });
          }
        } catch (error) {
          console.error('GitHub login failed:', error);
          navigate('/login?error=github_auth_failed', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, githubLogin, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Completing GitHub authentication...</p>
      </div>
    </div>
  );
}