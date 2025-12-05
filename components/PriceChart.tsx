import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartDataPoint } from '../types';
import { Activity, Clock } from 'lucide-react';

interface PriceChartProps {
  data: ChartDataPoint[];
  currentPrice: number;
}

const timeframes = ['1m', '15m', '1H', '1D', '1W'];

const PriceChart: React.FC<PriceChartProps> = ({ data, currentPrice }) => {
  const [activeTab, setActiveTab] = useState('1m');

  // Calculate min/max for Y-axis domain to keep chart centered
  const minValue = Math.min(...data.map(d => d.value)) * 0.999;
  const maxValue = Math.max(...data.map(d => d.value)) * 1.001;

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden relative">
      {/* Chart Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <img src="https://picsum.photos/32/32" alt="Asset" className="w-6 h-6 rounded-full" />
                <span className="font-bold text-white">BTC/USD</span>
            </div>
            <span className={`font-mono text-sm ${data[data.length - 1]?.value > data[data.length - 2]?.value ? 'text-emerald-400' : 'text-rose-400'}`}>
                {currentPrice.toFixed(2)}
            </span>
        </div>

        <div className="flex bg-zinc-950 p-1 rounded-md">
            {timeframes.map((tf) => (
                <button
                    key={tf}
                    onClick={() => setActiveTab(tf)}
                    className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                        activeTab === tf 
                        ? 'bg-zinc-800 text-white shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                >
                    {tf}
                </button>
            ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#52525b' }}
                minTickGap={30}
            />
            <YAxis 
                domain={[minValue, maxValue]}
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#52525b', fontFamily: 'monospace' }}
                width={50}
            />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#18181b', 
                    borderColor: '#27272a',
                    color: '#e4e4e7',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                }}
                itemStyle={{ color: '#10b981' }}
            />
            <ReferenceLine y={currentPrice} stroke="#10b981" strokeDasharray="3 3" opacity={0.5} />
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                isAnimationActive={false} // Disable animation for smoother high-frequency feel
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Chart Watermark / Info Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none opacity-20">
            <div className="flex flex-col">
                <span className="text-4xl font-bold text-white tracking-widest">TRADEARENA</span>
                <span className="text-xs text-zinc-400">SIMULATION ENVIRONMENT</span>
            </div>
        </div>

        {/* Live Status Indicator */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-zinc-950/80 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                <Activity className="w-3 h-3" />
                MARKET OPEN
            </span>
            <span className="text-zinc-600 text-xs">|</span>
            <span className="text-xs text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                24h Vol: 42.8M
            </span>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;