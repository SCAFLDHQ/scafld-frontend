import { Play, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function DemoVideo() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // 1. FIX: Use only the clean Video ID. The ID is the value after 'v=' or 'youtu.be/'.
  // The original video ID (VHSyADee8zQ) implies the full link was: https://www.youtube.com/watch?v=VHSyADee8zQ&t=2s
  const cleanVideoId = "VHSyADee8zQ"; 

  // 2. CONSTANT FOR START TIME (in seconds), extracted from the original ID.
  const startTime = 2; 

  const openVideo = () => {
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
  };

  return (
    <section id="demo" className="px-4 sm:px-6 py-16 md:py-24 bg-white/5">
      <div className="max-w-4xl lg:max-w-5xl mx-auto">
        <div className="text-center mb-8 md:mb-12 space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            See SCAFLD in action
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base sm:text-lg">
            Watch how easy it is to build and deploy a production-ready API
          </p>
        </div>

        {/* Video Thumbnail/Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-video bg-white/5 border-2 border-white/20 rounded-xl flex items-center justify-center cursor-pointer group overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={openVideo}
        >
          {/* Video Thumbnail Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              // FIX: Use the clean Video ID for the thumbnail URL
              backgroundImage: `url(https://img.youtube.com/vi/${cleanVideoId}/maxresdefault.jpg)`,
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Play Button */}
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#29142e] flex items-center justify-center rounded-full transition-all group-hover:bg-[#3a1f4a]"
          >
            <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white ml-1 sm:ml-2" fill="white" />
          </motion.div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.3 : 0 }}
            className="absolute inset-0 bg-[#29142e] transition-opacity"
          />
        </motion.div>

        <div className="mt-6 md:mt-8 text-center">
          <p className="text-white/60 text-sm">
            3 minutes demo • See the full workflow from design to deployment
          </p>
        </div>

        {/* Video Modal */}
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={closeVideo}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeVideo}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* YouTube Video Embed */}
              <iframe
                // FIX: Use the standard embed URL format
                src={`https://www.youtube.com/embed/${cleanVideoId}?autoplay=1&rel=0&start=${startTime}`}
                title="SCAFLD Demo Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}