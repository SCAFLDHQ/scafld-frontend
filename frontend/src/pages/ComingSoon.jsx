// ComingSoon.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';

const ComingSoon = () => {
  const { projectId } = useParams();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Email submitted:", email);
      alert('Thank you for your interest! We\'ll notify you when this feature is ready.');
      setEmail('');
    }
  };

  const handlePublish = () => {
    console.log("Publish project clicked");
    alert('Project published successfully!');
  };

  const handleGenerateCode = () => {
    console.log("Generate code clicked");
    alert('Code generated successfully!');
  };

  return (
    <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
      <Sidebar 
        onPublish={handlePublish} 
        onGenerateCode={handleGenerateCode}
        activeTab="permissions" 
      />
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0 p-8">
          <Breadcrumbs projectName="E-commerce API" currentPage="Feature Preview" projectId={projectId} />
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-3xl px-4 flex flex-col items-center text-center">
            {/* Animated Construction Icon */}
            <div className="mb-8 relative">
              <div className="w-24 h-24 bg-gradient-to-r from-accent-start to-accent-end rounded-full flex items-center justify-center neumorphic mb-4">
                <span className="material-symbols-outlined text-white text-4xl animate-pulse">
                  construction
                </span>
              </div>
              <div className="absolute -top-2 -right-2">
                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                  SOON
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Feature in Progress
            </h1>
            
            {/* Description */}
            <p className="font-body text-lg md:text-xl text-primary-text mt-6 max-w-2xl mx-auto leading-relaxed">
              We're actively building this feature to make your development experience even better. 
              This powerful tool will be available in the next update.
            </p>

            {/* Progress Indicators */}
            <div className="mt-12 w-full max-w-md space-y-6">
              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Development Progress</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 neumorphic-inset">
                  <div 
                    className="bg-gradient-to-r from-accent-start to-accent-end h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: '65%' }}
                  ></div>
                </div>
              </div>

              {/* Feature List */}
              <div className="text-left space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="material-symbols-outlined text-green-400 text-base">check_circle</span>
                  <span>Backend architecture completed</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="material-symbols-outlined text-green-400 text-base">check_circle</span>
                  <span>Core functionality implemented</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="material-symbols-outlined text-yellow-400 text-base">schedule</span>
                  <span>UI/UX design in progress</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="material-symbols-outlined text-blue-400 text-base">pending</span>
                  <span>Testing and optimization phase</span>
                </div>
              </div>

              {/* Notification Form */}
              <div className="pt-6 border-t border-gray-700">
                <p className="font-body text-primary-text mb-4 text-sm">
                  Get notified when this feature is ready
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    className="flex-grow px-4 py-3 rounded-lg bg-[#2C2C2C] border border-[#4A4A4A] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm"
                    placeholder="Enter your email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button 
                    type="submit"
                    className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-accent-start to-accent-end hover:shadow-lg hover:shadow-purple-500/30 transition-all text-sm font-display whitespace-nowrap"
                  >
                    Notify Me
                  </button>
                </form>
              </div>
            </div>

            {/* Estimated Timeline */}
            <div className="mt-8 p-4 glassmorphism rounded-xl max-w-md">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="material-symbols-outlined text-primary text-base">calendar_month</span>
                <span>Estimated completion: Q4 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;