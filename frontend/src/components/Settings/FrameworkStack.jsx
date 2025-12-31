import React from 'react';

const FrameworkStack = ({ settings, onSettingChange }) => {
  const frameworkOptions = [
    { value: 'django', label: 'Django + DRF' },
    { value: 'express', label: 'Express.js + Sequelize' },
    { value: 'flask', label: 'Flask + SQLAlchemy' }
  ];

  const databaseOptions = [
    { value: 'PostgreSQL', label: 'PostgreSQL' },
    { value: 'MySQL', label: 'MySQL' },
    { value: 'SQLite', label: 'SQLite' },
    { value: 'MongoDB', label: 'MongoDB' }
  ];

  const authOptions = [
    { value: 'JWT', label: 'JWT' },
    { value: 'OAuth 2.0', label: 'OAuth 2.0' },
    { value: 'Session-based', label: 'Session-based' }
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold font-heading text-white mb-6 border-b border-white/10 pb-4">
        Framework & Stack
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Backend Framework */}
        <label className="flex flex-col gap-2">
          <p className="text-base font-medium leading-normal text-white">Backend Framework</p>
          <div className="relative">
            <select
              className="appearance-none w-full rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] h-14 p-4 text-base font-normal text-white shadow-neumorphic-inset focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all pr-10"
              value={settings.backendFramework}
              onChange={(e) => onSettingChange('backendFramework', e.target.value)}
            >
              {frameworkOptions.map(option => (
                <option key={option.value} value={option.value} className="text-black">
                  {option.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              expand_more
            </span>
          </div>
        </label>

        {/* Database */}
        <label className="flex flex-col gap-2">
          <p className="text-base font-medium leading-normal text-white">Database</p>
          <div className="relative">
            <select
              className="appearance-none w-full rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] h-14 p-4 text-base font-normal text-white shadow-neumorphic-inset focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all pr-10"
              value={settings.database}
              onChange={(e) => onSettingChange('database', e.target.value)}
            >
              {databaseOptions.map(option => (
                <option key={option.value} value={option.value} className="text-black">
                  {option.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              expand_more
            </span>
          </div>
        </label>

        {/* Authentication */}
        <label className="flex flex-col gap-2">
          <p className="text-base font-medium leading-normal text-white">Authentication</p>
          <div className="relative">
            <select
              className="appearance-none w-full rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] h-14 p-4 text-base font-normal text-white shadow-neumorphic-inset focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all pr-10"
              value={settings.authentication}
              onChange={(e) => onSettingChange('authentication', e.target.value)}
            >
              {authOptions.map(option => (
                <option key={option.value} value={option.value} className="text-black">
                  {option.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              expand_more
            </span>
          </div>
        </label>
      </div>
    </section>
  );
};

export default FrameworkStack;