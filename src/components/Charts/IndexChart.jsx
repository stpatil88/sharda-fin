import { useState, useEffect, useRef } from 'react';
import { marketDataAPI } from '../../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function IndexChart({ symbol = 'NIFTY', height = 300 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const generateMockData = () => {
      const data = [];
      const basePrice = symbol === 'NIFTY' ? 19500 : 65000;
      let currentPrice = basePrice;
      
      for (let i = 0; i < 30; i++) {
        const change = (Math.random() - 0.5) * 200;
        currentPrice += change;
        
        data.push({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price: Math.round(currentPrice),
          volume: Math.floor(Math.random() * 1000000) + 500000,
        });
      }
      
      return data;
    };

    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 500);

    async function loadQuote() {
      try {
        console.log(`[IndexChart] Fetching quote for ${symbol}...`);
        const q = await marketDataAPI.getIndexQuote(symbol);
        console.log(`[IndexChart] Received quote for ${symbol}:`, q);
        if (q && q.status === 'ok') {
          console.log(`[IndexChart] Setting quote data:`, q);
          setQuote(q);
        } else {
          console.warn(`[IndexChart] Invalid quote status for ${symbol}:`, q);
        }
      } catch (e) {
        console.error(`[IndexChart] Error loading quote for ${symbol}:`, e);
      }
    }

    loadQuote();
    const interval = setInterval(loadQuote, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [symbol]);

  // Debug logging - moved before conditional return to follow React Hooks rules
  useEffect(() => {
    if (quote) {
      console.log(`[IndexChart] Rendering with quote data:`, {
        symbol,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent
      });
    }
  }, [quote, symbol]);

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  const derivedCurrent = data[data.length - 1]?.price || 0;
  const derivedPrev = data[data.length - 2]?.price || 0;
  
  // Use quote data if available, otherwise fallback to mock
  const currentPrice = quote?.price ?? derivedCurrent;
  const change = quote?.change ?? (currentPrice - derivedPrev);
  const changePercent = quote?.changePercent ?? (derivedPrev ? (change / derivedPrev) * 100 : 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{symbol} Chart</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-2xl font-bold text-gray-900">
              ₹{currentPrice.toLocaleString()}
            </span>
            <div className={`flex items-center space-x-1 ${
              change >= 0 ? 'text-financial-green' : 'text-financial-red'
            }`}>
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">
                {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Last 30 days
        </div>
      </div>

      <div style={{ height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString('en-IN')}
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={change >= 0 ? '#22c55e' : '#ef4444'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: change >= 0 ? '#22c55e' : '#ef4444', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
