import { motion } from 'motion/react';
import { Database, Code2, Cloud, ShoppingCart, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Database,
    title: 'Design Schema',
    description: 'Visually construct your models with drag-and-drop components'
  },
  {
    icon: Code2,
    title: 'Export Spec',
    description: 'Export a structured JSON/YAML spec — pipe it into any AI coding agent to generate code in your language of choice'
  },
  {
    icon: Cloud,
    title: 'Deploy',
    description: 'Push your API live instantly with one-click deployment'
  },
  {
    icon: ShoppingCart,
    title: 'Monetize',
    description: 'Sell your templates and monetize your expertise on the marketplace'
  }
];

export default function Workflow() {
  return (
    <section className="px-4 sm:px-6 py-16 md:py-24 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            How It Works
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base sm:text-lg">
            A simple, streamlined process to get your API live in record time
          </p>
        </div>

        <div className="relative">
          {/* Desktop Flow */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-start">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#29142e] flex items-center justify-center mb-4 rounded-full border border-white/10">
                  <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="w-8 h-8 bg-white text-black flex items-center justify-center mb-4 rounded-full font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-white text-lg sm:text-xl font-bold">{step.title}</h3>
                <p className="text-white/60 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Tablet Flow */}
          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-2 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-[#29142e] flex items-center justify-center mb-4 rounded-full border border-white/10">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-white text-black flex items-center justify-center mb-4 rounded-full font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="mb-2 text-white text-lg font-bold">{step.title}</h3>
                  <p className="text-white/60 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Flow */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#29142e] flex items-center justify-center mb-3 rounded-full border border-white/10">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-6 h-6 bg-white text-black flex items-center justify-center mx-auto rounded-full font-bold text-xs">
                    {index + 1}
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="mb-2 text-white text-lg font-bold">{step.title}</h3>
                  <p className="text-white/60 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}