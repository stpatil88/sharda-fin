import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Globe, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';
import { nseDataAPI } from '../utils/api';

export default function FIIDIIData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFIIDIIData();
  }, []);

  const fetchFIIDIIData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await nseDataAPI.getFIIDIIData();
      
      if (result.status === 'success') {
        // The API returns {status: "success", data: {fii: {...}, dii: {...}}}
        // So result.data contains the actual FII/DII data
        setData(result.data || {});
      } else {
        setError(result.error || 'Failed to fetch FII/DII data');
        // Still set data if available (might have error status but data)
        if (result.data) {
          setData(result.data);
        }
      }
    } catch (err) {
      setError(err.message || 'Error fetching FII/DII data');
      console.error('FII/DII error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    if (isNaN(num)) return 'N/A';
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const getNetValue = (item) => {
    if (!item) return 0;
    const buy = typeof item.buy === 'string' ? parseFloat(item.buy.replace(/,/g, '')) : item.buy || 0;
    const sell = typeof item.sell === 'string' ? parseFloat(item.sell.replace(/,/g, '')) : item.sell || 0;
    return buy - sell;
  };

  const renderInstitutionCard = (title, icon, data, color) => {
    if (!data) return null;

    const net = getNetValue(data);
    const isPositive = net >= 0;
    const buy = typeof data.buy === 'string' ? parseFloat(data.buy.replace(/,/g, '')) : data.buy || 0;
    const sell = typeof data.sell === 'string' ? parseFloat(data.sell.replace(/,/g, '')) : data.sell || 0;

    return (
      <div className={`card border-l-4 ${isPositive ? 'border-green-500' : 'border-red-500'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">Trading Activity</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Buy</p>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(buy)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Sell</p>
              <p className="text-lg font-semibold text-red-600">{formatCurrency(sell)}</p>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Net Investment</p>
              <div className="flex items-center space-x-2">
                {isPositive ? (
                  <ArrowUp className="w-5 h-5 text-green-600" />
                ) : (
                  <ArrowDown className="w-5 h-5 text-red-600" />
                )}
                <p className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(net)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-[95%] xl:max-w-[1600px] mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">FII/DII Trading Activity</h3>
                <p className="text-sm text-gray-600">Foreign and Domestic Institutional Investors data</p>
              </div>
            </div>
            <button
              onClick={fetchFIIDIIData}
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading FII/DII data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <div className="grid md:grid-cols-2 gap-8">
            {renderInstitutionCard(
              'Foreign Institutional Investors (FII)',
              <Globe className="w-6 h-6 text-blue-600" />,
              data.fii || data.FII,
              'bg-blue-100'
            )}
            {renderInstitutionCard(
              'Domestic Institutional Investors (DII)',
              <TrendingUp className="w-6 h-6 text-purple-600" />,
              data.dii || data.DII,
              'bg-purple-100'
            )}
          </div>
        )}

        {!loading && !error && data && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total FII Buy</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(
                    typeof (data.fii || data.FII)?.buy === 'string'
                      ? parseFloat((data.fii || data.FII).buy.replace(/,/g, ''))
                      : (data.fii || data.FII)?.buy || 0
                  )}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total DII Buy</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(
                    typeof (data.dii || data.DII)?.buy === 'string'
                      ? parseFloat((data.dii || data.DII).buy.replace(/,/g, ''))
                      : (data.dii || data.DII)?.buy || 0
                  )}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Combined Net</p>
                <p className={`text-xl font-bold ${
                  (getNetValue(data.fii || data.FII) + getNetValue(data.dii || data.DII)) >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {formatCurrency(
                    getNetValue(data.fii || data.FII) + getNetValue(data.dii || data.DII)
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

