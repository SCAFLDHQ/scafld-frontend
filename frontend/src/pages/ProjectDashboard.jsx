// src/pages/ProjectDashboard.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';
import PageHeader from '../components/Projects/PageHeader';
import StatsGrid from '../components/Projects/StatsGrid';
import ModelsGrid from '../components/Projects/ModelsGrid';
import ActionButton from '../components/Projects/ActionButton';

const ProjectDashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const projectData = await projectsAPI.getProject(projectId);
      setProject(projectData);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleNewModel = () => {
    console.log("Create new model clicked");
    navigate(`/project/${projectId}/database`);
  };

  const handlePublish = () => {
    console.log("Publish project clicked");
    navigate('/publish');
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
        <Sidebar onPublish={handlePublish} />
        <main className="flex-1 p-8 md:p-12 overflow-y-auto flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
        <Sidebar onPublish={handlePublish} />
        <main className="flex-1 p-8 md:p-12 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-xl mb-4">{error || 'Project not found'}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Transform project data for the components
  const recentModels = project.database_models?.map(model => ({
    id: model.id,
    name: model.name,
    description: model.description || 'No description',
    fields: model.fields?.length || 0,
    lastUpdated: new Date(model.updated_at || model.created_at).toLocaleDateString()
  })) || [];

  const stats = [
    { label: "Models", value: project.database_models?.length || "0" },
    { label: "Endpoints", value: (project.database_models?.length || 0) * 5 }, // 5 endpoints per model
    { label: "Framework", value: project.framework === 'django' ? 'Django' : project.framework === 'express' ? 'Express.js' : 'Flask' },
    { label: "Project Health", value: "99%" }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
      <Sidebar projectId={projectId} onPublish={handlePublish} />
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs 
            projectName={project.name} 
            currentPage="Dashboard" 
            projectId={projectId} 
          />
          
          <PageHeader 
            title="Dashboard" 
            actionButton={
              <ActionButton icon="add" onClick={handleNewModel}>
                New Model
              </ActionButton>
            } 
          />
          
          <StatsGrid stats={stats} />
          
          <ModelsGrid models={recentModels} projectId={projectId} />
        </div>
      </main>
    </div>
  );
};

export default ProjectDashboard;