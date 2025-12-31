import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pdpAPI } from '../services/api';
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';
import PDPSchemaManager from '../components/PDP/PDPSchemaManager';
import PDPModelBuilder from '../components/PDP/PDPModelBuilder';
import VisualBuilder from '../components/Database/VisualBuilder';
import FieldPropertiesPanel from '../components/Database/FieldPropertiesPanel';

const PDPDatabase = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  
  // Visual builder state
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [isNewField, setIsNewField] = useState(false);
  const [currentModelId, setCurrentModelId] = useState(null);
  const [relationships, setRelationships] = useState([]);

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      
      // Fetch PDP project
      const projectData = await pdpAPI.getProject(projectId);
      setProject(projectData);
      
      // Fetch models
      const modelsData = await pdpAPI.getModels(projectId);
      const modelsArray = modelsData.results || modelsData;
      setModels(modelsArray);
      
      // Recreate relationships from field data
      const loadedRelationships = recreateRelationshipsFromFieldData(modelsArray);
      setRelationships(loadedRelationships);
      
    } catch (err) {
      console.error('Error fetching PDP project data:', err);
      setError('Failed to load PDP project data');
    } finally {
      setLoading(false);
    }
  };

  const recreateRelationshipsFromFieldData = (models) => {
    const relationships = [];
    
    models.forEach(model => {
      model.fields?.forEach(field => {
        if (field.relationship_data) {
          const relData = field.relationship_data;
          const fromModel = model;
          const toModel = models.find(m => m.name === relData.references?.model);
          
          if (toModel) {
            const toField = toModel.fields?.find(f => f.name === relData.references?.field);
            
            if (toField) {
              const fromFieldIndex = fromModel.fields?.findIndex(f => f.id === field.id) || 0;
              const toFieldIndex = toModel.fields?.findIndex(f => f.id === toField.id) || 0;
              
              const relationship = {
                id: `${fromModel.id}-${field.id}-${toModel.id}-${toField.id}`,
                from: {
                  modelId: fromModel.id,
                  fieldName: field.name,
                  fieldType: field.field_type,
                  modelName: fromModel.name,
                  fieldIndex: fromFieldIndex,
                  relativeX: 256,
                  relativeY: 80 + (fromFieldIndex * 40)
                },
                to: {
                  modelId: toModel.id,
                  fieldName: toField.name,
                  fieldType: toField.field_type,
                  modelName: toModel.name,
                  fieldIndex: toFieldIndex,
                  relativeX: 0,
                  relativeY: 80 + (toFieldIndex * 40)
                },
                type: relData.relationshipType || '1:M'
              };
              
              relationships.push(relationship);
            }
          }
        }
      });
    });
    
    return relationships;
  };

  const handleAddModel = async () => {
    try {
      const usedNames = models.map(model => model.name);
      let modelNumber = 1;
      let newName = `Model${modelNumber}`;
      
      while (usedNames.includes(newName)) {
        modelNumber++;
        newName = `Model${modelNumber}`;
      }

      const newModelData = {
        name: newName,
        description: "",
        display_field: "id"
      };

      const createdModel = await pdpAPI.createModel(projectId, newModelData);
      setModels(prev => [...prev, createdModel]);
    } catch (err) {
      console.error('Error creating PDP model:', err);
      setError('Failed to create model');
    }
  };

  const handleDeleteModel = async (modelId) => {
    try {
      await pdpAPI.deleteModel(projectId, modelId);
      setModels(prev => prev.filter(model => model.id !== modelId));
    } catch (err) {
      console.error('Error deleting PDP model:', err);
      setError('Failed to delete model');
    }
  };

  const handleModelUpdate = async (modelId, updateData) => {
    try {
      const updatedModel = await pdpAPI.updateModel(projectId, modelId, updateData);
      setModels(prev => prev.map(model => 
        model.id === modelId ? { ...model, ...updatedModel } : model
      ));
    } catch (err) {
      console.error('Error updating PDP model:', err);
      setError('Failed to update model');
    }
  };

  const handleSaveField = async (fieldData, modelId) => {
    try {
      const fieldDataForBackend = {
        name: fieldData.name,
        field_type: fieldData.field_type,
        max_length: fieldData.max_length,
        is_required: fieldData.is_required || false,
        is_unique: fieldData.is_unique || false,
        is_primary_key: fieldData.is_primary_key || false,
        default_value: fieldData.default_value || '',
        help_text: fieldData.help_text || '',
        order: fieldData.order || 0
      };
      
      if (isNewField) {
        const createdField = await pdpAPI.createField(projectId, modelId, fieldDataForBackend);
        setModels(prev => prev.map(model => 
          model.id === modelId 
            ? { ...model, fields: [...(model.fields || []), createdField] }
            : model
        ));
      } else {
        const updatedField = await pdpAPI.updateField(projectId, modelId, selectedField.id, fieldDataForBackend);
        setModels(prev => prev.map(model => ({
          ...model,
          fields: (model.fields || []).map(field => 
            field.id === selectedField.id ? { ...field, ...updatedField } : field
          )
        })));
      }
    } catch (err) {
      console.error('Error saving PDP field:', err);
      setError('Failed to save field');
    } finally {
      setIsPropertiesPanelOpen(false);
      setSelectedField(null);
      setIsNewField(false);
      setCurrentModelId(null);
    }
  };

  const handleFieldClick = (field) => {
    setSelectedField(field);
    setIsNewField(false);
    setIsPropertiesPanelOpen(true);
  };

  const handleAddField = (modelId) => {
    setSelectedField(null);
    setIsNewField(true);
    setCurrentModelId(modelId);
    setIsPropertiesPanelOpen(true);
  };

  const handleClosePropertiesPanel = () => {
    setIsPropertiesPanelOpen(false);
    setSelectedField(null);
    setIsNewField(false);
    setCurrentModelId(null);
  };

  const handleSchemaImported = (result) => {
    console.log('PDP Schema imported:', result);
    fetchProjectData(); // Refresh data
  };

  const handleValidationComplete = (validation) => {
    setValidationResult(validation);
    console.log('PDP Validation result:', validation);
  };

  const handleGenerateCode = () => {
    navigate(`/project/${projectId}/publish`);
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
        <Sidebar activeTab="database" />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
        <Sidebar activeTab="database" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-xl mb-4">{error}</p>
            <button 
              onClick={fetchProjectData}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
      <Sidebar activeTab="database" />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8 flex-shrink-0">
          <Breadcrumbs 
            projectName={project?.name || "PDP Project"} 
            currentPage="Database (PDP)" 
            projectId={projectId} 
          />
          
          {/* PDP Controls */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-secondary-text">
                Framework: {project?.target_framework || 'django'}
              </span>
              {validationResult && (
                <span className={`text-sm px-2 py-1 rounded ${
                  validationResult.status === 'valid' 
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-red-900 text-red-300'
                }`}>
                  {validationResult.status}
                </span>
              )}
            </div>
            
            <PDPSchemaManager
              projectId={projectId}
              onSchemaImported={handleSchemaImported}
              onValidationComplete={handleValidationComplete}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {models.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-primary-text mb-2">
                  No PDP Models Yet
                </h3>
                <p className="text-secondary-text mb-6">
                  Create your first data model to get started with PDP
                </p>
                <button
                  onClick={handleAddModel}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Create First Model
                </button>
              </div>
            </div>
          ) : (
            <VisualBuilder
              models={models}
              onAddModel={handleAddModel}
              onGenerateCode={handleGenerateCode}
              onFieldClick={handleFieldClick}
              onAddField={handleAddField}
              onDeleteModel={handleDeleteModel}
              onModelUpdate={handleModelUpdate}
              projectId={projectId}
              initialRelationships={relationships}
            />
          )}
        </div>
      </main>

      <FieldPropertiesPanel
        isOpen={isPropertiesPanelOpen}
        onClose={handleClosePropertiesPanel}
        selectedField={selectedField}
        onSaveField={handleSaveField}
        isNewField={isNewField}
        modelId={currentModelId}
      />
    </div>
  );
};

export default PDPDatabase;