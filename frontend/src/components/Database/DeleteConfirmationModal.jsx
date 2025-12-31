const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemType, itemName }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-accent-dark rounded-xl p-6 w-full max-w-md border border-white/10 shadow-neumorphic">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-red-500 text-2xl">warning</span>
            <h2 className="text-2xl font-bold font-display text-white">Delete {itemType}</h2>
          </div>
          
          <p className="text-primary-text mb-2">
            Are you sure you want to delete <span className="text-white font-semibold">"{itemName}"</span>?
          </p>
          
          {itemType === 'Model' && (
            <p className="text-red-400 text-sm mb-4">
              This will also delete all fields and relationships associated with this model.
            </p>
          )}
          
          {itemType === 'Relationship' && (
            <p className="text-red-400 text-sm mb-4">
              This relationship will be permanently removed.
            </p>
          )}
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-3 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteConfirmationModal;