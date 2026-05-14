import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Briefcase, HeartPulse, Sparkles, Car, CreditCard } from 'lucide-react';
import { DecryptText } from './DecryptText';

const projects = [
  {
    title: 'uddoktaOS',
    status: 'Live',
    description: 'Currently running. Comprehensive SaaS for SME management, empowering local entrepreneurs.',
    icon: <Briefcase className="w-8 h-8 text-neonTeal" />,
    color: 'from-neonTeal/30 to-transparent',
    borderColor: 'hover:border-neonTeal/50',
    glowColor: 'from-neonTeal to-electricIndigo'
  },
  {
    title: 'sheba link',
    status: 'Beta',
    description: 'Bridging the health-tech gap by seamlessly linking doctors, patients, and clinics.',
    icon: <HeartPulse className="w-8 h-8 text-electricIndigo" />,
    color: 'from-electricIndigo/30 to-transparent',
    borderColor: 'hover:border-electricIndigo/50',
    glowColor: 'from-electricIndigo to-purple-500'
  },
  {
    title: 'glowUp',
    status: 'Staging',
    description: 'Beauty & lifestyle marketplace connecting salons, spas, and clients with seamless booking.',
    icon: <Sparkles className="w-8 h-8 text-pink-400" />,
    color: 'from-pink-500/30 to-transparent',
    borderColor: 'hover:border-pink-500/50',
    glowColor: 'from-pink-500 to-rose-500'
  },
  {
    title: 'drivable',
    status: 'Dev',
    description: 'Self-drive vehicle rental platform bringing autonomous mobility to every Bangladeshi city.',
    icon: <Car className="w-8 h-8 text-orange-400" />,
    color: 'from-orange-500/30 to-transparent',
    borderColor: 'hover:border-orange-500/50',
    glowColor: 'from-orange-500 to-amber-500'
  },
  {
    title: 'banglaPay',
    status: 'Live',
    description: 'Unified fintech aggregator. Send money, pay bills, and manage finances in one tap.',
    icon: <CreditCard className="w-8 h-8 text-green-400" />,
    color: 'from-green-500/30 to-transparent',
    borderColor: 'hover:border-green-500/50',
    glowColor: 'from-green-400 to-emerald-500'
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const HolographicCard = ({ project, children }: { project: typeof projects[0], children: React.ReactNode }) => {
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
    zTarget.set(isHovered ? 35 : 0);
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
        className={`relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm cursor-pointer transition-colors duration-300 h-full flex flex-col group ${project.borderColor}`}
      >
        {/* Scanning Line */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-3xl"
          style={{ opacity: glareOpacity }}
        >
          <motion.div 
            className="w-full h-[1px] bg-neonTeal/50 shadow-[0_0_15px_rgba(0,240,255,0.8)]"
            animate={isHovered ? { top: ["0%", "100%"], opacity: [0, 1, 1, 0] } : { top: "0%", opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', left: 0 }}
          />
        </motion.div>

        {/* Energy Glow */}
        <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${project.glowColor} blur-2xl pointer-events-none`} />
        
        <motion.div className="relative z-10 flex-1 flex flex-col" style={{ translateZ: z }}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const ProjectGallery = () => {
  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-24 bg-obsidian relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Our{' '}
            <DecryptText text="Ecosystem" className="text-neonTeal" duration={500} delay={100} />
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-system-mono text-sm">
            <DecryptText text="// constellation of specialized platforms → BanglaApps vision" duration={800} delay={300} />
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <HolographicCard key={project.title} project={project}>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/[0.05] rounded-xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  {project.icon}
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-gray-300">
                  {project.status}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-neonTeal transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {project.description}
              </p>
            </HolographicCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
