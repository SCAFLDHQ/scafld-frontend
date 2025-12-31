// ProjectDetails.jsx
import React from 'react';

const ProjectDetails = ({ settings, onSettingChange }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold font-heading text-white mb-6 border-b border-white/10 pb-4">
        Project Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <label className="flex flex-col gap-2">
          <p className="text-base font-medium leading-normal text-white">Project Name</p>
          <input
            className="w-full rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] h-14 placeholder:text-gray-500 p-4 text-base font-normal text-black shadow-neumorphic-inset focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            value={settings.projectName}
            onChange={(e) => onSettingChange('projectName', e.target.value)}
          />
        </label>
        
        <label className="flex flex-col gap-2">
          <p className="text-base font-medium leading-normal text-white">Version</p>
          <input
            className="w-full rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] h-14 placeholder:text-gray-500 p-4 text-base font-normal text-black shadow-neumorphic-inset focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            value={settings.version}
            onChange={(e) => onSettingChange('version', e.target.value)}
          />
        </label>
        
        <label className="flex flex-col gap-2 md:col-span-2">
          <p className="text-base font-medium leading-normal text-white">Description</p>
          <textarea
            className="w-full rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] min-h-32 placeholder:text-gray-500 p-4 text-base font-normal text-black shadow-neumorphic-inset focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
            placeholder="Enter a short description for your project..."
            value={settings.description}
            onChange={(e) => onSettingChange('description', e.target.value)}
          />
        </label>
      </div>
    </section>
  );
};

export default ProjectDetails;