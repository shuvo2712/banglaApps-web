import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export const AtmosphereToggle = () => {
  const [enabled, setEnabled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const scrollGainRef = useRef<GainNode | null>(null);
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);

  const startAtmosphere = () => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);
    master.connect(ctx.destination);
    masterGainRef.current = master;

    const scrollGain = ctx.createGain();
    scrollGain.gain.setValueAtTime(1, ctx.currentTime);
    scrollGain.connect(master);
    scrollGainRef.current = scrollGain;

    // Layer 1: deep sub-bass drone (40Hz)
    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(40, ctx.currentTime);
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.6, ctx.currentTime);
    drone.connect(droneGain);
    droneGain.connect(scrollGain);
    drone.start();

    // Layer 2: mid-frequency hum (80Hz) for body
    const hum = ctx.createOscillator();
    hum.type = 'sine';
    hum.frequency.setValueAtTime(80, ctx.currentTime);
    const humGain = ctx.createGain();
    humGain.gain.setValueAtTime(0.25, ctx.currentTime);
    hum.connect(humGain);
    humGain.connect(scrollGain);
    hum.start();

    // Layer 3: high harmonic shimmer (320Hz, very quiet)
    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(320, ctx.currentTime);
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0.04, ctx.currentTime);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(scrollGain);
    shimmer.start();

    oscillatorsRef.current = [drone, hum, shimmer];
  };

  const stopAtmosphere = () => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1.5);
      setTimeout(() => {
        oscillatorsRef.current.forEach(o => { try { o.stop(); } catch {} });
        oscillatorsRef.current = [];
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
      }, 1600);
    }
  };

  // Scroll velocity reaction
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const current = window.scrollY;
      scrollVelocity.current = Math.abs(current - lastScrollY.current);
      lastScrollY.current = current;

      if (scrollGainRef.current && audioCtxRef.current) {
        const boost = 1 + Math.min(scrollVelocity.current / 30, 1.5);
        scrollGainRef.current.gain.setTargetAtTime(boost, audioCtxRef.current.currentTime, 0.1);
        // Decay back to 1
        setTimeout(() => {
          if (scrollGainRef.current && audioCtxRef.current) {
            scrollGainRef.current.gain.setTargetAtTime(1, audioCtxRef.current.currentTime, 0.5);
          }
        }, 200);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled]);

  const handleToggle = () => {
    if (enabled) {
      stopAtmosphere();
      setEnabled(false);
    } else {
      startAtmosphere();
      setEnabled(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="bg-obsidian border border-white/10 rounded-xl px-3 py-2 text-xs font-system-mono text-gray-300 whitespace-nowrap"
          >
            {enabled ? 'ATMOSPHERE: ACTIVE' : 'ATMOSPHERE: OFFLINE'}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileTap={{ scale: 0.9 }}
        className={`relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
          enabled ? 'energy-border-btn' : 'bg-white/5 border border-white/10'
        }`}
      >
        {/* Pulse ring when active */}
        {enabled && (
          <motion.div
            className="absolute inset-0 rounded-full border border-neonTeal/40"
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        {enabled
          ? <Volume2 className="w-5 h-5 text-neonTeal" />
          : <VolumeX className="w-5 h-5 text-gray-500" />
        }
      </motion.button>
    </div>
  );
};
