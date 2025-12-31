import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Settings, ArrowRight, Coins } from 'lucide-react';

const suggestions = [
  'Build a todo list backend with auth and tasks',
  'Create an e-commerce API with products, cart, and payments',
  'Social media backend with posts, likes, and comments',
  'Blog CMS with articles, categories, and tags',
  'Task management system with teams and projects',
];

export default function Step1AIOrManual({ onAIQuickCreate, onManualSetup }) {
  const [prompt, setPrompt] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const aiCreditCost = 50;

  const handleAIGenerate = () => {
    if (prompt.trim()) {
      setShowConfirm(true);
    }
  };

  const handleConfirmAI = () => {
    onAIQuickCreate(prompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {!showConfirm ? (
        <>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* AI Quick Create */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm mb-2">Describe your API</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., 'Build a todo list backend with auth and tasks'"
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#29142e] transition-colors resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-white/60 text-sm">Quick suggestions:</div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(suggestion)}
                      className="block w-full text-left px-4 py-2 bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-[#29142e] transition-colors text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 p-4 bg-[#29142e]/10 border border-[#29142e]/30">
                  <Coins className="w-5 h-5 text-[#29142e]" />
                  <span className="text-white/60 text-sm">
                    Cost: <span className="text-white">{aiCreditCost} credits</span>
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAIGenerate}
                  disabled={!prompt.trim()}
                  className="w-full px-6 py-4 bg-[#29142e] text-white flex items-center justify-center gap-2 hover:bg-[#3a1f4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate with AI
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Manual Setup */}
            <div className="flex flex-col justify-center items-center text-center space-y-6">
                <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center">
                    <Settings className="w-8 h-8 text-white" />
                </div>
              <div className="space-y-4">
                <p className="text-white/60 text-sm max-w-sm">
                  Configure your project step-by-step with full control over every detail
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onManualSetup}
                  className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all"
                >
                  Manual Setup
                </motion.button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Confirmation Screen
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center space-y-6"
        >
          <div className="w-16 h-16 bg-[#29142e] flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <div>
            <h3 className="text-white mb-3">Ready to Generate?</h3>
            <p className="text-white/60 mb-4">AI will generate the following based on your prompt:</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 text-left">
            <div className="text-white/40 text-sm mb-2">Your prompt:</div>
            <div className="text-white mb-6 italic">"{prompt}"</div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-1.5 h-1.5 bg-[#29142e] rounded-full"></div>
                Project name and description
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-1.5 h-1.5 bg-[#29142e] rounded-full"></div>
                Framework selection (Django/Express.js)
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-1.5 h-1.5 bg-[#29142e] rounded-full"></div>
                Recommended boilerplates
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-1.5 h-1.5 bg-[#29142e] rounded-full"></div>
                Database models and fields
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-1.5 h-1.5 bg-[#29142e] rounded-full"></div>
                Complete CRUD API endpoints
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 p-6 bg-[#29142e]/20 border border-[#29142e]">
            <Coins className="w-6 h-6 text-[#29142e]" />
            <span className="text-white text-xl">
              Cost: <span className="font-mono">{aiCreditCost} credits</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-6 py-4 border-2 border-white/20 text-white hover:bg-white/5 transition-all"
            >
              Go Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirmAI}
              className="flex-1 px-6 py-4 bg-[#29142e] text-white hover:bg-[#3a1f4a] transition-colors"
            >
              Confirm & Generate
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}