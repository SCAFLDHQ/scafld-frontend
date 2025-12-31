import React from 'react';

const BuildConfiguration = ({ config, onConfigChange }) => {
  const options = [
    { key: 'includeAuth', label: 'Include Authentication', description: 'Add authentication middleware and endpoints' },
    { key: 'generateDocs', label: 'Generate API Docs', description: 'Create Swagger/OpenAPI documentation' },
    { key: 'generateDockerfile', label: 'Generate Dockerfile', description: 'Create Docker configuration for containerization' },
    { key: 'enableCI', label: 'Enable CI/CD Pipeline', description: 'Set up GitHub Actions for automated deployments' }
  ];

  return (
    <div className="glassmorphism rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4">Build Options</h2>
      <div className="space-y-4">
        {options.map(option => (
          <div key={option.key} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex-1">
              <label className="font-medium text-white text-sm cursor-pointer" htmlFor={option.key}>
                {option.label}
              </label>
              <p className="text-gray-400 text-xs mt-1">{option.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={config[option.key]}
                onChange={(e) => onConfigChange(option.key, e.target.checked)}
                className="sr-only peer"
                id={option.key}
              />
              <div className="w-11 h-6 bg-[#2C2C2C] border border-[#4A4A4A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuildConfiguration;