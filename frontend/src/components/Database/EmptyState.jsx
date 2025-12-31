const EmptyState = ({ onAddModel }) => {
    return (
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white font-display">Visual Builder</h1>
            <p className="text-primary-text mt-2">Design your database models visually.</p>
          </div>
          <button 
            onClick={onAddModel}
            className="bg-primary text-white font-display font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add Model
          </button>
        </div>
        
        <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-600 rounded-xl">
          <div className="text-center p-8">
            <span className="material-symbols-outlined text-5xl text-gray-600">database</span>
            <p className="text-gray-500 font-body mt-2 text-lg">No models yet. Start by adding your first model.</p>
            <button 
              onClick={onAddModel}
              className="mt-4 bg-primary text-white font-display font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
            >
              <span className="material-symbols-outlined">add</span>
              Add Your First Model
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default EmptyState;