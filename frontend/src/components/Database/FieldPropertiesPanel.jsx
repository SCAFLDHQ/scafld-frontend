import { useState, useEffect } from 'react';

const FieldPropertiesPanel = ({ isOpen, onClose, selectedField, onSaveField, isNewField = false, modelId }) => {
  const [fieldData, setFieldData] = useState({
    name: '',
    field_type: 'char', // Use 'char' instead of 'CharField'
    max_length: null,
    null: false,
    blank: false,
    unique: false,
    default_value: '',
    help_text: '',
    order: 0,
  });

  const fieldTypes = [
    { value: 'char', label: 'CharField' },
    { value: 'text', label: 'TextField' },
    { value: 'integer', label: 'IntegerField' },
    { value: 'boolean', label: 'BooleanField' },
    { value: 'date', label: 'DateField' },
    { value: 'datetime', label: 'DateTimeField' },
    { value: 'email', label: 'EmailField' },
    { value: 'url', label: 'URLField' },
    { value: 'decimal', label: 'DecimalField' },
    { value: 'float', label: 'FloatField' },
    { value: 'json', label: 'JSONField' },
  ];

  // In FieldPropertiesPanel, update the useEffect:
useEffect(() => {
  if (selectedField) {
    setFieldData({
      name: selectedField.name || '',
      field_type: selectedField.field_type || 'char', // Ensure correct value
      max_length: selectedField.max_length || null,
      null: selectedField.null || false,
      blank: selectedField.blank || false,
      unique: selectedField.unique || false,
      default_value: selectedField.default_value || '',
      help_text: selectedField.help_text || '',
      order: selectedField.order || 0,
    });
  } else if (isNewField) {
    setFieldData({
      name: '',
      field_type: 'char', // Default to 'char'
      max_length: null,
      null: false,
      blank: false,
      unique: false,
      default_value: '',
      help_text: '',
      order: 0,
    });
  }
}, [selectedField, isNewField]);

  // In FieldPropertiesPanel.jsx, update the handleSave function:
const handleSave = () => {
  // Ensure we have all required fields with proper values
  const completeFieldData = {
    name: fieldData.name.trim(),
    field_type: fieldData.field_type,
    max_length: fieldData.max_length ? parseInt(fieldData.max_length) : null, // Ensure it's a number
    null: Boolean(fieldData.null),
    blank: Boolean(fieldData.blank),
    unique: Boolean(fieldData.unique),
    default_value: fieldData.default_value || '',
    help_text: fieldData.help_text || '',
    order: fieldData.order || 0
  };

  console.log('💾 Saving field data:', completeFieldData);
  console.log('📊 Max length details:', {
    original: fieldData.max_length,
    parsed: completeFieldData.max_length,
    type: typeof completeFieldData.max_length
  });

  if (onSaveField) {
    onSaveField(completeFieldData, modelId);
  }
  onClose();
};

  const generateCodePreview = () => {
    const { name, field_type, max_length, null: isNull, blank, unique, default_value } = fieldData;
    
    let code = `${name} = models.${field_type}(`;
    const options = [];
    
    if (field_type === 'CharField' && max_length) {
      options.push(`max_length=${max_length}`);
    }
    if (isNull) options.push('null=True');
    if (blank) options.push('blank=True');
    if (unique) options.push('unique=True');
    if (default_value) {
      const defaultVal = field_type === 'BooleanField' ? default_value : `'${default_value}'`;
      options.push(`default=${defaultVal}`);
    }
    
    code += options.join(', ') + ')';
    return code;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-full max-w-md transform translate-x-0 transition-transform duration-300 ease-in-out z-50">
      <div className="glassmorphism-panel h-full w-full flex flex-col text-white">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold font-display">
              {isNewField ? 'Add New Field' : `Field: ${selectedField?.name}`}
            </h2>
            <p className="text-sm text-primary-text">
              {isNewField ? 'Create a new field for your model' : 'Configure the properties of your field'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Basic Properties */}
          <div>
            <h3 className="text-lg font-semibold font-display mb-4 text-white">Basic Properties</h3>
            <div className="space-y-4">
              <label className="flex flex-col">
                <p className="text-primary-text text-sm font-medium pb-2">Field Name</p>
                <input 
                  value={fieldData.name}
                  onChange={(e) => setFieldData({...fieldData, name: e.target.value})}
                  className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary border-0 neumorphic-inset-select h-12 p-3 text-base font-normal leading-normal placeholder:text-gray-500"
                  placeholder="e.g., username, email"
                />
              </label>
              
              <label className="flex flex-col">
                <p className="text-primary-text text-sm font-medium pb-2">Field Type</p>
                <select 
                  value={fieldData.field_type}
                  onChange={(e) => setFieldData({...fieldData, field_type: e.target.value})}
                  className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary border-0 neumorphic-inset-select h-12 p-3 text-base font-normal leading-normal appearance-none bg-no-repeat bg-right pr-10"
                >
                  {fieldTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </label>

            {fieldData.field_type === 'char' && (
              <label className="flex flex-col">
                <p className="text-primary-text text-sm font-medium pb-2">Max Length</p>
                <input 
                  type="number"
                  min="1"
                  max="255"
                  value={fieldData.max_length || ''}
                  onChange={(e) => setFieldData({
                    ...fieldData, 
                    max_length: e.target.value ? parseInt(e.target.value) : null
                  })}
                  className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary border-0 neumorphic-inset-select h-12 p-3 text-base font-normal leading-normal placeholder:text-gray-500"
                  placeholder="255"
                />
                <p className="text-gray-400 text-xs mt-1">
                  Maximum length for this character field (1-255)
                </p>
              </label>
            )}
            </div>
          </div>

          {/* Constraints */}
          <div>
            <h3 className="text-lg font-semibold font-display mb-4 text-white">Constraints</h3>
            <div className="space-y-4 bg-black/20 rounded-lg p-4">
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-white/5 rounded">
                <p className="text-primary-text text-base font-normal">Allow Null</p>
                <input 
                  type="checkbox"
                  checked={fieldData.null}
                  onChange={(e) => setFieldData({...fieldData, null: e.target.checked})}
                  className="h-5 w-10 rounded-full appearance-none bg-[#2e1835] neumorphic-raised transition-colors duration-300 ease-in-out checked:bg-primary"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-white/5 rounded">
                <p className="text-primary-text text-base font-normal">Allow Blank</p>
                <input 
                  type="checkbox"
                  checked={fieldData.blank}
                  onChange={(e) => setFieldData({...fieldData, blank: e.target.checked})}
                  className="h-5 w-10 rounded-full appearance-none bg-[#2e1835] neumorphic-raised transition-colors duration-300 ease-in-out checked:bg-primary"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-white/5 rounded">
                <p className="text-primary-text text-base font-normal">Unique</p>
                <input 
                  type="checkbox"
                  checked={fieldData.unique}
                  onChange={(e) => setFieldData({...fieldData, unique: e.target.checked})}
                  className="h-5 w-10 rounded-full appearance-none bg-[#2e1835] neumorphic-raised transition-colors duration-300 ease-in-out checked:bg-primary"
                />
              </label>
              
              <label className="flex flex-col pt-2">
                <p className="text-primary-text text-sm font-medium pb-2">Default Value</p>
                <input 
                  value={fieldData.default_value}
                  onChange={(e) => setFieldData({...fieldData, default_value: e.target.value})}
                  className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary border-0 neumorphic-inset-select h-12 p-3 text-base font-normal leading-normal placeholder:text-gray-500"
                  placeholder="Enter default value"
                />
              </label>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold font-display mb-4 text-white">Additional Information</h3>
            <div className="space-y-4">
              <label className="flex flex-col">
                <p className="text-primary-text text-sm font-medium pb-2">Help Text</p>
                <textarea 
                  value={fieldData.help_text}
                  onChange={(e) => setFieldData({...fieldData, help_text: e.target.value})}
                  className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary border-0 neumorphic-inset-select h-20 p-3 text-base font-normal leading-normal placeholder:text-gray-500"
                  placeholder="User-facing help text..."
                ></textarea>
              </label>
            </div>
          </div>
        </div>

        {/* Code Preview */}
        <div className="p-6 border-t border-white/10">
          <h3 className="text-lg font-semibold font-display mb-4 text-white">Generated Code Preview</h3>
          <div className="bg-[#110914] p-4 rounded-lg border border-gray-700">
            <pre><code className="font-mono text-sm text-primary-text">
              {generateCodePreview()}
            </code></pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-white/10">
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={!fieldData.name.trim()}
              className="flex-1 py-3 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isNewField ? 'Add Field' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldPropertiesPanel;