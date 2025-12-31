import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { projectsAPI, modelsAPI } from '../services/api';
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';
import EmptyState from '../components/Database/EmptyState';
import VisualBuilder from '../components/Database/VisualBuilder';
import FieldPropertiesPanel from '../components/Database/FieldPropertiesPanel';

const Database = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [isNewField, setIsNewField] = useState(false);
  const [currentModelId, setCurrentModelId] = useState(null);
  const [relationships, setRelationships] = useState([]); 
  
  // Fetch project and models data
  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const navigate = useNavigate();

  // In your Database.jsx, update the fetchProjectData function
  const fetchProjectData = async () => {
    try {
      setLoading(true);
      // Fetch project details
      const projectData = await projectsAPI.getProject(projectId);
      setProject(projectData);
      
      // Fetch models for this project
      const modelsData = await modelsAPI.getModels(projectId);
      const modelsWithRelationships = (modelsData.results || modelsData).map(model => ({
        ...model,
        fields: (model.fields || []).map(field => ({
          ...field,
          // Convert relationship_data to relationship for frontend compatibility
          relationship: field.relationship_data || null
        }))
      }));
      
      setModels(modelsWithRelationships);
      
      // Recreate relationships from field data and store them
      const loadedRelationships = recreateRelationshipsFromFieldData(modelsWithRelationships);
      setRelationships(loadedRelationships); // Store relationships in state
      
      console.log('🔄 Loaded relationships:', loadedRelationships.length);
      
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const recreateRelationshipsFromFieldData = (models) => {
    const relationships = [];
    
    console.log('🔄 Recreating relationships from field data...');
    
    models.forEach(model => {
      model.fields?.forEach(field => {
        if (field.relationship_data) {
          const relData = field.relationship_data;
          const fromModel = model;
          const toModel = models.find(m => m.name === relData.references?.model);
          
          console.log('📋 Found relationship data:', {
            fromModel: fromModel.name,
            field: field.name,
            toModel: relData.references?.model,
            toField: relData.references?.field,
            relationshipType: relData.relationshipType
          });
          
          if (toModel) {
            const toField = toModel.fields?.find(f => f.name === relData.references?.field);
            
            if (toField) {
              // Calculate field indices safely
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
              console.log('✅ Recreated relationship:', relationship);
            } else {
              console.warn('⚠️ Could not find toField:', relData.references?.field);
            }
          } else {
            console.warn('⚠️ Could not find toModel:', relData.references?.model);
          }
        }
      });
    });
    
    console.log(`🎯 Total relationships recreated: ${relationships.length}`);
    return relationships;
  };


  // In your Database.jsx, update the handleAddModel function:
const handleAddModel = async () => {
  try {
    // Find the next available model number
    const usedNames = models.map(model => model.name);
    let modelNumber = 1;
    let newName = `Model${modelNumber}`;
    
    // Find the next available model name
    while (usedNames.includes(newName)) {
      modelNumber++;
      newName = `Model${modelNumber}`;
    }

    const newModelData = {
      name: newName,
      description: "",
      display_field: "id",
      order: models.length
    };

    console.log('🔧 Creating model with data:', newModelData);

    const createdModel = await modelsAPI.createModel(projectId, newModelData);
    console.log('✅ Model created successfully:', createdModel);
    
    setModels(prev => [...prev, createdModel]);
  } catch (err) {
    console.error('Error creating model:', err);
    setError('Failed to create model');
  }
};

  const handleDeleteModel = async (modelId) => {
    try {
      await modelsAPI.deleteModel(projectId, modelId);
      setModels(prev => prev.filter(model => model.id !== modelId));
    } catch (err) {
      console.error('Error deleting model:', err);
      setError('Failed to delete model');
    }
  };

  const handleGenerateCode = () => {
    navigate(`/project/${projectId}/publish`);
  };

  const handlePublish = () => {
    console.log("Publish clicked");
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

  const handleModelUpdate = async (modelId, updateData) => {
    try {
      console.log('🔄 handleModelUpdate CALLED!', { modelId, updateData });
      console.log('📋 Current projectId:', projectId);
      
      const updatedModel = await modelsAPI.updateModel(projectId, modelId, updateData);
      console.log('✅ Model updated successfully:', updatedModel);
      
      // Update local state
      setModels(prev => {
        const newModels = prev.map(model => 
          model.id === modelId ? { ...model, ...updatedModel } : model
        );
        console.log('📋 Local state updated:', newModels);
        return newModels;
      });
      
    } catch (err) {
      console.error('❌ Error in handleModelUpdate:', err);
      console.error('❌ Error response:', err.response?.data);
      setError(`Failed to update model: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
      throw err;
    }
  };

  const handleSaveField = async (fieldData, modelId) => {
    try {
      console.log('💾 handleSaveField called:', { fieldData, modelId, isNewField });
      
      // Only send the fields that the backend expects
      const fieldDataForBackend = {
        name: fieldData.name,
        field_type: fieldData.field_type,
        max_length: fieldData.max_length,
        null: fieldData.null || false,
        blank: fieldData.blank || false,
        unique: fieldData.unique || false,
        primary_key: fieldData.primary_key || false,
        default_value: fieldData.default_value || '',
        help_text: fieldData.help_text || '',
        order: fieldData.order || 0,
        relationship_data: fieldData.relationship || null  // Send relationship data
      };
      
      if (isNewField) {
        const createdField = await modelsAPI.createField(projectId, modelId, fieldDataForBackend);
        console.log('✅ Field created successfully:', createdField);
        
        setModels(prev => prev.map(model => 
          model.id === modelId 
            ? { 
                ...model, 
                fields: [...(model.fields || []), createdField] 
              }
            : model
        ));
      } else {
        // Update existing field - only send the fields we want to update
        const updateData = {
          name: fieldData.name,
          field_type: fieldData.field_type,
          max_length: fieldData.max_length,
          null: fieldData.null || false,
          blank: fieldData.blank || false,
          unique: fieldData.unique || false,
          primary_key: fieldData.primary_key || false,
          default_value: fieldData.default_value || '',
          help_text: fieldData.help_text || '',
          relationship_data: fieldData.relationship || null
        };
        
        const updatedField = await modelsAPI.updateField(projectId, modelId, selectedField.id, updateData);
        console.log('✅ Field updated successfully:', updatedField);
        
        setModels(prev => prev.map(model => ({
          ...model,
          fields: (model.fields || []).map(field => 
            field.id === selectedField.id ? { ...field, ...updatedField } : field
          )
        })));
      }
    } catch (err) {
      console.error('❌ Error saving field:', err);
      console.error('❌ Error response:', err.response?.data);
      setError(`Failed to save field: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
    } finally {
      setIsPropertiesPanelOpen(false);
      setSelectedField(null);
      setIsNewField(false);
      setCurrentModelId(null);
    }
  };

  const handleClosePropertiesPanel = () => {
    setIsPropertiesPanelOpen(false);
    setSelectedField(null);
    setIsNewField(false);
    setCurrentModelId(null);
  };

  // Transform backend models to frontend format
  const transformModelsForVisualBuilder = () => {
    return models.map(model => ({
      id: model.id,
      name: model.name,
      description: model.description,
      fields: model.fields || [],
      created_at: model.created_at,
      updated_at: model.updated_at
    }));
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
        <Sidebar onPublish={handlePublish} activeTab="database" />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
        <Sidebar onPublish={handlePublish} activeTab="database" />
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

  const hasModels = models.length > 0;
  const visualBuilderModels = transformModelsForVisualBuilder();

  return (
    <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
      <Sidebar onPublish={handlePublish} activeTab="database" />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8 flex-shrink-0">
          <Breadcrumbs 
            projectName={project?.name || "Project"} 
            currentPage="Database" 
            projectId={projectId} 
          />
        </div>
        
        <div className="flex-1 overflow-hidden">
          {!hasModels ? (
            <EmptyState onAddModel={handleAddModel} />
          ) : (
            <VisualBuilder
              models={visualBuilderModels}
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

export default Database;