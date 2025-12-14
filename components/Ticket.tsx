import React from 'react';
import { TOTAL_NUMBERS, SELECTION_COUNT, TICKET_PRICE } from '../types';
import { Trash2, Ticket as TicketIcon } from 'lucide-react';

interface TicketProps {
  selectedNumbers: number[];
  onSelectNumber: (num: number) => void;
  onClear: () => void;
  onPurchase: () => void;
  balance: number;
}

export const Ticket: React.FC<TicketProps> = ({
  selectedNumbers,
  onSelectNumber,
  onClear,
  onPurchase,
  balance,
}) => {
  const isComplete = selectedNumbers.length === SELECTION_COUNT;
  const canAfford = balance >= TICKET_PRICE;

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-2xl h-full flex flex-col shadow-sm">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-black flex items-center gap-2">
          <TicketIcon className="text-orange-500" />
          Classic Ticket
        </h2>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full">
          Pick {SELECTION_COUNT}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-6 flex-grow overflow-y-auto content-start custom-scrollbar p-1">
        {Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1).map((num) => {
          const isSelected = selectedNumbers.includes(num);
          return (
            <button
              key={num}
              onClick={() => onSelectNumber(num)}
              className={`aspect-square rounded-full flex items-center justify-center text-sm sm:text-lg font-bold transition-all duration-200 ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 transform scale-105'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-black'
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>

      <div className="space-y-3 mt-auto pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Ticket Cost</span>
          <span className="font-mono text-black font-bold text-lg">${TICKET_PRICE}</span>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClear}
            disabled={selectedNumbers.length === 0}
            className="px-4 py-3 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={onPurchase}
            disabled={!isComplete || !canAfford}
            className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-wide transition-all transform active:scale-[0.99] ${
              isComplete && canAfford
                ? 'btn-primary shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {!canAfford ? 'Top Up Wallet' : 'Submit Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
};
