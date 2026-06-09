import { Database, Code2, Terminal, Cloud, ShoppingCart, FileText } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: Database,
    title: 'Visual Schema Builder',
    description: 'Design your database schema with an intuitive visual interface. No SQL knowledge required.'
  },
  {
    icon: Code2,
    title: 'AI-Ready Spec Export',
    description: 'Export a rich JSON/YAML spec your AI agent uses as precise architectural context — any language, any framework.'
  },
  {
    icon: Terminal,
    title: 'CLI Integration',
    description: 'Powerful command-line tools to scaffold, manage, and sync your projects effortlessly.'
  },
  {
    icon: Cloud,
    title: 'One-Click Deployment',
    description: 'Deploy your APIs to production with a single command. No DevOps headaches.'
  },
  {
    icon: FileText,
    title: 'Auto-Generated Documentation',
    description: 'Beautiful API documentation generated automatically from your schema. Always in sync.'
  },
  {
    icon: ShoppingCart,
    title: 'Marketplace to Monetize',
    description: 'Share and sell your API templates on the marketplace. Turn your work into revenue.'
  }
];

export default function Features() {
  return (
    <section id="features" className="px-4 sm:px-6 py-16 md:py-24 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Everything you need to ship faster
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base sm:text-lg">
            SCAFLD provides a powerful, integrated toolkit to streamline your entire backend development process.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-black p-6 sm:p-8 border-2 border-white/10 rounded-lg transition-all hover:border-[#29142e] cursor-pointer feature-card"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#29142e] flex items-center justify-center mb-4 sm:mb-6 rounded-lg">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="mb-3 text-white text-lg sm:text-xl font-bold">{feature.title}</h3>
              <p className="text-white/60 text-sm sm:text-base">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}