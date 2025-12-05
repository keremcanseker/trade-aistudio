import React, { useState, useEffect } from 'react';
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
    const nowSeconds = Math.floor(Date.now() / 1000);
    
    // Generate 100 points of history
    for (let i = 100; i > 0; i--) {
        const time = nowSeconds - i;
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
                    time: Math.floor(Date.now() / 1000),
                    value: newPrice
                };
                
                // Avoid duplicate timestamps if interval runs fast
                if (prevData.length > 0 && prevData[prevData.length - 1].time === newPoint.time) {
                    return prevData; 
                }

                // Keep max 200 points for performance
                const newData = [...prevData, newPoint];
                if (newData.length > 200) return newData.slice(newData.length - 200);
                return newData;
            });

            // Check bets (Mock result logic)
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
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden">
      <Header balance={balance} level={level} />

      {/* Main Grid: flex-1 ensures it fills remaining height. min-h-0 prevents overflow. */}
      <main className="flex-1 p-3 md:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 min-h-0">
        
        {/* Left Column: Chat (3 cols) */}
        <section className="hidden md:flex md:col-span-3 flex-col h-full min-h-0 overflow-hidden">
          <LiveChat />
        </section>

        {/* Center Column: Charts & OrderBook (6 cols) */}
        {/* We use flex-col with gap. flex-[7] and flex-[3] distribute space while respecting the gap */}
        <section className="col-span-1 md:col-span-6 flex flex-col h-full min-h-0 gap-3 md:gap-4">
          <div className="flex-[7] min-h-0 relative">
             <PriceChart data={chartData} currentPrice={currentPrice} />
          </div>
          <div className="flex-[3] min-h-0 relative">
            <OrderBook currentPrice={currentPrice} />
          </div>
        </section>

        {/* Right Column: Interaction (3 cols) */}
        <section className="col-span-1 md:col-span-3 flex flex-col h-full min-h-0 overflow-hidden">
          <TradingPanel 
            currentPrice={currentPrice} 
            onPlaceBet={handlePlaceBet} 
            recentBets={bets} 
          />
        </section>

      </main>
      
      {/* Mobile-only Elements */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <div className="bg-emerald-600 p-3 rounded-full shadow-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default App;