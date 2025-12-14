import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, SELECTION_COUNT } from '../types';

interface DrawProps {
  gameState: GameState;
  drawnNumbers: number[];
  onDrawComplete: () => void;
}

export const Draw: React.FC<DrawProps> = ({ gameState, drawnNumbers, onDrawComplete }) => {
  const [displayedNumbers, setDisplayedNumbers] = useState<number[]>([]);
  const [currentDrawIndex, setCurrentDrawIndex] = useState(0);

  useEffect(() => {
    if (gameState === GameState.IDLE) {
      setDisplayedNumbers([]);
      setCurrentDrawIndex(0);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === GameState.DRAWING) {
      if (currentDrawIndex < SELECTION_COUNT) {
        const timeout = setTimeout(() => {
          setDisplayedNumbers(prev => [...prev, drawnNumbers[currentDrawIndex]]);
          setCurrentDrawIndex(prev => prev + 1);
        }, 1500);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          onDrawComplete();
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [gameState, currentDrawIndex, drawnNumbers, onDrawComplete]);

  if (gameState === GameState.IDLE) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-200 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        <div className="relative z-10">
          <div className="w-40 h-40 mx-auto mb-6 rounded-full border-4 border-gray-100 flex items-center justify-center bg-white shadow-sm">
             <span className="text-6xl font-black text-gray-100 select-none">?</span>
          </div>
          <h3 className="text-xl font-bold text-black mb-1">Awaiting Draw</h3>
          <p className="text-gray-400 text-sm">Draws happen instantly upon ticket submission.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-black rounded-2xl relative overflow-hidden p-6 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-black to-black"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
            <h3 className="text-2xl font-black text-white tracking-widest animate-pulse uppercase">
                {gameState === GameState.DRAWING ? 'Live Draw' : 'Results'}
            </h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: SELECTION_COUNT }).map((_, idx) => {
            const number = displayedNumbers[idx];
            return (
              <div key={idx} className="aspect-square relative">
                <AnimatePresence mode="wait">
                  {number ? (
                    <motion.div
                      key="ball"
                      initial={{ scale: 0, rotateX: 90 }}
                      animate={{ scale: 1, rotateX: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-full h-full rounded-full bg-white flex items-center justify-center border-4 border-gray-200 shadow-xl"
                    >
                      <span className="text-3xl font-black text-black">{number}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full h-full rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-gray-800 rounded-full animate-ping" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
