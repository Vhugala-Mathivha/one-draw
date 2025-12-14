import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Ticket, ArrowRight, Star, ShieldCheck, Users } from 'lucide-react';

interface LandingPageProps {
  onNavigateLogin: () => void;
  onPlayClick: (section?: 'PUNCH' | 'LOTTO') => void;
}

// Generate a large string of random numbers for the background
// Doubled the length for better coverage during animation
const NUMBER_GRID = Array.from({ length: 1200 }, () => Math.floor(Math.random() * 10)).join(' ');

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateLogin, onPlayClick }) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white font-sans overflow-x-hidden">
      {/* Custom Nav for Landing */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50 max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-black text-2xl skew-x-[-10deg]">
              <span className="skew-x-[10deg]">1</span>
           </div>
           <span className="text-2xl font-black tracking-tighter">ONE<span className="text-orange-500">DRAW</span></span>
        </div>
        <button 
          onClick={onNavigateLogin}
          className="px-6 py-2 border border-white/20 rounded-full font-bold hover:bg-white hover:text-black transition-all text-sm uppercase tracking-wider"
        >
          Player Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

        <motion.div 
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="relative z-10 max-w-5xl mx-auto"
        >
           <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              Live Jackpot: R 1,250,000
           </div>

           <h1 className="text-6xl md:text-9xl font-black leading-none tracking-tighter mb-8 drop-shadow-2xl">
              PREDICT<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-300 to-white">THE FUTURE</span>
           </h1>

           <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              The world's first skill-calibrated prediction market. 
              Analyze the patterns. Punch the numbers. Claim the glory.
           </p>

           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => onPlayClick()}
                className="group relative px-8 py-4 bg-orange-500 text-white font-black text-lg uppercase tracking-wider rounded-none skew-x-[-10deg] hover:bg-orange-400 transition-all min-w-[200px]"
              >
                 <span className="block skew-x-[10deg] flex items-center justify-center gap-2">
                    Start Playing <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </span>
                 {/* Glow effect */}
                 <div className="absolute inset-0 bg-orange-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity -z-10"></div>
              </button>
           </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 text-xs uppercase tracking-widest"
        >
          Scroll to Explore
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-4 relative z-10 bg-black">
         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
            
            {/* Card 1: Lucky Punch */}
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="group relative h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-[#0f0f0f] shadow-2xl"
            >
               {/* Designed Background: NUMBER GRID - ANIMATED & VISIBLE */}
               <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="absolute inset-0 bg-[#0a0a0a]"></div>
                  
                  {/* Sliding Number Pattern */}
                  <motion.div 
                    animate={{ x: [-50, 0], y: [-50, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-[100px] opacity-20"
                  >
                     <div className="w-full h-full text-xs font-mono font-bold leading-5 text-orange-500/40 break-all select-none whitespace-pre-wrap rotate-[-5deg]">
                        {NUMBER_GRID}
                     </div>
                  </motion.div>

                  {/* Pulsing Orange Energy Burst */}
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(249,115,22,0.6)_0%,transparent_60%)] blur-3xl"
                  ></motion.div>
                  
                  {/* Rotating Abstract Shape */}
                  <div className="absolute bottom-20 right-10 w-32 h-32 border-2 border-orange-500/30 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-1000 bg-black/40 backdrop-blur-md">
                      <div className="w-20 h-20 border border-orange-500/30 rounded-full"></div>
                  </div>
               </div>
               
               {/* Content Overlay */}
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 z-10"></div>
               
               <div className="absolute bottom-0 left-0 p-10 z-20">
                  <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 text-black shadow-[0_0_30px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_50px_rgba(249,115,22,0.8)] transition-all duration-300">
                     <Zap className="w-8 h-8 fill-black" />
                  </div>
                  <h3 className="text-4xl font-black italic uppercase mb-2 text-white drop-shadow-lg">Lucky Punch</h3>
                  <div className="w-12 h-1 bg-orange-500 mb-4 shadow-[0_0_10px_rgba(249,115,22,1)]"></div>
                  <p className="text-gray-300 mb-8 max-w-sm leading-relaxed font-medium">
                      Reflex-based high frequency trading. Lock onto the target number. 
                      <span className="text-orange-400 font-bold block mt-2 text-lg">Win up to 99x your bet instantly.</span>
                  </p>
                  <button onClick={() => onPlayClick('PUNCH')} className="px-6 py-3 bg-white hover:bg-orange-500 text-black hover:text-white font-bold uppercase tracking-widest text-xs rounded-lg flex items-center gap-2 transition-all group-hover:gap-4 shadow-lg">
                     Play Demo <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </motion.div>

            {/* Card 2: Daily Lotto */}
            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="group relative h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-[#0f0f0f] shadow-2xl"
            >
               {/* Designed Background: VISIBLE MOVING BALLS */}
               <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="absolute inset-0 bg-[#080808]"></div>
                  
                  {/* Floating Balls Animation - More Opacity & Color */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm ${
                            i % 3 === 0 ? 'bg-gradient-to-br from-orange-400/30 to-orange-600/30 border border-orange-400/50' : 
                            i % 2 === 0 ? 'bg-gradient-to-br from-blue-400/30 to-blue-600/30 border border-blue-400/50' : 
                            'bg-gradient-to-br from-white/10 to-gray-400/10 border border-white/30'
                        }`}
                        initial={{ 
                            x: Math.random() * 400, 
                            y: Math.random() * 400,
                            scale: 0.8 + Math.random() * 0.4
                        }}
                        animate={{ 
                            x: [Math.random() * 100, Math.random() * 400, Math.random() * 200],
                            y: [Math.random() * 100, Math.random() * 400, Math.random() * 200],
                            rotate: [0, 180, 360]
                        }}
                        transition={{ 
                            duration: 20 + Math.random() * 10, 
                            repeat: Infinity, 
                            repeatType: "mirror",
                            ease: "easeInOut"
                        }}
                        style={{
                            width: 50 + Math.random() * 50,
                            height: 50 + Math.random() * 50,
                        }}
                    >
                        <span className="text-white/40 font-bold text-lg select-none">{Math.floor(Math.random() * 50) + 1}</span>
                    </motion.div>
                  ))}

                  {/* Matrix Dot Overlay for Texture */}
                  <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  {/* Mystical Glow */}
                  <motion.div 
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.5)_0%,transparent_60%)] blur-3xl"
                  ></motion.div>
               </div>
               
               {/* Content Overlay */}
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 z-10"></div>
               
               <div className="absolute bottom-0 left-0 p-10 z-20">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_50px_rgba(255,255,255,0.6)] transition-all duration-300">
                     <Ticket className="w-8 h-8" />
                  </div>
                  <h3 className="text-4xl font-black italic uppercase mb-2 text-white drop-shadow-lg">Daily Lotto</h3>
                  <div className="w-12 h-1 bg-blue-500 mb-4 shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
                  <p className="text-gray-300 mb-8 max-w-sm leading-relaxed font-medium">
                      The classic 5+1 format reimagined. 
                      <span className="text-blue-400 font-bold block mt-2 text-lg">Jackpot: R100,000 Daily.</span>
                  </p>
                  <button onClick={() => onPlayClick('LOTTO')} className="px-6 py-3 bg-white hover:bg-blue-500 text-black hover:text-white font-bold uppercase tracking-widest text-xs rounded-lg flex items-center gap-2 transition-all group-hover:gap-4 shadow-lg">
                     View Draw Times <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </motion.div>
         </div>
      </section>
      
      {/* Stats/Trust */}
      <section className="py-20 border-t border-white/10 bg-neutral-950">
         <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-24 opacity-70">
            <div className="flex items-center gap-4 group">
               <ShieldCheck className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
               <div className="text-left">
                  <div className="text-2xl font-black text-white">ISO 27001</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">Certified Secure</div>
               </div>
            </div>
            <div className="flex items-center gap-4 group">
               <Users className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
               <div className="text-left">
                  <div className="text-2xl font-black text-white">50K+</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">Active Players</div>
               </div>
            </div>
            <div className="flex items-center gap-4 group">
               <Star className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
               <div className="text-left">
                  <div className="text-2xl font-black text-white">98.5%</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">RTP Rate</div>
               </div>
            </div>
         </div>
      </section>

      <footer className="py-10 text-center text-gray-600 text-sm bg-black border-t border-white/5">
         <p>&copy; 2024 OneDraw Gaming. The future is yours to take.</p>
      </footer>
    </div>
  );
};