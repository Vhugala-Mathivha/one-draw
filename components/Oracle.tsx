import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Loader2 } from 'lucide-react';
import { askOracle } from '../services/gemini';
import { OracleResponse } from '../types';

interface OracleProps {
  onNumbersGenerated: (numbers: number[]) => void;
}

export const Oracle: React.FC<OracleProps> = ({ onNumbersGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastReason, setLastReason] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setLastReason(null);
    try {
      const result: OracleResponse = await askOracle(prompt);
      onNumbersGenerated(result.numbers);
      setLastReason(result.reason);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl relative overflow-hidden">
      
      <div className="flex items-center gap-2 mb-3">
        <BrainCircuit className="w-5 h-5 text-orange-600" />
        <h2 className="text-lg font-bold text-orange-900">
          AI Predictor
        </h2>
      </div>

      <p className="text-xs text-orange-800/70 mb-4 font-medium">
        Describe your goal. Our AI will analyze patterns for you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Buying a new house"
            className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-md shadow-orange-200 flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Numbers
            </>
          )}
        </button>
      </form>

      {lastReason && (
        <div className="mt-4 p-3 bg-white/50 rounded-lg border border-orange-100 animate-fade-in">
          <p className="text-[10px] text-orange-400 uppercase tracking-widest mb-1 font-bold">Prediction Logic</p>
          <p className="text-sm text-orange-900 italic">"{lastReason}"</p>
        </div>
      )}
    </div>
  );
};
