import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
      <header className="sticky top-0 z-50 w-full bg-background-dark/80 backdrop-blur-lg">
      <div className="max-w-5xl mx-auto">
        <div className="glassmorphism rounded-none md:rounded-xl mx-0 md:mx-4">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
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
              <h2 className="text-white text-xl font-bold font-display">
                SCAFLD
              </h2>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-primary-text text-sm font-medium hover:text-white transition-colors" href="#">
                Features
              </a>
              <a className="text-primary-text text-sm font-medium hover:text-white transition-colors" href="#">
                How it Works
              </a>
              <Link to='/pricing' className="text-primary-text text-sm font-medium hover:text-white transition-colors" href="#">
                Pricing
              </Link>
            </nav>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link to='/login'>
                <button className="px-4 py-2 rounded-lg text-sm font-semibold text-primary-text shadow-neumorphic hover:shadow-neumorphic-inset transition-shadow">
                  Log In
                </button>
              </Link>
              <Link to='/register'>
                <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-neumorphic hover:shadow-neumorphic-inset transition-shadow">
                  Sign Up
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg shadow-neumorphic"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-white">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden px-4 pb-4 border-t border-gray-700">
              <nav className="flex flex-col gap-4 py-4">
                <a className="text-primary-text text-sm font-medium hover:text-white transition-colors" href="#">
                  Features
                </a>
                <a className="text-primary-text text-sm font-medium hover:text-white transition-colors" href="#">
                  How it Works
                </a>
                <Link to='/pricing' className="text-primary-text text-sm font-medium hover:text-white transition-colors" href="#">
                  Pricing
                </Link>
                <div className="flex gap-2 pt-2">
                  <Link to='/login' className="flex-1">
                    <button className="w-full px-4 py-2 rounded-lg text-sm font-semibold text-primary-text shadow-neumorphic hover:shadow-neumorphic-inset transition-shadow">
                      Log In
                    </button>
                  </Link>
                  <Link to='/register' className="flex-1">
                    <button className="w-full px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-neumorphic hover:shadow-neumorphic-inset transition-shadow">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
    )
}