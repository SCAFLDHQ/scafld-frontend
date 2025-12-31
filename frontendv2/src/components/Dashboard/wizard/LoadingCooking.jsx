import { motion } from 'motion/react';

export default function LoadingCooking() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-8xl"
        >
          👨‍🍳
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-white text-2xl">scafld is cooking...</h3>
          <p className="text-white/60">Setting up your backend project</p>
        </div>

        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-[#29142e] rounded-full"
            />
          ))}
        </div>

        <div className="text-white/40 text-sm font-mono">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Generating models...
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}