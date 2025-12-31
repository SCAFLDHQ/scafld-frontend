const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  setTokens(access, refresh) {
    this.token = access;
    this.refreshToken = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);

      // Handle token refresh on 401
      if (response.status === 401 && this.refreshToken) {
        try {
          const refreshResponse = await this.refreshAccessToken();
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            this.setTokens(refreshData.access, refreshData.refresh);
            config.headers.Authorization = `Bearer ${refreshData.access}`;
            return fetch(url, config);
          }
        } catch (refreshError) {
          this.clearTokens();
          window.location.href = '/login';
          throw new Error('Session expired');
        }
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async refreshAccessToken() {
    return fetch(`${this.baseURL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: this.refreshToken,
      }),
    });
  }

  // Authentication methods
  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response;
  }

  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password2: userData.confirmPassword,
        first_name: userData.firstName || '',
        last_name: userData.lastName || ''
      }),
    });
    return response;
  }

  async getProfile() {
    const response = await this.request('/auth/profile/');
    return response;
  }

  // OAuth methods
  async googleOAuth(token) {
    const response = await fetch(`${this.baseURL}/auth/google/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    return response;
  }

  async getGoogleOAuthConfig() {
    const response = await this.request('/auth/google/config/');
    return response;
  }

  async githubOAuth(code) {
    const response = await fetch(`${this.baseURL}/auth/github/callback/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    return response;
  }

  async getGitHubOAuthConfig() {
    const response = await this.request('/auth/github/config/');
    return response;
  }

  // Credits and subscription methods
  async getCreditStats() {
    const response = await this.request('/auth/credits/stats/');
    return response;
  }

  async getSubscriptionTiers() {
    const response = await this.request('/auth/subscription/tiers/');
    return response;
  }

  // Project methods
  async getProjects() {
    const response = await this.request('/scaffolder/projects/');
    return response;
  }

  async getProject(id) {
    const response = await this.request(`/scaffolder/projects/${id}/`);
    return response;
  }

  async createProject(projectData) {
    const response = await this.request('/scaffolder/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
    return response;
  }

  async updateProject(id, projectData) {
    const response = await this.request(`/scaffolder/projects/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    });
    return response;
  }

  async deleteProject(id) {
    const response = await this.request(`/scaffolder/projects/${id}/`, {
      method: 'DELETE'
    });
    return response;
  }

  async generateProject(id) {
    const response = await this.request(`/scaffolder/projects/${id}/generate/`, {
      method: 'POST'
    });
    return response;
  }

  async getGenerationCost(id) {
    const response = await this.request(`/scaffolder/projects/${id}/generation_cost/`);
    return response;
  }

  // Template methods
  async getTemplates() {
    const response = await this.request('/scaffolder/templates/');
    return response;
  }

  async useTemplate(templateId, projectData) {
    const response = await this.request(`/scaffolder/templates/${templateId}/use_template/`, {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
    return response;
  }
}

export default new ApiService();
