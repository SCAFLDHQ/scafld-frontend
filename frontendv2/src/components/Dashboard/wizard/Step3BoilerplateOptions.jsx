import { motion } from 'motion/react';

const boilerplateOptions = [
  { key: 'docker', title: 'Docker Configuration', description: 'Dockerfile and docker-compose.yml for containerization' },
  { key: 'rateLimiting', title: 'Rate Limiting', description: 'API rate limiting to prevent abuse' },
  { key: 'logging', title: 'Structured Logging', description: 'Production-ready logging with JSON formatting' },
  { key: 'envExample', title: '.env.example File', description: 'Environment variables template file' },
  { key: 'pagination', title: 'Pagination Defaults', description: 'Default pagination for list endpoints' },
  { key: 'jwt', title: 'JWT Authentication', description: 'JSON Web Token authentication package' },
  { key: 'healthcheck', title: 'Healthcheck Endpoint', description: '/health endpoint for monitoring' },
  { key: 'openapi', title: 'Auto-generated OpenAPI', description: 'Automatic OpenAPI/Swagger schema generation' },
];

export default function Step3BoilerplateOptions({ data, onUpdate, onNext, onBack }) {
  const handleToggle = (key) => {
    onUpdate({
      boilerplates: {
        ...data.boilerplates,
        [key]: !data.boilerplates[key],
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-white mb-2">Boilerplate Options</h3>
        <p className="text-white/60">Choose modern backend features to include in your project</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {boilerplateOptions.map((option) => {
          const key = option.key;
          const isEnabled = data.boilerplates[key];

          return (
            <div
              key={option.key}
              className={`p-4 border transition-all ${
                isEnabled
                  ? 'bg-[#29142e]/20 border-[#29142e]'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-white mb-1">{option.title}</h4>
                  <p className="text-white/60 text-sm">{option.description}</p>
                </div>
                <button
                  onClick={() => handleToggle(key)}
                  className={`relative w-12 h-6 transition-colors flex-shrink-0 ${
                    isEnabled ? 'bg-[#29142e]' : 'bg-white/10'
                  }`}
                >
                  <motion.div
                    animate={{ x: isEnabled ? 24 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white"
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="p-4 bg-white/5 border border-white/10">
        <div className="text-white/60 text-sm">
          Selected: <span className="text-white font-mono">
            {Object.values(data.boilerplates).filter(Boolean).length}
          </span> / {boilerplateOptions.length} options
        </div>
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
          className="flex-1 px-6 py-3 bg-[#29142e] text-white hover:bg-[#3a1f4a] transition-colors"
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
}