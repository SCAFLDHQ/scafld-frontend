// src/components/Projects/Breadcrumbs.jsx
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ projectName = "Project Name", currentPage = "Dashboard", projectId }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Link 
        to="/dashboard"
        className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
      >
        My Projects
      </Link>
      <span className="text-gray-500 text-sm font-medium">/</span>
      <Link 
        to={`/project/${projectId}`}
        className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
      >
        {projectName}
      </Link>
      <span className="text-gray-500 text-sm font-medium">/</span>
      <span className="text-white text-sm font-medium">{currentPage}</span>
    </div>
  );
};

export default Breadcrumbs;