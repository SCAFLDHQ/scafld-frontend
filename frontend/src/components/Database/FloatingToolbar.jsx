import { Link } from "react-router-dom";

const FloatingToolbar = ({ 
    onAddModel, 
    onGenerateCode, 
    onRelationshipMode, 
    onZoomIn, 
    onZoomOut,
    isRelationshipMode = false 
  }) => {
    return (
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"> {/* Changed to fixed positioning */}
        <div className="flex items-center gap-2 p-2 rounded-xl glassmorphism">
          <button 
            onClick={onAddModel}
            className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
            title="Add Model"
          >
            <span className="material-symbols-outlined text-2xl">add</span>
          </button>
          
          <div className="w-px h-8 bg-white/10"></div>
          
          <button 
            onClick={onRelationshipMode}
            className={`flex items-center justify-center h-12 w-12 rounded-lg transition-colors ${
              isRelationshipMode 
                ? 'bg-primary text-white' 
                : 'text-primary-text hover:bg-white/10'
            }`}
            title="Relationship Tool"
          >
            <span className="material-symbols-outlined text-2xl">timeline</span>
          </button>
          
          <button 
            onClick={onZoomIn}
            className="flex items-center justify-center h-12 w-12 rounded-lg text-primary-text hover:bg-white/10 transition-colors"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-2xl">zoom_in</span>
          </button>
          
          <button 
            onClick={onZoomOut}
            className="flex items-center justify-center h-12 w-12 rounded-lg text-primary-text hover:bg-white/10 transition-colors"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-2xl">zoom_out</span>
          </button>
          
          <button className="flex items-center justify-center h-12 w-12 rounded-lg text-primary-text hover:bg-white/10 transition-colors" title="Layout Tools">
            <span className="material-symbols-outlined text-2xl">auto_awesome_mosaic</span>
          </button>
          
          <div className="w-px h-8 bg-white/10"></div>
          
          <button 
            onClick={onGenerateCode}
            className="flex items-center justify-center h-12 px-6 rounded-lg bg-primary text-white gap-2 text-base font-display font-semibold leading-normal tracking-wide hover:bg-primary/90 transition-all transform hover:scale-105"
          >
            <span className="material-symbols-outlined text-2xl">code</span>
            <span>Generate Code</span>
          </button>
        </div>
      </div>
    );
  };
  
  export default FloatingToolbar;