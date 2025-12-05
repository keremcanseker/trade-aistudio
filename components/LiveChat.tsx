import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { ChatMessage } from '../types';

const USER_NAMES = ["CryptoKing", "SatoshiFan", "MoonWalker", "BearMarketBob", "AlphaSeeker", "WhaleWatcher"];
const MESSAGES = [
  { text: "BTC breaking resistance!", side: 'bull' },
  { text: "Shorting this top, way overbought.", side: 'bear' },
  { text: "Anyone watching ETH?", side: 'neutral' },
  { text: "LFG!!! 🚀", side: 'bull' },
  { text: "Careful with the leverage guys.", side: 'neutral' },
  { text: "Dumping incoming...", side: 'bear' },
  { text: "Green candle confirmed.", side: 'bull' },
];

const LiveChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate incoming chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomUser = USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)];
      const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      
      const newMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        user: randomUser,
        text: randomMsg.text,
        side: randomMsg.side as 'bull' | 'bear' | 'neutral',
      };

      setMessages(prev => [...prev.slice(-30), newMessage]); // Keep last 30
    }, 3500); // New message every 3.5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/30">
        <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Trollbox Live</span>
        </div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-baseline gap-2">
                    <span className={`text-[10px] font-bold ${
                        msg.side === 'bull' ? 'text-emerald-500' : 
                        msg.side === 'bear' ? 'text-rose-500' : 'text-zinc-400'
                    }`}>
                        {msg.user}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-mono">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed break-words">
                    {msg.text}
                </p>
            </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Placeholder */}
      <div className="p-2 border-t border-zinc-800 bg-zinc-950/30">
        <div className="relative">
            <input 
                type="text" 
                placeholder="Type a message..." 
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-600"
                disabled
            />
            <Send className="w-3 h-3 text-zinc-500 absolute right-2 top-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
};

export default LiveChat;