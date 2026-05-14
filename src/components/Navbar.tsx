import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'home',     label: 'Home' },
  { id: 'projects', label: 'Ecosystem' },
  { id: 'vision',   label: 'Vision' },
  { id: 'demo',     label: 'AI Demo' },
  { id: 'roadmap',  label: 'Roadmap' },
  { id: 'team',     label: 'Architects' },
];

const MagneticButton = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { damping: 15, stiffness: 200 });
  const y = useSpring(rawY, { damping: 15, stiffness: 200 });

  return (
    <motion.button
      ref={btnRef}
      style={{ x, y }}
      onMouseMove={(e) => {
        if (!btnRef.current) return;
        const r = btnRef.current.getBoundingClientRect();
        rawX.set((e.clientX - r.left - r.width / 2) * 0.35);
        rawY.set((e.clientY - r.top  - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => { rawX.set(0); rawY.set(0); }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
};

export const Navbar = ({ onLaunchClick }: { onLaunchClick: () => void }) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observers = NAV_ITEMS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: '-30% 0px -50% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-obsidian/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-lg">
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neonTeal to-electricIndigo group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xl font-bold tracking-tight group-hover:text-neonTeal transition-colors">BanglaApps</span>
        </a>

        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-300">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="relative px-4 py-2 rounded-full transition-colors hover:text-white"
              style={{ color: activeId === id ? 'white' : undefined }}
            >
              {activeId === id && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full border border-neonTeal/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </a>
          ))}
        </div>

        <MagneticButton
          onClick={onLaunchClick}
          className="relative group px-6 py-2 rounded-full font-medium text-sm overflow-hidden energy-border-btn cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neonTeal to-electricIndigo opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          <span className="relative z-10 group-hover:text-white text-gray-300 transition-colors font-system-mono tracking-wider">Launch App</span>
        </MagneticButton>
      </div>
    </motion.nav>
  );
};
