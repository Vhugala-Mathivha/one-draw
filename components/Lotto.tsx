import React, { useState } from 'react';
import { MAIN_NUMBERS_COUNT, MAIN_POOL, LUCKY_POOL, LOTTO_PRICE } from '../types';
import { Ticket as TicketIcon, RotateCcw, Check } from 'lucide-react';

interface LottoProps {
  balance: number;
  onPurchase: (mainNumbers: number[], luckyNumber: number) => void;
  gameState: 'IDLE' | 'DRAWING' | 'RESULT';
  drawnNumbers: number[]; // First 5 are main, last 1 is lucky
  lastResult: { matches: number; luckyMatch: boolean; prize: number } | null;
  onReset: () => void;
}

export const Lotto: React.FC<LottoProps> = ({ balance, onPurchase, gameState, drawnNumbers, lastResult, onReset }) => {
  const [selectedMain, setSelectedMain] = useState<number[]>([]);
  const [selectedLucky, setSelectedLucky] = useState<number | null>(null);

  const toggleMain = (num: number) => {
    if (gameState !== 'IDLE') return;
    if (selectedMain.includes(num)) {
      setSelectedMain(prev => prev.filter(n => n !== num));
    } else if (selectedMain.length < MAIN_NUMBERS_COUNT) {
      setSelectedMain(prev => [...prev, num].sort((a,b) => a-b));
    }
  };

  const toggleLucky = (num: number) => {
    if (gameState !== 'IDLE') return;
    setSelectedLucky(prev => prev === num ? null : num);
  };

  const isReady = selectedMain.length === MAIN_NUMBERS_COUNT && selectedLucky !== null;
  const canAfford = balance >= LOTTO_PRICE;

  return (
    <div id="draw" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Selection Panel */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-black flex items-center gap-2">
                <TicketIcon className="text-orange-500" /> 5 + 1 LOTTO
            </h3>
            <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase">Price: R{LOTTO_PRICE}</span>
        </div>

        {/* Main Numbers Grid */}
        <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Select 5 Numbers (1-{MAIN_POOL})</h4>
            <div className="grid grid-cols-10 gap-2">
                {Array.from({ length: MAIN_POOL }, (_, i) => i + 1).map(num => (
                    <button
                        key={`main-${num}`}
                        onClick={() => toggleMain(num)}
                        disabled={gameState !== 'IDLE'}
                        className={`aspect-square rounded-md text-sm font-bold transition-all ${
                            selectedMain.includes(num)
                            ? 'bg-black text-white shadow-lg scale-110'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>

        {/* Lucky Number Grid */}
        <div className="mb-6">
            <h4 className="text-sm font-bold text-orange-500 uppercase mb-3">Select 1 Lucky Number (1-{LUCKY_POOL})</h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {Array.from({ length: LUCKY_POOL }, (_, i) => i + 1).map(num => (
                    <button
                        key={`lucky-${num}`}
                        onClick={() => toggleLucky(num)}
                        disabled={gameState !== 'IDLE'}
                        className={`w-12 h-12 flex-shrink-0 rounded-full text-lg font-bold transition-all border-2 ${
                            selectedLucky === num
                            ? 'bg-orange-500 border-orange-500 text-white shadow-lg scale-110'
                            : 'bg-white border-orange-200 text-orange-300 hover:border-orange-400'
                        }`}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>

        <div className="mt-auto">
            <button
                onClick={() => isReady && onPurchase(selectedMain, selectedLucky!)}
                disabled={!isReady || !canAfford || gameState !== 'IDLE'}
                className="w-full py-4 bg-black text-white font-black text-xl uppercase tracking-widest rounded-xl hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {gameState !== 'IDLE' ? 'Game in Progress' : !canAfford ? 'Insufficient Funds' : 'Place Bet'}
            </button>
        </div>
      </div>

      {/* Draw Visual Panel */}
      <div className="lg:col-span-5 bg-neutral-900 rounded-2xl p-6 text-white flex flex-col relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-800 to-black pointer-events-none"></div>
         
         <h3 className="relative z-10 text-center font-bold text-gray-500 uppercase tracking-widest mb-8">Live Draw</h3>
         
         <div className="relative z-10 flex-grow flex flex-col items-center justify-center">
            {gameState === 'IDLE' && !lastResult && (
                <div className="text-center text-gray-600">
                    <div className="text-6xl mb-4">?</div>
                    <p>Waiting for ticket...</p>
                </div>
            )}

            {(gameState === 'DRAWING' || gameState === 'RESULT') && (
                <div className="space-y-8 w-full">
                    {/* Main Balls */}
                    <div className="flex justify-center gap-3">
                        {Array.from({ length: MAIN_NUMBERS_COUNT }).map((_, i) => (
                            <div key={i} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-2 ${drawnNumbers[i] ? 'bg-white text-black border-white' : 'bg-transparent border-gray-700 text-gray-700'}`}>
                                {drawnNumbers[i] || '?'}
                            </div>
                        ))}
                    </div>
                    {/* Lucky Ball */}
                    <div className="flex justify-center">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl border-4 shadow-[0_0_20px_rgba(249,115,22,0.5)] ${drawnNumbers[5] ? 'bg-orange-500 text-white border-orange-500' : 'bg-transparent border-orange-900/30 text-orange-900/30'}`}>
                            {drawnNumbers[5] || '?'}
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'RESULT' && lastResult && (
                <div className="mt-8 text-center animate-fade-in bg-white/10 p-4 rounded-xl backdrop-blur-sm w-full">
                    <div className="text-sm font-bold uppercase text-gray-400 mb-1">Result</div>
                    <div className="text-3xl font-black mb-2">
                        {lastResult.prize > 0 ? <span className="text-green-400">R{lastResult.prize} WON</span> : <span className="text-gray-500">NO WIN</span>}
                    </div>
                    <div className="text-xs text-gray-400">
                        {lastResult.matches} Matches + {lastResult.luckyMatch ? 'Lucky Number' : 'No Bonus'}
                    </div>
                    <button onClick={onReset} className="mt-4 px-6 py-2 bg-white text-black rounded-full font-bold text-sm flex items-center gap-2 mx-auto hover:bg-gray-200">
                        <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                </div>
            )}
         </div>
      </div>

    </div>
  );
};
