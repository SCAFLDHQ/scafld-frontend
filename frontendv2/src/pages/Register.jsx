import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/Auth/AuthLayout';
import SocialAuthButtons from '../components/Auth/SocialAuthButtons';
import { Eye, EyeOff, Check, X } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    };
  };

  const passwordChecks = validatePassword(formData.password);
  const showPasswordStrength = formData.password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!Object.values(passwordChecks).every(Boolean)) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const result = await register(formData);
        if (result.success) {
          navigate('/dashboard');
        } else {
          setErrors({ general: result.error });
        }
      } catch (error) {
        setErrors({ general: 'Registration failed. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Create your account</h1>
          <p className="text-white/60 text-sm sm:text-base">Start building APIs in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-white text-sm">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border ${
                errors.username ? 'border-red-500' : 'border-white/10'
              } text-white placeholder-white/40 focus:outline-none focus:border-[#29142e] transition-colors rounded-lg text-sm sm:text-base`}
              placeholder="johndoe"
            />
            {errors.username && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm"
              >
                {errors.username}
              </motion.p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-white text-sm">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border ${
                errors.email ? 'border-red-500' : 'border-white/10'
              } text-white placeholder-white/40 focus:outline-none focus:border-[#29142e] transition-colors rounded-lg text-sm sm:text-base`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-white text-sm">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border ${
                  errors.password ? 'border-red-500' : 'border-white/10'
                } text-white placeholder-white/40 focus:outline-none focus:border-[#29142e] transition-colors rounded-lg pr-12 text-sm sm:text-base`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>

            {/* Password Strength Indicators */}
            {showPasswordStrength && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1 sm:space-y-2 pt-2"
              >
                <div className="flex items-center gap-2 text-xs">
                  {passwordChecks.length ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <X className="w-3 h-3 text-white/40" />
                  )}
                  <span className={passwordChecks.length ? 'text-green-400' : 'text-white/60'}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {passwordChecks.uppercase ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <X className="w-3 h-3 text-white/40" />
                  )}
                  <span className={passwordChecks.uppercase ? 'text-green-400' : 'text-white/60'}>
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {passwordChecks.lowercase ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <X className="w-3 h-3 text-white/40" />
                  )}
                  <span className={passwordChecks.lowercase ? 'text-green-400' : 'text-white/60'}>
                    One lowercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {passwordChecks.number ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <X className="w-3 h-3 text-white/40" />
                  )}
                  <span className={passwordChecks.number ? 'text-green-400' : 'text-white/60'}>
                    One number
                  </span>
                </div>
              </motion.div>
            )}

            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm"
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-white text-sm">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                } text-white placeholder-white/40 focus:outline-none focus:border-[#29142e] transition-colors rounded-lg pr-12 text-sm sm:text-base`}
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm"
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#29142e] text-white transition-all hover:bg-[#3a1f4a] rounded-lg font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>

          {/* General Error */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3"
            >
              {errors.general}
            </motion.div>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-white/60 text-xs sm:text-sm">Or continue with</span>
            </div>
          </div>

          {/* Social Auth */}
          <SocialAuthButtons />

          {/* Login Link */}
          <div className="text-center">
            <p className="text-white/60 text-sm sm:text-base">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#29142e] hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </AuthLayout>
  );
}