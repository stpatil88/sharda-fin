import { useState, useEffect } from 'react';
import { TrendingDown, Calendar, RefreshCw } from 'lucide-react';
import { nseDataAPI } from '../utils/api';

export default function BulkDeals() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    fetchBulkDeals();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB').split('/').reverse().join('-').split('-').reverse().join('-');
  };

  const getDefaultDates = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return {
      from: formatDate(weekAgo),
      to: formatDate(today)
    };
  };

  const fetchBulkDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const dates = getDefaultDates();
      const from = fromDate || dates.from;
      const to = toDate || dates.to;
      
      // Convert YYYY-MM-DD to DD-MM-YYYY for API
      const formatForAPI = (dateStr) => {
        if (!dateStr) return null;
        const parts = dateStr.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      };

      const result = await nseDataAPI.getBulkDeals(
        formatForAPI(from),
        formatForAPI(to)
      );
      
      if (result.status === 'success') {
        setData(result.data || []);
      } else {
        setError('Failed to fetch bulk deals');
      }
    } catch (err) {
      setError(err.message || 'Error fetching bulk deals');
      console.error('Bulk deals error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="max-w-[95%] xl:max-w-[1600px] mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Bulk Deals</h3>
                <p className="text-sm text-gray-600">Bulk transactions on NSE</p>
              </div>
            </div>
            <button
              onClick={fetchBulkDeals}
              disabled={loading}
              className="btn-primary flex items-center space-x-2 bg-secondary-600 hover:bg-secondary-700"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Date Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                placeholder="From Date"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                placeholder="To Date"
              />
            </div>
            <button
              onClick={fetchBulkDeals}
              className="btn-primary bg-secondary-600 hover:bg-secondary-700"
            >
              Apply Filter
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
            <p className="mt-4 text-gray-600">Loading bulk deals...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {data.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">No bulk deals found for the selected period.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buy/Sell
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((deal, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">
                            {deal.SYMBOL || deal.symbol || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700">
                            {deal.CLIENT_NAME || deal.client_name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            (deal.BUY_SELL || deal.buy_sell || '').toUpperCase() === 'BUY'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {deal.BUY_SELL || deal.buy_sell || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-700">
                            {deal.QTY_TRADED || deal.qty_traded || deal.QUANTITY || deal.quantity || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-700">
                            {formatCurrency(deal.TRADE_PRICE || deal.trade_price || deal.PRICE || deal.price)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {deal.DATE || deal.date || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

