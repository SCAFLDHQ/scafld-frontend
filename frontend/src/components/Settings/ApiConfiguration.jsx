import React from 'react';

const ApiConfiguration = ({ settings, onSettingChange }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold font-heading text-white mb-6 border-b border-white/10 pb-4">
        API Configuration & Boilerplate
      </h2>
      <div className="space-y-6">
        {/* API Base Path */}
        <label className="flex flex-col gap-2">
          <p className="text-base font-medium leading-normal text-white">API Base Path</p>
          <input
            className="w-full md:w-1/2 rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] h-14 placeholder:text-gray-500 p-4 text-base font-normal text-white shadow-neumorphic-inset focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            value={settings.apiBasePath}
            onChange={(e) => onSettingChange('apiBasePath', e.target.value)}
          />
        </label>

        {/* Boilerplate Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Docker */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <p className="text-base font-medium leading-normal text-white">Docker Support</p>
              <p className="text-sm text-gray-400">Include Dockerfile and docker-compose.yml</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.include_docker}
                onChange={(e) => onSettingChange('include_docker', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-[#2C2C2C] shadow-neumorphic-inset peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* CORS */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <p className="text-base font-medium leading-normal text-white">CORS Support</p>
              <p className="text-sm text-gray-400">Enable Cross-Origin Resource Sharing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.include_cors}
                onChange={(e) => onSettingChange('include_cors', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-[#2C2C2C] shadow-neumorphic-inset peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Rate Limiting */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <p className="text-base font-medium leading-normal text-white">Rate Limiting</p>
              <p className="text-sm text-gray-400">Add API rate limiting middleware</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.include_rate_limiting}
                onChange={(e) => onSettingChange('include_rate_limiting', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-[#2C2C2C] shadow-neumorphic-inset peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Logging */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <p className="text-base font-medium leading-normal text-white">Logging</p>
              <p className="text-sm text-gray-400">Add structured logging configuration</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.include_logging}
                onChange={(e) => onSettingChange('include_logging', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-[#2C2C2C] shadow-neumorphic-inset peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* CORS Allowed Origins */}
        <div className="flex flex-col gap-2">
          <p className="text-base font-medium leading-normal text-white">CORS Allowed Origins</p>
          <p className="text-sm text-gray-400 mb-2">Enter comma-separated domains.</p>
          <input
            className="w-full rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] h-14 placeholder:text-gray-500 p-4 text-base font-normal text-white shadow-neumorphic-inset focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="e.g., https://example.com, http://localhost:5173"
            value={settings.corsAllowedOrigins}
            onChange={(e) => onSettingChange('corsAllowedOrigins', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};

export default ApiConfiguration;