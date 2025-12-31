// src/pages/CreditsPricing.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/Projects/PageHeader';
import ActionButton from '../components/Projects/ActionButton';
import Header from '../components/Landing/Header';
import { creditsAPI } from '../services/api';
import { usePayment } from '../hooks/usePayment';
import { useAuth } from '../contexts/AuthContext';

const CreditsPricing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, refreshUser } = useAuth();
  const [currentCredits, setCurrentCredits] = useState(0);
  const [currentTier, setCurrentTier] = useState('free');
  const [creditPackages, setCreditPackages] = useState([]);
  const [subscriptionTiers, setSubscriptionTiers] = useState({});
  const [loading, setLoading] = useState(true);
  
  const { 
    loading: paymentLoading, 
    error: paymentError, 
    initiatePayment, 
    initiateSubscriptionUpgrade,
    verifyPayment,
    clearError 
  } = usePayment();

  useEffect(() => {
    fetchUserData();
    checkPaymentVerification();
  }, []);

  // Update current tier when user data changes
  useEffect(() => {
    if (user?.profile?.subscription_tier) {
      const userTier = user.profile.subscription_tier.tier_id || 
                      user.profile.subscription_tier || 'free';
      setCurrentTier(userTier);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Fetch credit stats
      const statsResponse = await creditsAPI.getCreditStats();
      const stats = statsResponse.data.stats;
      setCurrentCredits(stats.remaining_credits);
      
      // Set current tier from user data
      const userTier = user?.profile?.subscription_tier?.tier_id || 
                      user?.profile?.subscription_tier || 'free';
      setCurrentTier(userTier);
      
      // Fetch credit packages
      const packagesResponse = await creditsAPI.getCreditPackages();
      setCreditPackages(packagesResponse.data.results || packagesResponse.data);
      
      // Fetch subscription tiers
      const tiersResponse = await creditsAPI.getSubscriptionTiers();
      const tiers = tiersResponse.data.results || tiersResponse.data;
      
      // Convert array to object with tier_id as key
      const tiersObj = {};
      tiers.forEach(tier => {
        tiersObj[tier.tier_id] = {
          name: tier.name,
          credits: tier.credits,
          projects_limit: tier.projects_limit,
          models_per_project: tier.models_per_project,
          monthly_credits: tier.monthly_credits,
          cost_per_generation: tier.tier_id === 'free' ? 1.0 : 
                              tier.tier_id === 'pro' ? 0.7 :
                              tier.tier_id === 'team' ? 0.6 : 0.5,
          price: `₦${tier.price_naira.toLocaleString()}`,
          popular: tier.tier_id === 'pro',
          features: tier.features || []
        };
      });
      setSubscriptionTiers(tiersObj);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentVerification = async () => {
    const reference = searchParams.get('reference');
    const transactionId = searchParams.get('transaction_id');
    
    if (reference) {
      try {
        const result = await verifyPayment(reference, transactionId);
        if (result.success) {
          alert(`Payment successful! ${result.credits_added || 'Subscription updated successfully'}`);
          // Refresh user data in AuthContext
          await refreshUser();
          // Refresh local data
          await fetchUserData();
          // Clean up URL
          navigate('/pricing', { replace: true });
        } else {
          alert('Payment verification failed. Please contact support.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        alert('Error verifying payment. Please check your transaction history.');
      }
    }
  };



  const handleSubscribe = async (tier) => {
    if (tier === 'free') {
      alert('Free tier is already active');
      return;
    }

    if (currentTier === tier) {
      alert(`You are already on the ${subscriptionTiers[tier]?.name} plan`);
      return;
    }

    try {
      clearError();
      await initiateSubscriptionUpgrade(tier);
      // User will be redirected to PayStack, flow continues after redirect
    } catch (error) {
      console.error('Subscription upgrade failed:', error);
      alert(`Subscription upgrade failed: ${error.message}`);
    }
  };

  const handleBuyCredits = async (packageId) => {
    try {
      clearError();
      await initiatePayment({ packageId });
      // User will be redirected to PayStack, flow continues after redirect
    } catch (error) {
      console.error('Credit purchase failed:', error);
      alert(`Credit purchase failed: ${error.message}`);
    }
  };

  const getCurrentTierData = () => {
    return subscriptionTiers[currentTier] || subscriptionTiers['free'] || {};
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark font-body text-primary-text">
        <Header />
        <main className="p-8 md:p-12">
          <div className="max-w-7xl mx-auto flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark font-body text-primary-text">
      <Header />
      
      <main className="p-8 md:p-12">
        <div className="max-w-7xl mx-auto">
          <PageHeader 
            title="Credits & Subscription" 
            subtitle="Choose the perfect plan for your development needs"
          />

          {/* Payment Error Alert */}
          {paymentError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-300">{paymentError}</p>
              <button 
                onClick={clearError}
                className="mt-2 text-red-400 hover:text-red-300 text-sm"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Current Usage Section */}
          <div className="glassmorphism rounded-xl p-6 mb-8 neumorphic">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  Current Balance
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">{currentCredits}</span>
                  <span className="text-gray-400">credits</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Current Plan: <span className="text-primary font-semibold">{getCurrentTierData().name}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <ActionButton 
                  icon="bolt" 
                  onClick={() => scrollToSection('credit-packages')}
                  loading={paymentLoading}
                >
                  Buy More Credits
                </ActionButton>
                <ActionButton 
                  icon="upgrade" 
                  variant="outline" 
                  onClick={() => scrollToSection('subscriptions')}
                >
                  Upgrade Plan
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Subscription Tiers */}
          <section id="subscriptions" className="mb-12">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Subscription Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(subscriptionTiers).map(([key, tier]) => (
                <div 
                  key={key}
                  className={`glassmorphism rounded-xl p-6 neumorphic hover:shadow-lg transition-all duration-300 border ${
                    tier.popular 
                      ? 'border-primary shadow-lg scale-105' 
                      : 'border-white/10'
                  } ${currentTier === key ? 'ring-2 ring-primary' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0">
                      <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h3 className="text-xl font-display font-semibold text-white mb-2">
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-white">{tier.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {tier.credits} starting credits
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="material-symbols-outlined text-primary text-lg">
                          check_circle
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(key)}
                    disabled={currentTier === key || paymentLoading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                      currentTier === key
                        ? 'bg-gray-600 text-white cursor-not-allowed'
                        : tier.popular
                        ? 'bg-primary text-white hover:bg-primary/90 disabled:bg-primary/50'
                        : 'bg-white/10 text-white hover:bg-white/20 disabled:bg-white/5'
                    }`}
                  >
                    {paymentLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : currentTier === key ? (
                      'Current Plan'
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Credit Packages */}
          <section id="credit-packages" className="mb-12">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Buy Additional Credits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creditPackages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className="glassmorphism rounded-xl p-6 neumorphic hover:shadow-lg transition-all duration-300 border border-white/10"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-display font-semibold text-white mb-2">
                      {pkg.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-white">{pkg.price_naira}</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {pkg.credits} credits • ₦{pkg.price_per_credit}/credit
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Credits Value</span>
                      <span className="text-white font-semibold">{pkg.credits} credits</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Cost per Credit</span>
                      <span className="text-primary font-semibold">₦{pkg.price_per_credit}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyCredits(pkg.id)}
                    disabled={paymentLoading}
                    className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:bg-primary/50 transition-all flex items-center justify-center"
                  >
                    {paymentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      'Buy Now'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="glassmorphism rounded-xl p-6 neumorphic">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group cursor-pointer">
                <summary className="flex justify-between items-center p-4 bg-white/5 rounded-lg list-none">
                  <span className="text-white font-medium">What happens after payment?</span>
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="p-4 text-gray-300">
                  After successful payment, you'll be redirected back to this page and your credits will be automatically added to your account. The process is instant and you can start using your credits immediately.
                </div>
              </details>

              <details className="group cursor-pointer">
                <summary className="flex justify-between items-center p-4 bg-white/5 rounded-lg list-none">
                  <span className="text-white font-medium">Do credits expire?</span>
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="p-4 text-gray-300">
                  No, purchased credits never expire. Subscription monthly credits reset at the beginning of each billing cycle.
                </div>
              </details>

              <details className="group cursor-pointer">
                <summary className="flex justify-between items-center p-4 bg-white/5 rounded-lg list-none">
                  <span className="text-white font-medium">Can I change my subscription?</span>
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="p-4 text-gray-300">
                  Yes, you can upgrade or downgrade your subscription at any time. 
                  Changes take effect immediately with pro-rated billing.
                </div>
              </details>

              <details className="group cursor-pointer">
                <summary className="flex justify-between items-center p-4 bg-white/5 rounded-lg list-none">
                  <span className="text-white font-medium">What payment methods are accepted?</span>
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="p-4 text-gray-300">
                  We accept all major credit cards, debit cards, and bank transfers through PayStack's secure payment processor.
                </div>
              </details>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CreditsPricing;