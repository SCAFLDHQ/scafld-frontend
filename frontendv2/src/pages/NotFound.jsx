import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

function BrokenSchemaIllustration() {
  return (
    <svg
      viewBox="0 0 340 180"
      width="100%"
      style={{ maxWidth: 340, imageRendering: 'pixelated' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="nf-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Left card: User ── */}
      <rect x="4" y="18" width="112" height="144" rx="3" fill="#0d0d14" stroke="#7c3aed" strokeWidth="1.5" />
      <rect x="4" y="18" width="112" height="26" rx="3" fill="#29142e" />
      <rect x="4"  y="32" width="112" height="12" fill="#29142e" />
      <text x="14" y="36" fontFamily="'Press Start 2P', monospace" fontSize="8" fill="#a78bfa">User</text>

      {/* divider */}
      <rect x="4" y="44" width="112" height="1" fill="#7c3aed" opacity="0.4" />

      {/* field rows */}
      <text x="14" y="57"  fontFamily="monospace" fontSize="8" fill="#7c3aed">id</text>
      <text x="38" y="57"  fontFamily="monospace" fontSize="8" fill="#ffffff" opacity="0.25">Integer</text>
      <rect x="14" y="62" width="94" height="1" fill="#ffffff" opacity="0.05" />

      <text x="14" y="75"  fontFamily="monospace" fontSize="8" fill="#7c3aed">email</text>
      <text x="52" y="75"  fontFamily="monospace" fontSize="8" fill="#ffffff" opacity="0.25">Char</text>
      <rect x="14" y="80" width="94" height="1" fill="#ffffff" opacity="0.05" />

      <text x="14" y="93"  fontFamily="monospace" fontSize="8" fill="#7c3aed">name</text>
      <text x="52" y="93"  fontFamily="monospace" fontSize="8" fill="#ffffff" opacity="0.25">Char</text>
      <rect x="14" y="98" width="94" height="1" fill="#ffffff" opacity="0.05" />

      <text x="14" y="111" fontFamily="monospace" fontSize="8" fill="#7c3aed">tier</text>
      <text x="38" y="111" fontFamily="monospace" fontSize="8" fill="#ffffff" opacity="0.25">Choice</text>
      <rect x="14" y="116" width="94" height="1" fill="#ffffff" opacity="0.05" />

      <text x="14" y="129" fontFamily="monospace" fontSize="8" fill="#7c3aed">posts</text>
      <text x="52" y="129" fontFamily="monospace" fontSize="8" fill="#a78bfa" opacity="0.7">1→N</text>

      {/* connector dot */}
      <circle cx="116" cy="129" r="5" fill="#7c3aed" filter="url(#nf-glow)" />

      {/* ── Broken relationship line ── */}
      {/* left segment */}
      <line x1="121" y1="129" x2="148" y2="129" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 3" opacity="0.9" />
      {/* right segment */}
      <line x1="192" y1="129" x2="220" y2="129" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 3" opacity="0.9" />

      {/* scattered break pixels */}
      <rect x="152" y="122" width="4" height="4" fill="#a78bfa" opacity="0.85" />
      <rect x="160" y="127" width="3" height="3" fill="#7c3aed" opacity="0.6" />
      <rect x="156" y="132" width="4" height="4" fill="#a78bfa" opacity="0.55" />
      <rect x="165" y="120" width="2" height="2" fill="#c4b5fd" opacity="0.45" />
      <rect x="170" y="126" width="4" height="4" fill="#a78bfa" opacity="0.8" />
      <rect x="164" y="134" width="3" height="3" fill="#7c3aed" opacity="0.5" />
      <rect x="176" y="122" width="2" height="2" fill="#c4b5fd" opacity="0.35" />
      <rect x="178" y="130" width="3" height="3" fill="#a78bfa" opacity="0.6" />
      <rect x="185" y="124" width="2" height="2" fill="#7c3aed" opacity="0.4" />

      {/* "?" above break */}
      <text
        x="160" y="116"
        fontFamily="'Press Start 2P', monospace"
        fontSize="14"
        fill="#a78bfa"
        filter="url(#nf-glow)"
      >?</text>

      {/* connector dot right card */}
      <circle cx="224" cy="129" r="5" fill="#7c3aed" filter="url(#nf-glow)" />

      {/* ── Right card: Post ── */}
      <rect x="228" y="18" width="108" height="144" rx="3" fill="#0d0d14" stroke="#7c3aed" strokeWidth="1.5" />
      <rect x="228" y="18" width="108" height="26" rx="3" fill="#29142e" />
      <rect x="228" y="32" width="108" height="12" fill="#29142e" />
      <text x="238" y="36" fontFamily="'Press Start 2P', monospace" fontSize="8" fill="#a78bfa">Post</text>

      <rect x="228" y="44" width="108" height="1" fill="#7c3aed" opacity="0.4" />

      <text x="238" y="57"  fontFamily="monospace" fontSize="8" fill="#7c3aed">id</text>
      <text x="258" y="57"  fontFamily="monospace" fontSize="8" fill="#ffffff" opacity="0.25">Integer</text>
      <rect x="238" y="62" width="90" height="1" fill="#ffffff" opacity="0.05" />

      <text x="238" y="75"  fontFamily="monospace" fontSize="8" fill="#7c3aed">title</text>
      <text x="266" y="75"  fontFamily="monospace" fontSize="8" fill="#ffffff" opacity="0.25">Char</text>
      <rect x="238" y="80" width="90" height="1" fill="#ffffff" opacity="0.05" />

      <text x="238" y="93"  fontFamily="monospace" fontSize="8" fill="#7c3aed">body</text>
      <text x="266" y="93"  fontFamily="monospace" fontSize="8" fill="#ffffff" opacity="0.25">Text</text>
      <rect x="238" y="98" width="90" height="1" fill="#ffffff" opacity="0.05" />

      <text x="238" y="111" fontFamily="monospace" fontSize="8" fill="#7c3aed">status</text>
      <text x="278" y="111" fontFamily="monospace" fontSize="8" fill="#ffffff" opacity="0.25">Bool</text>
      <rect x="238" y="116" width="90" height="1" fill="#ffffff" opacity="0.05" />

      {/* broken FK reference */}
      <text x="238" y="129" fontFamily="monospace" fontSize="8" fill="#7c3aed">user</text>
      <text x="266" y="129" fontFamily="monospace" fontSize="8" fill="#ef4444" opacity="0.8">FK→?</text>
    </svg>
  );
}

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-4 py-16 text-center overflow-hidden">

      {/* scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ fontFamily: "'Press Start 2P', monospace" }}
          className="text-6xl sm:text-8xl font-bold text-[#a78bfa] drop-shadow-[0_0_28px_rgba(167,139,250,0.45)]"
        >
          404
        </motion.div>

        {/* Broken schema illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="w-full px-2"
        >
          <BrokenSchemaIllustration />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontFamily: "'Press Start 2P', monospace" }}
          className="text-sm sm:text-base text-white leading-loose"
        >
          Relationship not found.
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontFamily: "'Press Start 2P', monospace" }}
          className="text-[9px] sm:text-[10px] text-white/35 leading-loose max-w-[260px]"
        >
          This schema node doesn't exist.<br />The FK is broken. Head back.
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
          <button
            onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/dashboard')}
            style={{ fontFamily: "'Press Start 2P', monospace" }}
            className="text-[9px] px-5 py-3 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors rounded-lg"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ fontFamily: "'Press Start 2P', monospace" }}
            className="text-[9px] px-5 py-3 bg-[#29142e] border border-[#7c3aed]/40 text-[#a78bfa] hover:bg-[#3a1f4a] hover:border-[#a78bfa]/60 transition-colors rounded-lg shadow-[0_0_14px_rgba(124,58,237,0.25)]"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
