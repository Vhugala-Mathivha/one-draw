import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, X, User, Mail, Key } from 'lucide-react';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ isOpen, onClose, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  
  // Form States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // If registering, use the provided username. 
      // If logging in, derive a username from email for this demo.
      const finalUsername = isRegister ? username : (email.split('@')[0] || 'User');
      
      onLogin(finalUsername);
      
      setLoading(false);
      onClose();
      
      // Reset form
      setUsername('');
      setEmail('');
      setPassword('');
      setIsRegister(false);
    }, 1200);
  };

  const toggleMode = () => {
      setIsRegister(!isRegister);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl relative overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Abstract Background Shapes */}
            <div className={`absolute top-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full blur-3xl opacity-50 pointer-events-none transition-colors duration-500 ${isRegister ? 'bg-blue-100' : 'bg-orange-50'}`}></div>
            <div className={`absolute bottom-[-10%] left-[-10%] w-[200px] h-[200px] rounded-full blur-3xl opacity-50 pointer-events-none transition-colors duration-500 ${isRegister ? 'bg-purple-100' : 'bg-gray-50'}`}></div>

            <div className="p-8 relative z-10">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-black tracking-tighter mb-2">
                    {isRegister ? 'Join' : 'One'}<span className="text-orange-500">{isRegister ? 'OneDraw' : 'Draw'}</span>
                </h1>
                <p className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                    {isRegister ? 'Create your player profile' : 'Sign in to start winning'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {isRegister && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        >
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-300" />
                                <input 
                                    type="text" 
                                    required={isRegister}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                                    placeholder="PlayerOne"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-300" />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                        placeholder="you@onedraw.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 w-5 h-5 text-gray-300" />
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                        placeholder="••••••••"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 group mt-6 shadow-lg shadow-orange-500/20"
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      {isRegister ? 'Create Account' : 'Sign In'} 
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Lock className="w-3 h-3" />
                <span>Secured by Quantum Encryption</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
              <p className="text-gray-400 text-xs">
                {isRegister ? "Already have an account?" : "Don't have an account?"}{' '}
                <button 
                    onClick={toggleMode}
                    className="text-orange-500 font-bold cursor-pointer hover:underline focus:outline-none"
                >
                    {isRegister ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};