import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MIN_PUNCH_BET } from '../types';

interface LuckyPunchProps {
  balance: number;
  punchesRemaining: number;
  onPunch: (bet: number, target: number, punched: number) => void;
}

export const LuckyPunch: React.FC<LuckyPunchProps> = ({ balance, punchesRemaining, onPunch }) => {
  const [bet, setBet] = useState<number>(10);
  const [target, setTarget] = useState<number>(50);
  const [currentNumber, setCurrentNumber] = useState<number>(1);
  const [lastResult, setLastResult] = useState<'WIN' | 'LOSS' | null>(null);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cycling logic: Runs every second (1000ms) or slightly faster to make it "critical thinking" timing?
  // User asked for "generate a different number every second".
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentNumber(Math.floor(Math.random() * 99) + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handlePunch = () => {
    if (punchesRemaining <= 0 || balance < bet) return;
    if (bet < MIN_PUNCH_BET) return;

    // Capture the number at the moment of click
    const punched = currentNumber;
    
    // Win Condition: The User "Selects" a matching number.
    // Meaning: The User predicted 'Target', and clicked when 'Current' == 'Target'.
    const won = punched === target;

    if (won) {
        setLastResult('WIN');
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#F97316', '#FFFFFF']
        });
    } else {
        setLastResult('LOSS');
    }

    onPunch(bet, target, punched);
    
    setTimeout(() => setLastResult(null), 2500);
  };

  const getNumberColor = (num: number) => {
    if (num === target) return 'text-green-500 scale-110'; // Visual cue
    return 'text-white';
  };

  return (
    <div id="punch" className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-1 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-3xl"></div>
      
      <div className="bg-black/40 backdrop-blur-xl rounded-[20px] p-6 md:p-10 h-full flex flex-col md:flex-row gap-8 items-center">
        
        {/* Game Visual */}
        <div className="flex-1 flex flex-col items-center justify-center relative w-full">
            <h2 className="absolute top-0 left-0 text-xl font-black italic text-orange-500 flex items-center gap-2">
                <Zap className="fill-orange-500" /> LUCKY PUNCH
            </h2>

            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center my-8">
                {/* Rotating Rings */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-orange-500/20 rounded-full border-t-orange-500"
                />
                 <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border-2 border-white/10 rounded-full border-b-white/50"
                />

                {/* The Number */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentNumber}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        transition={{ duration: 0.2 }}
                        className={`text-9xl font-black ${getNumberColor(currentNumber)} drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]`}
                    >
                        {currentNumber}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Result Feedback */}
            <AnimatePresence>
                {lastResult && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`absolute inset-0 flex items-center justify-center bg-black/90 z-20 rounded-xl flex-col`}
                    >
                        <h3 className={`text-6xl font-black italic mb-2 ${lastResult === 'WIN' ? 'text-green-500' : 'text-red-500'}`}>
                            {lastResult === 'WIN' ? 'JACKPOT!' : 'MISSED!'}
                        </h3>
                        <p className="text-white text-xl">
                             {lastResult === 'WIN' ? `Payout: R${bet * target}` : `Stopped at ${currentNumber}`}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex-1 w-full max-w-md bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="space-y-6">
                
                {/* Target Selector */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold uppercase text-gray-400">Target Number</label>
                        <span className="text-orange-500 font-black text-lg">{target}</span>
                    </div>
                    <input 
                        type="range" 
                        min="1" 
                        max="99" 
                        value={target}
                        onChange={(e) => setTarget(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
                        <span>Risk: LOW</span>
                        <span>Potential Win: R{bet * target}</span>
                    </div>
                </div>

                {/* Bet Selector */}
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Bet Amount (Min R{MIN_PUNCH_BET})</label>
                    <div className="grid grid-cols-4 gap-2">
                        {[2, 5, 10, 50].map(amt => (
                            <button 
                                key={amt}
                                onClick={() => setBet(amt)}
                                className={`py-2 rounded font-bold transition-all ${bet === amt ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                            >
                                R{amt}
                            </button>
                        ))}
                    </div>
                    <div className="mt-2 flex items-center">
                         <span className="text-gray-400 text-xs mr-2">Custom:</span>
                         <input 
                            type="number" 
                            min={MIN_PUNCH_BET}
                            value={bet}
                            onChange={(e) => setBet(Math.max(MIN_PUNCH_BET, parseInt(e.target.value) || 0))}
                            className="bg-transparent border-b border-gray-600 w-20 text-white font-mono focus:border-orange-500 outline-none"
                         />
                    </div>
                </div>

                {/* Action */}
                <button 
                    onClick={handlePunch}
                    disabled={punchesRemaining === 0 || lastResult !== null || balance < bet}
                    className="w-full py-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-2xl uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    <Target className="w-8 h-8" /> PUNCH
                </button>
                
                <div className="text-center text-xs text-gray-500 uppercase tracking-widest">
                    {punchesRemaining} Punches Remaining Today
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
