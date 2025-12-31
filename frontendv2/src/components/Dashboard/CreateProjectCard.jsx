import { motion } from 'motion/react';
import { Plus, Sparkles } from 'lucide-react';

export default function CreateProjectCard({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      className="bg-[#29142e]/20 border-2 border-dashed border-[#29142e] p-4 sm:p-6 transition-all hover:bg-[#29142e]/30 hover:border-[#3a1f4a] text-left w-full min-h-[200px] sm:min-h-[240px] flex flex-col items-center justify-center gap-3 sm:gap-4 rounded-lg"
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#29142e] flex items-center justify-center rounded-lg">
        <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </div>
      <div className="text-center">
        <h3 className="text-white text-base sm:text-lg mb-1 sm:mb-2">Create New Project</h3>
        <p className="text-white/60 text-xs sm:text-sm px-2 sm:px-0">
          Use AI to generate your API or start from scratch
        </p>
      </div>
      <div className="flex items-center gap-2 text-[#b5a0ba] text-xs sm:text-sm">
        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>AI-Powered</span>
      </div>
    </motion.button>
  );
}