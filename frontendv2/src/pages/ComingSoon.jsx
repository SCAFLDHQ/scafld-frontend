import { motion } from 'motion/react';

function BillingLockedIllustration() {
  return (
    <svg
      viewBox="0 0 340 180"
      width="100%"
      style={{ maxWidth: 340, imageRendering: 'pixelated' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="cs-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Schema card: Billing ── */}
      <rect x="80" y="12" width="180" height="156" rx="3" fill="#0d0d14" stroke="#7c3aed" strokeWidth="1.5" />
      <rect x="80" y="12" width="180" height="26" rx="3" fill="#29142e" />
      <rect x="80" y="26" width="180" height="12" fill="#29142e" />
      <text x="92" y="30" fontFamily="'Press Start 2P', monospace" fontSize="8" fill="#a78bfa">Billing</text>

      {/* divider */}
      <rect x="80" y="38" width="180" height="1" fill="#7c3aed" opacity="0.4" />

      {/* field rows */}
      <text x="92" y="53"  fontFamily="monospace" fontSize="8" fill="#7c3aed">tier</text>
      <text x="122" y="53" fontFamily="monospace" fontSize="8" fill="#ffffff" opacity="0.25">Choice</text>
      <rect x="92" y="58" width="156" height="1" fill="#ffffff" opacity="0.05" />

      <text x="92" y="72"  fontFamily="monospace" fontSize="8" fill="#7c3aed">price</text>
      <text x="128" y="72" fontFamily="monospace" fontSize="8" fill="#ffffff" opacity="0.25">Decimal</text>
      <rect x="92" y="77" width="156" height="1" fill="#ffffff" opacity="0.05" />

      <text x="92" y="91"  fontFamily="monospace" fontSize="8" fill="#7c3aed">currency</text>
      <text x="152" y="91" fontFamily="monospace" fontSize="8" fill="#ffffff" opacity="0.25">Char</text>
      <rect x="92" y="96" width="156" height="1" fill="#ffffff" opacity="0.05" />

      <text x="92" y="110" fontFamily="monospace" fontSize="8" fill="#7c3aed">status</text>
      <text x="128" y="110" fontFamily="monospace" fontSize="8" fill="#f59e0b" opacity="0.9">PENDING</text>
      <rect x="92" y="115" width="156" height="1" fill="#ffffff" opacity="0.05" />

      <text x="92" y="129" fontFamily="monospace" fontSize="8" fill="#7c3aed">launch_at</text>
      <text x="160" y="129" fontFamily="monospace" fontSize="8" fill="#a78bfa" opacity="0.6">soon™</text>

      {/* ── Padlock overlay ── */}
      {/* lock body */}
      <rect x="218" y="128" width="28" height="22" rx="3" fill="#29142e" stroke="#a78bfa" strokeWidth="1.5" filter="url(#cs-glow)" />
      {/* lock shackle */}
      <path d="M224 128 L224 120 Q232 113 240 120 L240 128" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" filter="url(#cs-glow)" />
      {/* keyhole */}
      <circle cx="232" cy="137" r="3" fill="#a78bfa" opacity="0.8" />
      <rect x="230.5" y="137" width="3" height="5" rx="1" fill="#a78bfa" opacity="0.8" />

      {/* scattered pixel dust around lock */}
      <rect x="212" y="124" width="3" height="3" fill="#a78bfa" opacity="0.4" />
      <rect x="248" y="130" width="2" height="2" fill="#7c3aed" opacity="0.5" />
      <rect x="250" y="122" width="3" height="3" fill="#a78bfa" opacity="0.3" />
      <rect x="209" y="135" width="2" height="2" fill="#c4b5fd" opacity="0.35" />
    </svg>
  );
}

export default function ComingSoon() {

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-4 py-16 text-center overflow-hidden">

      {/* scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ fontFamily: "'Press Start 2P', monospace" }}
          className="text-[11px] text-[#a78bfa]/60 tracking-widest uppercase"
        >
          status: pending
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{ fontFamily: "'Press Start 2P', monospace" }}
          className="text-3xl sm:text-4xl font-bold text-[#a78bfa] drop-shadow-[0_0_28px_rgba(167,139,250,0.45)] leading-snug"
        >
          COMING<br />SOON
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="w-full px-2"
        >
          <BillingLockedIllustration />
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{ fontFamily: "'Press Start 2P', monospace" }}
          className="text-[9px] sm:text-[10px] text-white/35 leading-loose max-w-[270px]"
        >
          Billing is being wired up.<br />
          Paid plans launch soon.
        </motion.p>

        {/* Blinking cursor */}
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: 'steps(1)' }}
          style={{ fontFamily: "'Press Start 2P', monospace" }}
          className="text-[#a78bfa] text-sm"
        >
          ▮
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 mt-1"
        >
          <a
            href="/dashboard"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
            className="text-[9px] px-5 py-3 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors rounded-lg"
          >
            ← Dashboard
          </a>
          <a
            href="/"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
            className="text-[9px] px-5 py-3 bg-[#29142e] border border-[#7c3aed]/40 text-[#a78bfa] hover:bg-[#3a1f4a] hover:border-[#a78bfa]/60 transition-colors rounded-lg shadow-[0_0_14px_rgba(124,58,237,0.25)]"
          >
            Return Home
          </a>
        </motion.div>
      </div>
    </div>
  );
}
