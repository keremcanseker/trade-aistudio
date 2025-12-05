import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, History } from 'lucide-react';
import { Bet } from '../types';

interface TradingPanelProps {
  currentPrice: number;
  onPlaceBet: (direction: 'up' | 'down', amount: number) => void;
  recentBets: Bet[];
}

const TradingPanel: React.FC<TradingPanelProps> = ({ currentPrice, onPlaceBet, recentBets }) => {
  const [betAmount, setBetAmount] = useState(100);
  const [leverage, setLeverage] = useState(10);

  const potentialReturn = (betAmount * 1.85).toFixed(2);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Main Trading Controls */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h2 className="text-white font-bold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Place Prediction
            </h2>
            <span className="text-xs text-zinc-500 bg-zinc-950 px-2 py-1 rounded">
                Payout: 1.85x
            </span>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
                <span>Wager Amount</span>
                <span>Max: $1,000</span>
            </div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                <input 
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-3 pl-8 pr-4 text-white font-mono focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
            </div>
            
            {/* Quick Selectors */}
            <div className="grid grid-cols-4 gap-2">
                {[50, 100, 250, 500].map(amt => (
                    <button 
                        key={amt}
                        onClick={() => setBetAmount(amt)}
                        className={`text-xs py-1.5 rounded border transition-all ${
                            betAmount === amt 
                            ? 'bg-zinc-800 border-zinc-600 text-white' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        }`}
                    >
                        ${amt}
                    </button>
                ))}
            </div>
        </div>

        {/* Leverage Slider (Visual only) */}
        <div className="space-y-3">
            <div className="flex justify-between text-xs text-zinc-400">
                <span>Leverage</span>
                <span className="text-emerald-400 font-bold">{leverage}x</span>
            </div>
            <input 
                type="range" 
                min="1" 
                max="100" 
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full h-2 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-2">
            <button 
                onClick={() => onPlaceBet('up', betAmount)}
                className="group relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 p-4 rounded-lg transition-all active:scale-95 border-b-4 border-emerald-800 hover:border-emerald-700"
            >
                <div className="relative z-10 flex flex-col items-center gap-1">
                    <span className="font-bold text-white tracking-wide">PREDICT UP</span>
                    <TrendingUp className="w-5 h-5 text-white/80 group-hover:-translate-y-1 transition-transform" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </button>

            <button 
                onClick={() => onPlaceBet('down', betAmount)}
                className="group relative overflow-hidden bg-rose-600 hover:bg-rose-500 p-4 rounded-lg transition-all active:scale-95 border-b-4 border-rose-800 hover:border-rose-700"
            >
                <div className="relative z-10 flex flex-col items-center gap-1">
                    <span className="font-bold text-white tracking-wide">PREDICT DOWN</span>
                    <TrendingDown className="w-5 h-5 text-white/80 group-hover:translate-y-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </button>
        </div>

        <div className="text-center text-xs text-zinc-500 font-mono">
            Potential Win: <span className="text-emerald-400">${potentialReturn}</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
        <div className="p-3 border-b border-zinc-800 flex items-center gap-2">
            <History className="w-4 h-4 text-zinc-400" />
            <h3 className="text-zinc-400 text-xs font-bold uppercase">Recent Predictions</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {recentBets.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-600 text-xs italic">
                    No active predictions
                </div>
            ) : (
                recentBets.slice().reverse().map(bet => (
                    <div key={bet.id} className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800/50">
                        <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded ${bet.direction === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {bet.direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-zinc-300 font-medium">BTC/USD</span>
                                <span className="text-[10px] text-zinc-500">Entry: {bet.entryPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-mono text-white">${bet.amount}</div>
                            {bet.outcome && (
                                <span className={`text-[10px] uppercase font-bold ${bet.outcome === 'win' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {bet.outcome}
                                </span>
                            )}
                            {!bet.outcome && <span className="text-[10px] text-yellow-500 animate-pulse">PENDING</span>}
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;