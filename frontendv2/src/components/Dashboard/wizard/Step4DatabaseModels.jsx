import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const fieldTypes = [
  'text', 'int', 'bool', 'float', 'datetime', 'FK', 'file', 'slug', 'choice', 'JSON', 'email', 'url'
];

export default function Step4DatabaseModels({ data, onUpdate, onNext, onBack }) {
  const [expandedModel, setExpandedModel] = useState(null);

  const addModel = () => {
    const newModel = {
      id: Date.now().toString(),
      name: `Model${data.models.length + 1}`,
      fields: [],
    };
    onUpdate({ models: [...data.models, newModel] });
    setExpandedModel(newModel.id);
  };

  const removeModel = (modelId) => {
    onUpdate({ models: data.models.filter(m => m.id !== modelId) });
    if (expandedModel === modelId) {
      setExpandedModel(null);
    }
  };

  const updateModel = (modelId, updates) => {
    onUpdate({
      models: data.models.map(m => m.id === modelId ? { ...m, ...updates } : m)
    });
  };

  const addField = (modelId) => {
    const model = data.models.find(m => m.id === modelId);
    if (!model) return;

    const newField = {
      id: Date.now().toString(),
      name: `field${model.fields.length + 1}`,
      type: 'text',
      required: true,
      defaultValue: '',
      description: '',
    };

    updateModel(modelId, {
      fields: [...model.fields, newField]
    });
  };

  const removeField = (modelId, fieldId) => {
    const model = data.models.find(m => m.id === modelId);
    if (!model) return;

    updateModel(modelId, {
      fields: model.fields.filter(f => f.id !== fieldId)
    });
  };

  const updateField = (modelId, fieldId, updates) => {
    const model = data.models.find(m => m.id === modelId);
    if (!model) return;

    updateModel(modelId, {
      fields: model.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white mb-2">Database Models</h3>
          <p className="text-white/60">Define your data models and fields</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addModel}
          className="px-4 py-2 bg-[#29142e] text-white flex items-center gap-2 hover:bg-[#3a1f4a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Model
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Model Editor */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {data.models.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border border-white/10">
              <p className="text-white/60 mb-4">No models yet</p>
              <button
                onClick={addModel}
                className="px-6 py-3 bg-[#29142e] text-white hover:bg-[#3a1f4a] transition-colors"
              >
                Create Your First Model
              </button>
            </div>
          ) : (
            data.models.map((model) => (
              <div
                key={model.id}
                className={`border transition-all ${
                  expandedModel === model.id
                    ? 'bg-white/5 border-[#29142e]'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={model.name}
                      onChange={(e) => updateModel(model.id, { name: e.target.value })}
                      className="flex-1 bg-transparent text-white border-b border-white/20 focus:border-[#29142e] outline-none pb-1"
                    />
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setExpandedModel(expandedModel === model.id ? null : model.id)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        {expandedModel === model.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => removeModel(model.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-white/40 text-sm">
                    {model.fields.length} field{model.fields.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedModel === model.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10 overflow-hidden"
                    >
                      <div className="p-4 space-y-4">
                        {model.fields.map((field) => (
                          <div key={field.id} className="bg-white/5 p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={field.name}
                                onChange={(e) => updateField(model.id, field.id, { name: e.target.value })}
                                placeholder="field_name"
                                className="flex-1 px-2 py-1 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29142e]"
                              />
                              <select
                                value={field.type}
                                onChange={(e) => updateField(model.id, field.id, { type: e.target.value })}
                                className="px-2 py-1 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29142e]"
                              >
                                {fieldTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => removeField(model.id, field.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <label className="flex items-center gap-2 text-sm text-white/60">
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={(e) => updateField(model.id, field.id, { required: e.target.checked })}
                                  className="w-4 h-4"
                                />
                                Required
                              </label>
                              <input
                                type="text"
                                value={field.defaultValue}
                                onChange={(e) => updateField(model.id, field.id, { defaultValue: e.target.value })}
                                placeholder="default value"
                                className="px-2 py-1 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29142e]"
                              />
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() => addField(model.id)}
                          className="w-full px-3 py-2 border border-dashed border-white/20 text-white/60 hover:border-[#29142e] hover:text-white transition-colors text-sm"
                        >
                          + Add Field
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>

        {/* Right: Schema Preview */}
        <div className="bg-[#1a1a1a] border border-white/10 p-4 max-h-[500px] overflow-y-auto">
          <div className="text-white/40 text-sm mb-4">Schema Preview</div>
          <div className="font-mono text-sm space-y-4">
            {data.models.length === 0 ? (
              <div className="text-white/40 text-center py-8">
                No models to preview
              </div>
            ) : (
              data.models.map((model) => (
                <div key={model.id} className="text-white/80">
                  <div className="text-muted-dark mb-2">class {model.name}:</div>
                  {model.fields.length === 0 ? (
                    <div className="ml-4 text-white/40">  # No fields</div>
                  ) : (
                    model.fields.map((field) => (
                      <div key={field.id} className="ml-4">
                        {field.name}: <span className="text-green-400">{field.type}</span>
                        {field.required && <span className="text-yellow-400"> *</span>}
                        {field.defaultValue && <span className="text-white/40"> = {field.defaultValue}</span>}
                      </div>
                    ))
                  )}
                </div>
              ))
            )}
          </div>
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