import React from 'react';

const DeploymentPipeline = ({ deploymentState }) => {
  const steps = [
    { number: 1, label: 'Analyze Project', key: 'isBuilding' },
    { number: 2, label: 'Generate Code', key: 'isGenerating' },
    { number: 3, label: 'Download Ready', key: 'isComplete' }
  ];

  return (
    <div className="glassmorphism rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4">Generation Pipeline</h2>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-3 ${
                deploymentState.currentStep > step.number ? 'opacity-100' : 
                deploymentState.currentStep === step.number ? 'opacity-100' : 'opacity-50'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all ${
                  deploymentState.currentStep > step.number ? 'bg-green-500' :
                  deploymentState[step.key] ? 'bg-primary animate-pulse' :
                  deploymentState.currentStep === step.number ? 'bg-primary' : 'bg-[#2C2C2C] border border-[#4A4A4A]'
                }`}>
                  {deploymentState.currentStep > step.number ? '✓' : step.number}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{step.label}</p>
                  <p className={`text-xs transition-colors ${
                    deploymentState[step.key] ? 'text-primary' :
                    deploymentState.currentStep > step.number ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {deploymentState[step.key] ? 'In progress...' :
                     deploymentState.currentStep > step.number ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="h-0.5 flex-1 bg-[#2C2C2C] mx-4">
                <div 
                  className="h-0.5 bg-primary transition-all duration-500"
                  style={{ width: deploymentState.currentStep > step.number ? '100%' : '0%' }}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DeploymentPipeline;