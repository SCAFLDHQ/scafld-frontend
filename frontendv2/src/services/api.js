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
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    };

    if (this.token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      let response = await fetch(url, config);

      if (response.status === 401 && this.refreshToken) {
        try {
          const refreshRes = await fetch(`${this.baseURL}/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: this.refreshToken }),
          });
          if (refreshRes.ok) {
            const { access, refresh } = await refreshRes.json();
            this.setTokens(access, refresh);
            config.headers.Authorization = `Bearer ${access}`;
            response = await fetch(url, config);
          } else {
            this.clearTokens();
            window.location.href = '/login';
            throw new Error('Session expired');
          }
        } catch {
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

  // ── Auth ──────────────────────────────────────────────────────────────────

  async login(email, password) {
    return fetch(`${this.baseURL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return fetch(`${this.baseURL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password2: userData.confirmPassword,
        first_name: userData.firstName || '',
        last_name: userData.lastName || '',
      }),
    });
  }

  async logout() {
    return this.request('/auth/logout/', { method: 'POST' });
  }

  async getProfile() {
    return this.request('/auth/profile/');
  }

  async updateProfile(data) {
    return this.request('/auth/profile/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ── OAuth ─────────────────────────────────────────────────────────────────

  async googleOAuth(token) {
    return fetch(`${this.baseURL}/auth/google/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  }

  async getGoogleOAuthConfig() {
    return fetch(`${this.baseURL}/auth/google/config/`);
  }

  async githubOAuth(code) {
    return fetch(`${this.baseURL}/auth/github/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
  }

  async getGitHubOAuthConfig() {
    return fetch(`${this.baseURL}/auth/github/config/`);
  }

  async githubStatus() {
    return this.request('/auth/github/status/');
  }

  async githubConnect(code) {
    return this.request('/auth/github/connect/', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // ── Projects ──────────────────────────────────────────────────────────────

  async getProjects() {
    return this.request('/core/projects/');
  }

  async getProject(id) {
    return this.request(`/core/projects/${id}/`);
  }

  async createProject(data) {
    return this.request('/core/projects/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id, data) {
    return this.request(`/core/projects/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id) {
    return this.request(`/core/projects/${id}/`, { method: 'DELETE' });
  }

  async initiatePayment(tier, callback_url) {
    return this.request('/billing/payment/initiate/', {
      method: 'POST',
      body: JSON.stringify({ tier, callback_url }),
    });
  }

  async initiatePackPurchase(pack, callback_url) {
    return this.request('/billing/pack/initiate/', {
      method: 'POST',
      body: JSON.stringify({ pack, callback_url }),
    });
  }

  async verifyPayment(reference) {
    return this.request(`/billing/payment/verify/?reference=${reference}`);
  }

  async changePassword(old_password, new_password) {
    return this.request('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify({ old_password, new_password, new_password2: new_password }),
    });
  }

  async deleteAccount(password) {
    return this.request('/auth/delete-account/', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  }

  async getApiKey() {
    return this.request('/auth/api-key/');
  }

  async generateApiKey() {
    return this.request('/auth/api-key/', { method: 'POST' });
  }

  async revokeApiKey() {
    return this.request('/auth/api-key/', { method: 'DELETE' });
  }

  async requestPasswordReset(email) {
    return fetch(`${this.baseURL}/auth/password-reset/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  }

  async confirmPasswordReset(token, new_password) {
    return fetch(`${this.baseURL}/auth/password-reset/confirm/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password }),
    });
  }

  // ── Canvas / IR ───────────────────────────────────────────────────────────

  async getProjectIR(id) {
    return this.request(`/core/projects/${id}/ir/`);
  }

  async getProjectModels(projectId) {
    return this.request(`/core/models/?project=${projectId}`);
  }

  async createModel(data) {
    return this.request('/core/models/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteModel(id) {
    return this.request(`/core/models/${id}/`, { method: 'DELETE' });
  }

  async createField(data) {
    return this.request('/core/fields/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateField(id, data) {
    return this.request(`/core/fields/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteField(id) {
    return this.request(`/core/fields/${id}/`, { method: 'DELETE' });
  }

  async createRelationship(data) {
    return this.request('/core/relationships/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteRelationship(id) {
    return this.request(`/core/relationships/${id}/`, { method: 'DELETE' });
  }

  async iterateSchema(projectId, context) {
    return this.request(`/ai/iterate/${projectId}/`, {
      method: 'POST',
      body: JSON.stringify({ context }),
    });
  }

  async updateModelPositions(positions) {
    return this.request('/core/models/update_positions/', {
      method: 'POST',
      body: JSON.stringify({ positions }),
    });
  }

  async createSnapshot(projectId, description = '') {
    return this.request(`/core/projects/${projectId}/snapshot/`, {
      method: 'POST',
      body: JSON.stringify({ description }),
    });
  }

  async getSnapshots(projectId) {
    return this.request(`/core/projects/${projectId}/snapshots/`);
  }

  // ── Collaborators ─────────────────────────────────────────────────────────

  async getCollaborators(projectId) {
    return this.request(`/core/projects/${projectId}/collaborators/`);
  }

  async addCollaborator(projectId, email, role = 'editor') {
    return this.request(`/core/projects/${projectId}/collaborators/`, {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  }

  async removeCollaborator(projectId, userId) {
    return this.request(`/core/projects/${projectId}/collaborators/`, {
      method: 'DELETE',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  // ── Export ────────────────────────────────────────────────────────────────

  async exportProject(id, format = 'json') {
    return this.request(`/core/projects/${id}/export/`, {
      method: 'POST',
      body: JSON.stringify({ format }),
    });
  }

  // ── Code Generation ───────────────────────────────────────────────────────

  async generateCode(id) {
    return this.request(`/core/projects/${id}/generate/`, { method: 'POST' });
  }

  // ── AI Generation ─────────────────────────────────────────────────────────

  async generateWithAI(description, framework = 'django') {
    return this.request('/ai/generate/', {
      method: 'POST',
      body: JSON.stringify({ description, framework }),
    });
  }

  async previewSchema(description, framework = 'django') {
    return this.request('/ai/preview/', {
      method: 'POST',
      body: JSON.stringify({ description, framework }),
    });
  }

  // ── Templates ─────────────────────────────────────────────────────────────

  async getTemplates() {
    // Hardcoded templates — no backend endpoint needed
    const templates = [
      { id: 'saas', name: 'Multi-tenant SaaS', description: 'Users, workspaces, billing, and file uploads', framework: 'django' },
      { id: 'ecommerce', name: 'E-commerce', description: 'Products, orders, cart, payments, and reviews', framework: 'django' },
      { id: 'social', name: 'Social App', description: 'Users, posts, comments, likes, and followers', framework: 'django' },
      { id: 'blog', name: 'Blog Platform', description: 'Authors, posts, categories, tags, and comments', framework: 'django' },
      { id: 'taskapp', name: 'Task Manager', description: 'Users, teams, projects, tasks, and deadlines', framework: 'django' },
      { id: 'marketplace', name: 'Marketplace', description: 'Buyers, sellers, listings, bids, and transactions', framework: 'express' },
    ];
    return new Response(JSON.stringify(templates), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  async useTemplate(templateId, data) {
    // Templates use the AI generate endpoint with the template description
    return this.request('/ai/generate/', {
      method: 'POST',
      body: JSON.stringify({ description: data.description, framework: data.framework || 'django' }),
    });
  }

  // ── Requirements / Architecture ──────────────────────────────────────────

  async generateRequirements(projectId) {
    return this.request(`/ai/requirements/${projectId}/`, { method: 'POST' });
  }

  async generateArchitecture(projectId) {
    return this.request(`/ai/architecture/${projectId}/`, { method: 'POST' });
  }

  // ── GitHub Push ───────────────────────────────────────────────────────────

  async githubPush(projectId, { repo_name, private: isPrivate, description }) {
    return this.request(`/core/projects/${projectId}/github-push/`, {
      method: 'POST',
      body: JSON.stringify({ repo_name, private: isPrivate, description }),
    });
  }

  // ── MCP ───────────────────────────────────────────────────────────────────

  async getMCPSchema(projectId) {
    return this.request(`/mcp/schema/?project=${projectId}`);
  }
}

export default new ApiService();
