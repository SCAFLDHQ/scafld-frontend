import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Database, Code2, Terminal, Cloud, ShoppingCart, Menu, X } from 'lucide-react';

export default function Hero() {
  const [cliStep, setCliStep] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();

  const cliLines = [
    '$ scafld startapp --django',
    'project_name: Name?',
    'prompt: Build a Todo List Backend?',
    'setting up structure...',
    'installing requirements...',
    'scafld has cooked 👨‍🍳'
  ];

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // 640px is the sm breakpoint
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate responsive line height
  const lineHeight = isMobile ? 28 : 34; // Mobile: 28px, Desktop: 34px
  const paddingHeight = isMobile ? 24 : 32; // Adjust padding for mobile
  const minHeight = cliLines.length * lineHeight + paddingHeight;

  useEffect(() => {
    if (cliStep < cliLines.length) {
      const timeout = setTimeout(() => {
        setCliStep(cliStep + 1);
      }, cliStep === 0 ? 800 : cliStep === 1 ? 1000 : 600);
      return () => clearTimeout(timeout);
    } else {
      const resetTimeout = setTimeout(() => {
        setCliStep(0);
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }
  }, [cliStep]);

  return (
    <section className="relative px-4 sm:px-6 py-20 md:py-32 max-w-7xl mx-auto">
      {/* Header/Nav */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#29142e] flex items-center justify-center rounded-lg">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="tracking-tight text-white font-bold text-lg">SCAFLD</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <a href="#features" className="text-white/80 hover:text-white transition-colors text-sm lg:text-base">Features</a>
          <a href="#demo" className="text-white/80 hover:text-white transition-colors text-sm lg:text-base">Demo</a>
          <a href="#docs" className="text-white/80 hover:text-white transition-colors text-sm lg:text-base">Docs</a>
          <button
            onClick={() => navigate('/login')}
            className="text-white/80 hover:text-white transition-colors text-sm lg:text-base"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 bg-[#29142e] text-white text-sm hover:bg-[#3a1f4a] transition-colors rounded-lg font-medium"
          >
            Sign Up
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-4 right-4 bg-[#1c151e] border border-white/10 rounded-lg z-50 md:hidden">
          <nav className="flex flex-col p-4 space-y-4">
            <a href="#features" className="text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="#demo" className="text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Demo</a>
            <Link to="/dashboard" className="text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Docs</Link>
            <button
              onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
              className="text-white/80 hover:text-white transition-colors py-2 text-left"
            >
              Login
            </button>
            <button
              onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
              className="px-4 py-2 bg-[#29142e] text-white text-sm hover:bg-[#3a1f4a] transition-colors rounded-lg font-medium text-center"
            >
              Sign Up
            </button>
          </nav>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-16 md:mt-2">
        {/* Left Content */}
        <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white text-center lg:text-left">
              Build production-ready APIs in minutes, not days
            </h1>
            <p className="text-white/60 max-w-xl text-base sm:text-lg text-center lg:text-left">
              Visually design your database and instantly generate robust Django or Express.js code.
            </p>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 flex-wrap">
            <button 
              onClick={() => navigate('/register')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-[#29142e] text-white transition-all hover:scale-105 rounded-lg font-bold text-sm sm:text-base"
            >
              Get Started Free
            </button>
            <button className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white transition-all hover:bg-white hover:text-black rounded-lg font-bold text-sm sm:text-base">
              Watch Demo
            </button>
          </div>

          {/* CLI Snippet with Responsive Height */}
          <div 
            className="bg-[#1a1a1a] border border-white/10 text-white p-4 sm:p-6 font-mono text-xs sm:text-sm max-w-lg mx-auto lg:mx-0 rounded-lg overflow-hidden"
            style={{ 
              minHeight: `${minHeight}px`,
              // Optional: Add transition for smooth height changes
              transition: 'min-height 0.3s ease'
            }}
          >
            <div className="space-y-2">
              {cliLines.slice(0, cliStep).map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`leading-relaxed ${index === 0 ? 'text-green-400' : index === 5 ? 'text-yellow-300' : 'text-white/80'}`}
                >
                  {line}
                </motion.div>
              ))}
              {cliStep < cliLines.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-white ml-1"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Illustration - Workflow Animation */}
        <div className="relative order-1 lg:order-2">
          {/* Main Flow */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-2 sm:space-y-4"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#29142e] flex items-center justify-center rounded-lg">
                <Database className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-center text-xs sm:text-sm text-white/60">Schema</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="w-6 sm:w-8 lg:w-12 h-0.5 bg-white/20 hidden sm:block"
            />

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-2 sm:space-y-4"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#29142e] flex items-center justify-center rounded-lg">
                <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-center text-xs sm:text-sm text-white/60">Generate</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="w-6 sm:w-8 lg:w-12 h-0.5 bg-white/20 hidden sm:block"
            />

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="space-y-2 sm:space-y-4"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#29142e] flex items-center justify-center rounded-lg">
                <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-center text-xs sm:text-sm text-white/60">Deploy</div>
            </motion.div>
          </div>

          {/* Secondary Flow */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="space-y-2 sm:space-y-4"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#29142e] flex items-center justify-center rounded-lg">
                <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-center text-xs sm:text-sm text-white/60">CLI</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="space-y-2 sm:space-y-4"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#29142e] flex items-center justify-center rounded-lg">
                <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-center text-xs sm:text-sm text-white/60">Marketplace</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}