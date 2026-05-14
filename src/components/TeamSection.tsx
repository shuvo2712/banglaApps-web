import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Globe, Mail, Link } from 'lucide-react';
import { DecryptText } from './DecryptText';

const team = [
  {
    name: 'Tanzim Ahmed',
    role: 'Founder & CEO',
    bio: 'Visionary architect behind the BanglaApps ecosystem. Passionate about democratizing AI for Bangladesh.',
    image: 'https://i.pravatar.cc/300?img=11', // Placeholder
    glow: 'from-neonTeal/30 to-transparent',
    color: 'from-neonTeal to-electricIndigo'
  },
  {
    name: 'Sarah Rahman',
    role: 'CTO & Head of AI',
    bio: 'Former DeepMind researcher. Leading the development of the Agentic Core and autonomous systems.',
    image: 'https://i.pravatar.cc/300?img=5', // Placeholder
    glow: 'from-electricIndigo/30 to-transparent',
    color: 'from-electricIndigo to-purple-500'
  },
  {
    name: 'Rafiq Islam',
    role: 'VP of Product (Fintech)',
    bio: '10+ years scaling fintech platforms. The driving force behind banglaPay and financial integrations.',
    image: 'https://i.pravatar.cc/300?img=8', // Placeholder
    glow: 'from-pink-500/30 to-transparent',
    color: 'from-pink-500 to-rose-500'
  }
];

const HolographicTeamCard = ({ member, children }: { member: typeof team[0], children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scaleTarget = useMotionValue(1);
  const zTarget = useMotionValue(0);
  const opacityTarget = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { damping: 20, stiffness: 400 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { damping: 20, stiffness: 400 });
  const scale = useSpring(scaleTarget, { damping: 15, stiffness: 300 });
  const z = useSpring(zTarget, { damping: 15, stiffness: 300 });
  const glareOpacity = useSpring(opacityTarget, { damping: 20, stiffness: 300 });

  useEffect(() => {
    scaleTarget.set(isHovered ? 1.05 : 1);
    zTarget.set(isHovered ? 30 : 0);
    opacityTarget.set(isHovered ? 1 : 0);
  }, [isHovered, scaleTarget, zTarget, opacityTarget]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div style={{ perspective: "1000px" }} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(0);
          mouseY.set(0);
        }}
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        className="relative bg-obsidian border border-white/10 rounded-3xl overflow-hidden h-full flex flex-col group"
      >
        {/* Scanning Line */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
          style={{ opacity: glareOpacity }}
        >
          <motion.div 
            className="w-full h-[1px] bg-neonTeal/50 shadow-[0_0_15px_rgba(0,240,255,0.8)]"
            animate={isHovered ? { top: ["0%", "100%"], opacity: [0, 1, 1, 0] } : { top: "0%", opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', left: 0 }}
          />
        </motion.div>

        {/* Energy Glow */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${member.color} blur-2xl pointer-events-none`} />
        
        <motion.div className="relative z-10 flex-1 flex flex-col" style={{ translateZ: z }}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const TeamSection = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const memberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [constellationLines, setConstellationLines] = useState<{x1:number;y1:number;x2:number;y2:number}[]>([]);

  const computeLines = (fromIdx: number) => {
    if (!gridRef.current) return;
    const containerRect = gridRef.current.getBoundingClientRect();
    const fromEl = memberRefs.current[fromIdx];
    if (!fromEl) return;
    const fromRect = fromEl.getBoundingClientRect();
    const fx = fromRect.left - containerRect.left + fromRect.width / 2;
    const fy = fromRect.top - containerRect.top + fromRect.height / 2;
    const lines = memberRefs.current
      .map((el, idx) => {
        if (idx === fromIdx || !el) return null;
        const r = el.getBoundingClientRect();
        return {
          x1: fx, y1: fy,
          x2: r.left - containerRect.left + r.width / 2,
          y2: r.top - containerRect.top + r.height / 2,
        };
      })
      .filter(Boolean) as {x1:number;y1:number;x2:number;y2:number}[];
    setConstellationLines(lines);
  };

  return (
    <section id="team" className="py-24 px-6 md:px-12 lg:px-24 bg-obsidian relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonTeal to-electricIndigo">
              <DecryptText text="Architects" duration={500} delay={100} />
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-system-mono text-sm">
            <DecryptText text="// the minds building the future in motion" duration={800} delay={300} />
          </p>
        </motion.div>

        {/* Grid with constellation SVG overlay */}
        <div className="relative" ref={gridRef}>
          {/* Constellation SVG lines */}
          <AnimatePresence>
            {hoveredIdx !== null && constellationLines.length > 0 && (
              <motion.svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 30 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <defs>
                  <filter id="cline-glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                {constellationLines.map((ln, i) => (
                  <g key={i}>
                    <line
                      x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
                      stroke="#00F0FF" strokeWidth="0.8" strokeOpacity="0.35"
                      strokeDasharray="6 5" filter="url(#cline-glow)"
                    />
                    <circle cx={ln.x2} cy={ln.y2} r="3" fill="#00F0FF" opacity="0.5" filter="url(#cline-glow)" />
                  </g>
                ))}
              </motion.svg>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                ref={(el: HTMLDivElement | null) => { memberRefs.current[idx] = el; }}
                onMouseEnter={() => { setHoveredIdx(idx); computeLines(idx); }}
                onMouseLeave={() => { setHoveredIdx(null); setConstellationLines([]); }}
                className="h-full"
              >
                <HolographicTeamCard member={member}>
                    <div className={`h-32 bg-gradient-to-b ${member.glow}`} />
                    
                    <div className="px-8 pb-8 flex-1 flex flex-col items-center text-center -mt-16">
                      <div className="w-32 h-32 rounded-full border-4 border-obsidian overflow-hidden mb-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-neonTeal to-electricIndigo animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDuration: '3s' }} />
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover relative z-10 rounded-full border-2 border-transparent bg-obsidian p-1"
                        />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-neonTeal font-medium text-sm mb-4 tracking-wide uppercase">{member.role}</p>
                      <p className="text-gray-400 text-sm mb-6 flex-1">{member.bio}</p>
                      
                      <div className="flex gap-4 items-center justify-center">
                        <a href="#" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><Globe className="w-4 h-4" /></a>
                        <a href="#" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><Mail className="w-4 h-4" /></a>
                        <a href="#" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><Link className="w-4 h-4" /></a>
                      </div>
                    </div>
                </HolographicTeamCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
