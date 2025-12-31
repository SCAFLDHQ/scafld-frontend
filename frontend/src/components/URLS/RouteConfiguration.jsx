import React, { useState, useEffect } from 'react';

const RouteConfiguration = ({ route, onUpdateRoute, onSaveChanges, isNew, availableViews, hasUnsavedChanges }) => {
  const [localRoute, setLocalRoute] = useState(route);
  const [activeTab, setActiveTab] = useState('path');

  useEffect(() => {
    setLocalRoute(route);
  }, [route]);

  const handleFieldChange = (field, value) => {
    const updatedRoute = { ...localRoute, [field]: value };
    setLocalRoute(updatedRoute);
    onUpdateRoute(updatedRoute);
  };

  const handleSaveParameters = async () => {
    setSaving(true);
    try {
      // Save parameters to backend
      // This would need to be implemented with API calls
      console.log('Saving parameters:', parameters);
      // For now, just update the local route
      const updatedRoute = { ...localRoute, parameters };
      onUpdateRoute(updatedRoute);
    } catch (error) {
      console.error('Error saving parameters:', error);
    } finally {
      setSaving(false);
    }
  };

  const navigationItems = [
    { id: 'path', icon: 'route', label: 'Path' },
    { id: 'parameters', icon: 'tune', label: 'Parameters' },
    { id: 'permissions', icon: 'security', label: 'Permissions' },
    { id: 'nested', icon: 'account_tree', label: 'Nested Routes' }
  ];

  const [parameters, setParameters] = useState(route.parameters || []);
  const [saving, setSaving] = useState(false);

  return (
    <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shadow-neumorphic-in bg-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-2xl">route</span>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-white text-lg font-medium leading-normal truncate">Route Configuration</h1>
          <p className="text-text-light/70 text-sm font-normal leading-normal truncate">
            {localRoute.path}
          </p>
          <div className="flex gap-2 mt-1">
            {isNew && (
              <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">New</span>
            )}
            {hasUnsavedChanges && (
              <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">Unsaved Changes</span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-shrink-0">
        {navigationItems.map(item => (
          <button
            key={item.id}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              activeTab === item.id 
                ? 'bg-white/10' 
                : 'hover:bg-white/10'
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className={`material-symbols-outlined text-2xl ${
              activeTab === item.id ? 'text-primary' : 'text-text-light/80'
            }`}>
              {item.icon}
            </span>
            <p className={`text-sm font-medium leading-normal ${
              activeTab === item.id ? 'text-white' : 'text-text-light/80'
            }`}>
              {item.label}
            </p>
          </button>
        ))}
      </nav>

      {/* Configuration Form */}
      <div className="space-y-4 overflow-y-auto flex-1">
        {activeTab === 'path' && (
          <>
            <div>
              <label className="text-text-light/80 text-sm font-medium mb-2 block">Path</label>
              <input
                className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={localRoute.path}
                onChange={(e) => handleFieldChange('path', e.target.value)}
                placeholder="/api/example/"
              />
            </div>

            <div>
              <label className="text-text-light/80 text-sm font-medium mb-2 block">View/Controller</label>
              <select
                className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={localRoute.view}
                onChange={(e) => handleFieldChange('view', e.target.value)}
              >
                <option value="" className="text-black">Select a view</option>
                {availableViews?.map(view => (
                  <option key={view.id} value={view.name} className="text-black">
                    {view.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-text-light/80 text-sm font-medium mb-2 block">Route Name</label>
              <input
                className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={localRoute.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="route_name"
              />
            </div>

            <div>
              <label className="text-text-light/80 text-sm font-medium mb-2 block">Description</label>
              <textarea
                className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                rows="3"
                value={localRoute.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Route description..."
              />
            </div>

            <div>
              <label className="text-text-light/80 text-sm font-medium mb-2 block">Permission Level</label>
              <select
                className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={localRoute.permission}
                onChange={(e) => handleFieldChange('permission', e.target.value)}
              >
                <option value="Public" className="text-black">Public</option>
                <option value="Authenticated" className="text-black">Authenticated</option>
                <option value="Admin Only" className="text-black">Admin Only</option>
              </select>
            </div>

            {/* Advanced Settings */}
            <AdvancedSettings
              route={localRoute}
              onFieldChange={handleFieldChange}
            />
          </>
        )}

        {activeTab === 'parameters' && (
          <ParametersTab
            parameters={parameters}
            onParametersChange={setParameters}
            onSave={handleSaveParameters}
            saving={saving}
          />
        )}

        {activeTab === 'nested' && (
          <NestedRoutesTab />
        )}


      </div>

      {/* Save Button */}
      <div className="flex-shrink-0">
        <button
          onClick={onSaveChanges}
          disabled={!hasUnsavedChanges}
          className={`w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 text-base font-bold leading-normal tracking-[0.015em] shadow-neumorphic-out hover:shadow-neumorphic-in transition-shadow ${
            hasUnsavedChanges 
              ? 'bg-primary text-background-dark' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span className="truncate">
            {isNew ? 'Create Route' : 'Save Changes'}
          </span>
        </button>
      </div>
    </div>
  );
};

const ParametersTab = ({ parameters, onParametersChange, onSave, saving }) => {
  const addParameter = () => {
    const newParam = {
      id: Date.now(),
      name: '',
      type: 'string',
      required: false,
      description: '',
      default: ''
    };
    onParametersChange([...parameters, newParam]);
  };

  const updateParameter = (id, field, value) => {
    const updatedParams = parameters.map(param =>
      param.id === id ? { ...param, [field]: value } : param
    );
    onParametersChange(updatedParams);
  };

  const removeParameter = (id) => {
    onParametersChange(parameters.filter(param => param.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg font-medium">Route Parameters</h3>
        <button
          onClick={addParameter}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Parameter
        </button>
      </div>

      {parameters.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <span className="material-symbols-outlined text-4xl mb-2 block">tune</span>
          <p>No parameters defined yet</p>
          <p className="text-sm">Add parameters to define your route's input requirements</p>
        </div>
      ) : (
        <div className="space-y-3">
          {parameters.map((param) => (
            <div key={param.id} className="p-4 bg-[#2C2C2C] rounded-lg border border-[#4A4A4A]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-text-light/80 text-sm font-medium mb-2 block">Parameter Name</label>
                  <input
                    className="w-full bg-[#1A1A1A] border border-[#4A4A4A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    value={param.name}
                    onChange={(e) => updateParameter(param.id, 'name', e.target.value)}
                    placeholder="param_name"
                  />
                </div>

                <div>
                  <label className="text-text-light/80 text-sm font-medium mb-2 block">Type</label>
                  <select
                    className="w-full bg-[#1A1A1A] border border-[#4A4A4A] rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    value={param.type}
                    onChange={(e) => updateParameter(param.id, 'type', e.target.value)}
                  >
                    <option value="string" className="text-black">String</option>
                    <option value="integer" className="text-black">Integer</option>
                    <option value="boolean" className="text-black">Boolean</option>
                    <option value="float" className="text-black">Float</option>
                    <option value="date" className="text-black">Date</option>
                    <option value="uuid" className="text-black">UUID</option>
                  </select>
                </div>

                <div>
                  <label className="text-text-light/80 text-sm font-medium mb-2 block">Default Value</label>
                  <input
                    className="w-full bg-[#1A1A1A] border border-[#4A4A4A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    value={param.default}
                    onChange={(e) => updateParameter(param.id, 'default', e.target.value)}
                    placeholder="default value"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-text-light/80 text-sm">
                    <input
                      type="checkbox"
                      checked={param.required}
                      onChange={(e) => updateParameter(param.id, 'required', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    Required
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="text-text-light/80 text-sm font-medium mb-2 block">Description</label>
                  <textarea
                    className="w-full bg-[#1A1A1A] border border-[#4A4A4A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                    rows="2"
                    value={param.description}
                    onChange={(e) => updateParameter(param.id, 'description', e.target.value)}
                    placeholder="Parameter description..."
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => removeParameter(param.id)}
                  className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-white/10">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined text-sm">save</span>
          )}
          {saving ? 'Saving...' : 'Save Parameters'}
        </button>
      </div>
    </div>
  );
};

const NestedRoutesTab = () => {
  return (
    <div className="text-center py-8 text-gray-400">
      <span className="material-symbols-outlined text-4xl mb-2 block">account_tree</span>
      <p>Nested routes feature coming soon</p>
      <p className="text-sm">This will allow you to define hierarchical route structures</p>
    </div>
  );
};

const AdvancedSettings = ({ route, onFieldChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details className="flex flex-col rounded-lg bg-white/10 group">
      <summary
        className="flex cursor-pointer items-center justify-between gap-6 p-3 list-none"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <p className="text-white text-sm font-medium leading-normal">Advanced</p>
        <span className={`material-symbols-outlined text-text-light transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`}>
          expand_more
        </span>
      </summary>

      {isOpen && (
        <div className="p-3 border-t border-white/10 space-y-4">
          <div>
            <label className="text-text-light/80 text-sm font-medium mb-2 block">Namespace</label>
            <input
              className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              value={route.namespace}
              onChange={(e) => onFieldChange('namespace', e.target.value)}
              placeholder="e.g., v1"
            />
          </div>
          <div>
            <label className="text-text-light/80 text-sm font-medium mb-2 block">Custom Regex</label>
            <input
              className="w-full bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              value={route.regex}
              onChange={(e) => onFieldChange('regex', e.target.value)}
              placeholder="e.g., [0-9]+"
            />
          </div>
        </div>
      )}
    </details>
  );
};

export default RouteConfiguration;