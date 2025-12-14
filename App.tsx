import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameState, Ticket as TicketType, User, ViewState, LOTTO_PRICE, MAIN_POOL, LUCKY_POOL } from './types';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import { LuckyPunch } from './components/LuckyPunch';
import { Lotto } from './components/Lotto';
import { History } from './components/History';
import { BankModal } from './components/BankModal';
import { DepositModal } from './components/DepositModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { LogOut, Wallet, User as UserIcon, Plus, Minus, HelpCircle } from 'lucide-react';

const App = () => {
  // Global App State
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(0); 
  const [bonusBalance, setBonusBalance] = useState(0);
  
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  
  const [helpType, setHelpType] = useState<'PUNCH' | 'LOTTO' | null>(null);
  const [targetSection, setTargetSection] = useState<'PUNCH' | 'LOTTO' | null>(null);
  
  const [tickets, setTickets] = useState<TicketType[]>([]);

  // Refs for scrolling
  const luckyPunchRef = useRef<HTMLElement>(null);
  const lottoRef = useRef<HTMLElement>(null);
  const historyRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  // Lotto State
  const [lottoState, setLottoState] = useState<GameState>(GameState.IDLE);
  const [lottoDrawn, setLottoDrawn] = useState<number[]>([]);
  const [lottoResult, setLottoResult] = useState<{ matches: number; luckyMatch: boolean; prize: number } | null>(null);

  // --- Persistence ---
  useEffect(() => {
    const savedUser = localStorage.getItem('onedraw_user');
    const savedBalance = localStorage.getItem('onedraw_balance');
    const savedBonus = localStorage.getItem('onedraw_bonus');
    const savedTickets = localStorage.getItem('onedraw_tickets');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedBalance) setBalance(parseFloat(savedBalance));
    if (savedBonus) setBonusBalance(parseFloat(savedBonus));
    if (savedTickets) setTickets(JSON.parse(savedTickets));
  }, []);

  useEffect(() => {
    if (user) {
        localStorage.setItem('onedraw_user', JSON.stringify(user));
        localStorage.setItem('onedraw_balance', balance.toString());
        localStorage.setItem('onedraw_bonus', bonusBalance.toString());
        localStorage.setItem('onedraw_tickets', JSON.stringify(tickets));
    }
  }, [user, balance, bonusBalance, tickets]);

  // --- Effects ---

  // Scroll to section after demo login
  useEffect(() => {
    if (user && targetSection) {
        setTimeout(() => {
            if (targetSection === 'PUNCH' && luckyPunchRef.current) {
                scrollToSection(luckyPunchRef);
            } else if (targetSection === 'LOTTO' && lottoRef.current) {
                scrollToSection(lottoRef);
            }
            setTargetSection(null);
        }, 100);
    }
  }, [user, targetSection]);

  // --- Handlers ---

  const handleLogin = (username: string) => {
    // Check if we are "re-logging in" to existing data or new user
    // Ideally we would key this by username, but for this demo we just check if *any* user was saved
    const existingUser = localStorage.getItem('onedraw_user');
    
    setUser({
      username,
      email: `${username}@example.com`,
      isBankLinked: false,
      punchesRemaining: 10
    });

    if (!existingUser) {
        // First time / Reset
        setBalance(0); 
        setBonusBalance(25);
        // Welcome Confetti
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#F97316', '#ffffff'] // Orange and White
            });
        }, 500);
    }
    
    setIsLoginModalOpen(false);
  };

  const handleDemoLogin = (section?: 'PUNCH' | 'LOTTO') => {
    setUser({
      username: 'DemoPlayer',
      email: 'demo@onedraw.com',
      isBankLinked: false,
      punchesRemaining: 20
    });
    setBalance(2000); 
    setBonusBalance(100);
    
    if (section) {
        setTargetSection(section);
    }
    
    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#F97316', '#ffffff'] 
        });
    }, 500);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('onedraw_user');
    // We keep balance/history in localStorage for UX demo purposes, 
    // but in a real app you'd clear sensitive data or keep it if "Remember Me"
  };

  const checkAuth = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return false;
    }
    return true;
  };

  const handleDepositClick = () => {
    if (!checkAuth()) return;
    setIsDepositModalOpen(true);
  };

  const handleWithdrawClick = () => {
    if (!checkAuth()) return;
    if (user?.isBankLinked) {
        if (balance <= 0) {
            alert("No funds available to withdraw.");
            return;
        }
        setBalance(0);
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.1 },
            colors: ['#cccccc', '#ffffff']
        });
        alert("Withdrawal processed to your linked account.");
    } else {
        setIsBankModalOpen(true);
    }
  };

  const handleVoucherRedeem = (amount: number) => {
    setBalance(prev => prev + amount);
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.1 },
        colors: ['#22c55e', '#ffffff'] // Green for money
    });
  };

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    if (!ref.current) {
        if (!user) {
            setIsLoginModalOpen(true);
        }
        return;
    }
    const yOffset = -100; // Adjust for fixed header
    const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
  };

  const handlePunch = (bet: number, target: number, punched: number) => {
    if (!checkAuth()) return;
    if (!user) return; // TS guard
    
    let amountToDeduct = bet;
    
    if (bonusBalance >= amountToDeduct) {
        setBonusBalance(prev => prev - amountToDeduct);
        amountToDeduct = 0;
    } else {
        amountToDeduct -= bonusBalance;
        setBonusBalance(0);
        setBalance(prev => prev - amountToDeduct);
    }
    
    setUser(prev => prev ? ({ ...prev, punchesRemaining: prev.punchesRemaining - 1 }) : null);

    const won = target === punched;
    const prize = won ? bet * punched : 0;

    if (won) {
        setBalance(prev => prev + prize);
    }

    const newTicket: TicketType = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'PUNCH',
        numbers: [target, punched],
        timestamp: Date.now(),
        isWinner: won,
        prize: prize
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const handleLottoPurchase = (mainNumbers: number[], luckyNumber: number) => {
     if (!checkAuth()) return;
     const totalFunds = balance + bonusBalance;
     if (totalFunds < LOTTO_PRICE) {
         setIsDepositModalOpen(true);
         return;
     }
     
     let cost = LOTTO_PRICE;
     if (bonusBalance >= cost) {
         setBonusBalance(prev => prev - cost);
     } else {
         cost -= bonusBalance;
         setBonusBalance(0);
         setBalance(prev => prev - cost);
     }

     setLottoState(GameState.DRAWING);
     setLottoResult(null);

     setTimeout(() => {
        const drawnMain = new Set<number>();
        while(drawnMain.size < 5) drawnMain.add(Math.floor(Math.random() * MAIN_POOL) + 1);
        const drawnLucky = Math.floor(Math.random() * LUCKY_POOL) + 1;
        
        const drawnArray = [...Array.from(drawnMain).sort((a,b)=>a-b), drawnLucky];
        setLottoDrawn(drawnArray);

        const matches = mainNumbers.filter(n => drawnMain.has(n)).length;
        const luckyMatch = luckyNumber === drawnLucky;
        
        let prize = 0;
        if (luckyMatch) {
            if (matches === 3) prize = 50;
            if (matches === 4) prize = 500;
            if (matches === 5) prize = 100000;
        }

        setLottoState(GameState.RESULT);
        setLottoResult({ matches, luckyMatch, prize });

        if (prize > 0) {
            setBalance(prev => prev + prize);
            confetti({
                particleCount: 200,
                spread: 120,
                colors: ['#000000', '#F97316']
            });
        }

        const newTicket: TicketType = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'LOTTO',
            numbers: [...mainNumbers, luckyNumber],
            timestamp: Date.now(),
            isWinner: prize > 0,
            matchCount: matches,
            luckyMatch: luckyMatch,
            prize: prize
        };
        setTickets(prev => [newTicket, ...prev]);

     }, 2000);
  };

  const displayBalance = user ? balance + bonusBalance : 1000;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
        {/* Modals */}
        <BankModal 
            isOpen={isBankModalOpen} 
            onClose={() => setIsBankModalOpen(false)} 
            onLink={() => setUser(prev => prev ? ({...prev, isBankLinked: true}) : null)}
            isLinked={user?.isBankLinked || false}
        />
        <DepositModal 
            isOpen={isDepositModalOpen}
            onClose={() => setIsDepositModalOpen(false)}
            onDeposit={handleVoucherRedeem}
        />
        <HowToPlayModal 
            isOpen={!!helpType}
            onClose={() => setHelpType(null)}
            type={helpType}
        />
        <Login 
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLogin={handleLogin}
        />

        {/* Global Nav - Only visible when logged in */}
        {user && (
            <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 h-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-black text-2xl skew-x-[-10deg]">
                            <span className="skew-x-[10deg]">1</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter">ONE<span className="text-orange-500">DRAW</span></span>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-500">
                            <button onClick={() => scrollToSection(luckyPunchRef)} className="hover:text-black hover:scale-105 transition-all">
                                Lucky Punch
                            </button>
                            <button onClick={() => scrollToSection(lottoRef)} className="hover:text-black hover:scale-105 transition-all">
                                Draw
                            </button>
                            <button onClick={() => scrollToSection(historyRef)} className="hover:text-black hover:scale-105 transition-all">
                                Tickets
                            </button>
                            <button onClick={() => scrollToSection(aboutRef)} className="hover:text-black hover:scale-105 transition-all">
                                About
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <div className="text-xs text-gray-400">Player</div>
                                    <div className="font-bold text-sm">{user.username}</div>
                                </div>
                                <button onClick={handleLogout} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold transition-colors">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        )}

        {!user ? (
             <LandingPage 
                onNavigateLogin={() => setIsLoginModalOpen(true)}
                onPlayClick={handleDemoLogin}
             />
        ) : (
            <>
                {/* Balance Bar */}
                <div className="fixed top-20 w-full z-30 bg-black text-white border-b border-white/10 shadow-xl transform animate-slide-down">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex justify-between items-center">
                        <div className="flex items-center gap-8">
                            <div>
                                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider mr-2">Balance</span>
                                <span className="text-xl font-black">R{balance.toLocaleString()}</span>
                            </div>
                            <div className="w-px h-6 bg-gray-800"></div>
                            <div>
                                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider mr-2">Bonus</span>
                                <span className="text-lg font-bold text-orange-500">R{bonusBalance.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center ml-4 gap-2">
                                <button 
                                    onClick={handleDepositClick}
                                    className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-bold uppercase tracking-wider transition-all transform active:scale-95"
                                >
                                    <Plus className="w-3 h-3" /> Deposit
                                </button>
                                <button 
                                    onClick={handleWithdrawClick}
                                    className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs font-bold uppercase tracking-wider transition-all transform active:scale-95"
                                >
                                    <Minus className="w-3 h-3" /> Withdraw
                                </button>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsBankModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs font-bold transition-colors"
                        >
                            <Wallet className="w-3 h-3" /> {user.isBankLinked ? 'Wallet' : 'Link Bank'}
                        </button>
                    </div>
                </div>

                {/* Dashboard Main */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24 transition-all pt-40">
                    
                    <section ref={luckyPunchRef} className="space-y-8 scroll-mt-32">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative inline-flex items-center justify-center mb-2">
                                <h2 className="text-4xl font-black uppercase italic text-black flex items-center justify-center gap-2">
                                    <span className="w-12 h-1 bg-orange-500 block"></span> 
                                    Lucky Punch 
                                    <span className="w-12 h-1 bg-orange-500 block"></span>
                                </h2>
                                <button 
                                    onClick={() => setHelpType('PUNCH')}
                                    className="absolute left-full ml-4 hidden md:flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-orange-500 transition-colors whitespace-nowrap"
                                >
                                    <HelpCircle className="w-4 h-4" /> How to Play
                                </button>
                            </div>
                            <button 
                                onClick={() => setHelpType('PUNCH')}
                                className="md:hidden mt-2 mx-auto flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-orange-500 transition-colors"
                            >
                                <HelpCircle className="w-4 h-4" /> How to Play
                            </button>
                            <p className="text-gray-500">Match the number. Win the multiplier.</p>
                        </div>
                        
                        <LuckyPunch 
                            balance={displayBalance} 
                            punchesRemaining={user.punchesRemaining} 
                            onPunch={handlePunch} 
                        />
                    </section>

                    <section ref={lottoRef} className="space-y-8 border-t border-gray-100 pt-16 scroll-mt-32">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative inline-flex items-center justify-center mb-2">
                                <h2 className="text-4xl font-black uppercase text-black">Daily 5+1 Draw</h2>
                                <button 
                                    onClick={() => setHelpType('LOTTO')}
                                    className="absolute left-full ml-4 hidden md:flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-orange-500 transition-colors whitespace-nowrap"
                                >
                                    <HelpCircle className="w-4 h-4" /> How to Play
                                </button>
                            </div>
                            <button 
                                onClick={() => setHelpType('LOTTO')}
                                className="md:hidden mt-2 mx-auto flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-orange-500 transition-colors"
                            >
                                <HelpCircle className="w-4 h-4" /> How to Play
                            </button>
                            <p className="text-gray-500">Classic selection. Massive jackpots.</p>
                        </div>
                        <Lotto 
                            balance={displayBalance}
                            onPurchase={handleLottoPurchase}
                            gameState={lottoState}
                            drawnNumbers={lottoDrawn}
                            lastResult={lottoResult}
                            onReset={() => setLottoState(GameState.IDLE)}
                        />
                    </section>

                    <section ref={historyRef} className="space-y-8 border-t border-gray-100 pt-16 scroll-mt-32">
                        <History tickets={tickets} />
                    </section>

                </main>
            </>
        )}
        
        <footer ref={aboutRef} className="bg-black text-white py-12 text-center text-sm text-gray-500 scroll-mt-20">
             <div className="mb-4 text-2xl font-black text-white">ONE<span className="text-orange-500">DRAW</span></div>
             <p className="max-w-md mx-auto mb-4">
               OneDraw is a skill-based prediction platform designed for entertainment purposes. 
               We ensure fair play through certified random number generation and transparent odds.
             </p>
             <p>&copy; 2024 OneDraw Gaming. Responsible Gaming Rules Apply.</p>
        </footer>
    </div>
  );
};

export default App;