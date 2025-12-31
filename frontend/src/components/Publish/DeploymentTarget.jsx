import React from 'react';

const DeploymentTarget = ({ target, onTargetChange, onDeploy, deploymentState }) => {
  const platforms = [
    { value: 'download', label: 'Download ZIP', description: 'Download complete project as ZIP file' },
    { value: 'github', label: 'Push to GitHub', description: 'Automatically create GitHub repository' },
    { value: 'docker', label: 'Build Docker Image', description: 'Generate and build Docker container' }
  ];

  const getButtonText = () => {
    if (deploymentState.isBuilding) return 'Analyzing Project...';
    if (deploymentState.isGenerating) return 'Generating Code...';
    if (deploymentState.isComplete) return 'Download Complete!';
    return 'Generate Project Code';
  };

  const getButtonIcon = () => {
    if (deploymentState.isComplete) return 'check_circle';
    if (deploymentState.isBuilding || deploymentState.isGenerating) return 'hourglass_empty';
    return 'download';
  };

  return (
    <div className="glassmorphism rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4">Export Target</h2>
      <div className="space-y-4">
        <div className="space-y-3">
          {platforms.map(platform => (
            <label key={platform.value} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <input
                type="radio"
                name="platform"
                value={platform.value}
                checked={target === platform.value}
                onChange={(e) => onTargetChange(e.target.value)}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <p className="font-medium text-white text-sm">{platform.label}</p>
                <p className="text-gray-400 text-xs mt-1">{platform.description}</p>
              </div>
            </label>
          ))}
        </div>
        
        <button
          onClick={onDeploy}
          disabled={deploymentState.isBuilding || deploymentState.isGenerating}
          className={`w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 text-base font-bold transition-all ${
            deploymentState.isComplete 
              ? 'bg-green-600 text-white cursor-default'
              : deploymentState.isBuilding || deploymentState.isGenerating
              ? 'bg-primary/50 text-white cursor-not-allowed'
              : 'bg-primary text-black hover:bg-primary/90 active:scale-95'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {getButtonIcon()}
          </span>
          {getButtonText()}
        </button>
        
        {deploymentState.isComplete && (
          <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm text-center">
              Project generated successfully! Check your downloads.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentTarget;