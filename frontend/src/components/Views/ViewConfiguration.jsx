// ViewConfiguration.jsx
import React, { useState, useEffect } from 'react';

const ViewConfiguration = ({ view, onUpdateView, availableModels, isCreatingNew }) => {
  const [localView, setLocalView] = useState(view);
  const [availableFields, setAvailableFields] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setLocalView(view);
    setHasUnsavedChanges(false);

    // Find the selected model and set available fields
    const model = availableModels.find(m => m.id === view.model);
    setSelectedModel(model);

    if (model && model.fields) {
      // Extract field names from the fields array
      const fieldNames = model.fields.map(field =>
        typeof field === 'string' ? field : field.name || field.field_name
      );
      setAvailableFields(fieldNames);
    } else {
      setAvailableFields([]);
    }
  }, [view, availableModels]);

  const handleFieldChange = (field, value) => {
    const updatedView = { ...localView, [field]: value };
    setLocalView(updatedView);
    setHasUnsavedChanges(true);
  };


  const handlePermissionToggle = (permission) => {
    const permissions = localView.permissions.includes(permission)
      ? localView.permissions.filter(p => p !== permission)
      : [...localView.permissions, permission];
    
    handleFieldChange('permissions', permissions);
  };

  const handleFieldToggle = (field) => {
    const fields = localView.fields.includes(field)
      ? localView.fields.filter(f => f !== field)
      : [...localView.fields, field];
    
    handleFieldChange('fields', fields);
  };

  const handleAddFilter = () => {
    const newFilters = [...localView.filters, "field__lookup"];
    handleFieldChange('filters', newFilters);
  };

  const handleUpdateFilter = (index, value) => {
    const newFilters = [...localView.filters];
    newFilters[index] = value;
    handleFieldChange('filters', newFilters);
  };

  const handleRemoveFilter = (index) => {
    const newFilters = localView.filters.filter((_, i) => i !== index);
    handleFieldChange('filters', newFilters);
  };

  const handleModelChange = (modelId) => {
    const selectedModel = availableModels.find(m => m.id === modelId);
    if (selectedModel) {
      setSelectedModel(selectedModel);

      // Extract field names from the selected model
      const fieldNames = selectedModel.fields?.map(field =>
        typeof field === 'string' ? field : field.name || field.field_name
      ) || [];

      setAvailableFields(fieldNames);

      // Update the view with new model and reset fields
      const updatedView = {
        ...localView,
        model: modelId,
        fields: [], // Reset fields when model changes
        filters: [] // Optionally reset filters too
      };

      setLocalView(updatedView);
      setHasUnsavedChanges(true);
    }
  };

  const handleSelectAllFields = () => {
    handleFieldChange('fields', [...availableFields]);
  };

  const handleClearAllFields = () => {
    handleFieldChange('fields', []);
  };

  const handleSave = () => {
    onUpdateView(localView);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="lg:col-span-1 glassmorphism rounded-xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">View Configuration</h2>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
              Unsaved changes
            </span>
          )}
          {isCreatingNew && (
            <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">New</span>
          )}
        </div>
      </div>
      
      {/* View Name */}
      <label className="flex flex-col w-full">
        <p className="text-sm font-medium leading-normal pb-2 text-gray-300">View Name</p>
        <input 
          className="w-full rounded-lg h-12 p-3 text-sm focus:outline-none bg-[#2C2C2C] border border-[#4A4A4A] text-white focus:border-primary focus:ring-2 focus:ring-primary/30"
          placeholder="e.g., UserProfileDetail" 
          value={localView.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
        />
      </label>

      {/* Model Selection */}
      <label className="flex flex-col w-full">
        <p className="text-sm font-medium leading-normal pb-2 text-gray-300">Model</p>
        <select 
          className="w-full rounded-lg h-12 px-3 text-sm focus:outline-none appearance-none bg-[#2C2C2C] border border-[#4A4A4A] text-white focus:border-primary focus:ring-2 focus:ring-primary/30 bg-no-repeat bg-right pr-10"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%23EAEAEA%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")' }}
          value={localView.model}
          onChange={(e) => handleModelChange(e.target.value)}
        >
          <option value="" className="text-black">Select a model</option>
          {availableModels.map(model => (
            <option key={model.id} value={model.id} className="text-black">
              {model.name}
            </option>
          ))}
        </select>
      </label>

      {/* View Type */}
      <div>
        <p className="text-sm font-medium leading-normal pb-2 text-gray-300">View Type</p>
        <div className="flex h-10 w-full items-center justify-center rounded-lg bg-[#1A1A1A] p-1 neumorphic-inset">
          <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-[:checked]:bg-primary has-[:checked]:text-black text-gray-300 text-sm font-medium leading-normal transition-colors">
            <span className="truncate">List</span>
            <input 
              type="radio" 
              name="view-type" 
              value="List" 
              checked={localView.type === 'List'}
              onChange={(e) => handleFieldChange('type', e.target.value)}
              className="invisible w-0" 
            />
          </label>
          <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-[:checked]:bg-primary has-[:checked]:text-black text-gray-300 text-sm font-medium leading-normal transition-colors">
            <span className="truncate">Detail</span>
            <input 
              type="radio" 
              name="view-type" 
              value="Detail" 
              checked={localView.type === 'Detail'}
              onChange={(e) => handleFieldChange('type', e.target.value)}
              className="invisible w-0" 
            />
          </label>
        </div>
      </div>

      {/* Permissions */}
      <div>
        <p className="text-sm font-medium leading-normal pb-2 text-gray-300">Permissions</p>
        <div className="space-y-2">
          {['IsAuthenticated', 'IsAdminUser', 'AllowAny'].map(permission => (
            <label key={permission} className="flex items-center gap-2 text-sm text-gray-300">
              <input 
                type="checkbox" 
                checked={localView.permissions.includes(permission)}
                onChange={() => handlePermissionToggle(permission)}
                className="rounded bg-[#2C2C2C] border-[#4A4A4A] text-primary focus:ring-primary/50" 
              />
              {permission}
            </label>
          ))}
        </div>
      </div>

      {/* Pagination - Fixed to show for List views */}
      {localView.type === 'List' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-300">Pagination</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={localView.pagination || false}
                onChange={(e) => handleFieldChange('pagination', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-[#2C2C2C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          {localView.pagination && (
            <label className="flex flex-col w-full">
              <p className="text-sm font-medium leading-normal pb-2 text-gray-300">Page Size</p>
              <select 
                className="w-full rounded-lg h-12 px-3 text-sm focus:outline-none bg-[#2C2C2C] border border-[#4A4A4A] text-white focus:border-primary focus:ring-2 focus:ring-primary/30"
                value={localView.pageSize || 20}
                onChange={(e) => handleFieldChange('pageSize', parseInt(e.target.value))}
              >
                <option value={10} className="text-black">10 items</option>
                <option value={20} className="text-black">20 items</option>
                <option value={50} className="text-black">50 items</option>
                <option value={100} className="text-black">100 items</option>
              </select>
            </label>
          )}
        </div>
      )}

      {/* Fields to Include */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-300">Fields to Include</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{localView.fields?.length || 0} selected</span>
            {availableFields.length > 0 && (
              <>
                <button 
                  onClick={handleSelectAllFields}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Select All
                </button>
                <button 
                  onClick={handleClearAllFields}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>
        <div className="p-3 rounded-lg neumorphic-inset space-y-2 max-h-40 overflow-y-auto">
          {availableFields.length > 0 ? (
            availableFields.map(field => (
              <FieldChip 
                key={field}
                field={field}
                selected={localView.fields?.includes(field) || false}
                onToggle={handleFieldToggle}
              />
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center py-2">
              {localView.model ? 'No fields available for this model' : 'Select a model to see fields'}
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium leading-normal text-gray-300">Filters</p>
          <span className="text-xs text-gray-400">{localView.filters?.length || 0} active</span>
        </div>
        <div className="space-y-3">
          {localView.filters?.map((filter, index) => (
            <FilterInput
              key={index}
              value={filter}
              onUpdate={(value) => handleUpdateFilter(index, value)}
              onRemove={() => handleRemoveFilter(index)}
            />
          ))}
          <button
            onClick={handleAddFilter}
            className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Add Filter
          </button>
        </div>
      </div>

      {/* Save Button */}
      {hasUnsavedChanges && (
        <div className="flex justify-end pt-4 border-t border-gray-600">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary hover:bg-primary/80 text-black font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

// Field Chip Component
const FieldChip = ({ field, selected, onToggle }) => (
  <span 
    className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium cursor-pointer transition-colors ${
      selected ? 'bg-primary/20 text-primary' : 'bg-gray-600/20 text-gray-400 hover:bg-gray-500/20'
    }`}
    onClick={() => onToggle(field)}
  >
    {field}
    <span className="ml-1 transition-colors">
      {selected ? '✓' : '+'}
    </span>
  </span>
);

// Filter Input Component
const FilterInput = ({ value, onUpdate, onRemove }) => (
  <div className="flex items-center gap-2 text-sm">
    <input 
      className="w-full rounded-lg h-10 p-2 text-xs bg-[#2C2C2C] border border-[#4A4A4A] text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" 
      value={value}
      onChange={(e) => onUpdate(e.target.value)}
      placeholder="field__lookup"
    />
    <button 
      onClick={onRemove} 
      className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
    >
      <span className="material-symbols-outlined text-sm">delete</span>
    </button>
  </div>
);

export default ViewConfiguration;