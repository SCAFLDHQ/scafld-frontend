import { Github, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-4 sm:px-6 py-12 md:py-16 bg-[#0a0a0a] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg">
                <span className="text-black font-bold">S</span>
              </div>
              <span className="tracking-tight font-bold text-lg">SCAFLD</span>
            </div>
            <p className="text-white/60 text-sm">
              Build production-ready APIs in minutes, not days.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-white font-bold">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-white/60 hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-white/60 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#marketplace" className="text-white/60 hover:text-white transition-colors">Marketplace</a></li>
              <li><a href="#changelog" className="text-white/60 hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-white font-bold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#docs" className="text-white/60 hover:text-white transition-colors">Docs</a></li>
              <li><a href="#blog" className="text-white/60 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#guides" className="text-white/60 hover:text-white transition-colors">Guides</a></li>
              <li><a href="#api" className="text-white/60 hover:text-white transition-colors">API Reference</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-white font-bold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-white/60 hover:text-white transition-colors">About</a></li>
              <li><a href="#contact" className="text-white/60 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#careers" className="text-white/60 hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs sm:text-sm text-center md:text-left">
            © 2025 SCAFLD. All rights reserved.
          </p>

          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#github" className="text-white/60 hover:text-white transition-colors" aria-label="GitHub">
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a href="#twitter" className="text-white/60 hover:text-white transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a href="#linkedin" className="text-white/60 hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a href="#instagram" className="text-white/60 hover:text-white transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a href="#email" className="text-white/60 hover:text-white transition-colors" aria-label="Email">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}