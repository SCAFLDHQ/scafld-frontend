import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="px-4 sm:px-6 py-16 md:py-24 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8"
      >
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Ready to build faster?
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base sm:text-lg">
            Start your next project with SCAFLD today. No credit card required.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-[#29142e] text-white transition-all rounded-lg font-bold text-sm sm:text-base"
          >
            Get Started Free
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#fff', color: '#000' }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 border-2 border-white text-white transition-all rounded-lg font-bold text-sm sm:text-base"
          >
            Watch Demo
          </motion.button>
        </div>

        <p className="text-white/40 text-xs sm:text-sm">
          No credit card required • Free tier available
        </p>
      </motion.div>
    </section>
  );
}