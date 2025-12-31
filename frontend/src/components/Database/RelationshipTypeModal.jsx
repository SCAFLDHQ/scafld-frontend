const RelationshipTypeModal = ({ isOpen, onClose, onSelectType }) => {
    if (!isOpen) return null;
  
    const relationshipTypes = [
      {
        type: '1:1',
        label: 'One-to-One',
        description: 'Each record in one table is linked to exactly one record in another table',
        example: 'User ↔ Profile'
      },
      {
        type: '1:M',
        label: 'One-to-Many',
        description: 'One record in a table can be linked to many records in another table',
        example: 'User ↔ Posts'
      },
      {
        type: 'M:M',
        label: 'Many-to-Many',
        description: 'Many records in one table can be linked to many records in another table',
        example: 'Students ↔ Courses'
      }
    ];
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-accent-dark rounded-xl p-6 w-full max-w-md border border-white/10 shadow-neumorphic">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display text-white">Select Relationship Type</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-400">close</span>
            </button>
          </div>
          
          <p className="text-primary-text mb-6">Choose the type of relationship you want to create between your models</p>
          
          <div className="space-y-4">
            {relationshipTypes.map((relType) => (
              <button
                key={relType.type}
                onClick={() => onSelectType(relType.type)}
                className="w-full p-4 text-left rounded-lg border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-white font-display">{relType.type}</span>
                      <span className="text-white font-medium">{relType.label}</span>
                    </div>
                    <p className="text-primary-text text-sm mb-2">{relType.description}</p>
                    <p className="text-primary text-sm font-medium">Example: {relType.example}</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">
                    arrow_forward
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/10">
            <button 
              onClick={onClose}
              className="w-full py-3 px-4 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default RelationshipTypeModal;