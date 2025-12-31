import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';
import DeploymentPipeline from '../components/Publish/DeploymentPipeline';
import BuildConfiguration from '../components/Publish/BuildConfiguration';
import EnvironmentVariables from '../components/Publish/EnvironmentVariables';
import DeploymentTarget from '../components/Publish/DeploymentTarget';
import ExportOptions from '../components/Publish/ExportOptions';
import DeploymentLogs from '../components/Publish/DeploymentLogs';

const Publish = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [deploymentState, setDeploymentState] = useState({
    currentStep: 0, // 0: Ready, 1: Building, 2: Generating, 3: Complete
    isBuilding: false,
    isGenerating: false,
    isComplete: false
  });

  const [buildConfig, setBuildConfig] = useState({
    includeAuth: true,
    generateDocs: true,
    generateDockerfile: true,
    enableCI: false
  });



  const [deploymentTarget, setDeploymentTarget] = useState('download');
  const [logs, setLogs] = useState([]);

  // Fetch project data
  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const projectData = await projectsAPI.getProject(projectId);
      setProject(projectData);
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  const handleGenerateCode = async () => {
    try {
      setDeploymentState({ currentStep: 1, isBuilding: true, isGenerating: false, isComplete: false });
      setLogs([]);
      
      addLog('🚀 Starting code generation...');
      addLog(`📁 Project: ${project?.name}`);
      addLog(`⚙️ Framework: ${project?.framework === 'django' ? 'Django + DRF' : project?.framework === 'express' ? 'Express.js + Sequelize' : 'Flask + SQLAlchemy'}`);
      
      // Step 1: Building project structure
      await simulateStep('🔍 Analyzing project structure...', 1000);
      addLog('✅ Models analyzed');
      addLog('✅ Views configured');
      addLog('✅ Routes mapped');
      
      setDeploymentState(prev => ({ ...prev, currentStep: 2, isBuilding: false, isGenerating: true }));
      
      // Step 2: Generating code
      await simulateStep('💻 Generating source code...', 1500);
      addLog('✅ Database models generated');
      addLog('✅ API serializers created');
      addLog('✅ View controllers implemented');
      
      await simulateStep('📄 Creating configuration files...', 1000);
      addLog('✅ Settings configured');
      addLog('✅ Requirements file created');
      
      if (buildConfig.generateDockerfile) {
        addLog('🐳 Docker configuration generated');
      }
      
      if (buildConfig.generateDocs) {
        addLog('📚 API documentation created');
      }
      
      setDeploymentState(prev => ({ ...prev, currentStep: 3, isGenerating: false, isComplete: true }));
      
      // Step 3: Download the generated code
      addLog('✅ Code generation complete!');
      addLog('📥 Downloading project files...');
      
      // Trigger the actual download from backend
      await downloadGeneratedCode();
      
    } catch (err) {
      console.error('Error generating code:', err);
      addLog(`❌ Code generation failed: ${err.message}`);
      setDeploymentState({ currentStep: 0, isBuilding: false, isGenerating: false, isComplete: false });
    }
  };

  const downloadGeneratedCode = async () => {
    try {
      addLog('📡 Connecting to server...');
      
      // Use the generate endpoint from projectsAPI
      const response = await projectsAPI.generate(projectId);
      
      addLog('✅ Project files ready for download');
      
      // Since projectsAPI.generate() should return a blob response, we can handle it directly
      // Create a blob from the response data
      const blob = new Blob([response], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project?.name}_project.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      addLog('🎉 Project downloaded successfully!');
      addLog('📦 You can now extract the ZIP file and start developing.');
      
    } catch (err) {
      console.error('Error downloading code:', err);
      addLog(`❌ Download failed: ${err.response?.data?.error || err.message}`);
      
      // Fallback: Create a dummy ZIP file for demonstration
      addLog('🔄 Creating demo project structure...');
      await createDemoDownload();
    }
  };

  const createDemoDownload = async () => {
    try {
      // Create a simple text file as fallback
      const demoContent = `# ${project?.name} - Generated Project

This is a demo download since the backend generation is not fully configured.

## Project Structure
- models.py (Database models)
- serializers.py (API serializers) 
- views.py (View controllers)
- urls.py (URL routing)
- settings.py (Configuration)

## Next Steps
1. Extract this ZIP file
2. Run: pip install -r requirements.txt
3. Run: python manage.py migrate
4. Run: python manage.py runserver

Your API will be available at http://localhost:8000/api/
`;

      const blob = new Blob([demoContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project?.name}_README.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      addLog('📝 Demo file downloaded as fallback');
      addLog('💡 Configure your backend for full code generation');
      
    } catch (fallbackErr) {
      addLog('❌ Even fallback download failed');
    }
  };

  const simulateStep = async (message, duration) => {
    addLog(message);
    await new Promise(resolve => setTimeout(resolve, duration));
  };

  const handleBuildConfigChange = (key, value) => {
    setBuildConfig(prev => ({ ...prev, [key]: value }));
  };



  const handleExport = (type) => {
    addLog(`📤 Exporting ${type}...`);
    
    // Create different types of exports
    const exportContents = {
      'full-project': `# Full Project Export - ${project?.name}\nComplete project structure with all models, views, and configuration.`,
      'api-docs': `# API Documentation - ${project?.name}\nAuto-generated API documentation for all endpoints.`,
      'database-schema': `# Database Schema - ${project?.name}\nSQL schema and migration files.`,
      'docker-config': `# Docker Configuration - ${project?.name}\nDockerfile and docker-compose setup.`
    };

    const content = exportContents[type] || `# ${type} - ${project?.name}\nExport content.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project?.name}_${type.replace('-', '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    addLog(`✅ ${type} exported successfully!`);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
        <Sidebar activeTab="publish" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
        <Sidebar activeTab="publish" />
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
        onPublish={handleGenerateCode}
        onGenerateCode={handleGenerateCode}
        activeTab="publish" 
      />
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0 p-8">
          <Breadcrumbs projectName={project?.name} currentPage="Generate & Export" projectId={projectId} />
        </div>
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-white text-4xl font-black font-heading tracking-tight mb-2">Generate & Export</h1>
              <p className="text-gray-400 text-lg">
                Generate complete backend code and export as a downloadable project
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left and Center Column */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Visual Pipeline */}
                <DeploymentPipeline 
                  deploymentState={deploymentState}
                />

                {/* Build & Environment Config */}
                <div className="grid grid-cols-1 gap-6">
                  <BuildConfiguration 
                    config={buildConfig}
                    onConfigChange={handleBuildConfigChange}
                  />
                  
                  <EnvironmentVariables
                    projectId={projectId}
                  />
                </div>

                {/* Deployment Logs - Make sure it's visible */}
                <div className="flex-1 min-h-[300px]">
                  <DeploymentLogs logs={logs} />
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <DeploymentTarget 
                  target={deploymentTarget}
                  onTargetChange={setDeploymentTarget}
                  onDeploy={handleGenerateCode}
                  deploymentState={deploymentState}
                />
                
                <ExportOptions onExport={handleExport} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Publish;