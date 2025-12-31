import { useState, useEffect } from 'react';
import { pdpAPI } from '../../services/api';

const PDPProjectSelector = ({ onProjectSelect, selectedProjectId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await pdpAPI.getProjects();
      setProjects(response.results || response);
    } catch (error) {
      console.error('Failed to fetch PDP projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-background-light rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-primary-text">PDP Project</label>
      <select
        value={selectedProjectId || ''}
        onChange={(e) => onProjectSelect(e.target.value)}
        className="w-full p-3 bg-background-light text-primary-text rounded-lg border border-border-color focus:border-primary focus:outline-none"
      >
        <option value="">Select a PDP project...</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name} ({project.target_framework})
          </option>
        ))}
      </select>
      
      {projects.length === 0 && (
        <p className="text-sm text-secondary-text">
          No PDP projects found. Create one first.
        </p>
      )}
    </div>
  );
};

export default PDPProjectSelector;