const StatsCard = ({ label, value, isPrimary = false }) => {
    return (
      <div className="flex flex-col gap-2 rounded-xl p-6 bg-accent-dark shadow-neumorphic border border-white/5">
        <p className="text-primary-text text-base font-medium">{label}</p>
        <p className={`text-4xl font-display font-bold ${
          isPrimary ? "text-primary" : "text-white"
        }`}>
          {value}
        </p>
      </div>
    );
  };
  
  export default StatsCard;