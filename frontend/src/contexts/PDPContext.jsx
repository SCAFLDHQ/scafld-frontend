import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { pdpAPI } from '../services/api';

const PDPContext = createContext();

// PDP State Management
const initialState = {
  currentProject: null,
  projects: [],
  models: [],
  endpoints: [],
  configs: [],
  pdpSchema: null,
  loading: false,
  error: null,
  validationStatus: null
};

const pdpReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload, loading: false };
    
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload, loading: false };
    
    case 'SET_MODELS':
      return { ...state, models: action.payload };
    
    case 'ADD_MODEL':
      return { ...state, models: [...state.models, action.payload] };
    
    case 'UPDATE_MODEL':
      return {
        ...state,
        models: state.models.map(model =>
          model.id === action.payload.id ? action.payload : model
        )
      };
    
    case 'DELETE_MODEL':
      return {
        ...state,
        models: state.models.filter(model => model.id !== action.payload)
      };
    
    case 'SET_ENDPOINTS':
      return { ...state, endpoints: action.payload };
    
    case 'ADD_ENDPOINT':
      return { ...state, endpoints: [...state.endpoints, action.payload] };
    
    case 'UPDATE_ENDPOINT':
      return {
        ...state,
        endpoints: state.endpoints.map(endpoint =>
          endpoint.id === action.payload.id ? action.payload : endpoint
        )
      };
    
    case 'DELETE_ENDPOINT':
      return {
        ...state,
        endpoints: state.endpoints.filter(endpoint => endpoint.id !== action.payload)
      };
    
    case 'SET_CONFIGS':
      return { ...state, configs: action.payload };
    
    case 'SET_PDP_SCHEMA':
      return { ...state, pdpSchema: action.payload };
    
    case 'SET_VALIDATION_STATUS':
      return { ...state, validationStatus: action.payload };
    
    default:
      return state;
  }
};

export const PDPProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pdpReducer, initialState);

  // Project Operations
  const loadProjects = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const projects = await pdpAPI.getProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const loadProject = useCallback(async (projectId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const project = await pdpAPI.getProject(projectId);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
      
      // Load related data
      const [models, endpoints, configs] = await Promise.all([
        pdpAPI.getModels(projectId),
        pdpAPI.getEndpoints(projectId),
        pdpAPI.getConfigs(projectId)
      ]);
      
      dispatch({ type: 'SET_MODELS', payload: models });
      dispatch({ type: 'SET_ENDPOINTS', payload: endpoints });
      dispatch({ type: 'SET_CONFIGS', payload: configs });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const createProject = useCallback(async (projectData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newProject = await pdpAPI.createProject(projectData);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject });
      await loadProjects(); // Refresh projects list
      return newProject;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [loadProjects]);

  const updateProject = useCallback(async (projectId, projectData) => {
    try {
      const updatedProject = await pdpAPI.updateProject(projectId, projectData);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: updatedProject });
      await loadProjects(); // Refresh projects list
      return updatedProject;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [loadProjects]);

  // Model Operations
  const createModel = useCallback(async (projectId, modelData) => {
    try {
      const newModel = await pdpAPI.createModel(projectId, modelData);
      dispatch({ type: 'ADD_MODEL', payload: newModel });
      return newModel;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const updateModel = useCallback(async (projectId, modelId, modelData) => {
    try {
      const updatedModel = await pdpAPI.updateModel(projectId, modelId, modelData);
      dispatch({ type: 'UPDATE_MODEL', payload: updatedModel });
      return updatedModel;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const deleteModel = useCallback(async (projectId, modelId) => {
    try {
      await pdpAPI.deleteModel(projectId, modelId);
      dispatch({ type: 'DELETE_MODEL', payload: modelId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  // Field Operations
  const createField = useCallback(async (projectId, modelId, fieldData) => {
    try {
      const newField = await pdpAPI.createField(projectId, modelId, fieldData);
      // Reload the model to get updated fields
      await loadProject(projectId);
      return newField;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [loadProject]);

  // Endpoint Operations
  const createEndpoint = useCallback(async (projectId, endpointData) => {
    try {
      const newEndpoint = await pdpAPI.createEndpoint(projectId, endpointData);
      dispatch({ type: 'ADD_ENDPOINT', payload: newEndpoint });
      return newEndpoint;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  // PDP Schema Operations (The Universal Contract)
  const exportPDPSchema = useCallback(async (projectId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const schema = await pdpAPI.exportPDP(projectId);
      dispatch({ type: 'SET_PDP_SCHEMA', payload: schema });
      return schema;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const importPDPSchema = useCallback(async (pdpData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const project = await pdpAPI.importPDP(pdpData);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
      await loadProjects(); // Refresh projects list
      return project;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [loadProjects]);

  const validateSchema = useCallback(async (projectId) => {
    try {
      const validation = await pdpAPI.validateSchema(projectId);
      dispatch({ type: 'SET_VALIDATION_STATUS', payload: validation });
      return validation;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  // Real-time PDP updates for Visual Builder (SSOT)
  const syncPDPChanges = useCallback(async (projectId) => {
    try {
      console.log('🔄 Syncing PDP changes for project:', projectId);

      // Export current PDP schema after any change
      const schema = await exportPDPSchema(projectId);

      // Update the project's PDP schema in the database
      if (state.currentProject) {
        await updateProject(projectId, {
          pdp_schema: schema
        });
        console.log('✅ PDP schema updated in database');
      }

      // Update the local PDP schema state
      dispatch({ type: 'SET_PDP_SCHEMA', payload: schema });

      // Trigger validation after sync
      await validateSchema(projectId);

      return schema;
    } catch (error) {
      console.error('❌ PDP sync failed:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [state.currentProject, exportPDPSchema, updateProject, validateSchema]);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const value = {
    // State
    ...state,
    
    // Project Operations
    loadProjects,
    loadProject,
    createProject,
    updateProject,
    
    // Model Operations
    createModel,
    updateModel,
    deleteModel,
    
    // Field Operations
    createField,
    
    // Endpoint Operations
    createEndpoint,
    
    // PDP Schema Operations (Universal Contract)
    exportPDPSchema,
    importPDPSchema,
    validateSchema,
    syncPDPChanges,
    
    // Utility
    clearError
  };

  return (
    <PDPContext.Provider value={value}>
      {children}
    </PDPContext.Provider>
  );
};

export const usePDP = () => {
  const context = useContext(PDPContext);
  if (!context) {
    throw new Error('usePDP must be used within a PDPProvider');
  }
  return context;
};

export default PDPContext;