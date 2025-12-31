const ActionButton = ({ children, icon = "add", onClick, ...props }) => {
    return (
      <button 
        className="bg-primary text-white font-display font-bold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-neumorphic"
        onClick={onClick}
        {...props}
      >
        <span className="material-symbols-outlined">{icon}</span>
        {children}
      </button>
    );
  };
  
  export default ActionButton;