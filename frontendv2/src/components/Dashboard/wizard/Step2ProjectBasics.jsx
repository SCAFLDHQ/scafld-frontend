import { motion } from 'motion/react';
import { Coins } from 'lucide-react';

const templates = [
  { id: 'blank', name: 'Blank Project', description: 'Start from scratch with minimal setup', credits: 0 },
  { id: 'rest-api', name: 'REST API Starter', description: 'Basic REST API with sample endpoints', credits: 10 },
  { id: 'auth', name: 'Auth Template', description: 'Pre-configured authentication system', credits: 20 },
  { id: 'crud', name: 'Full CRUD', description: 'Complete CRUD operations template', credits: 15 },
];

export default function Step2ProjectBasics({ data, onUpdate, onNext, onBack }) {
  const canProceed = data.projectName && data.framework && data.template;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-white mb-2">Project Basics</h3>
        <p className="text-white/60">Configure the foundation of your API project</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project Name */}
        <div className="space-y-2">
          <label className="block text-white text-sm">Project Name *</label>
          <input
            type="text"
            value={data.projectName}
            onChange={(e) => onUpdate({ projectName: e.target.value })}
            placeholder="my-awesome-api"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#29142e] transition-colors"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-white text-sm">Description</label>
          <input
            type="text"
            value={data.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="A brief description of your project"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#29142e] transition-colors"
          />
        </div>
      </div>

      {/* Framework Selection */}
      <div className="space-y-3">
        <label className="block text-white text-sm">Framework *</label>
        <div className="grid grid-cols-3 gap-4">
          {['Django', 'Express.js', 'Flask'].map((framework) => (
            <button
              key={framework}
              onClick={() => onUpdate({ framework })}
              className={`p-4 border-2 transition-all ${
                data.framework === framework
                  ? 'bg-[#29142e] border-[#29142e] text-white'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              <div className="text-center">
                <div className="mb-2">{framework}</div>
                <div className="text-xs opacity-60">
                  {framework === 'Django' && 'Python'}
                  {framework === 'Express.js' && 'Node.js'}
                  {framework === 'Flask' && 'Python'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <label className="block text-white text-sm">Template *</label>
        <div className="grid md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onUpdate({ template: template.id })}
              className={`p-4 border-2 text-left transition-all group ${
                data.template === template.id
                  ? 'bg-[#29142e]/20 border-[#29142e] text-white'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className={data.template === template.id ? 'text-white' : 'text-white/80'}>
                  {template.name}
                </h4>
                {template.credits > 0 && (
                  <div className="flex items-center gap-1 text-xs text-[#29142e]">
                    <Coins className="w-3 h-3" />
                    {template.credits}
                  </div>
                )}
              </div>
              <p className="text-sm opacity-60">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Credit Cost */}
      <div className="flex items-center gap-2 p-4 bg-white/5 border border-white/10">
        <Coins className="w-5 h-5 text-[#29142e]" />
        <span className="text-white/60">
          Template cost: <span className="text-white font-mono">
            {templates.find(t => t.id === data.template)?.credits || 0} credits
          </span>
        </span>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="px-6 py-3 border-2 border-white/20 text-white hover:bg-white/5 transition-all"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 px-6 py-3 bg-[#29142e] text-white hover:bg-[#3a1f4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
}