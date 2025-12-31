import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI, envVarsAPI } from '../services/api';
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';
import ProjectDetails from '../components/Settings/ProjectDetails';
import FrameworkStack from '../components/Settings/FrameworkStack';
import ApiConfiguration from '../components/Settings/ApiConfiguration';

const Settings = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [settings, setSettings] = useState({
    projectName: '',
    version: '1.0.0',
    description: '',
    backendFramework: 'django',
    database: 'PostgreSQL',
    authentication: 'JWT',
    apiBasePath: '/api/v1',
    pagination: true,
    corsAllowedOrigins: '',
    include_docker: false,
    include_cors: true,
    include_rate_limiting: false,
    include_logging: false,
    include_env_example: true
  });

  const [originalSettings, setOriginalSettings] = useState({ ...settings });

  // Fetch project data
  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const projectData = await projectsAPI.getProject(projectId);
      setProject(projectData);
      
      // Transform backend data to frontend settings format
      const transformedSettings = transformProjectToSettings(projectData);
      setSettings(transformedSettings);
      setOriginalSettings(transformedSettings);
      
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('Failed to load project settings');
    } finally {
      setLoading(false);
    }
  };

  // Transform backend project data to frontend settings format
  const transformProjectToSettings = (projectData) => {
    return {
      projectName: projectData.name || '',
      version: '1.0.0', // You might want to add version to your Project model
      description: projectData.description || '',
      backendFramework: projectData.framework || 'django',
      database: 'PostgreSQL', // You might want to add database to your Project model
      authentication: 'JWT', // You might want to add authentication to your Project model
      apiBasePath: '/api/v1', // You might want to add apiBasePath to your Project model
      pagination: true, // You might want to add pagination to your Project model
      corsAllowedOrigins: '',
      include_docker: projectData.include_docker || false,
      include_cors: projectData.include_cors !== undefined ? projectData.include_cors : true,
      include_rate_limiting: projectData.include_rate_limiting || false,
      include_logging: projectData.include_logging || false,
      include_env_example: projectData.include_env_example !== undefined ? projectData.include_env_example : true
    };
  };

  // Transform frontend settings to backend project format
  const transformSettingsToProject = (settingsData) => {
    return {
      name: settingsData.projectName,
      description: settingsData.description,
      framework: settingsData.backendFramework,
      include_docker: settingsData.include_docker,
      include_cors: settingsData.include_cors,
      include_rate_limiting: settingsData.include_rate_limiting,
      include_logging: settingsData.include_logging,
      include_env_example: settingsData.include_env_example
    };
  };

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      console.log("Saving settings...", settings);
      
      const projectData = transformSettingsToProject(settings);
      await projectsAPI.updateProject(projectId, projectData);
      
      // Update local project state
      setProject(prev => ({
        ...prev,
        ...projectData
      }));
      
      setOriginalSettings({ ...settings });
      alert('Settings saved successfully!');
      
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(`Failed to save settings: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
      alert('Failed to save settings. Please try again.');
    }
  };

  const handleResetToDefaults = () => {
    const defaults = {
      projectName: 'New Project',
      version: '1.0.0',
      description: '',
      backendFramework: 'django',
      database: 'PostgreSQL',
      authentication: 'JWT',
      apiBasePath: '/api/v1',
      pagination: true,
      corsAllowedOrigins: '',
      include_docker: false,
      include_cors: true,
      include_rate_limiting: false,
      include_logging: false,
      include_env_example: true
    };
    
    setSettings(defaults);
    setOriginalSettings(defaults);
    alert('Settings reset to defaults!');
  };

  const handlePublish = () => {
    console.log("Publishing project with settings...", settings);
    alert('Project published successfully!');
  };

  const handleGenerateCode = () => {
    const code = generateProjectCode(settings);
    downloadCode(code, 'project_config.py');
  };

  const generateProjectCode = (settings) => {
    return `# Project Configuration
PROJECT_NAME = "${settings.projectName}"
VERSION = "${settings.version}"
DESCRIPTION = "${settings.description}"

# Framework & Stack
BACKEND_FRAMEWORK = "${settings.backendFramework}"
DATABASE = "${settings.database}"
AUTHENTICATION = "${settings.authentication}"

# API Configuration
API_BASE_PATH = "${settings.apiBasePath}"
PAGINATION = ${settings.pagination}
CORS_ALLOWED_ORIGINS = "${settings.corsAllowedOrigins}"

# Boilerplate Options
INCLUDE_DOCKER = ${settings.include_docker}
INCLUDE_CORS = ${settings.include_cors}
INCLUDE_RATE_LIMITING = ${settings.include_rate_limiting}
INCLUDE_LOGGING = ${settings.include_logging}
INCLUDE_ENV_EXAMPLE = ${settings.include_env_example}`;
  };

  const downloadCode = (content, filename) => {
    const blob = new Blob([content], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
        <Sidebar activeTab="settings" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
        <Sidebar activeTab="settings" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-xl mb-4">{error}</p>
            <button 
              onClick={fetchProjectData}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
      <Sidebar 
        onPublish={handlePublish} 
        onGenerateCode={handleGenerateCode}
        activeTab="settings" 
      />
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0 p-8">
          <Breadcrumbs projectName={settings.projectName} currentPage="Settings" projectId={projectId} />
        </div>
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-black font-heading tracking-tight text-white">Project Settings</h1>
              <p className="text-gray-400 text-lg font-display mt-1">
                Configure your project's core settings
              </p>
              {hasChanges && (
                <div className="flex items-center gap-2 mt-2 text-yellow-400 text-sm">
                  <span className="material-symbols-outlined text-base">info</span>
                  You have unsaved changes
                </div>
              )}
            </div>

            {/* Settings Panel */}
            <div className="glassmorphism rounded-xl p-8 shadow-lg">
              <div className="space-y-12">
                <ProjectDetails 
                  settings={settings}
                  onSettingChange={handleSettingChange}
                />
                
                <FrameworkStack 
                  settings={settings}
                  onSettingChange={handleSettingChange}
                />
                
                <ApiConfiguration
                  settings={settings}
                  onSettingChange={handleSettingChange}
                />

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-8 border-t border-white/10">
                  <button
                    onClick={handleResetToDefaults}
                    className="flex items-center justify-center rounded-lg h-12 px-6 bg-white/10 text-white text-sm font-bold shadow-neumorphic-outset hover:bg-white/20 transition-colors"
                  >
                    Reset to Defaults
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={!hasChanges}
                    className={`flex items-center justify-center rounded-lg h-12 px-6 text-sm font-bold shadow-neumorphic-outset transition-colors ${
                      hasChanges 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;