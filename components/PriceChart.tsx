import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { ChartDataPoint } from '../types';
import { Activity, Clock } from 'lucide-react';

interface PriceChartProps {
  data: ChartDataPoint[];
  currentPrice: number;
}

const timeframes = ['1m', '15m', '1H', '1D', '1W'];

const PriceChart: React.FC<PriceChartProps> = ({ data, currentPrice }) => {
  const [activeTab, setActiveTab] = useState('1m');
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#18181b' }, // zinc-900
        textColor: '#a1a1aa', // zinc-400
      },
      grid: {
        vertLines: { color: '#27272a' }, // zinc-800
        horzLines: { color: '#27272a' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: '#27272a',
      },
      rightPriceScale: {
        borderColor: '#27272a',
      },
      crosshair: {
        vertLine: {
            color: '#3f3f46',
            labelBackgroundColor: '#3f3f46',
        },
        horzLine: {
            color: '#3f3f46',
            labelBackgroundColor: '#3f3f46',
        },
      },
      autoSize: true, // Use built-in autosize handler if available, but manual Observer is safer for flex quirks
    });

    const newSeries = chart.addAreaSeries({
      lineColor: '#10b981', // emerald-500
      topColor: 'rgba(16, 185, 129, 0.4)',
      bottomColor: 'rgba(16, 185, 129, 0)',
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = newSeries;

    // Use ResizeObserver for robust resizing in flex layouts
    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== chartContainerRef.current) { return; }
      const newRect = entries[0].contentRect;
      chart.applyOptions({ height: newRect.height, width: newRect.width });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  // Update Data
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden relative">
      {/* Chart Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-800 h-14 shrink-0">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <img src="https://picsum.photos/32/32" alt="Asset" className="w-6 h-6 rounded-full" />
                <span className="font-bold text-white">BTC/USD</span>
            </div>
            <span className={`font-mono text-sm ${data[data.length - 1]?.value >= (data[data.length - 2]?.value || 0) ? 'text-emerald-400' : 'text-rose-400'}`}>
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
      <div className="flex-1 w-full min-h-0 relative group">
        <div ref={chartContainerRef} className="w-full h-full absolute inset-0" />
        
        {/* Chart Watermark / Info Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity z-10">
            <div className="flex flex-col">
                <span className="text-4xl font-bold text-white tracking-widest">TRADEARENA</span>
                <span className="text-xs text-zinc-400">SIMULATION ENVIRONMENT</span>
            </div>
        </div>

        {/* Live Status Indicator */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-zinc-950/80 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-800 pointer-events-none z-10">
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