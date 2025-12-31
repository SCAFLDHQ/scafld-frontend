// src/hooks/usePayment.js
import { useState } from 'react';
import { creditsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const initiatePayment = async (paymentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await creditsAPI.purchaseCredits(paymentData.packageId);
      
      if (response.data.payment_url) {
        // Redirect to PayStack payment page
        window.location.href = response.data.payment_url;
        return response.data;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Payment initiation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const initiateSubscriptionUpgrade = async (tier) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await creditsAPI.upgradeSubscription(tier);
      
      if (response.data.payment_url) {
        // Redirect to PayStack payment page
        window.location.href = response.data.payment_url;
        return response.data;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Subscription upgrade failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (reference, transactionId = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await creditsAPI.verifyPayment(reference, transactionId);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Payment verification failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    initiatePayment,
    initiateSubscriptionUpgrade,
    verifyPayment,
    clearError: () => setError(null)
  };
};