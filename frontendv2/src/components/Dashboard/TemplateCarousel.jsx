import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Loader2, Star, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

export default function TemplateCarousel() {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingTemplate, setUsingTemplate] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(1);

  // Responsive items to show
  const getItemsToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
    }
    return 1;
  };

  useEffect(() => {
    setItemsToShow(getItemsToShow());
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await apiService.getTemplates();
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.results || data);
      }
    } catch {
      // silently fail — templates are non-critical
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (template) => {
    setUsingTemplate(template.id);
    try {
      const response = await apiService.useTemplate(template.id, {
        description: template.description,
        framework: template.framework || 'django',
      });
      const data = await response.json();
      if (response.ok && data.project_id) {
        navigate(`/canvas/${data.project_id}`);
      } else {
        alert(data.error || 'Failed to create project from template');
      }
    } catch {
      alert('Failed to create project from template');
    } finally {
      setUsingTemplate(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl sm:text-2xl">Popular Templates</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-lg animate-pulse">
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded mb-4 w-3/4"></div>
              <div className="h-16 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }



  const handlePrev = () => {
    setStartIndex(Math.max(0, startIndex - 1));
  };

  const handleNext = () => {
    setStartIndex(Math.min(templates.length - itemsToShow, startIndex + 1));
  };

  const visibleTemplates = templates.slice(startIndex, startIndex + itemsToShow);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl sm:text-2xl mb-2">Popular Templates</h2>
          <p className="text-white/60 text-sm sm:text-base">Start with pre-built templates to ship faster</p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="p-2 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-lg"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={startIndex >= templates.length - itemsToShow}
            className="p-2 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-lg"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {visibleTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ y: -4 }}
            className="bg-white/5 border border-white/10 p-4 sm:p-6 transition-all hover:border-[#29142e] cursor-pointer group rounded-lg"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm sm:text-base mb-1 truncate">{template.name}</h3>
                <div className="text-xs px-2 py-1 inline-block bg-[#29142e]/30 text-[#29142e] border border-[#29142e]/50 rounded">
                  {template.framework}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/60 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
              {template.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
              {(template.tags || []).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-white/5 text-white/60 border border-white/10 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1 text-white/60">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  <span>{template.rating || '4.5'}</span>
                </div>
                <div className="flex items-center gap-1 text-white/60">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{template.downloads || '0'}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: usingTemplate ? 1 : 1.05 }}
                whileTap={{ scale: usingTemplate ? 1 : 0.95 }}
                onClick={() => handleUseTemplate(template)}
                disabled={!!usingTemplate}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#29142e] text-white text-xs sm:text-sm transition-all hover:bg-[#3a1f4a] disabled:opacity-60 rounded"
              >
                {usingTemplate === template.id
                  ? <><Loader2 className="w-3 h-3 animate-spin" /> Generating…</>
                  : 'Use Template'}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}