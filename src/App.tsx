import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { GalaxyBackground } from './components/GalaxyBackground';
import { ProjectGallery } from './components/ProjectGallery';
import { VisionSection } from './components/VisionSection';
import { StatsSection } from './components/StatsSection';
import { AiDemoSection } from './components/AiDemoSection';
import { RoadmapSection } from './components/RoadmapSection';
import { TeamSection } from './components/TeamSection';
import { AtmosphereToggle } from './components/AtmosphereToggle';
import { MarqueeTicker } from './components/MarqueeTicker';
import { SectionReveal } from './components/SectionReveal';
import { X, Terminal } from 'lucide-react';

const SneakPeekModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-xl" onClick={onClose} />
          <motion.div 
            className="relative w-full max-w-4xl bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)]"
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8 md:p-12 text-center">
              <div className="inline-block p-4 rounded-full bg-neonTeal/10 mb-6">
                <Terminal className="w-10 h-10 text-neonTeal" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Super App <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonTeal to-electricIndigo">Interface v1.0</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
                The centralized agentic dashboard is currently compiling. Soon, you will be able to manage your businesses, book health services, rent vehicles, and process payments—all from one autonomous command center.
              </p>
              
              <div className="relative mx-auto max-w-2xl aspect-[16/9] rounded-2xl border border-white/10 bg-black/50 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-neonTeal/20 to-electricIndigo/20 opacity-50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 border-2 border-dashed border-neonTeal/50 rounded-full flex items-center justify-center"
                  >
                    <div className="w-16 h-16 border-2 border-electricIndigo/50 rounded-full" />
                  </motion.div>
                  <p className="mt-6 font-mono text-sm text-neonTeal animate-pulse">AWAITING_DEPLOYMENT</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Live system clock for footer
const LiveClock = () => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);
  return (
    <span className="font-system-mono text-xs text-neonTeal/60">
      SYS_TIME: {time} <span className="animate-pulse">█</span>
    </span>
  );
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarping, setIsWarping] = useState(false);

  // Glitch title state
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0, active: false });
  const glitchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scheduleGlitch = () => {
      glitchRef.current = setTimeout(() => {
        setGlitchOffset({ x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 4, active: true });
        setTimeout(() => setGlitchOffset({ x: -(Math.random() - 0.5) * 6, y: 0, active: true }), 60);
        setTimeout(() => {
          setGlitchOffset({ x: 0, y: 0, active: false });
          scheduleGlitch();
        }, 130);
      }, 3500 + Math.random() * 4000);
    };
    scheduleGlitch();
    return () => { if (glitchRef.current) clearTimeout(glitchRef.current); };
  }, []);

  const handleLaunchClick = () => {
    setIsWarping(true);
    setTimeout(() => {
      setIsModalOpen(true);
      setIsWarping(false);
    }, 800);
  };

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleX = useSpring(scrollYProgress, { damping: 30, stiffness: 200 });

  return (
    <div className="relative bg-obsidian text-white min-h-screen font-sans selection:bg-neonTeal selection:text-black">
      {/* Overlays */}
      <div className="noise-overlay" />
      <div className="crt-overlay" />

      {/* Scroll Progress Glowbar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[999] shadow-[0_0_8px_rgba(0,240,255,0.8)]"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #00F0FF, #6600FF, #FF00A0)',
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Navbar onLaunchClick={handleLaunchClick} />
        <SneakPeekModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <main>
          {/* Hero Section */}
          <section id="home" className="relative h-[110vh] min-h-[950px] max-h-[1200px] w-full flex flex-col items-center justify-center pt-20">
            <GalaxyBackground isWarping={isWarping} />
            <motion.div 
              className="relative z-10 text-center pointer-events-none px-4 w-full flex flex-col items-center"
              style={{ y: heroY, opacity: heroOpacity }}
            >
              <div className="mb-6 px-5 py-2 rounded-full energy-border-btn backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                <span className="text-xs md:text-sm font-bold tracking-[0.25em] text-neonTeal uppercase font-system-mono">The BanglaApps Super App</span>
              </div>

              {/* Glitch Title */}
              <motion.div
                animate={{ x: glitchOffset.x, y: glitchOffset.y }}
                transition={{ type: 'tween', duration: 0.05 }}
                style={{ filter: glitchOffset.active ? 'hue-rotate(30deg) saturate(180%)' : 'none' }}
              >
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-none">
                  <span className="block text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">Future in</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neonTeal via-blue-400 to-electricIndigo drop-shadow-[0_0_30px_rgba(0,240,255,0.4)] pb-2">
                    motion.
                  </span>
                </h1>
              </motion.div>
              
              <p className="text-lg md:text-xl lg:text-2xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed border-t border-white/10 pt-8 mt-2">
                Building <span className="text-white font-medium">SaaS</span>, <span className="text-white font-medium">AI</span>, and <span className="text-white font-medium">Agentic tools</span> to revolutionize life in Bangladesh and beyond.
              </p>
            </motion.div>
          </section>



          {/* Marquee Ticker between hero and ecosystem */}
          <SectionReveal>
            <MarqueeTicker />
          </SectionReveal>

          <SectionReveal>
            <ProjectGallery />
          </SectionReveal>
          
          <SectionReveal>
            <VisionSection />
          </SectionReveal>
          
          <SectionReveal>
            <StatsSection />
          </SectionReveal>
          
          <SectionReveal>
            <AiDemoSection />
          </SectionReveal>
          
          <SectionReveal>
            <RoadmapSection />
          </SectionReveal>
          
          <SectionReveal>
            <TeamSection />
          </SectionReveal>
        </main>

        <AtmosphereToggle />

        {/* Footer */}
        <footer className="bg-obsidian border-t border-white/5 pt-16 pb-8 px-6 relative z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neonTeal/50 to-transparent" />
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neonTeal to-electricIndigo shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
                <span className="text-2xl font-bold tracking-tight">BanglaApps</span>
              </div>
              <p className="text-gray-400 max-w-xs">
                The ultimate AI Super App ecosystem. One endpoint for all your digital needs.
              </p>
            </div>
            
            <div className="font-system-mono text-sm">
              <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">System Status</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> uddoktaOS: Online</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> banglaPay: Online</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500" /> sheba link: Beta</li>
              </ul>
            </div>
            
            <div className="text-sm">
              <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Connect</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-neonTeal transition-colors">Twitter / X</a></li>
                <li><a href="#" className="hover:text-neonTeal transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-neonTeal transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-system-mono">
            <p>© {new Date().getFullYear()} BanglaApps. All rights reserved.</p>
            <LiveClock />
            <p>ENCRYPTED // AGENTIC_CORE_ACTIVE</p>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}

export default App;
