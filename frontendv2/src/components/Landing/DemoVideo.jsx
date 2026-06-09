import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

export default function DemoVideo() {
  const videoRef = useRef(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => setBlocked(true));
  }, []);

  const handleTap = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(() => setBlocked(false)).catch(() => {});
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-video bg-black border-2 border-white/20 rounded-xl overflow-hidden"
          onClick={blocked ? handleTap : undefined}
        >
          <video
            ref={videoRef}
            src="https://github.com/SCAFLDHQ/scafld-frontend/releases/download/pre-release/scafld-demo-2.mp4"
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />

          {blocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer">
              <div className="w-20 h-20 bg-[#29142e] rounded-full flex items-center justify-center">
                <Play className="w-10 h-10 text-white ml-1" fill="white" />
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-6 md:mt-8 text-center">
          <p className="text-white/60 text-sm">
            3 minutes demo • See the full workflow from design to deployment
          </p>
        </div>
      </div>
    </section>
  );
}
