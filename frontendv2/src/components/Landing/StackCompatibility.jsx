import { motion } from 'motion/react';

const languages = [
  { name: 'Python',     color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  { name: 'TypeScript', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  { name: 'Go',         color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  { name: 'Rust',       color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
  { name: 'Java',       color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  { name: 'Haskell',   color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  { name: 'Kotlin',     color: 'text-orange-300 border-orange-400/30 bg-orange-400/10' },
  { name: 'Ruby',       color: 'text-red-300 border-red-400/30 bg-red-400/10' },
  { name: 'C#',         color: 'text-green-400 border-green-500/30 bg-green-500/10' },
  { name: 'PHP',        color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' },
  { name: 'Swift',      color: 'text-orange-400 border-orange-400/30 bg-orange-400/10' },
  { name: 'Elixir',     color: 'text-violet-400 border-violet-500/30 bg-violet-500/10' },
];

const agents = ['Claude Code', 'Cursor', 'Gemini', 'Copilot', 'Windsurf'];

export default function StackCompatibility() {
  return (
    <section className="px-4 sm:px-6 py-14 md:py-20 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase">Language & Framework Agnostic</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Works with any language, any AI agent
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Scafld generates the architecture spec — not the code. Pipe that spec into Claude Code, Cursor, or Gemini
            and let your AI agent scaffold the backend in <span className="text-white/80 font-medium">whatever language you actually use</span>.
          </p>
        </motion.div>

        {/* Language badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {languages.map((lang, i) => (
            <motion.span
              key={lang.name}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className={`px-3 py-1.5 rounded-full border text-xs sm:text-sm font-medium ${lang.color}`}
            >
              {lang.name}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: languages.length * 0.04, duration: 0.3 }}
            className="px-3 py-1.5 rounded-full border border-white/10 text-xs sm:text-sm font-medium text-white/30"
          >
            + any other
          </motion.span>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 max-w-xs mx-auto">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/20 text-xs tracking-wider uppercase">plugs into</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* AI Agent badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {agents.map((agent, i) => (
            <motion.span
              key={agent}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
              className="px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs sm:text-sm font-medium text-white/60"
            >
              {agent}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
