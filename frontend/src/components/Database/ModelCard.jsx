// src/components/Database/ModelCard.jsx
import { useState, useCallback } from 'react';

const ModelCard = ({ 
  model, 
  position = { x: 100, y: 100 }, 
  onFieldClick, 
  onAddField,
  onFieldClickForRelationship,
  onModelSelect,
  onModelUpdate,
  isRelationshipMode = false,
  isSelected = false,
  zoom = 1,
  onPositionChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(model.name);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(position);

  const fieldTypeMap = {
    'char': 'String',
    'text': 'Text',
    'integer': 'Integer',
    'boolean': 'Boolean',
    'date': 'Date',
    'datetime': 'DateTime',
    'email': 'Email',
    'url': 'URL',
    'decimal': 'Decimal',
    'float': 'Float',
    'json': 'JSON',
  };

  const fieldTypeColors = {
    'Integer': 'bg-indigo-500/20 text-indigo-300',
    'String': 'bg-sky-500/20 text-sky-300',
    'Text': 'bg-blue-500/20 text-blue-300',
    'Boolean': 'bg-purple-500/20 text-purple-300',
    'DateTime': 'bg-teal-500/20 text-teal-300',
    'Email': 'bg-orange-500/20 text-orange-300',
    'URL': 'bg-amber-500/20 text-amber-300',
    'Decimal': 'bg-green-500/20 text-green-300',
    'Float': 'bg-emerald-500/20 text-emerald-300',
    'JSON': 'bg-pink-500/20 text-pink-300',
  };

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y
    });
  }, [currentPosition]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    const newPosition = { x: newX, y: newY };
    setCurrentPosition(newPosition);
    
    if (onPositionChange) {
      onPositionChange(model.id, newPosition);
    }
  }, [isDragging, dragOffset, model.id, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFieldClick = useCallback((field) => {
    if (isRelationshipMode && onFieldClickForRelationship) {
      onFieldClickForRelationship(field, model.id);
    } else if (onFieldClick) {
      onFieldClick(field);
    }
  }, [isRelationshipMode, onFieldClickForRelationship, onFieldClick, model.id]);

  const handleModelClick = useCallback((e) => {
    e.stopPropagation();
    
    // Don't select model if we're in relationship mode
    if (isRelationshipMode) {
      return;
    }
    
    if (onModelSelect) {
      onModelSelect(model.id);
    }
  }, [onModelSelect, model.id, isRelationshipMode]);

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditedName(model.name);
  }, [model.name]);

  const handleNameChange = useCallback((e) => {
    setEditedName(e.target.value);
  }, []);

  // In ModelCard.jsx, update the handleNameSave function:
const handleNameSave = useCallback(async () => {
  console.log('💾 handleNameSave called:', { editedName, currentName: model.name });
  
  if (editedName.trim() && editedName !== model.name) {
    if (onModelUpdate) {
      console.log('📤 Calling onModelUpdate...');
      try {
        await onModelUpdate(model.id, { name: editedName.trim() });
        console.log('✅ onModelUpdate completed successfully');
      } catch (error) {
        console.error('❌ onModelUpdate failed:', error);
        setEditedName(model.name); // Revert on error
      }
    } else {
      console.warn('⚠️ onModelUpdate prop is not provided!');
    }
  } else {
    console.log('🔄 No changes or empty name, reverting');
    setEditedName(model.name); // Revert if empty or same
  }
  setIsEditing(false);
}, [editedName, model.id, model.name, onModelUpdate]);

  // FIXED: Proper keyboard event handling
  const handleInputKeyDown = useCallback((e) => {
    // Stop propagation to prevent VisualBuilder from capturing these events
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditedName(model.name);
      setIsEditing(false);
    }
    // Allow Backspace/Delete to work normally for text editing
  }, [handleNameSave, model.name]);

  const handleInputFocus = useCallback((e) => {
    // Stop propagation when input is focused
    e.stopPropagation();
  }, []);

  const handleInputClick = useCallback((e) => {
    // Stop click propagation when clicking the input
    e.stopPropagation();
  }, []);

  const handleBlur = useCallback(() => {
    handleNameSave();
  }, [handleNameSave]);

  return (
    <div 
      className={`absolute w-64 rounded-xl bg-accent-dark shadow-neumorphic p-4 font-body transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${isRelationshipMode ? 'ring-2 ring-primary/50' : 'ring-2 ring-transparent'} ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      style={{ 
        top: currentPosition.y, 
        left: currentPosition.x,
        transform: `scale(${zoom}) ${isDragging ? 'scale(1.02)' : 'scale(1)'}`,
        zIndex: isDragging ? 1000 : 1,
        transformOrigin: 'top left'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleModelClick}
      onDoubleClick={handleDoubleClick}
    >
      <div 
        className="flex justify-between items-center pb-3 border-b border-gray-700/50 mb-3 cursor-move"
        onMouseDown={handleMouseDown}
      >
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={handleNameChange}
            onKeyDown={handleInputKeyDown} // FIXED: Use onKeyDown with proper handler
            onBlur={handleBlur}
            onClick={handleInputClick}
            onFocus={handleInputFocus}
            className="flex-1 bg-transparent text-white font-display font-semibold text-lg border-b border-primary focus:outline-none focus:border-primary px-1"
            autoFocus
          />
        ) : (
          <h3 className="font-display font-semibold text-lg text-white">{model.name}</h3>
        )}
        <span className="material-symbols-outlined text-gray-500">drag_indicator</span>
      </div>
      
      <div className="space-y-2">
        {model.fields?.map((field, index) => (
          <div 
            key={field.id || index}
            className={`flex justify-between items-center text-sm cursor-pointer p-2 rounded transition-all duration-200 group ${
              isRelationshipMode 
                ? 'hover:bg-primary/20 hover:ring-1 hover:ring-primary/50' 
                : 'hover:bg-white/5'
            }`}
            onClick={() => handleFieldClick(field)}
          >
            <div className="flex items-center gap-2">
              <span className={`group-hover:text-white ${
                isRelationshipMode ? 'text-primary font-medium' : 'text-primary-text'
              }`}>
                {field.name}
              </span>
              {field.unique && (
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1 rounded">U</span>
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              fieldTypeColors[fieldTypeMap[field.field_type]] || 'bg-gray-500/20 text-gray-300'
            }`}>
              {fieldTypeMap[field.field_type] || field.field_type}
              {field.field_type === 'char' && field.max_length && `(${field.max_length})`}
            </span>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => onAddField(model.id)}
        className="mt-4 w-full text-center py-2 text-sm text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/80 rounded-lg transition-colors flex items-center justify-center gap-1"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        Add Field
      </button>
    </div>
  );
};

export default ModelCard;