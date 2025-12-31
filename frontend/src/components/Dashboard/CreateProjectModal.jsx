// src/components/Dashboard/CreateProjectModal.jsx
import { useState } from 'react';
import { projectsAPI, modelsAPI } from '../../services/api';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    framework: 'django',
    include_docker: false,
    include_cors: true,
    include_rate_limiting: false,
    include_logging: false,
    include_env_example: true,
  });
  
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState({
    name: '',
    description: '',
    display_field: '',
    fields: []
  });

  if (!isOpen) return null;

  const steps = [
    { number: 1, label: 'Project Details', active: currentStep === 1 },
    { number: 2, label: 'Model Definition', active: currentStep === 2 },
    { number: 3, label: 'API Endpoints', active: currentStep === 3 },
    { number: 4, label: 'Review & Create', active: currentStep === 4 },
  ];

  const fieldTypes = [
    { value: 'char', label: 'CharField' },
    { value: 'text', label: 'TextField' },
    { value: 'integer', label: 'IntegerField' },
    { value: 'boolean', label: 'BooleanField' },
    { value: 'date', label: 'DateField' },
    { value: 'datetime', label: 'DateTimeField' },
    { value: 'email', label: 'EmailField' },
    { value: 'url', label: 'URLField' },
    { value: 'image', label: 'ImageField' },
    { value: 'file', label: 'FileField' },
    { value: 'decimal', label: 'DecimalField' },
    { value: 'float', label: 'FloatField' },
    { value: 'json', label: 'JSONField' },
  ];

  const handleProjectDataChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddModel = () => {
    if (currentModel.name.trim()) {
      setModels(prev => [...prev, { 
        ...currentModel, 
        id: Date.now(),
        fields: currentModel.fields.map((field, index) => ({
          ...field,
          order: index
        }))
      }]);
      setCurrentModel({
        name: '',
        description: '',
        display_field: '',
        fields: []
      });
    }
  };

  const handleAddField = (modelIndex) => {
    const newField = {
      name: '',
      field_type: 'char',
      max_length: null,
      null: false,
      blank: false,
      unique: false,
      default_value: '',
      help_text: '',
      order: models[modelIndex].fields.length
    };
    
    const updatedModels = [...models];
    updatedModels[modelIndex].fields.push(newField);
    setModels(updatedModels);
  };

  const handleFieldChange = (modelIndex, fieldIndex, field, value) => {
    const updatedModels = [...models];
    updatedModels[modelIndex].fields[fieldIndex][field] = value;
    setModels(updatedModels);
  };

  const handleRemoveModel = (index) => {
    setModels(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveField = (modelIndex, fieldIndex) => {
    const updatedModels = [...models];
    updatedModels[modelIndex].fields.splice(fieldIndex, 1);
    setModels(updatedModels);
  };

    // src/components/Dashboard/CreateProjectModal.jsx
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // First create the project
      const projectResponse = await projectsAPI.createProject(projectData);
      const projectId = projectResponse.id;

      // Then create models and their fields
      for (const model of models) {
        const modelData = {
          name: model.name,
          description: model.description,
          display_field: model.display_field || 'id', // Default to 'id' if empty
          order: models.indexOf(model)
        };

        try {
          const modelResponse = await modelsAPI.createModel(projectId, modelData);
          const modelId = modelResponse.id;

          // Create fields for this model
          for (const field of model.fields) {
            const fieldData = {
              name: field.name,
              field_type: field.field_type,
              max_length: field.max_length || null,
              null: field.null || false,
              blank: field.blank || false,
              unique: field.unique || false,
              default_value: field.default_value || '',
              help_text: field.help_text || '',
              order: field.order || 0
            };

            // Remove null values
            Object.keys(fieldData).forEach(key => {
              if (fieldData[key] === null || fieldData[key] === undefined) {
                delete fieldData[key];
              }
            });

            await modelsAPI.createField(projectId, modelId, fieldData);
          }
        } catch (modelError) {
          console.error(`Error creating model ${model.name}:`, modelError);
          throw new Error(`Failed to create model: ${model.name}`);
        }
      }

      onProjectCreated(projectResponse);
      resetForm();
      
    } catch (err) {
      console.error('Error creating project:', err);
      const errorMessage = err.response?.data 
        ? JSON.stringify(err.response.data)
        : err.message || 'Failed to create project';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setProjectData({
      name: '',
      description: '',
      framework: 'django',
      include_docker: false,
      include_cors: true,
      include_rate_limiting: false,
      include_logging: false,
      include_env_example: true,
    });
    setModels([]);
    setCurrentModel({
      name: '',
      description: '',
      display_field: '',
      fields: []
    });
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto glassmorphism rounded-xl shadow-lg border border-white/10">
        <div className="p-8">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold font-heading text-white mb-2">Create New Project</h2>
            <p className="text-gray-400">Follow the steps to set up your new API project.</p>
            
            {/* Progress Steps */}
            <div className="mt-6">
              <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center w-full">
                    <div className="text-center flex-1">
                      <div className="relative mb-2">
                        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                          step.active 
                            ? 'bg-primary text-white' 
                            : 'bg-black/30 text-gray-400 shadow-neumorphic-inset'
                        }`}>
                          {step.number}
                        </div>
                      </div>
                      <p className={step.active ? 'text-white' : 'text-gray-400'}>{step.label}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 h-0.5 bg-gray-700/50"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Form Content */}
          <div className="space-y-10">
            {/* Step 1: Project Details */}
            {currentStep === 1 && (
              <section className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <label className="flex flex-col gap-2">
                    <p className="text-base font-medium leading-normal">Project Name</p>
                    <input 
                      value={projectData.name}
                      onChange={(e) => handleProjectDataChange('name', e.target.value)}
                      className="w-full rounded-lg text-white bg-black/30 border-none h-14 placeholder:text-gray-500 p-4 text-base font-normal shadow-neumorphic-inset focus:ring-2 focus:ring-primary transition-all" 
                      placeholder="e.g., E-commerce API"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <p className="text-base font-medium leading-normal">Framework</p>
                    <div className="relative">
                      <select
                        value={projectData.framework}
                        onChange={(e) => handleProjectDataChange('framework', e.target.value)}
                        className="appearance-none w-full rounded-lg text-white bg-black/30 border-none h-14 p-4 text-base font-normal shadow-neumorphic-inset focus:ring-2 focus:ring-primary transition-all pr-10"
                      >
                        <option value="django">Django + DRF</option>
                        <option value="express">Express.js + Sequelize</option>
                        <option value="flask">Flask + SQLAlchemy</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">expand_more</span>
                    </div>
                  </label>
                  <label className="flex flex-col gap-2 md:col-span-2">
                    <p className="text-base font-medium leading-normal">Description</p>
                    <textarea 
                      value={projectData.description}
                      onChange={(e) => handleProjectDataChange('description', e.target.value)}
                      className="w-full rounded-lg text-white bg-black/30 border-none min-h-24 placeholder:text-gray-500 p-4 text-base font-normal shadow-neumorphic-inset focus:ring-2 focus:ring-primary transition-all" 
                      placeholder="Enter a short description for your project..."
                    ></textarea>
                  </label>
                </div>

                {/* Boilerplate Options */}
                <div className="border-t border-white/10 pt-8">
                  <h3 className="text-xl font-bold text-white mb-6">Boilerplate Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { key: 'include_docker', label: 'Docker Configuration', description: 'Add Dockerfile and docker-compose.yml' },
                      { key: 'include_cors', label: 'CORS Support', description: 'Enable Cross-Origin Resource Sharing' },
                      { key: 'include_rate_limiting', label: 'Rate Limiting', description: 'Add API rate limiting middleware' },
                      { key: 'include_logging', label: 'Structured Logging', description: 'Add comprehensive logging setup' },
                      { key: 'include_env_example', label: 'Environment Example', description: 'Include .env.example file' },
                    ].map((option) => (
                      <label key={option.key} className="flex items-start gap-3 p-4 rounded-lg bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={projectData[option.key]}
                          onChange={(e) => handleProjectDataChange(option.key, e.target.checked)}
                          className="mt-1 rounded border-gray-600 bg-black/30 text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="text-white font-medium">{option.label}</p>
                          <p className="text-gray-400 text-sm">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Step 2: Model Definition */}
            {currentStep === 2 && (
              <section className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Database Models</h3>
                  <button
                    onClick={handleAddModel}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Model
                  </button>
                </div>

                {/* Current Model Form */}
                <div className="glassmorphism rounded-xl p-6 space-y-6">
                  <h4 className="text-lg font-semibold text-white">Add New Model</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col gap-2">
                      <p className="text-base font-medium leading-normal">Model Name</p>
                      <input 
                        value={currentModel.name}
                        onChange={(e) => setCurrentModel(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-lg text-white bg-black/30 border-none h-12 placeholder:text-gray-500 p-4 text-base font-normal shadow-neumorphic-inset focus:ring-2 focus:ring-primary transition-all" 
                        placeholder="e.g., User, Product"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <p className="text-base font-medium leading-normal">Display Field</p>
                      <input 
                        value={currentModel.display_field}
                        onChange={(e) => setCurrentModel(prev => ({ ...prev, display_field: e.target.value }))}
                        className="w-full rounded-lg text-white bg-black/30 border-none h-12 placeholder:text-gray-500 p-4 text-base font-normal shadow-neumorphic-inset focus:ring-2 focus:ring-primary transition-all" 
                        placeholder="e.g., username, title"
                      />
                    </label>
                    <label className="flex flex-col gap-2 md:col-span-2">
                      <p className="text-base font-medium leading-normal">Description</p>
                      <textarea 
                        value={currentModel.description}
                        onChange={(e) => setCurrentModel(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full rounded-lg text-white bg-black/30 border-none min-h-20 placeholder:text-gray-500 p-4 text-base font-normal shadow-neumorphic-inset focus:ring-2 focus:ring-primary transition-all" 
                        placeholder="Model description..."
                      ></textarea>
                    </label>
                  </div>
                  <button
                    onClick={handleAddModel}
                    disabled={!currentModel.name.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">save</span>
                    Save Model
                  </button>
                </div>

                {/* Existing Models */}
                {models.map((model, modelIndex) => (
                  <div key={model.id} className="glassmorphism rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold text-white">{model.name}</h4>
                      <button
                        onClick={() => handleRemoveModel(modelIndex)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    
                    {model.description && (
                      <p className="text-gray-400">{model.description}</p>
                    )}

                    {/* Fields for this model */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium text-white">Fields</h5>
                        <button
                          onClick={() => handleAddField(modelIndex)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                          Add Field
                        </button>
                      </div>

                      {model.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-black/20 rounded-lg">
                          <div className="md:col-span-3">
                            <label className="text-sm text-gray-400">Field Name</label>
                            <input
                              value={field.name}
                              onChange={(e) => handleFieldChange(modelIndex, fieldIndex, 'name', e.target.value)}
                              className="w-full rounded text-white bg-black/30 border-none h-10 p-2 text-sm shadow-neumorphic-inset focus:ring-1 focus:ring-primary"
                              placeholder="field_name"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="text-sm text-gray-400">Type</label>
                            <select
                              value={field.field_type}
                              onChange={(e) => handleFieldChange(modelIndex, fieldIndex, 'field_type', e.target.value)}
                              className="w-full rounded text-white bg-black/30 border-none h-10 p-2 text-sm shadow-neumorphic-inset focus:ring-1 focus:ring-primary"
                            >
                              {fieldTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-sm text-gray-400">Max Length</label>
                            <input
                              type="number"
                              value={field.max_length || ''}
                              onChange={(e) => handleFieldChange(modelIndex, fieldIndex, 'max_length', e.target.value ? parseInt(e.target.value) : null)}
                              className="w-full rounded text-white bg-black/30 border-none h-10 p-2 text-sm shadow-neumorphic-inset focus:ring-1 focus:ring-primary"
                              placeholder="255"
                            />
                          </div>

                          <div className="md:col-span-3">
                            <label className="text-sm text-gray-400">Default Value</label>
                            <input
                              value={field.default_value}
                              onChange={(e) => handleFieldChange(modelIndex, fieldIndex, 'default_value', e.target.value)}
                              className="w-full rounded text-white bg-black/30 border-none h-10 p-2 text-sm shadow-neumorphic-inset focus:ring-1 focus:ring-primary"
                              placeholder="default value"
                            />
                          </div>

                          <div className="md:col-span-2 flex gap-2">
                            <label className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={field.null}
                                onChange={(e) => handleFieldChange(modelIndex, fieldIndex, 'null', e.target.checked)}
                                className="rounded border-gray-600 bg-black/30 text-primary focus:ring-primary"
                              />
                              <span className="text-xs text-gray-400">Null</span>
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={field.blank}
                                onChange={(e) => handleFieldChange(modelIndex, fieldIndex, 'blank', e.target.checked)}
                                className="rounded border-gray-600 bg-black/30 text-primary focus:ring-primary"
                              />
                              <span className="text-xs text-gray-400">Blank</span>
                            </label>
                            <button
                              onClick={() => handleRemoveField(modelIndex, fieldIndex)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Step 3: API Endpoints (Auto-generated preview) */}
            {currentStep === 3 && (
              <section className="space-y-8">
                <h3 className="text-xl font-bold text-white">Generated API Endpoints</h3>
                <p className="text-gray-400">
                  Based on your models, the following API endpoints will be automatically generated:
                </p>

                <div className="space-y-4">
                  {models.map((model) => (
                    <div key={model.name} className="glassmorphism rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">{model.name} API</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">GET</span>
                            <code className="text-sm text-white">/api/{model.name.toLowerCase()}s/</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">POST</span>
                            <code className="text-sm text-white">/api/{model.name.toLowerCase()}s/</code>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-mono">GET</span>
                            <code className="text-sm text-white">/api/{model.name.toLowerCase()}s/&#123;id&#125;/</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-mono">PUT</span>
                            <code className="text-sm text-white">/api/{model.name.toLowerCase()}s/&#123;id&#125;/</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-mono">DELETE</span>
                            <code className="text-sm text-white">/api/{model.name.toLowerCase()}s/&#123;id&#125;/</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Step 4: Review & Create */}
            {currentStep === 4 && (
              <section className="space-y-8">
                <h3 className="text-xl font-bold text-white">Review Project</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Project Details */}
                  <div className="glassmorphism rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Project Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">Name</p>
                        <p className="text-white">{projectData.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Framework</p>
                        <p className="text-white">
                          {projectData.framework === 'django' ? 'Django + DRF' :
                           projectData.framework === 'express' ? 'Express.js + Sequelize' :
                           'Flask + SQLAlchemy'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Description</p>
                        <p className="text-white">{projectData.description || 'No description'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Boilerplate Features</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {Object.entries(projectData).filter(([key, value]) => key.startsWith('include_') && value).map(([key]) => (
                            <span key={key} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                              {key.replace('include_', '').replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Models Summary */}
                  <div className="glassmorphism rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Database Models</h4>
                    <div className="space-y-3">
                      {models.map((model) => (
                        <div key={model.name} className="border-l-2 border-primary pl-3">
                          <p className="text-white font-medium">{model.name}</p>
                          <p className="text-gray-400 text-sm">
                            {model.fields.length} fields
                            {model.display_field && ` • Display: ${model.display_field}`}
                          </p>
                        </div>
                      ))}
                      {models.length === 0 && (
                        <p className="text-gray-400">No models defined</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* API Summary */}
                <div className="glassmorphism rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Generated API</h4>
                  <p className="text-gray-400 mb-4">
                    Total endpoints to be generated: {models.length * 5}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {models.map((model) => (
                      <div key={model.name} className="text-center p-4 bg-black/20 rounded-lg">
                        <p className="text-white font-medium">{model.name}</p>
                        <p className="text-gray-400 text-sm">5 endpoints</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between items-center pt-8 mt-8 border-t border-white/10">
            <button 
              onClick={handleClose}
              disabled={loading}
              className="flex items-center justify-center rounded-lg h-12 px-6 bg-white/10 text-white text-sm font-bold shadow-neumorphic-outset hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <div className="flex gap-4">
              {currentStep > 1 && (
                <button 
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={loading}
                  className="flex items-center justify-center rounded-lg h-12 px-6 bg-white/10 text-white text-sm font-bold shadow-neumorphic-outset hover:bg-white/20 transition-colors gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  <span>Previous</span>
                </button>
              )}
              <button 
                onClick={() => {
                  if (currentStep < 4) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    handleSubmit();
                  }
                }}
                disabled={(currentStep === 1 && !projectData.name.trim()) || loading}
                className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-sm font-bold shadow-neumorphic-outset hover:bg-primary/90 transition-colors gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>
                      {currentStep === 4 
                        ? 'Create Project' 
                        : `Next: ${steps[currentStep]?.label}`
                      }
                    </span>
                    {currentStep < 4 && <span className="material-symbols-outlined">arrow_forward</span>}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;