import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const STEPS = [
  'Reading your description…',
  'Designing data models…',
  'Planning relationships…',
  'Configuring API endpoints…',
  'Almost there…',
];

export default function LoadingCooking() {
  const [step, setStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 12000);
    const elapsedTimer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { clearInterval(stepTimer); clearInterval(elapsedTimer); };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 max-w-sm px-6"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl"
        >
          👨‍🍳
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-white text-2xl">Scafld is cooking…</h3>
          <p className="text-white/50 text-sm">Generating your schema…</p>
        </div>

        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 bg-[#7c3aed] rounded-full"
            />
          ))}
        </div>

        <div className="space-y-1">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#a78bfa] text-sm font-mono"
          >
            {STEPS[step]}
          </motion.p>
          <p className="text-white/20 text-xs">{elapsed}s elapsed</p>
        </div>
      </motion.div>
    </div>
  );
}