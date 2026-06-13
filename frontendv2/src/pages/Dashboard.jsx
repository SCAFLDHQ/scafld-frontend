import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import AIPromptInput from '../components/Dashboard/AIPromptInput';
import ProjectCard from '../components/Dashboard/ProjectCard';
import CreateProjectCard from '../components/Dashboard/CreateProjectCard';
import TemplateCarousel from '../components/Dashboard/TemplateCarousel';
import CreateProjectWizard from '../components/Dashboard/wizard/CreateProjectWizard';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

export default function Dashboard({ onProjectCreated }) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const filteredProjects = searchQuery.trim()
    ? projects.filter(p => {
        const q = searchQuery.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.framework?.toLowerCase().includes(q)
        );
      })
    : projects;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileResponse, projectsResponse] = await Promise.all([
        apiService.getProfile(),
        apiService.getProjects()
      ]);

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile(profileData);
      }

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.results || projectsData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setIsWizardOpen(true);
  };

  const handleWizardClose = () => {
    setIsWizardOpen(false);
  };

  const handleWizardComplete = (projectData) => {
    setIsWizardOpen(false);
    fetchDashboardData();
    if (onProjectCreated) onProjectCreated(projectData);
  };

  const handleProjectDeleted = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <DashboardNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-12">
        {/* AI Prompt Section */}
        <section>
          <div className="mb-4">
            <h2 className="text-white text-xl sm:text-2xl mb-2">Create with AI</h2>
            <p className="text-white/60 text-sm sm:text-base">
              Describe your API and let SCAFLD generate the code for you
            </p>
          </div>
          <AIPromptInput />
        </section>

        {/* Projects Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-white text-xl sm:text-2xl mb-2">Your Projects</h2>
              <p className="text-white/60 text-sm sm:text-base">
                {projects.length} projects •{' '}
                {userProfile?.credits ?? 0}/{userProfile?.daily_limit ?? 10} daily credits
                {(userProfile?.pack_credits ?? 0) > 0 && (
                  <span className="text-[#a78bfa]"> + {userProfile.pack_credits} pack</span>
                )}
              </p>
            </div>
            <button
              onClick={handleCreateProject}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-[#29142e] text-white hover:bg-[#3a1f4a] transition-colors text-sm sm:text-base rounded-lg w-full sm:w-auto"
            >
              New Project
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {!searchQuery && <CreateProjectCard onClick={handleCreateProject} />}
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  name={project.name}
                  framework={project.framework || 'Django'}
                  lastModified={project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'Recently'}
                  status={project.status || 'active'}
                  project={project}
                  onDelete={handleProjectDeleted}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-white/60 text-lg">{searchQuery ? `No projects match "${searchQuery}"` : 'No projects yet'}</p>
                <p className="text-white/40 mt-2">{searchQuery ? 'Try a different search term' : 'Create your first project to get started'}</p>
              </div>
            )}
          </div>
        </section>

        {/* Templates Section */}
        <section>
          <TemplateCarousel searchQuery={searchQuery} />
        </section>

      </main>

      {/* Create Project Wizard Modal */}
      <CreateProjectWizard
        isOpen={isWizardOpen}
        onClose={handleWizardClose}
        onComplete={handleWizardComplete}
      />
    </div>
  );
}