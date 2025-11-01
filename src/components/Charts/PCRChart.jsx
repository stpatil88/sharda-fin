import { useState, useEffect } from 'react';
import { marketDataAPI } from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function PCRChart({ height = 400 }) {
  const [pcrData, setPcrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(50);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'

  useEffect(() => {
    async function loadPCRData() {
      try {
        setLoading(true);
        console.log('[PCRChart] Fetching PCR data...');
        const response = await marketDataAPI.getPutCallRatio(200); // Get more data for sorting
        
        if (response && response.status === 'ok') {
          let sortedData = [...(response.data || [])];
          
          // Sort based on current sort order
          if (sortOrder === 'desc') {
            sortedData.sort((a, b) => b.pcr - a.pcr);
          } else {
            sortedData.sort((a, b) => a.pcr - b.pcr);
          }
          
          setPcrData(sortedData.slice(0, displayLimit));
          setStats({
            avg: response.avg_pcr || 0,
            max: response.max_pcr || 0,
            min: response.min_pcr || 0,
            total: response.total_symbols || 0
          });
          console.log('[PCRChart] PCR data loaded:', sortedData.slice(0, displayLimit).length, 'symbols');
        } else {
          console.warn('[PCRChart] Invalid response:', response);
        }
      } catch (e) {
        console.error('[PCRChart] Error loading PCR data:', e);
      } finally {
        setLoading(false);
      }
    }

    loadPCRData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadPCRData, 300000);
    return () => clearInterval(interval);
  }, [displayLimit, sortOrder]);

  // Color code based on PCR value
  // PCR > 1: Bearish (red), PCR < 1: Bullish (green), PCR = 1: Neutral (yellow)
  const getPCRColor = (pcr) => {
    if (pcr > 1.2) return '#ef4444'; // Strong bearish - dark red
    if (pcr > 1.0) return '#f87171'; // Bearish - red
    if (pcr > 0.8) return '#fbbf24'; // Neutral-bearish - yellow
    if (pcr > 0.5) return '#34d399'; // Neutral-bullish - light green
    return '#22c55e'; // Bullish - green
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.symbol}</p>
          <p className="text-sm">
            <span className="font-medium">PCR: </span>
            <span className={`${data.pcr > 1 ? 'text-red-600' : 'text-green-600'}`}>
              {data.pcr.toFixed(3)}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {data.pcr > 1 ? 'Bearish (More Puts)' : 'Bullish (More Calls)'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!pcrData || pcrData.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8 text-gray-500">
          No PCR data available
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Put/Call Ratio (PCR)</h3>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={displayLimit}
              onChange={(e) => setDisplayLimit(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex items-center space-x-1 text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {sortOrder === 'desc' ? (
                <><TrendingDown className="w-4 h-4" /><span>High to Low</span></>
              ) : (
                <><TrendingUp className="w-4 h-4" /><span>Low to High</span></>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Total Symbols</div>
              <div className="text-lg font-semibold text-blue-700">{stats.total}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Average PCR</div>
              <div className="text-lg font-semibold text-green-700">{stats.avg.toFixed(3)}</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Maximum PCR</div>
              <div className="text-lg font-semibold text-red-700">{stats.max.toFixed(3)}</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Minimum PCR</div>
              <div className="text-lg font-semibold text-yellow-700">{stats.min.toFixed(3)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ height: height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={pcrData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="symbol"
              angle={-45}
              textAnchor="end"
              height={100}
              stroke="#666"
              fontSize={11}
              interval={0}
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              label={{ value: 'PCR Ratio', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={1} stroke="#666" strokeDasharray="3 3" label={{ value: "PCR = 1.0", position: "right", fill: "#666" }} />
            <Bar dataKey="pcr" radius={[4, 4, 0, 0]}>
              {pcrData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getPCRColor(entry.pcr)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-gray-600">PCR &gt; 1.2 (Strong Bearish)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-gray-600">PCR &gt; 1.0 (Bearish)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-gray-600">0.8 - 1.0 (Neutral)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-gray-600">0.5 - 0.8 (Bullish)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-gray-600">PCR &lt; 0.5 (Strong Bullish)</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <strong>Note:</strong> PCR &gt; 1 indicates more put options (bearish sentiment), PCR &lt; 1 indicates more call options (bullish sentiment)
        </div>
      </div>
    </div>
  );
}

