import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

const suggestions = [
  'Create a REST API for a todo app with Django',
  'Build an Express.js API for user authentication',
  'Generate a blog backend with Django and PostgreSQL',
  'Create an e-commerce API with payment integration',
  'Build a social media backend with Express.js',
];

export default function AIPromptInput() {
  const [prompt, setPrompt] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);

  const handlePromptChange = (value) => {
    setPrompt(value);
    if (value.length > 0) {
      setShowSuggestions(true);
      const filtered = suggestions.filter(s =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions(suggestions);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setPrompt(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      console.log('Creating project with prompt:', prompt);
      // Handle project creation
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 sm:gap-3 bg-white/5 border border-white/10 p-3 sm:p-4 focus-within:border-[#29142e] transition-colors rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <Sparkles className="w-4 h-10 sm:w-5 sm:h-5 text-[#29142e] flex-shrink-0" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              onFocus={() => prompt.length === 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Describe your API project..."
              className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm sm:text-base min-w-0"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!prompt.trim()}
            className="px-4 sm:px-6 py-2 bg-[#29142e] text-white flex items-center justify-center gap-2 transition-all hover:bg-[#3a1f4a] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base rounded-lg"
          >
            <span className="hidden sm:inline">Generate</span>
            <span className="sm:hidden">Go</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 max-h-48 sm:max-h-64 overflow-y-auto z-10 rounded-lg"
          >
            <div className="p-2">
              <div className="text-white/40 text-xs px-2 sm:px-3 py-1 sm:py-2">Suggestions</div>
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-white/80 hover:bg-white/5 hover:text-white transition-colors text-xs sm:text-sm rounded"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}