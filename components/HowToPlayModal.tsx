import React from 'react';
import { X, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'PUNCH' | 'LOTTO' | null;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 z-10 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <HelpCircle className="w-6 h-6" />
            </div>

            <h2 className="text-2xl font-black mb-2 uppercase">
                {type === 'PUNCH' ? 'Lucky Punch' : '5+1 Lotto'} Rules
            </h2>
            <p className="text-gray-500 text-sm font-bold mb-6 uppercase tracking-wide">How to Win</p>

            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                {type === 'PUNCH' ? (
                    <>
                        <p><strong className="text-black">1. Set Your Target:</strong> Choose a number between 1 and 99. Higher targets mean higher risk but bigger payouts.</p>
                        <p><strong className="text-black">2. Watch the Cycle:</strong> A random number generator cycles rapidly.</p>
                        <p><strong className="text-black">3. Punch:</strong> Click the 'PUNCH' button exactly when the displayed number matches your target.</p>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Payout Formula</span>
                            <span className="font-mono text-black font-bold">Bet Amount × Target Number</span>
                        </div>
                    </>
                ) : (
                    <>
                         <p><strong className="text-black">1. Pick Numbers:</strong> Select 5 main numbers (1-50) and 1 Lucky Number (1-10).</p>
                         <p><strong className="text-black">2. Place Bet:</strong> Tickets cost R5. You can buy multiple tickets.</p>
                         <p><strong className="text-black">3. The Draw:</strong> Draws happen instantly. Match numbers to win.</p>
                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>3 Matches + Lucky</span>
                                <span className="font-bold text-black">R50</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span>4 Matches + Lucky</span>
                                <span className="font-bold text-black">R500</span>
                            </div>
                             <div className="flex justify-between text-xs">
                                <span>5 Matches + Lucky</span>
                                <span className="font-bold text-orange-500">JACKPOT (R100,000)</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <button onClick={onClose} className="w-full btn-primary py-3 rounded-xl font-bold mt-8">
                Got it
            </button>
        </div>
      </motion.div>
    </div>
  );
};