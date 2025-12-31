import { motion } from 'motion/react';
import { useEffect } from 'react';

export default function Step5APIEndpoints({ data, onUpdate, onNext, onBack }) {
  // Initialize endpoints for all models
  useEffect(() => {
    const newEndpoints = { ...data.endpoints };
    data.models.forEach(model => {
      if (!newEndpoints[model.name]) {
        newEndpoints[model.name] = {
          crud: true,
          search: false,
          filtering: false,
          ordering: false,
        };
      }
    });
    onUpdate({ endpoints: newEndpoints });
  }, [data.models]);

  const toggleEndpoint = (modelName, key) => {
    onUpdate({
      endpoints: {
        ...data.endpoints,
        [modelName]: {
          ...data.endpoints[modelName],
          [key]: !data.endpoints[modelName]?.[key],
        },
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
        <h3 className="text-white mb-2">API Endpoints</h3>
        <p className="text-white/60">Configure auto-generated CRUD endpoints for your models</p>
      </div>

      {data.models.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10">
          <p className="text-white/60">No models defined. Go back to add models first.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.models.map((model) => {
            const endpoints = data.endpoints[model.name] || {
              crud: true,
              search: false,
              filtering: false,
              ordering: false,
            };

            return (
              <div key={model.id} className="bg-white/5 border border-white/10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-white mb-1">{model.name}</h4>
                    <p className="text-white/40 text-sm">{model.fields.length} fields</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">Enable CRUD</span>
                    <button
                      onClick={() => toggleEndpoint(model.name, 'crud')}
                      className={`relative w-12 h-6 transition-colors ${
                        endpoints.crud ? 'bg-[#29142e]' : 'bg-white/10'
                      }`}
                    >
                      <motion.div
                        animate={{ x: endpoints.crud ? 24 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white"
                      />
                    </button>
                  </div>
                </div>

                {endpoints.crud && (
                  <div className="space-y-4">
                    {/* Endpoint Preview */}
                    <div className="bg-black/50 p-4 font-mono text-sm space-y-1">
                      <div className="text-green-400">GET    /api/{model.name.toLowerCase()}</div>
                      <div className="text-blue-400">POST   /api/{model.name.toLowerCase()}</div>
                      <div className="text-yellow-400">PATCH  /api/{model.name.toLowerCase()}/:id</div>
                      <div className="text-red-400">DELETE /api/{model.name.toLowerCase()}/:id</div>
                    </div>

                    {/* Advanced Options */}
                    <div className="space-y-3">
                      <div className="text-white/60 text-sm">Advanced Options</div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <label className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                          <span className="text-white text-sm">Search</span>
                          <button
                            onClick={() => toggleEndpoint(model.name, 'search')}
                            className={`relative w-10 h-5 transition-colors ${
                              endpoints.search ? 'bg-[#29142e]' : 'bg-white/10'
                            }`}
                          >
                            <motion.div
                              animate={{ x: endpoints.search ? 20 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-0.5 left-0.5 w-4 h-4 bg-white"
                            />
                          </button>
                        </label>

                        <label className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                          <span className="text-white text-sm">Filtering</span>
                          <button
                            onClick={() => toggleEndpoint(model.name, 'filtering')}
                            className={`relative w-10 h-5 transition-colors ${
                              endpoints.filtering ? 'bg-[#29142e]' : 'bg-white/10'
                            }`}
                          >
                            <motion.div
                              animate={{ x: endpoints.filtering ? 20 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-0.5 left-0.5 w-4 h-4 bg-white"
                            />
                          </button>
                        </label>

                        <label className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                          <span className="text-white text-sm">Ordering</span>
                          <button
                            onClick={() => toggleEndpoint(model.name, 'ordering')}
                            className={`relative w-10 h-5 transition-colors ${
                              endpoints.ordering ? 'bg-[#29142e]' : 'bg-white/10'
                            }`}
                          >
                            <motion.div
                              animate={{ x: endpoints.ordering ? 20 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-0.5 left-0.5 w-4 h-4 bg-white"
                            />
                          </button>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      <div className="p-4 bg-white/5 border border-white/10">
        <div className="text-white/60 text-sm">
          Total endpoints: <span className="text-white font-mono">
            {Object.values(data.endpoints).filter(e => e.crud).length * 4}
          </span>
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
          Continue to Review
        </motion.button>
      </div>
    </motion.div>
  );
}