import StatsCard from './StatsCard';

const StatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          label={stat.label}
          value={stat.value}
          isPrimary={stat.label === "Project Health"}
        />
      ))}
    </div>
  );
};

export default StatsGrid;