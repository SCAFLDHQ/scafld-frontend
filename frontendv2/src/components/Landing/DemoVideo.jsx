import { motion } from 'motion/react';

export default function DemoVideo() {
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
        >
          <video
            src="https://github.com/SCAFLDHQ/scafld-frontend/releases/download/pre-release/scafld-demo-2.mp4"
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        </motion.div>

        <div className="mt-6 md:mt-8 text-center">
          <p className="text-white/60 text-sm">
            3 minutes demo • See the full workflow from design to deployment
          </p>
        </div>
      </div>
    </section>
  )
}