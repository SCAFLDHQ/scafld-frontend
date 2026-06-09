import { Construction } from 'lucide-react';

export default function ComingSoonPanel({ title, description }) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-sm space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
          <Construction className="w-7 h-7 text-white/30" />
        </div>
        <div className="space-y-2">
          <h3 className="text-white font-semibold">{title}</h3>
          <p className="text-white/40 text-sm leading-relaxed">{description}</p>
        </div>
        <span className="inline-block px-3 py-1 rounded-full bg-[#29142e]/40 border border-[#a78bfa]/20 text-[#a78bfa] text-xs font-medium">
          Coming Soon
        </span>
      </div>
    </div>
  );
}
