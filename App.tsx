import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import OrderBook from './components/OrderBook';
import PriceChart from './components/PriceChart';
import TradingPanel from './components/TradingPanel';
import LiveChat from './components/LiveChat';
import { ChartDataPoint, Bet } from './types';

// Constants for simulation
const INITIAL_PRICE = 45000;
const VOLATILITY = 15;

const App: React.FC = () => {
  const [balance, setBalance] = useState(10000);
  const [level, setLevel] = useState(5);
  const [currentPrice, setCurrentPrice] = useState(INITIAL_PRICE);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  
  // Simulation Loop
  useEffect(() => {
    // Initial Data population
    const initialData: ChartDataPoint[] = [];
    let price = INITIAL_PRICE;
    const now = new Date();
    
    for (let i = 50; i > 0; i--) {
        const time = new Date(now.getTime() - i * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        price = price + (Math.random() - 0.5) * VOLATILITY;
        initialData.push({ time, value: price });
    }
    setChartData(initialData);
    setCurrentPrice(price);

    // Live Tick Interval
    const interval = setInterval(() => {
        setCurrentPrice(prevPrice => {
            const movement = (Math.random() - 0.5) * VOLATILITY;
            const newPrice = prevPrice + movement;
            
            // Update chart data
            setChartData(prevData => {
                const newPoint = {
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    value: newPrice
                };
                // Keep max 60 points for performance
                const newData = [...prevData.slice(1), newPoint];
                return newData;
            });

            // Check bets (Mock result logic)
            // In a real app, this would be complex server logic. 
            // Here we just randomly resolve bets older than 5 seconds for simulation fun
            setBets(currentBets => {
                return currentBets.map(bet => {
                    if (bet.outcome) return bet; // Already settled
                    
                    const age = new Date().getTime() - bet.timestamp.getTime();
                    if (age > 5000) { // Settle after 5 seconds
                        // Simple win condition logic for demo
                        const isWin = (bet.direction === 'up' && newPrice > bet.entryPrice) ||
                                      (bet.direction === 'down' && newPrice < bet.entryPrice);
                        
                        if (isWin) {
                            setBalance(prev => prev + bet.amount * 1.85); // Payout
                        }
                        
                        return { ...bet, outcome: isWin ? 'win' : 'loss' };
                    }
                    return bet;
                });
            });

            return newPrice;
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePlaceBet = (direction: 'up' | 'down', amount: number) => {
    if (balance < amount) {
        alert("Insufficient funds!");
        return;
    }

    setBalance(prev => prev - amount);
    
    const newBet: Bet = {
        id: Math.random().toString(36).substr(2, 9),
        direction,
        amount,
        entryPrice: currentPrice,
        timestamp: new Date(),
    };

    setBets(prev => [...prev, newBet]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden">
      <Header balance={balance} level={level} />

      <main className="flex-1 p-4 grid grid-cols-1 md:grid-cols-12 gap-4 max-h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Column: Market Data (3 cols) */}
        <section className="hidden md:block md:col-span-3 h-full overflow-hidden">
          <OrderBook currentPrice={currentPrice} />
        </section>

        {/* Center Column: Charts (6 cols) */}
        <section className="col-span-1 md:col-span-6 h-[50vh] md:h-full flex flex-col">
          <PriceChart data={chartData} currentPrice={currentPrice} />
        </section>

        {/* Right Column: Interaction (3 cols) */}
        <section className="col-span-1 md:col-span-3 h-full overflow-y-auto custom-scrollbar">
          <TradingPanel 
            currentPrice={currentPrice} 
            onPlaceBet={handlePlaceBet} 
            recentBets={bets} 
          />
        </section>

      </main>

      {/* Floating Elements */}
      <LiveChat />
      
      {/* Mobile-only Order Book Toggle (Hidden in desktop via grid) */}
      <div className="md:hidden fixed bottom-20 left-4 bg-zinc-900 p-2 rounded-full border border-zinc-700 shadow-lg text-xs font-bold text-zinc-400">
        Order Book
      </div>
    </div>
  );
};

export default App;