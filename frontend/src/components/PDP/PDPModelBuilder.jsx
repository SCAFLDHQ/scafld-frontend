import { useState, useEffect } from 'react';
import { pdpAPI } from '../../services/api';

const PDPModelBuilder = ({ projectId, onModelCreated, onModelUpdated }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    description: '',
    table_name: '',
    display_field: 'id'
  });

  useEffect(() => {
    if (projectId) {
      fetchModels();
    }
  }, [projectId]);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await pdpAPI.getModels(projectId);
      setModels(response.results || response);
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModel = async () => {
    try {
      const createdModel = await pdpAPI.createModel(projectId, newModel);
      setModels(prev => [...prev, createdModel]);
      setShowCreateModal(false);
      setNewModel({ name: '', description: '', table_name: '', display_field: 'id' });
      onModelCreated?.(createdModel);
    } catch (error) {
      console.error('Failed to create model:', error);
    }
  };

  const handleDeleteModel = async (modelId) => {
    try {
      await pdpAPI.deleteModel(projectId, modelId);
      setModels(prev => prev.filter(m => m.id !== modelId));
    } catch (error) {
      console.error('Failed to delete model:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-background-light rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-primary-text">Data Models</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Add Model
        </button>
      </div>

      <div className="grid gap-4">
        {models.map((model) => (
          <div key={model.id} className="p-4 bg-background-light rounded-lg border border-border-color">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-primary-text">{model.name}</h4>
                <p className="text-sm text-secondary-text">{model.description || 'No description'}</p>
                <p className="text-xs text-secondary-text mt-1">
                  {model.fields?.length || 0} fields
                </p>
              </div>
              <button
                onClick={() => handleDeleteModel(model.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {models.length === 0 && (
        <div className="text-center py-8 text-secondary-text">
          <p>No models created yet.</p>
          <p className="text-sm">Click "Add Model" to get started.</p>
        </div>
      )}

      {/* Create Model Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background-light rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-primary-text mb-4">Create New Model</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-text mb-1">Name</label>
                <input
                  type="text"
                  value={newModel.name}
                  onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-background-dark text-primary-text rounded-lg border border-border-color"
                  placeholder="e.g., User, Product, Order"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary-text mb-1">Description</label>
                <textarea
                  value={newModel.description}
                  onChange={(e) => setNewModel(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 bg-background-dark text-primary-text rounded-lg border border-border-color"
                  rows="3"
                  placeholder="Describe what this model represents..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-secondary-text hover:text-primary-text"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateModel}
                disabled={!newModel.name.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                Create Model
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDPModelBuilder;