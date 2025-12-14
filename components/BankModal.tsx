import React, { useState } from 'react';
import { X, Building2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLink: () => void;
  isLinked: boolean;
}

export const BankModal: React.FC<BankModalProps> = ({ isOpen, onClose, onLink, isLinked }) => {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLink();
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-500" />
            Link Bank Account
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {isLinked ? (
             <div className="text-center py-8">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle2 className="w-8 h-8" />
               </div>
               <h3 className="text-lg font-bold mb-2">Account Linked</h3>
               <p className="text-gray-500 mb-6">Your primary bank account is actively linked for deposits and withdrawals.</p>
               <button onClick={onClose} className="w-full btn-primary py-3 rounded-xl font-bold">Done</button>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-500 text-sm mb-4">
                Connect your bank account to enable instant withdrawals of your winnings. OneDraw uses bank-grade encryption.
              </p>
              
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Account Holder</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3" placeholder="John Doe" required />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">IBAN / Account Number</label>
                <input 
                  type="text" 
                  value={account}
                  onChange={e => setAccount(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono" 
                  placeholder="US89 3704 0044 0532 0130 00" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-accent py-3 rounded-xl font-bold mt-2"
              >
                {loading ? 'Verifying...' : 'Link Account'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
