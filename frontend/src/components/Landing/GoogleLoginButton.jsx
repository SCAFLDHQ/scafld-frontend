// src/components/GoogleLoginButton.jsx
import { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const GoogleLoginButton = ({ text = "signin_with", redirectTo = "/dashboard" }) => {
  const { loginWithGoogle, googleConfig, error } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!googleConfig?.client_id || hasInitialized.current) return;

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: googleConfig.client_id,
          callback: handleGoogleResponse,
          auto_select: false,
        });

        // Render the Google Sign-In button
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: 'filled_black',
            size: 'large',
            text: text,
            width: '100%',
            logo_alignment: 'center',
          }
        );

        hasInitialized.current = true;
      }
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [googleConfig, text]);

  const handleGoogleResponse = async (response) => {
    try {
      // response.credential contains the Google ID token
      const result = await loginWithGoogle(response.credential);
      
      console.log('Google login successful:', result);
      
      // Navigate to dashboard or specified redirect
      navigate(redirectTo);
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };

  if (!googleConfig) {
    return (
      <div className="flex items-center justify-center py-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={googleButtonRef} className="flex justify-center w-full"></div>
      
      {error && error.includes('Google') && (
        <div className="mt-2 text-center text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};