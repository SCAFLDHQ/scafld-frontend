import { motion } from 'motion/react';
import { MoreVertical, Edit, Trash2, Rocket, Calendar, Code2 } from 'lucide-react';
import { useState } from 'react';
import apiService from '../../services/api';

export default function ProjectCard({ name, framework, lastModified, status, project, onDelete }) {
  const [showActions, setShowActions] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await apiService.deleteProject(project.id);
        
        if (response.ok) {
          onDelete(project.id);
        } else {
          alert('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
    setShowActions(false);
  };

  const handleGenerate = async () => {
    try {
      // Get generation cost first
      const costResponse = await apiService.getGenerationCost(project.id);
      if (costResponse.ok) {
        const costData = await costResponse.json();
        const confirmed = window.confirm(
          `Generate project code? This will cost ${costData.estimated_cost} credits. You have ${costData.available_credits} credits available.`
        );
        
        if (confirmed) {
          const response = await apiService.generateProject(project.id);
          if (response.ok) {
            // Download the generated file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project.name}_project.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          } else {
            const errorData = await response.json();
            alert(errorData.error || 'Failed to generate project');
          }
        }
      }
    } catch (error) {
      console.error('Error generating project:', error);
      alert('Failed to generate project');
    }
    setShowActions(false);
  };

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    deployed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    inactive: 'bg-white/10 text-white/60 border-white/20'
  };

  const frameworkColors = {
    Django: 'bg-[#0C4B33] text-[#44B78B]',
    'Express.js': 'bg-[#1a1a1a] text-[#68A063]'
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/5 border border-white/10 p-4 sm:p-6 transition-all hover:border-[#29142e] cursor-pointer relative group rounded-lg"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#29142e] flex items-center justify-center rounded-lg flex-shrink-0">
            <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white text-sm sm:text-base mb-1 truncate">{name}</h3>
            <div className={`text-xs px-2 py-1 inline-block ${frameworkColors[framework]} rounded`}>
              {framework}
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-white/40 hover:text-white transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 top-full mt-1 sm:mt-2 w-32 sm:w-40 bg-[#1a1a1a] border border-white/10 rounded-lg z-10"
            >
              <button className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-xs sm:text-sm">
                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Edit</span>
              </button>
              <button 
                onClick={handleGenerate}
                className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-xs sm:text-sm"
              >
                <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Generate</span>
              </button>
              <button 
                onClick={() => handleDelete()}
                className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors text-xs sm:text-sm border-t border-white/10"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Delete</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Status & Last Modified */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Modified {lastModified}</span>
        </div>
        <div className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 border text-xs ${statusColors[status]} rounded`}>
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current"></span>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/5 transition-opacity">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#29142e] text-white text-xs sm:text-sm hover:bg-[#3a1f4a] transition-colors rounded"
          >
            Open
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-white/20 text-white text-xs sm:text-sm hover:bg-white/5 transition-colors rounded"
          >
            <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}