import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ArrowRight, Sparkles } from 'lucide-react';

const PREDEFINED_PROMPTS = [
  "Book a doctor's appointment and a ride there.",
  "Transfer 500 BDT and track my SME sales.",
  "Schedule a spa day using my glowUp credits."
];

const RESPONSES: Record<string, string> = {
  [PREDEFINED_PROMPTS[0]]: "Agentic Core: I've booked an appointment at Apollo Clinic for 3:00 PM via sheba link. A drivable rental will arrive at 2:15 PM to pick you up. Estimated total: 1,200 BDT. Proceed?",
  [PREDEFINED_PROMPTS[1]]: "Agentic Core: 500 BDT transferred via banglaPay successfully. Fetching uddoktaOS... Your SME generated 45,000 BDT in sales today, up 12% from yesterday.",
  [PREDEFINED_PROMPTS[2]]: "Agentic Core: Booking confirmed at Aura Spa for tomorrow at 11:00 AM via glowUp. 2,000 credits applied. Remaining balance: 450 credits."
};

export const AiDemoSection = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello. I am the BanglaApps Agentic Core. How can I autonomously orchestrate your day?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handlePromptClick = (prompt: string) => {
    if (isTyping) return;

    setMessages(prev => [...prev, { sender: 'user', text: prompt }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: RESPONSES[prompt] }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <section id="demo" className="py-24 px-6 md:px-12 lg:px-24 bg-obsidian relative z-10 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-neonTeal/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electricIndigo/10 text-electricIndigo border border-electricIndigo/20 text-sm font-medium">
            <Sparkles className="w-4 h-4" /> Live Interactive Demo
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Talk to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonTeal to-electricIndigo">Agentic Core</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Experience the future of autonomous app navigation. The Super App doesn't wait for you to find what you need—it anticipates and executes across our entire ecosystem.
          </p>

          <div className="space-y-3 pt-4">
            <p className="text-sm text-gray-500 font-mono uppercase">Try a command:</p>
            {PREDEFINED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                disabled={isTyping}
                className="block w-full text-left px-5 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-neonTeal/50 hover:bg-white/10 transition-all text-gray-300 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span>"{prompt}"</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-neonTeal" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex-1 w-full max-w-md h-[500px] bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.05)] overflow-hidden"
        >
          <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neonTeal to-electricIndigo flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
            </div>
            <div>
              <h3 className="font-medium text-white">Agentic Core</h3>
              <p className="text-xs text-green-400">Online & Ready</p>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col relative">
            {/* Floating data particles */}
            {[11, 22, 33, 45, 57, 68, 79, 90].map((left, i) => (
              <div
                key={i}
                className="data-particle"
                style={{
                  left: `${left}%`,
                  bottom: `${10 + (i * 17) % 55}%`,
                  animationDuration: `${3.5 + i * 0.6}s`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-white/10 border border-white/10 text-white rounded-tr-sm'
                      : 'bg-gradient-to-br from-neonTeal/10 to-electricIndigo/10 border border-neonTeal/20 text-gray-200 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-neonTeal animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-neonTeal animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-neonTeal animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
