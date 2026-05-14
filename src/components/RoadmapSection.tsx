import { useRef, useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { CheckCircle2, Clock, Rocket } from 'lucide-react';
import { DecryptText } from './DecryptText';

const timeline = [
  {
    phase: 'Phase 1: Foundation',
    status: 'completed',
    title: 'uddoktaOS & banglaPay Live',
    description: 'Establishing the core business tools and financial infrastructure for the Super App ecosystem.',
    icon: CheckCircle2,
    color: 'text-green-400',
    glowColor: '#4ade80',
  },
  {
    phase: 'Phase 2: Expansion',
    status: 'in-progress',
    title: 'sheba link Beta',
    description: 'Integrating the health sector. Bridging the gap between rural patients and urban medical experts.',
    icon: Clock,
    color: 'text-neonTeal',
    glowColor: '#00F0FF',
  },
  {
    phase: 'Phase 3: Lifestyle & Mobility',
    status: 'upcoming',
    title: 'glowUp & drivable Launch',
    description: 'Expanding into daily lifestyle needs with beauty services and autonomous vehicle rentals.',
    icon: Rocket,
    color: 'text-electricIndigo',
    glowColor: '#6600FF',
  },
  {
    phase: 'Phase 4: Singularity',
    status: 'upcoming',
    title: 'Agentic Core Full Deployment',
    description: 'All apps merged into a single interface governed by an autonomous AI that anticipates user needs.',
    icon: Rocket,
    color: 'text-gray-500',
    glowColor: '#6b7280',
  },
];

// Thresholds: what scroll progress (0-1) lights up each milestone
const THRESHOLDS = [0.0, 0.28, 0.56, 0.82];

export const RoadmapSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const maxProgressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 35%'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (v > maxProgressRef.current) {
        maxProgressRef.current = v;
        setProgress(v);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const isLit = (idx: number) => progress >= THRESHOLDS[idx];

  return (
    <section id="roadmap" className="py-24 px-6 md:px-12 lg:px-24 bg-obsidian relative z-10" ref={sectionRef}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The{' '}
            <DecryptText text="Roadmap" className="text-neonTeal" duration={500} delay={100} />
          </h2>
          <p className="text-gray-400 font-system-mono text-sm">
            <DecryptText text="// trajectory → ultimate AI Super App" duration={800} delay={300} />
          </p>
        </motion.div>

        {/* Thread of Light */}
        <div className="relative flex gap-8">
          {/* Left: glowing SVG line column */}
          <div className="relative flex-shrink-0 w-8 flex justify-center">
            {/* Dim background line */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-white/5" />

            {/* Animated glow fill */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] origin-top"
              style={{
                height: `${Math.min(progress, 1) * 100}%`,
                background: 'linear-gradient(to bottom, #00F0FF, #6600FF)',
                boxShadow: '0 0 6px rgba(0,240,255,0.8), 0 0 16px rgba(0,240,255,0.3)',
              }}
            />

            {/* Pulse dot at tip with sparks */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-neonTeal"
              style={{
                top: `calc(${Math.min(progress, 0.99) * 100}% - 6px)`,
                boxShadow: '0 0 12px rgba(0,240,255,1), 0 0 24px rgba(0,240,255,0.5)',
                opacity: progress > 0.01 ? 1 : 0,
              }}
            >
              {/* Sparks emitting from the pulse */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-neonTeal rounded-full"
                  animate={{
                    x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 100],
                    y: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 100],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.5,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </motion.div>

            {/* Milestone dots at evenly spaced positions */}
            {THRESHOLDS.map((threshold, idx) => (
              <div
                key={idx}
                className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all duration-500 flex items-center justify-center"
                style={{
                  top: `calc(${threshold * 100}% - 8px)`,
                  borderColor: isLit(idx) ? timeline[idx].glowColor : 'rgba(255,255,255,0.15)',
                  backgroundColor: isLit(idx) ? timeline[idx].glowColor : 'transparent',
                  boxShadow: isLit(idx) ? `0 0 10px ${timeline[idx].glowColor}` : 'none',
                }}
              />
            ))}
          </div>

          {/* Right: timeline cards */}
          <div className="flex-1 space-y-14">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                animate={isLit(idx) ? { opacity: 1, x: 0 } : { opacity: 0.25, x: 16 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative"
              >
                <div
                  className="rounded-2xl p-6 border transition-all duration-500"
                  style={{
                    borderColor: isLit(idx) ? `${timeline[idx].glowColor}40` : 'rgba(255,255,255,0.05)',
                    boxShadow: isLit(idx) ? `0 0 20px ${timeline[idx].glowColor}15` : 'none',
                    background: isLit(idx) ? `linear-gradient(135deg, ${timeline[idx].glowColor}08, transparent)` : 'rgba(255,255,255,0.01)',
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <span className={`text-xs font-bold tracking-widest uppercase mb-2 md:mb-0 font-system-mono ${item.color}`}>
                      {item.phase}
                    </span>
                    <span className="text-xs text-gray-500 px-3 py-1 rounded-full bg-white/5 border border-white/10 inline-block w-fit font-system-mono">
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
