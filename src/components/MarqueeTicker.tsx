export const MarqueeTicker = () => {
  const items = [
    'uddoktaOS', 'banglaPay', 'sheba link', 'glowUp', 'drivable',
    'AGENTIC AI', 'SUPER APP v2.0', 'FUTURE IN MOTION', 'BANGLAAPPS ECOSYSTEM',
  ];

  return (
    <div className="w-full overflow-hidden border-y border-white/5 bg-white/[0.01] py-3 relative z-10">
      <div className="marquee-track flex whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-8 px-8 font-system-mono text-[11px] text-gray-600 uppercase tracking-[0.2em]">
            <span className="text-neonTeal text-base leading-none">·</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
