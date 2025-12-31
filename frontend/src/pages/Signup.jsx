// src/pages/Signup.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { GoogleLoginButton } from "../components/Landing/GoogleLoginButton";
import { GitHubLoginButton } from "../components/Landing/GitHubLoginButton";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark bg-background-dark font-sans text-[#E0E0E0] min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
        {/* Header */}
        <div className="absolute top-4 md:top-8 w-full max-w-md px-4">
          <Link to="/" className="flex items-center justify-center gap-2">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              viewBox="0 0 48 48" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" 
                fill="currentColor"
              />
            </svg>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white text-center">
              SCAFLD
            </h1>
          </Link>
        </div>
        
        {/* Signup Form */}
        <div className="glassmorphism w-full max-w-md rounded-xl p-6 md:p-8 space-y-6 mt-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold leading-tight tracking-tight">
              Create an account
            </h2>
            <p className="text-gray-400 mt-1 text-sm md:text-base">
              Get started with your 30-day free trial.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="w-full space-y-3">
            <GoogleLoginButton text="signup_with" />
            <GitHubLoginButton text="signup_with" />
          </div>

          <div className="relative my-4">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#2a2a2a] px-2 text-gray-400 rounded-full">
                Or continue with email
              </span>
            </div>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="first_name">
                  First Name
                </label>
                <input 
                  className="neumorphism-inset flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 h-12 p-4 text-base font-normal leading-normal"
                  id="first_name"
                  name="first_name"
                  placeholder="John"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="last_name">
                  Last Name
                </label>
                <input 
                  className="neumorphism-inset flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 h-12 p-4 text-base font-normal leading-normal"
                  id="last_name"
                  name="last_name"
                  placeholder="Doe"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="username">
                Username
              </label>
              <input 
                autoComplete="username"
                className="neumorphism-inset flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 h-12 p-4 text-base font-normal leading-normal"
                id="username"
                name="username"
                placeholder="johndoe"
                required
                type="text"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
                Email Address
              </label>
              <input 
                autoComplete="email"
                className="neumorphism-inset flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 h-12 p-4 text-base font-normal leading-normal"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input 
                  autoComplete="new-password"
                  className="neumorphism-inset flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 h-12 p-4 pr-12 text-base font-normal leading-normal"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-gray-400">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password2">
                Confirm Password
              </label>
              <input 
                autoComplete="new-password"
                className="neumorphism-inset flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 h-12 p-4 text-base font-normal leading-normal"
                id="password2"
                name="password2"
                placeholder="••••••••"
                required
                type="password"
                value={formData.password2}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input 
                id="terms"
                name="terms"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary focus:ring-offset-gray-800"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                I agree to the{" "}
                <a href="#" className="text-primary hover:text-primary/90 underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:text-primary/90 underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            
            <div>
              <button 
                className={`flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-base font-bold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300 ease-in-out ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?
            <Link to='/login'>
              <span className="font-semibold leading-6 text-primary hover:text-primary/90 ml-1 cursor-pointer">
                Log In
              </span>
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;