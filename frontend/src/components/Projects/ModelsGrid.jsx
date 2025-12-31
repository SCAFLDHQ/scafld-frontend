// src/components/Projects/ModelsGrid.jsx
import ModelCard from './ModelCard';

const ModelsGrid = ({ models, title = "Recent Models", projectId }) => {
  return (
    <div>
      <h2 className="text-white text-2xl font-display font-bold tracking-tight mb-6">{title}</h2>
      {models.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} projectId={projectId}/>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-accent-dark rounded-xl border border-dashed border-white/10">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-4">database</span>
          <p className="text-gray-400 text-lg mb-4">No models yet</p>
          <p className="text-gray-500">Create your first model to get started</p>
        </div>
      )}
    </div>
  );
};

export default ModelsGrid;