import React, { useEffect, useState } from 'react';
import { Order } from '../types';

interface OrderBookProps {
  currentPrice: number;
}

const OrderRow: React.FC<{ order: Order }> = ({ order }) => (
    <div className="relative flex justify-between text-xs py-0.5 px-2 hover:bg-zinc-800/50 cursor-pointer group">
      {/* Depth Bar Background */}
      <div 
        className={`absolute top-0 bottom-0 ${order.type === 'sell' ? 'right-0 bg-rose-500/10' : 'right-0 bg-emerald-500/10'}`}
        style={{ width: `${order.depthPercent}%` }}
      />
      
      <span className={`relative z-10 font-mono ${order.type === 'sell' ? 'text-rose-400' : 'text-emerald-400'}`}>
        {order.price.toFixed(2)}
      </span>
      <span className="relative z-10 font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
        {order.size.toFixed(4)}
      </span>
      <span className="relative z-10 font-mono text-zinc-300">
        {order.total.toFixed(0)}
      </span>
    </div>
);

const OrderBook: React.FC<OrderBookProps> = ({ currentPrice }) => {
  const [asks, setAsks] = useState<Order[]>([]);
  const [bids, setBids] = useState<Order[]>([]);

  // Generate simulated order book data based on current price
  useEffect(() => {
    const generateOrders = (basePrice: number, type: 'buy' | 'sell'): Order[] => {
      return Array.from({ length: 12 }).map((_, i) => {
        const offset = (i + 1) * (Math.random() * 0.5 + 0.1);
        const price = type === 'sell' ? basePrice + offset : basePrice - offset;
        const size = Math.random() * 2 + 0.1;
        return {
          price,
          size,
          total: size * price,
          type,
          depthPercent: Math.random() * 80 + 20, // Visual depth 20-100%
        };
      });
    };

    // Standard view: Sells (Red) on top (Price Descending visually usually, but Ascending in value), Bids (Green) on bottom (Price Descending)
    
    // Actually, normally:
    // Sells: Price 105, 104, 103 (Lowest sell closest to mid)
    // Bids: Price 102, 101, 100 (Highest buy closest to mid)
    
    const newAsks = generateOrders(currentPrice, 'sell').sort((a, b) => b.price - a.price); // Highest price at top
    const newBids = generateOrders(currentPrice, 'buy').sort((a, b) => b.price - a.price); // Highest price at top (closest to mid)

    setAsks(newAsks);
    setBids(newBids);

  }, [currentPrice]); // Updates when price changes roughly

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
        <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Order Book</h3>
        <span className="text-xs text-zinc-600">Spread: 0.2</span>
      </div>

      {/* Header Row */}
      <div className="flex justify-between px-2 py-2 text-[10px] text-zinc-500 uppercase tracking-wide border-b border-zinc-800/50">
        <span>Price</span>
        <span>Amount</span>
        <span>Total</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        {/* Asks (Sells) - Red */}
        <div className="flex flex-col justify-end pb-1">
            {asks.map((order, i) => <OrderRow key={`ask-${i}`} order={order} />)}
        </div>

        {/* Current Price Indicator */}
        <div className="py-2 my-1 bg-zinc-950 border-y border-zinc-800 text-center flex justify-center items-center gap-2">
            <span className={`text-lg font-mono font-bold ${Math.random() > 0.5 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {currentPrice.toFixed(2)}
            </span>
            <span className="text-xs text-zinc-500">USD</span>
        </div>

        {/* Bids (Buys) - Green */}
        <div className="flex flex-col pt-1">
            {bids.map((order, i) => <OrderRow key={`bid-${i}`} order={order} />)}
        </div>
      </div>
      
      {/* Market Sentiment / Liquidity Info */}
      <div className="p-3 border-t border-zinc-800">
        <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>Bids (62%)</span>
            <span>Asks (38%)</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500 w-[62%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <div className="h-full bg-rose-500 w-[38%]" />
        </div>
      </div>
    </div>
  );
};

export default OrderBook;