import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Code2, Database, ArrowRight } from 'lucide-react';

export default function AuthLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 py-4 sm:py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#29142e] flex items-center justify-center rounded-lg">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="tracking-tight text-white font-bold">SCAFLD</span>
          </button>
          <nav className="hidden sm:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => navigate('/docs')}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Docs
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Pricing
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side - Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {children}
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 lg:space-y-8"
            >
              <div className="space-y-3 lg:space-y-4">
                <h3 className="text-white text-xl lg:text-2xl font-bold">Ship faster with SCAFLD</h3>
                <p className="text-white/60 text-sm lg:text-base">
                  Join developers building production-ready APIs in minutes
                </p>
              </div>

              {/* Animated Workflow */}
              <div className="space-y-4 lg:space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#29142e] flex items-center justify-center flex-shrink-0 rounded-lg">
                    <Database className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm lg:text-base mb-1 truncate">Visual Schema Builder</div>
                    <div className="text-white/40 text-xs lg:text-sm truncate">Design your database visually</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#29142e] flex items-center justify-center flex-shrink-0 rounded-lg">
                    <Code2 className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm lg:text-base mb-1 truncate">Generate Code</div>
                    <div className="text-white/40 text-xs lg:text-sm truncate">Django or Express.js instantly</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="p-3 lg:p-4 bg-[#29142e]/20 border border-[#29142e]/50 rounded-lg"
                >
                  <div className="text-[#b5a0ba] text-xs lg:text-sm font-mono mb-1 lg:mb-2">$ scafld deploy --production</div>
                  <div className="text-white/60 text-xs lg:text-sm">Deploy with a single command</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-4 sm:py-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-white/40 text-xs sm:text-sm text-center sm:text-left">© 2025 SCAFLD. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <button
              onClick={() => navigate('/docs')}
              className="text-white/60 hover:text-white transition-colors"
            >
              Docs
            </button>
            <button
              onClick={() => navigate('/github')}
              className="text-white/60 hover:text-white transition-colors"
            >
              GitHub
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-white/60 hover:text-white transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}