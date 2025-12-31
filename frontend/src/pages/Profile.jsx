import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import Header from '../components/Dashboard/Header';
import ActionButton from '../components/Projects/ActionButton';

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [githubStatus, setGithubStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
    // Also refresh user data to ensure it's up to date
    refreshUser().catch(console.error);
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await authAPI.getDetailedProfile();
      setProfileData(response);
      
      // Check GitHub connection status
      try {
        const githubResponse = await authAPI.getGitHubStatus();
        setGithubStatus(githubResponse);
      } catch (githubErr) {
        console.log('GitHub not connected or error:', githubErr);
        setGithubStatus({ connected: false });
      }
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getSubscriptionTier = () => {
    return profileData?.subscription?.tier?.name || 'Free';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Header />
        <div className="mb-8 ">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-gray-400">Manage your account and subscription</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-primary text-2xl font-bold">
                      {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user?.username || 'User'
                  }
                </h2>
                <p className="text-gray-400">{user?.email}</p>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    getSubscriptionTier() === 'Free' 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {getSubscriptionTier()}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Member since:</span>
                  <span>{new Date(user?.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email verified:</span>
                  <span className={user?.email_verified ? 'text-green-400' : 'text-red-400'}>
                    {user?.email_verified ? 'Yes' : 'No'}
                  </span>
                </div>
                {user?.company && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Company:</span>
                    <span>{user.company}</span>
                  </div>
                )}
                {user?.website && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Website:</span>
                    <a href={user.website} target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline">
                      {user.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Connected Accounts */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Connected Accounts</h4>
                <div className="flex gap-3">
                  {/* Google - Always show as connected since user can login with Google */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-xs text-green-400">Google</span>
                  </div>
                  
                  {/* GitHub */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    githubStatus?.connected 
                      ? 'bg-green-500/10 border border-green-500/20' 
                      : 'bg-gray-500/10 border border-gray-500/20'
                  }`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.218.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.086.636-1.336-2.22-.252-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.336 1.909-1.296 2.747-1.026 2.747-1.026.546 1.376.202 2.393.1 2.646.64.698 1.027 1.59 1.027 2.682 0 3.841-2.338 4.687-4.566 4.935.359.308.678.92.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.577.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" fillRule="evenodd"/>
                    </svg>
                    <span className={`text-xs ${
                      githubStatus?.connected ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      GitHub {githubStatus?.connected ? '' : '(Not connected)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <ActionButton 
                    icon="bolt" 
                    onClick={() => navigate('/pricing')}
                  >
                    Buy More Credits
                  </ActionButton>
              </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors flex-shrink-0 text-gray-300 hover:text-red-300 border border-transparent hover:border-red-500/20 group ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? "Logout" : ""}
            >
              <span className="material-symbols-outlined">logout</span>
              {!isCollapsed && <p className="font-medium">Logout</p>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Logout
                </div>
              )}
            </button>

            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Info */}
            <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4">Subscription Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Current Plan</p>
                  <p className="text-lg font-medium">{getSubscriptionTier()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-lg font-medium capitalize">
                    {profileData?.subscription?.status || 'Active'}
                  </p>
                </div>
                {profileData?.subscription?.next_payment_date && (
                  <div>
                    <p className="text-gray-400 text-sm">Next Payment</p>
                    <p className="text-lg font-medium">
                      {new Date(profileData.subscription.next_payment_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {profileData?.subscription?.tier?.price_naira && (
                  <div>
                    <p className="text-gray-400 text-sm">Monthly Cost</p>
                    <p className="text-lg font-medium">₦{profileData.subscription.tier.price_naira}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Credits Overview */}
            <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4">Credits Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{profileData?.credits?.balance || 0}</p>
                  <p className="text-gray-400 text-sm">Available Credits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-300">{profileData?.credits?.used || 0}</p>
                  <p className="text-gray-400 text-sm">Credits Used</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-300">
                    {(profileData?.credits?.balance || 0) + (profileData?.credits?.used || 0)}
                  </p>
                  <p className="text-gray-400 text-sm">Total Credits</p>
                </div>
              </div>
              
              {/* Usage Stats */}
              {profileData?.credits?.stats && (
                <div className="space-y-3">
                  <h4 className="font-medium">Usage Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Today:</span>
                      <span>{profileData.credits.stats.today || 0} credits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">This Week:</span>
                      <span>{profileData.credits.stats.this_week || 0} credits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">This Month:</span>
                      <span>{profileData.credits.stats.this_month || 0} credits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">All Time:</span>
                      <span>{profileData.credits.stats.total || 0} credits</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Limits */}
            <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4">Account Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Projects Limit</p>
                  <p className="text-lg font-medium">{profileData?.limits?.projects || 'Unlimited'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Models per Project</p>
                  <p className="text-lg font-medium">{profileData?.limits?.models_per_project || 'Unlimited'}</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              
              {/* Recent Payments */}
              {profileData?.recent_payments?.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Recent Payments</h4>
                  <div className="space-y-2">
                    {profileData.recent_payments.slice(0, 3).map((payment, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium">
                            {payment.credit_package_name || `${payment.credits_purchased} Credits`}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-400">₦{payment.amount_naira}</p>
                          <p className="text-xs text-gray-400">+{payment.credits_purchased} credits</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Usage */}
              {profileData?.recent_usage?.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Recent Credit Usage</h4>
                  <div className="space-y-2">
                    {profileData.recent_usage.slice(0, 3).map((usage, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium capitalize">{usage.action_type.replace('_', ' ')}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(usage.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-red-400">-{usage.credits_used} credits</p>
                          <p className="text-xs text-gray-400">{usage.remaining_credits} remaining</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Transactions */}
              {profileData?.recent_transactions?.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Credit Transactions</h4>
                  <div className="space-y-2">
                    {profileData.recent_transactions.slice(0, 3).map((transaction, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium capitalize">{transaction.transaction_type}</p>
                          <p className="text-xs text-gray-400">{transaction.reason}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                          </p>
                          <p className="text-xs text-gray-400">{transaction.balance_after} balance</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!profileData?.recent_payments?.length && !profileData?.recent_usage?.length && !profileData?.recent_transactions?.length) && (
                <p className="text-gray-400 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;