import { Link } from "react-router-dom";

const ModelCard = ({ model, projectId }) => {
    return (
      <div className="bg-accent-dark rounded-xl p-6 shadow-neumorphic border border-white/5 hover:border-primary/50 transition-all duration-300 group">
        <div className="flex justify-between items-start">
          <h3 className="text-white font-display text-xl font-bold mb-2">{model.name}</h3>
          <span className="material-symbols-outlined text-gray-500">more_vert</span>
        </div>
        <p className="text-primary-text font-body text-sm mb-4">{model.description}</p>
        <div className="flex items-center justify-between text-sm text-primary-text">
          <span>Fields: {model.fields}</span>
          <span>Last updated: {model.lastUpdated}</span>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
        <Link 
          to={`/project/${projectId}/database/`} 
          className="text-primary font-medium text-sm flex items-center gap-2 group-hover:underline"
        >
          Go to builder
          <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>
        </div>
      </div>
    );
  };
  
  export default ModelCard;