import React from 'react';
import { LayoutDashboard, Wallet, Trophy, Bell } from 'lucide-react';

interface HeaderProps {
  balance: number;
  level: number;
}

const Header: React.FC<HeaderProps> = ({ balance, level }) => {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
          <LayoutDashboard className="w-6 h-6 text-emerald-500" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Trade<span className="text-emerald-500">Arena</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Level Indicator */}
        <div className="hidden md:flex items-center gap-2 text-zinc-400">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">Lvl {level}</span>
          <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 w-[70%]" />
          </div>
        </div>

        {/* Balance Display */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 py-1.5 px-4 rounded-full">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-emerald-400 font-bold">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <button className="ml-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded transition-colors">
            DEPOSIT
          </button>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-400 hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </button>
      </div>
    </header>
  );
};

export default Header;