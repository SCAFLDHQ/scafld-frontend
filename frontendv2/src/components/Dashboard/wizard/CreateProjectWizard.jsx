import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../services/api';
import Step1AIOrManual from './Step1AIOrManual';
import Step2ProjectBasics from './Step2ProjectBasics';
import Step3BoilerplateOptions from './Step3BoilerplateOptions';
import Step4DatabaseModels from './Step4DatabaseModels';
import Step5APIEndpoints from './Step5APIEndpoints';
import Step6ReviewCreate from './Step6ReviewCreate';
import LoadingCooking from './LoadingCooking';

export default function CreateProjectWizard({ isOpen, onClose, onComplete }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [wizardData, setWizardData] = useState({
    projectName: '',
    description: '',
    framework: '',
    template: '',
    boilerplates: {
      docker: false,
      cors: true,
      rateLimiting: false,
      logging: true,
      envExample: true,
      throttling: false,
      pagination: true,
      jwt: false,
      healthcheck: true,
      openapi: true,
      cicd: false,
    },
    models: [],
    endpoints: {},
  });

  const steps = [
    { number: 1, title: 'AI or Manual' },
    { number: 2, title: 'Project Basics' },
    { number: 3, title: 'Boilerplates' },
    { number: 4, title: 'Database Models' },
    { number: 5, title: 'API Endpoints' },
    { number: 6, title: 'Review & Create' },
  ];

  const handleAIQuickCreate = async (prompt) => {
    const updated = { ...wizardData, aiPrompt: prompt, isAIGenerated: true };
    setWizardData(updated);
    setIsLoading(true);
    setError('');
    try {
      const res = await apiService.generateWithAI(prompt, updated.framework || 'django');
      if (res.ok) {
        const data = await res.json();
        onClose();
        navigate(`/canvas/${data.project_id}`);
      } else {
        const err = await res.json();
        setError(err.error || 'AI generation failed. Please try again.');
        setIsLoading(false);
      }
    } catch {
      setError('AI generation failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalCreate = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await apiService.createProject({
        name: wizardData.projectName,
        description: wizardData.description || '',
        framework: wizardData.framework || 'django',
      });
      if (res.ok) {
        const project = await res.json();
        setIsLoading(false);
        onComplete(project);
      } else {
        const err = await res.json();
        setError(err.name?.[0] || err.error || 'Failed to create project.');
        setIsLoading(false);
      }
    } catch {
      setError('Failed to create project. Please try again.');
      setIsLoading(false);
    }
  };

  const updateWizardData = (data) => {
    setWizardData({ ...wizardData, ...data });
  };

  if (!isOpen) return null;

  if (isLoading) {
    return <LoadingCooking />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-6xl max-h-[90vh] bg-black border border-white/10 overflow-hidden flex flex-col"
      >
        {/* Header with Step Indicators */}
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white">Create New Project</h2>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-8 h-8 flex items-center justify-center border-2 transition-colors ${
                      currentStep === step.number
                        ? 'bg-[#29142e] border-[#29142e] text-white'
                        : currentStep > step.number
                        ? 'bg-[#29142e]/50 border-[#29142e]/50 text-white'
                        : 'border-white/20 text-white/40'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`text-sm ${
                      currentStep >= step.number ? 'text-white' : 'text-white/40'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      currentStep > step.number ? 'bg-[#29142e]' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="px-6 py-2 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Step1AIOrManual
                key="step1"
                onAIQuickCreate={handleAIQuickCreate}
                onManualSetup={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 2 && (
              <Step2ProjectBasics
                key="step2"
                data={wizardData}
                onUpdate={updateWizardData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <Step3BoilerplateOptions
                key="step3"
                data={wizardData}
                onUpdate={updateWizardData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <Step4DatabaseModels
                key="step4"
                data={wizardData}
                onUpdate={updateWizardData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 5 && (
              <Step5APIEndpoints
                key="step5"
                data={wizardData}
                onUpdate={updateWizardData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 6 && (
              <Step6ReviewCreate
                key="step6"
                data={wizardData}
                onBack={handleBack}
                onCreate={handleFinalCreate}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}