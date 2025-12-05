export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface Order {
  price: number;
  size: number;
  total: number;
  type: 'buy' | 'sell';
  depthPercent: number; // For the visual bar background
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  side: 'bull' | 'bear' | 'neutral';
}

export interface Bet {
  id: string;
  direction: 'up' | 'down';
  amount: number;
  entryPrice: number;
  timestamp: Date;
  outcome?: 'win' | 'loss';
}