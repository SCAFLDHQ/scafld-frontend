// src/components/Dashboard/ProjectCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../../services/api';

const ProjectCard = ({ project, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await projectsAPI.deleteProject(project.id);
      onDelete(project.id);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to project settings or edit page
    navigate(`/project/${project.id}/settings`);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/publish`); // Or wherever your generate/publish page is
  };

  const handleCardClick = () => {
    // Navigate to the Project Dashboard
    navigate(`/project/${project.id}`);
  };

  const getFrameworkBadge = (framework) => {
    const frameworks = {
      'django': { label: 'Django', color: 'bg-green-500/20 text-green-400' },
      'express': { label: 'Express.js', color: 'bg-yellow-500/20 text-yellow-400' },
      'flask': { label: 'Flask', color: 'bg-blue-500/20 text-blue-400' }
    };
    return frameworks[framework] || { label: framework, color: 'bg-gray-500/20 text-gray-400' };
  };

  const frameworkInfo = getFrameworkBadge(project.framework);
  const modelCount = project.database_models?.length || project.model_count || 0;

  return (
    <div 
      className="flex flex-col gap-3 pb-3 bg-[#2e1835]/50 rounded-xl p-3 sm:p-4 border border-transparent hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-white/50">
            code
          </span>
          <div className={`mt-2 px-2 py-1 rounded text-xs font-medium ${frameworkInfo.color}`}>
            {frameworkInfo.label}
          </div>
        </div>
      </div>
      <div>
        <p className="text-white text-base sm:text-lg font-bold leading-normal truncate">{project.name}</p>
        <p className="text-[#bd8ecc] text-xs sm:text-sm font-normal leading-normal mt-1">
          {modelCount} Models • Last modified: {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'Never'}
        </p>
        {project.description && (
          <p className="text-gray-400 text-xs mt-2 line-clamp-2">{project.description}</p>
        )}
        <div className="flex gap-2 mt-3 flex-wrap">
          <button 
            onClick={handleEdit}
            className="text-primary text-xs sm:text-sm font-medium leading-normal hover:underline"
          >
            Edit
          </button>
          <button 
            onClick={handleGenerate}
            className="text-primary text-xs sm:text-sm font-medium leading-normal hover:underline"
          >
            Generate
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-400 text-xs sm:text-sm font-medium leading-normal hover:underline disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;