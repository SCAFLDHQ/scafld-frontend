// src/components/Dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectsAPI, templatesAPI } from '../services/api';
import CreateProjectModal from '../components/Dashboard/CreateProjectModal';
import Header from '../components/Dashboard/Header';
import ProjectCard from '../components/Dashboard/ProjectCard';
import TemplateCard from '../components/Dashboard/TemplateCard';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
    fetchTemplates();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getProjects();
      setProjects(response.results || response); // Handle both list and paginated responses
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await templatesAPI.getTemplates();
      setTemplates(response.results || response);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    setIsModalOpen(false);
  };

  const handleTemplateUsed = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const handleProjectDeleted = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#1e1023] overflow-x-hidden pb-20 md:pb-0">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-6 lg:px-8 xl:px-40 flex flex-1 justify-center py-4 md:py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full">
              <Header />
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#1e1023] dark group/design-root overflow-x-hidden pb-20 md:pb-0">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-6 lg:px-8 xl:px-40 flex flex-1 justify-center py-4 md:py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full">
            <Header />

            <main className="flex flex-col gap-6 md:gap-8 mt-6 md:mt-8">
              {/* Projects Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-2 md:px-4">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                  My Projects
                </h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 sm:h-12 px-4 sm:px-6 bg-primary text-white text-sm sm:text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                >
                  <span className="truncate">Create Project</span>
                </button>
              </div>

              {error && (
                <div className="px-4">
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-400">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-2 md:p-4">
                {projects.length > 0 ? (
                  projects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onDelete={handleProjectDeleted}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg">No projects yet</p>
                    <p className="text-gray-500 mt-2">Create your first project to get started</p>
                  </div>
                )}
              </div>

              {/* Templates Section */}
              <div className="px-2 md:px-4">
                <h2 className="text-white text-xl sm:text-2xl md:text-[28px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-4 md:pt-5">
                  Explore Templates
                </h2>
                <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4">
                  <div className="flex items-stretch gap-4 md:gap-6 min-w-min">
                    {templates.map(template => (
                      <TemplateCard key={template.id} template={template} onTemplateUsed={handleTemplateUsed} />
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Dashboard;
