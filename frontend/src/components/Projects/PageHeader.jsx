const PageHeader = ({ title, actionButton }) => {
    return (
      <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
        <h1 className="text-white text-4xl font-display font-bold tracking-tight">{title}</h1>
        {actionButton}
      </div>
    );
  };
  
  export default PageHeader;