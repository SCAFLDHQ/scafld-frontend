import { motion } from 'motion/react';
import { Coins, Check } from 'lucide-react';

export default function Step6ReviewCreate({ data, onBack, onCreate }) {
  // Calculate total credits
  const templateCost = data.template === 'blank' ? 0 : data.template === 'rest-api' ? 10 : data.template === 'auth' ? 20 : 15;
  const boilerplateCost = Object.values(data.boilerplates).filter(Boolean).length * 2;
  const modelCost = data.models.length * 5;
  const endpointCost = Object.values(data.endpoints).filter(e => e.crud).length * 3;
  const totalCredits = templateCost + boilerplateCost + modelCost + endpointCost;

  const enabledBoilerplates = Object.entries(data.boilerplates)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h3 className="text-white mb-2">Review & Create</h3>
        <p className="text-white/60">Verify your project configuration before creating</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-white/5 border border-white/10 p-6 space-y-4">
            <div>
              <div className="text-white/40 text-sm mb-1">Project Name</div>
              <div className="text-white">{data.projectName || 'Untitled Project'}</div>
            </div>
            {data.description && (
              <div>
                <div className="text-white/40 text-sm mb-1">Description</div>
                <div className="text-white/80">{data.description}</div>
              </div>
            )}
            <div>
              <div className="text-white/40 text-sm mb-1">Framework</div>
              <div className="text-white">{data.framework || 'Not selected'}</div>
            </div>
            <div>
              <div className="text-white/40 text-sm mb-1">Template</div>
              <div className="text-white capitalize">{data.template.replace('-', ' ') || 'None'}</div>
            </div>
          </div>

          {/* Boilerplates */}
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="text-white mb-3">Boilerplates ({enabledBoilerplates.length})</div>
            {enabledBoilerplates.length === 0 ? (
              <div className="text-white/40 text-sm">No boilerplates selected</div>
            ) : (
              <div className="space-y-2">
                {enabledBoilerplates.map((key) => (
                  <div key={key} className="flex items-center gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-[#29142e]" />
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Database Models */}
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="text-white mb-3">Database Models ({data.models.length})</div>
            {data.models.length === 0 ? (
              <div className="text-white/40 text-sm">No models defined</div>
            ) : (
              <div className="space-y-3">
                {data.models.map((model) => (
                  <div key={model.id} className="bg-white/5 p-3">
                    <div className="text-white text-sm mb-1">{model.name}</div>
                    <div className="text-white/40 text-xs">
                      {model.fields.length} field{model.fields.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* API Endpoints */}
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="text-white mb-3">API Endpoints</div>
            {Object.keys(data.endpoints).length === 0 ? (
              <div className="text-white/40 text-sm">No endpoints configured</div>
            ) : (
              <div className="space-y-2">
                {Object.entries(data.endpoints).map(([modelName, config]) => (
                  config.crud && (
                    <div key={modelName} className="text-sm">
                      <div className="text-white/80 mb-1">{modelName}</div>
                      <div className="text-white/40 text-xs font-mono">
                        GET, POST, PATCH, DELETE
                        {config.search && ', Search'}
                        {config.filtering && ', Filter'}
                        {config.ordering && ', Order'}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Credit Cost */}
      <div className="bg-[#29142e]/20 border-2 border-[#29142e] p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/60 mb-2">Total Credit Cost</div>
            <div className="space-y-1 text-sm text-white/40">
              <div>Template: {templateCost} credits</div>
              <div>Boilerplates: {boilerplateCost} credits</div>
              <div>Models: {modelCost} credits</div>
              <div>Endpoints: {endpointCost} credits</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-3">
              <Coins className="w-8 h-8 text-[#29142e]" />
              <div className="text-4xl text-white font-mono">{totalCredits}</div>
            </div>
            <div className="text-white/60 text-sm mt-1">credits</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="px-6 py-4 border-2 border-white/20 text-white hover:bg-white/5 transition-all"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreate}
          className="flex-1 px-6 py-4 bg-[#29142e] text-white hover:bg-[#3a1f4a] transition-colors text-lg"
        >
          Create Project
        </motion.button>
      </div>
    </motion.div>
  );
}