import React, { useState } from 'react';
import { X, CreditCard, Loader2, Banknote, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

const VOUCHER_AMOUNTS = [10, 20, 50, 100, 200, 500];

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDeposit }) => {
  const [pin, setPin] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation for demo purposes
    if (pin.length < 10) {
        setError('Invalid Voucher PIN. Please enter a valid 10-digit OZOW PIN.');
        return;
    }

    setLoading(true);
    
    // Simulate API verification delay
    setTimeout(() => {
        onDeposit(selectedAmount);
        setLoading(false);
        setPin('');
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-black p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-bold text-black">
                O
            </div>
            <h2 className="text-xl font-bold">OZOW Voucher</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <p className="text-xs text-orange-800 leading-relaxed">
                    Instantly load funds using your purchased OZOW voucher. Funds are available immediately for gameplay.
                </p>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Select Voucher Value</label>
                <div className="grid grid-cols-3 gap-2">
                    {VOUCHER_AMOUNTS.map(amount => (
                        <button
                            key={amount}
                            type="button"
                            onClick={() => setSelectedAmount(amount)}
                            className={`py-2 rounded-lg font-bold border-2 transition-all ${
                                selectedAmount === amount 
                                ? 'border-black bg-black text-white' 
                                : 'border-gray-100 text-gray-500 hover:border-gray-300'
                            }`}
                        >
                            R{amount}
                        </button>
                    ))}
                </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Voucher PIN</label>
              <div className="relative">
                <Banknote className="absolute left-3 top-3.5 w-5 h-5 text-gray-300" />
                <input 
                    type="text" 
                    value={pin}
                    onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setPin(val);
                        setError('');
                    }}
                    maxLength={16}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" 
                    placeholder="0000 0000 0000" 
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading || pin.length < 5}
              className="w-full btn-accent py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </>
              ) : (
                  <>
                    Redeem Voucher
                  </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
              <p className="text-[10px] text-gray-400 uppercase">Secure Payment Processing</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};