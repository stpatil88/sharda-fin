import { useState } from 'react';
import { FileText, Search, Calendar, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { nseDataAPI } from '../utils/api';

export default function PastResults() {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await nseDataAPI.getPastResults(symbol.toUpperCase());
      
      if (result.status === 'success') {
        // API returns: {status: "success", symbol: "...", data: {resCmpData: [...]}}
        setData(result);
      } else if (result.status === 'not_found') {
        setError(result.message || `Past results not found for ${symbol}`);
      } else {
        setError(result.message || `Failed to fetch past results for ${symbol}`);
      }
    } catch (err) {
      setError(err.message || `Error fetching past results for ${symbol}`);
      console.error('Past results error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    if (isNaN(num)) return 'N/A';
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    const n = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    if (isNaN(n)) return 'N/A';
    
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2
    }).format(n);
  };

  const formatCurrencyInCr = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    // Amount is in thousands, so divide by 1000 to get crores
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    if (isNaN(num)) return 'N/A';
    const crores = num / 1000; // Convert from thousands to crores
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(crores * 10000000); // Convert crores to actual currency
  };

  const extractKeyMetrics = (resultData) => {
    if (!resultData || !resultData.resCmpData || !Array.isArray(resultData.resCmpData)) {
      return null;
    }

    // Get the latest quarter (first item in array)
    const latest = resultData.resCmpData[0];
    
    const netSales = latest.re_net_sale || latest.re_total_inc || 0;
    const netProfit = latest.re_net_profit || latest.re_con_pro_loss || 0;
    const eps = latest.re_basic_eps_for_cont_dic_opr || latest.re_dilut_eps_for_cont_dic_opr || latest.re_basic_eps || null;
    const profitBeforeTax = latest.re_pro_loss_bef_tax || 0;
    const period = `${latest.re_from_dt || ''} to ${latest.re_to_dt || ''}`;
    
    // Calculate profit margin
    const salesNum = typeof netSales === 'string' ? parseFloat(netSales.replace(/,/g, '')) : netSales;
    const profitNum = typeof netProfit === 'string' ? parseFloat(netProfit.replace(/,/g, '')) : netProfit;
    const profitMargin = salesNum && salesNum !== 0 ? ((profitNum / salesNum) * 100).toFixed(2) : null;

    return {
      period,
      netSales,
      netProfit,
      profitBeforeTax,
      eps,
      profitMargin
    };
  };

  return (
    <div className="p-6">
      <div className="max-w-[95%] xl:max-w-[1600px] mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">NSE Past Results</h3>
              <p className="text-sm text-gray-600">Historical financial results for companies</p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="Enter stock symbol (e.g., RELIANCE, TCS, INFY)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading past results...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-6">
            {Object.keys(data).length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">No past results found for {symbol}.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Key Metrics Card */}
                {data.data && data.data.resCmpData && extractKeyMetrics(data.data) && (() => {
                  const metrics = extractKeyMetrics(data.data);
                  return (
                    <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Key Financial Metrics - {symbol}
                        </h3>
                        <p className="text-gray-600">Period: {metrics.period}</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Net Sales/Revenue */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Net Sales/Revenue</p>
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrencyInCr(metrics.netSales)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
                        </div>

                        {/* Net Profit */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Net Profit</p>
                            <DollarSign className="w-5 h-5 text-primary-600" />
                          </div>
                          <p className={`text-2xl font-bold ${
                            parseFloat(metrics.netProfit) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrencyInCr(metrics.netProfit)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">After Tax</p>
                        </div>

                        {/* Profit Margin */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                            <Percent className="w-5 h-5 text-secondary-600" />
                          </div>
                          <p className={`text-2xl font-bold ${
                            parseFloat(metrics.profitMargin || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {metrics.profitMargin ? `${metrics.profitMargin}%` : 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Net Profit / Revenue</p>
                        </div>

                        {/* EPS */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Earnings Per Share</p>
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900">
                            {metrics.eps ? `₹${metrics.eps}` : 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Basic EPS</p>
                        </div>

                        {/* Profit Before Tax */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Profit Before Tax</p>
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                          </div>
                          <p className={`text-2xl font-bold ${
                            parseFloat(metrics.profitBeforeTax) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrencyInCr(metrics.profitBeforeTax)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PBT</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Detailed Results */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Detailed Financial Results
                  </h3>
                  {data.data && data.data.resCmpData && Array.isArray(data.data.resCmpData) ? (
                    <div className="space-y-4">
                      {data.data.resCmpData.slice(0, 5).map((quarter, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">
                              {quarter.re_from_dt} to {quarter.re_to_dt}
                            </h4>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {quarter.re_res_type === 'U' ? 'Unaudited' : 'Audited'}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Net Sales</p>
                              <p className="font-semibold">{formatCurrencyInCr(quarter.re_net_sale || quarter.re_total_inc)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Net Profit</p>
                              <p className={`font-semibold ${
                                parseFloat(quarter.re_net_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatCurrencyInCr(quarter.re_net_profit || quarter.re_con_pro_loss)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">EPS</p>
                              <p className="font-semibold">
                                {quarter.re_basic_eps_for_cont_dic_opr || quarter.re_dilut_eps_for_cont_dic_opr || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No detailed data available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Popular Symbols */}
        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-3">Popular symbols:</p>
          <div className="flex flex-wrap gap-2">
            {['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'HINDUNILVR', 'BHARTIARTL', 'SBIN', 'BAJFINANCE', 'KOTAKBANK'].map((sym) => (
              <button
                key={sym}
                onClick={() => {
                  setSymbol(sym);
                  handleSearch({ preventDefault: () => {} });
                }}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-primary-50 hover:border-primary-500 transition-colors text-sm"
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

