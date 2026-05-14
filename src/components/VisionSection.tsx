import { motion } from 'framer-motion';
import { Bot, Network, Zap } from 'lucide-react';
import { DecryptText } from './DecryptText';

export const VisionSection = () => {
  return (
    <section id="vision" className="py-24 px-6 md:px-12 lg:px-24 bg-obsidian relative z-10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electricIndigo/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        <div className="flex-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              <DecryptText text="One Endpoint." duration={400} delay={100} />
              <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonTeal to-electricIndigo">
                <DecryptText text="Infinite Possibilities." duration={600} delay={300} />
              </span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              We are building the architect of Bangladesh's AI-driven future. 
              The BanglaApps Super App will be powered by Agentic AI—autonomous 
              agents anticipating and serving your digital needs before you even ask.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-neonTeal/10 text-neonTeal">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Agentic AI</h4>
                <p className="text-gray-400">Intelligent autonomous agents executing tasks across the ecosystem on your behalf.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-electricIndigo/10 text-electricIndigo">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Unified Ecosystem</h4>
                <p className="text-gray-400">Health, transport, finance, and commerce seamlessly interconnected.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex-1 relative w-full aspect-square max-w-md mx-auto"
        >
          {/* Wireframe orbit rings */}
          {[
            { w: 180, h: 60,  rz: 0,   duration: 14 },
            { w: 280, h: 90,  rz: 55,  duration: 20 },
            { w: 380, h: 125, rz: -38, duration: 28 },
          ].map((ring, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 border border-neonTeal/10 rounded-full pointer-events-none"
              style={{
                width: ring.w,
                height: ring.h,
                marginLeft: -ring.w / 2,
                marginTop: -ring.h / 2,
                rotateX: '75deg',
                rotateZ: ring.rz,
              }}
              animate={{ rotateZ: ring.rz + 360 }}
              transition={{ duration: ring.duration, repeat: Infinity, ease: 'linear' }}
            />
          ))}

          {/* Central Logo/Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-neonTeal to-electricIndigo flex items-center justify-center z-20 shadow-[0_0_50px_rgba(0,240,255,0.4)]">
            <Zap className="w-12 h-12 text-white" />
          </div>
          
          {/* Pulsing rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neonTeal/30"
              style={{ width: `${ring * 120}px`, height: `${ring * 120}px` }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, delay: ring * 0.5 }}
            />
          ))}

          {/* Floating nodes connecting to center */}
          {['Health', 'Pay', 'Travel', 'Shop', 'SaaS'].map((label, index) => {
            const angle = (index / 5) * Math.PI * 2;
            const radius = 160;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={label}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ x, y }}
                animate={{ 
                  x: [x, 0], 
                  y: [y, 0],
                  opacity: [1, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: index * 0.4,
                  ease: "easeInOut"
                }}
              >
                <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm font-medium text-white shadow-lg">
                  {label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
