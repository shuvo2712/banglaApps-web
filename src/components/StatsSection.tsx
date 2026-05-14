import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, Users, Store, Zap } from 'lucide-react';

const stats = [
  { id: 1, label: 'Active Users', value: 150000, suffix: '+', icon: Users, color: 'text-neonTeal', stroke: '#00F0FF' },
  { id: 2, label: 'Businesses Onboarded', value: 2500, suffix: '+', icon: Store, color: 'text-electricIndigo', stroke: '#6600FF' },
  { id: 3, label: 'Daily Transactions', value: 85000, suffix: '+', icon: Activity, color: 'text-green-400', stroke: '#4ade80' },
  { id: 4, label: 'Agentic Actions/Sec', value: 1024, suffix: '', icon: Zap, color: 'text-pink-500', stroke: '#ec4899' },
];

// Heartbeat-style SVG sparkline that animates continuously
const HeartbeatGraph = ({ stroke }: { stroke: string }) => {
  const [points, setPoints] = useState<number[]>(() =>
    Array.from({ length: 20 }, () => 40 + Math.random() * 20)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => {
        const next = [...prev.slice(1)];
        // Occasionally add a spike for heartbeat feel
        const spike = Math.random() > 0.85;
        next.push(spike ? 10 + Math.random() * 15 : 35 + Math.random() * 25);
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const W = 120;
  const H = 40;
  const stepX = W / (points.length - 1);
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * stepX},${p}`)
    .join(' ');

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="opacity-80">
      {/* Glow filter */}
      <defs>
        <filter id={`glow-${stroke.replace('#', '')}`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Fill under line */}
      <path
        d={`${d} L ${W},${H} L 0,${H} Z`}
        fill={stroke}
        fillOpacity={0.06}
      />
      {/* The glowing line */}
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        filter={`url(#glow-${stroke.replace('#', '')})`}
      />
    </svg>
  );
};

// Smoothly ticking counter with live micro-jitter after reaching target
const LiveCounter = ({ from, to, duration, inView, suffix }: {
  from: number; to: number; duration: number; inView: boolean; suffix: string
}) => {
  const [count, setCount] = useState(from);
  const done = useRef(false);

  // Initial count-up animation
  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const animate = (t: number) => {
      if (!startTime) startTime = t;
      const progress = Math.min((t - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * (to - from) + from));
      if (progress < 1) requestAnimationFrame(animate);
      else done.current = true;
    };
    requestAnimationFrame(animate);
  }, [inView, from, to, duration]);

  // Live micro-jitter after reaching target
  useEffect(() => {
    if (!inView) return;
    const jitter = setInterval(() => {
      if (!done.current) return;
      const delta = Math.floor(Math.random() * 50) - 10; // small up/down tick
      setCount(prev => Math.max(to, prev + delta));
    }, 1200);
    return () => clearInterval(jitter);
  }, [inView, to]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

export const StatsSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-obsidian relative z-10 border-y border-white/5" ref={ref}>
      {/* Oscilloscope grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-system-mono text-xs text-green-400 tracking-widest uppercase">LIVE SYSTEM DASHBOARD</span>
        </div>
        <p className="font-system-mono text-xs text-gray-600">// real-time metrics · auto-refreshing</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:border-white/20 transition-colors duration-300"
            >
              {/* Faint icon watermark */}
              <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity ${stat.color}`}>
                <stat.icon className="w-24 h-24" />
              </div>

              <div className="relative z-10">
                {/* Top: icon + live indicator */}
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-system-mono text-[10px] text-green-500 tracking-wider">LIVE</span>
                  </div>
                </div>

                {/* Counter */}
                <h3 className="text-3xl md:text-4xl font-extrabold mb-1 text-white tracking-tight font-system-mono">
                  <LiveCounter from={0} to={stat.value} duration={2} inView={isInView} suffix={stat.suffix} />
                </h3>
                <p className="text-xs text-gray-500 font-system-mono uppercase tracking-widest mb-4">{stat.label}</p>

                {/* Heartbeat sparkline */}
                <div className="border-t border-white/5 pt-3 -mx-1">
                  {isInView && <HeartbeatGraph stroke={stat.stroke} />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
