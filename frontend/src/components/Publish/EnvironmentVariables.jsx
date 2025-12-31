import React, { useState, useEffect } from 'react';
import { envVarsAPI } from '../../services/api';

const EnvironmentVariables = ({ projectId }) => {
  const [envVars, setEnvVars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVar, setEditingVar] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    variable_type: 'string',
    description: '',
    is_required: false,
    default_value: '',
    is_secret: false
  });

  // Fetch environment variables
  useEffect(() => {
    if (projectId) {
      fetchEnvVars();
    }
  }, [projectId]);

  const fetchEnvVars = async () => {
    try {
      setLoading(true);
      console.log('Fetching env vars for projectId:', projectId);
      const data = await envVarsAPI.getEnvVars(projectId);
      console.log('API response data:', data);
      console.log('API response type:', typeof data);
      console.log('API response keys:', data ? Object.keys(data) : 'null/undefined');
      // Handle paginated response from Django REST framework
      const safeData = Array.isArray(data) ? data : (data && data.results ? data.results : []);
      console.log('Setting envVars to:', safeData);
      setEnvVars(safeData);
      setError(null);
    } catch (err) {
      console.error('Error fetching environment variables:', err);
      setError('Failed to load environment variables');
      setEnvVars([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      key: '',
      value: '',
      variable_type: 'string',
      description: '',
      is_required: false,
      default_value: '',
      is_secret: false
    });
    setEditingVar(null);
    setShowAddForm(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleEdit = (envVar) => {
    // FIX: When editing a secret variable, do NOT populate the 'value' field with the masked value ('••••••••').
    // This forces the user to re-enter the value or leave it blank to keep the existing secret.
    const initialValue = envVar.is_secret ? '' : envVar.value;

    setFormData({
      key: envVar.key,
      value: initialValue, // Use the actual value or empty string for secrets
      variable_type: envVar.variable_type,
      description: envVar.description,
      is_required: envVar.is_required,
      default_value: envVar.default_value,
      is_secret: envVar.is_secret
    });
    setEditingVar(envVar);
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a mutable copy of the form data
    let dataToSubmit = { ...formData };

    // FIX: If it's an edit of a secret and the value is empty, remove the value key
    // from the submission payload so the backend doesn't overwrite the secret with an empty string.
    if (editingVar && editingVar.is_secret && dataToSubmit.value === '') {
        delete dataToSubmit.value;
    }

    console.log('Submitting data:', dataToSubmit);

    try {
      if (editingVar) {
        console.log('Updating env var:', editingVar.id);
        await envVarsAPI.updateEnvVar(projectId, editingVar.id, dataToSubmit);
      } else {
        console.log('Creating new env var');
        await envVarsAPI.createEnvVar(projectId, dataToSubmit);
      }
      console.log('Refetching env vars after submit...');
      await fetchEnvVars();
      resetForm();
      alert(editingVar ? 'Environment variable updated successfully!' : 'Environment variable added successfully!');
    } catch (err) {
      console.error('Error saving environment variable:', err);
      alert('Failed to save environment variable. Please try again.');
    }
  };

  const handleDelete = async (envVarId) => {
    if (!window.confirm('Are you sure you want to delete this environment variable?')) {
      return;
    }
    try {
      await envVarsAPI.deleteEnvVar(projectId, envVarId);
      await fetchEnvVars();
      alert('Environment variable deleted successfully!');
    } catch (err) {
      console.error('Error deleting environment variable:', err);
      alert('Failed to delete environment variable. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="glassmorphism rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Environment Variables</h2>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glassmorphism rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Environment Variables</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchEnvVars}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glassmorphism rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Environment Variables</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Variable
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6 glassmorphism rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingVar ? 'Edit Environment Variable' : 'Add Environment Variable'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Key</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => handleInputChange('key', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                <select
                  value={formData.variable_type}
                  onChange={(e) => handleInputChange('variable_type', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Value
                {editingVar && editingVar.is_secret && formData.value === '' && (
                    <span className="text-yellow-400 ml-2 text-xs">(Leave blank to keep current secret)</span>
                )}
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Default Value</label>
                <input
                  type="text"
                  value={formData.default_value}
                  onChange={(e) => handleInputChange('default_value', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.is_required}
                    onChange={(e) => handleInputChange('is_required', e.target.checked)}
                    className="rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
                  />
                  Required
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.is_secret}
                    onChange={(e) => handleInputChange('is_secret', e.target.checked)}
                    className="rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
                  />
                  Secret
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingVar ? 'Update' : 'Add'} Variable
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Environment Variables List */}
      <div className="space-y-4">
        {envVars.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No environment variables configured yet.</p>
            <button
              onClick={handleAdd}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Your First Variable
            </button>
          </div>
        ) : (
          envVars.map((envVar) => (
            <div key={envVar.id} className="glassmorphism rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{envVar.key}</h3>
                    <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                      {envVar.variable_type}
                    </span>
                    {envVar.is_required && (
                      <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">
                        Required
                      </span>
                    )}
                    {envVar.is_secret && (
                      <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                        Secret
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 mb-2">
                    Value: {envVar.is_secret ? '••••••••' : envVar.value || 'Not set'}
                  </p>
                  {envVar.description && (
                    <p className="text-gray-400 text-sm">{envVar.description}</p>
                  )}
                  {envVar.default_value && (
                    <p className="text-gray-400 text-sm">Default: {envVar.default_value}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(envVar)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(envVar.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EnvironmentVariables;
