import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { creditsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      const transactionId = searchParams.get('transaction_id');

      if (!reference) {
        setStatus('error');
        setMessage('Invalid payment reference');
        return;
      }

      try {
        const response = await creditsAPI.verifyPayment(reference, transactionId);
        
        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
          // Refresh user data in AuthContext
          await refreshUser();
          setTimeout(() => navigate('/profile'), 3000);
        } else {
          setStatus('error');
          setMessage(response.data.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Payment verification failed');
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="glassmorphism p-8 rounded-xl text-center max-w-md">
        {status === 'verifying' && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        )}
        
        {status === 'success' && (
          <div className="text-green-500 text-5xl mb-4">✓</div>
        )}
        
        {status === 'error' && (
          <div className="text-red-500 text-5xl mb-4">✗</div>
        )}
        
        <p className="text-white text-lg">{message}</p>
        
        {status === 'success' && (
          <p className="text-gray-400 text-sm mt-2">Redirecting to profile...</p>
        )}
        
        {status === 'error' && (
          <button 
            onClick={() => navigate('/profile')}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Go to Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;