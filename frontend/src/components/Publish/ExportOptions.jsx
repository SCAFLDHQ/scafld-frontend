// ExportOptions.jsx
import React from 'react';

const ExportOptions = ({ onExport }) => {
  const exportOptions = [
    { type: 'full-project', label: 'Export Full Project', icon: 'download' },
    { type: 'api-docs', label: 'Export API Documentation', icon: 'description' },
    { type: 'database-schema', label: 'Export Database Schema', icon: 'storage' },
    { type: 'docker-config', label: 'Export Docker Config', icon: 'settings' }
  ];

  return (
    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 glassmorphic">
      <h2 className="text-xl font-bold text-white mb-4">Export Options</h2>
      <div className="space-y-3">
        {exportOptions.map((option, index) => (
          <button
            key={option.type}
            onClick={() => onExport(option.type)}
            className={`w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 text-sm font-medium transition-colors ${
              index === 0 
                ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <span className="material-symbols-outlined text-base">{option.icon}</span>
            <span className="truncate">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExportOptions;