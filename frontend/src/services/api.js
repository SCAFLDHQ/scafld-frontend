// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  // Google OAuth methods
  getGoogleConfig: async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/google/config/`);
    return response.data;
  },

  googleLogin: async (googleToken) => {
    const response = await axios.post(`${API_BASE_URL}/auth/google/`, {
      token: googleToken,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/token/refresh/', { refresh: refreshToken });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  getDetailedProfile: async () => {
    const response = await api.get('/auth/profile/detailed/');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.patch('/auth/profile/', userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password/', passwordData);
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email/', { token });
    return response.data;
  },

  getGitHubConfig: async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/github/config/`);
    return response.data;
  },

  githubCallback: async (code, state = '') => {
    const payload = { code };
    if (state) {
      payload.state = state;
    }
    const response = await axios.post(`${API_BASE_URL}/auth/github/callback/`, payload);
    return response.data;
  },

  getGitHubStatus: async () => {
    const response = await api.get('/auth/github/status/');
    return response.data;
  },

  disconnectGitHub: async () => {
    const response = await api.delete('/auth/github/disconnect/');
    return response.data;
  },

  getGitHubRepositories: async () => {
    const response = await api.get('/auth/github/repositories/');
    return response.data;
  },
};

// Add GitHub project operations
export const githubAPI = {
  cloneToGitHub: async (projectId, data) => {
    const response = await api.post(`/projects/${projectId}/clone-to-github/`, data);
    return response.data;
  },
};

// Projects API calls
export const projectsAPI = {
  getProjects: async () => {
    const response = await api.get('/projects/');
    return response.data;
  },

  getProject: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects/', projectData);
    return response.data;
  },

  updateProject: async (projectId, projectData) => {
    const response = await api.patch(`/projects/${projectId}/`, projectData);
    return response.data;
  },

  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}/`);
    return response.data;
  },

  generate: async (projectId) => {
    const response = await api.post(`/projects/${projectId}/generate/`, {}, {
      responseType: 'blob'
    });
    return response.data;
  },
};

// Models API calls
export const modelsAPI = {
  getModels: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/models/`);
    return response.data;
  },

  createModel: async (projectId, modelData) => {
    const response = await api.post(`/projects/${projectId}/models/`, modelData);
    return response.data;
  },

  updateModel: async (projectId, modelId, modelData) => {
    const response = await api.patch(`/projects/${projectId}/models/${modelId}/`, modelData);
    return response.data;
  },

  deleteModel: async (projectId, modelId) => {
    const response = await api.delete(`/projects/${projectId}/models/${modelId}/`);
    return response.data;
  },

  createField: async (projectId, modelId, fieldData) => {
    const response = await api.post(`/projects/${projectId}/models/${modelId}/fields/`, fieldData);
    return response.data;
  },

  updateField: async (projectId, modelId, fieldId, fieldData) => {
    const response = await api.patch(`/projects/${projectId}/models/${modelId}/fields/${fieldId}/`, fieldData);
    return response.data;
  },

  deleteField: async (projectId, modelId, fieldId) => {
    const response = await api.delete(`/projects/${projectId}/models/${modelId}/fields/${fieldId}/`);
    return response.data;
  },
};

// Views API calls
export const viewsAPI = {
  getViews: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/views/`);
    return response.data;
  },

  createView: async (projectId, viewData) => {
    const response = await api.post(`/projects/${projectId}/views/`, viewData);
    return response.data;
  },

  updateView: async (projectId, viewId, viewData) => {
    const response = await api.patch(`/projects/${projectId}/views/${viewId}/`, viewData);
    return response.data;
  },

  deleteView: async (projectId, viewId) => {
    const response = await api.delete(`/projects/${projectId}/views/${viewId}/`);
    return response.data;
  },
};

// URLs API calls
export const urlsAPI = {
  getUrls: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/urls/`);
    return response.data;
  },

  createUrl: async (projectId, urlData) => {
    const response = await api.post(`/projects/${projectId}/urls/`, urlData);
    return response.data;
  },

  updateUrl: async (projectId, urlId, urlData) => {
    const response = await api.patch(`/projects/${projectId}/urls/${urlId}/`, urlData);
    return response.data;
  },

  deleteUrl: async (projectId, urlId) => {
    const response = await api.delete(`/projects/${projectId}/urls/${urlId}/`);
    return response.data;
  },
};

// Environment Variables API calls
export const envVarsAPI = {
  getEnvVars: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/env-vars/`);
    return response.data;
  },

  createEnvVar: async (projectId, envVarData) => {
    const response = await api.post(`/projects/${projectId}/env-vars/`, envVarData);
    return response.data;
  },

  updateEnvVar: async (projectId, envVarId, envVarData) => {
    const response = await api.patch(`/projects/${projectId}/env-vars/${envVarId}/`, envVarData);
    return response.data;
  },

  deleteEnvVar: async (projectId, envVarId) => {
    const response = await api.delete(`/projects/${projectId}/env-vars/${envVarId}/`);
    return response.data;
  },
};

// Templates API calls
export const templatesAPI = {
  getTemplates: async () => {
    const response = await api.get('/templates/');
    return response.data;
  },

  getTemplate: async (templateId) => {
    const response = await api.get(`/templates/${templateId}/`);
    return response.data;
  },

  useTemplate: async (templateId, projectData = {}) => {
    const response = await api.post(`/templates/${templateId}/use_template/`, projectData);
    return response.data;
  },
};

export const creditsAPI = {
  getCreditStats: () => api.get('/auth/credits/stats/'),
  getCreditPackages: () => api.get('/auth/credits/packages/'),
  getSubscriptionTiers: () => api.get('/auth/subscription/tiers/'),
  upgradeSubscription: (tier) => api.post('/auth/credits/purchase/initiate/', {
    custom_credits: getCreditsForTier(tier)
  }),
  purchaseCredits: (packageId) => api.post('/auth/credits/purchase/initiate/', {
    credit_package_id: packageId
  }),
  purchaseCustomCredits: (credits) => api.post('/auth/credits/purchase/initiate/', {
    custom_credits: credits
  }),
  verifyPayment: (reference, transactionId = null) => {
    const params = { reference };
    if (transactionId) {
      params.transaction_id = transactionId;
    }
    return api.get('/auth/credits/purchase/verify/', { params });
  },
  getPaymentHistory: () => api.get('/auth/credits/purchase/history/'),
};

const getCreditsForTier = (tier) => {
  const tierCredits = {
    'free': 100,
    'pro': 500,
    'team': 1000,
    'enterprise': 2000
  };
  return tierCredits[tier] || 100;
};

export const subscriptionAPI = {
  getTiers: () => api.get('/auth/subscription/tiers/'),
  subscribeTo: (tierId) => api.post('/auth/subscription/subscribe/', { tier_id: tierId }),
  upgradeTier: (tier) => {
    return api.post('/auth/subscription/upgrade/', { tier });
  }
};

// PDP (Project Definition Protocol) API calls
export const pdpAPI = {
  // Project Definition operations
  getProjects: async () => {
    const response = await api.get('/pdp/projects/');
    return response.data;
  },

  getProject: async (projectId) => {
    const response = await api.get(`/pdp/projects/${projectId}/`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/pdp/projects/', projectData);
    return response.data;
  },

  updateProject: async (projectId, projectData) => {
    const response = await api.patch(`/pdp/projects/${projectId}/`, projectData);
    return response.data;
  },

  deleteProject: async (projectId) => {
    const response = await api.delete(`/pdp/projects/${projectId}/`);
    return response.data;
  },

  // PDP Schema operations (Universal Contract)
  exportPDP: async (projectId) => {
    const response = await api.get(`/pdp/projects/${projectId}/export_pdp/`);
    return response.data;
  },

  importPDP: async (pdpData) => {
    const response = await api.post('/pdp/projects/import_pdp/', { pdp_json: pdpData });
    return response.data;
  },

  validateSchema: async (projectId) => {
    const response = await api.post(`/pdp/projects/${projectId}/validate_schema/`);
    return response.data;
  },

  // Data Models operations
  getModels: async (projectId) => {
    const response = await api.get(`/pdp/projects/${projectId}/models/`);
    return response.data;
  },

  createModel: async (projectId, modelData) => {
    const response = await api.post(`/pdp/projects/${projectId}/models/`, modelData);
    return response.data;
  },

  updateModel: async (projectId, modelId, modelData) => {
    const response = await api.patch(`/pdp/projects/${projectId}/models/${modelId}/`, modelData);
    return response.data;
  },

  deleteModel: async (projectId, modelId) => {
    const response = await api.delete(`/pdp/projects/${projectId}/models/${modelId}/`);
    return response.data;
  },

  // Data Fields operations
  createField: async (projectId, modelId, fieldData) => {
    const response = await api.post(`/pdp/projects/${projectId}/models/${modelId}/fields/`, fieldData);
    return response.data;
  },

  updateField: async (projectId, modelId, fieldId, fieldData) => {
    const response = await api.patch(`/pdp/projects/${projectId}/models/${modelId}/fields/${fieldId}/`, fieldData);
    return response.data;
  },

  deleteField: async (projectId, modelId, fieldId) => {
    const response = await api.delete(`/pdp/projects/${projectId}/models/${modelId}/fields/${fieldId}/`);
    return response.data;
  },

  // Relationships operations
  createRelationship: async (projectId, modelId, relationshipData) => {
    const response = await api.post(`/pdp/projects/${projectId}/models/${modelId}/relationships/`, relationshipData);
    return response.data;
  },

  updateRelationship: async (projectId, modelId, relationshipId, relationshipData) => {
    const response = await api.patch(`/pdp/projects/${projectId}/models/${modelId}/relationships/${relationshipId}/`, relationshipData);
    return response.data;
  },

  deleteRelationship: async (projectId, modelId, relationshipId) => {
    const response = await api.delete(`/pdp/projects/${projectId}/models/${modelId}/relationships/${relationshipId}/`);
    return response.data;
  },

  // Endpoints operations
  getEndpoints: async (projectId) => {
    const response = await api.get(`/pdp/projects/${projectId}/endpoints/`);
    return response.data;
  },

  createEndpoint: async (projectId, endpointData) => {
    const response = await api.post(`/pdp/projects/${projectId}/endpoints/`, endpointData);
    return response.data;
  },

  updateEndpoint: async (projectId, endpointId, endpointData) => {
    const response = await api.patch(`/pdp/projects/${projectId}/endpoints/${endpointId}/`, endpointData);
    return response.data;
  },

  deleteEndpoint: async (projectId, endpointId) => {
    const response = await api.delete(`/pdp/projects/${projectId}/endpoints/${endpointId}/`);
    return response.data;
  },

  // Configuration operations
  getConfigs: async (projectId) => {
    const response = await api.get(`/pdp/projects/${projectId}/configs/`);
    return response.data;
  },

  createConfig: async (projectId, configData) => {
    const response = await api.post(`/pdp/projects/${projectId}/configs/`, configData);
    return response.data;
  },

  updateConfig: async (projectId, configId, configData) => {
    const response = await api.patch(`/pdp/projects/${projectId}/configs/${configId}/`, configData);
    return response.data;
  },

  deleteConfig: async (projectId, configId) => {
    const response = await api.delete(`/pdp/projects/${projectId}/configs/${configId}/`);
    return response.data;
  },

  // AI Agent operations (Intelligence Input)
  getAIContext: async (projectId) => {
    const response = await api.get(`/ai/${projectId}/ai_context/`);
    return response.data;
  },

  requestAISuggestion: async (projectId, prompt) => {
    const response = await api.post(`/ai/${projectId}/ai_suggest/`, {
      prompt
    });
    return response.data;
  },

  applyAISuggestion: async (projectId, suggestion) => {
    const response = await api.post(`/ai/${projectId}/ai_apply/`, {
      suggestion
    });
    return response.data;
  },

  // Blumber/Deployment operations (Infra Contract)
  generateDeploymentConfig: async (projectId) => {
    const response = await api.get(`/pdp/projects/${projectId}/deployment_config/`);
    return response.data;
  },

  deployToBlumber: async (projectId, deploymentOptions) => {
    const response = await api.post(`/pdp/projects/${projectId}/deploy/`, deploymentOptions);
    return response.data;
  },

  getDeploymentStatus: async (projectId, deploymentId) => {
    const response = await api.get(`/pdp/projects/${projectId}/deployment/${deploymentId}/status/`);
    return response.data;
  }
};

export default api;