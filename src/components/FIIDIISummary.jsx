import { useState, useEffect } from 'react';
import { Globe, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import { nseDataAPI } from '../utils/api';
import Link from 'next/link';

export default function FIIDIISummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFIIDIIData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchFIIDIIData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchFIIDIIData = async () => {
    try {
      const result = await nseDataAPI.getFIIDIIData();
      
      if (result.status === 'success') {
        setData(result.data || {});
      } else if (result.data) {
        setData(result.data);
      }
    } catch (err) {
      console.error('FII/DII error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    if (isNaN(num)) return 'N/A';
    
    // Values are already in crores from the JSON file
    // Format: if >= 1000 crores, show in thousands of crores
    if (Math.abs(num) >= 1000) {
      return `₹${(num / 1000).toFixed(2)}K Cr`;
    }
    return `₹${num.toFixed(2)} Cr`;
  };

  const getNetValue = (item) => {
    if (!item) return 0;
    const buy = typeof item.buy === 'string' ? parseFloat(item.buy.replace(/,/g, '')) : item.buy || 0;
    const sell = typeof item.sell === 'string' ? parseFloat(item.sell.replace(/,/g, '')) : item.sell || 0;
    return buy - sell;
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">Loading FII/DII data...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!data || (!data.fii && !data.dii && !data.FII && !data.DII)) {
    return null;
  }

  const fii = data.fii || data.FII || {};
  const dii = data.dii || data.DII || {};
  const fiiNet = getNetValue(fii);
  const diiNet = getNetValue(dii);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">FII/DII Trading Activity</h2>
              <p className="text-gray-600">Institutional investor flows</p>
            </div>
          </div>
          <Link 
            href="/market-results"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
          >
            <span>View Details</span>
            <TrendingUp className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* FII Card */}
          <div className={`card border-l-4 ${fiiNet >= 0 ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Foreign Institutional Investors</h3>
                  <p className="text-sm text-gray-600">FII/FPI</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Buy</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(fii.buy || fii.buyValue || 0)}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Sell</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(fii.sell || fii.sellValue || 0)}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${fiiNet >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Net Investment</p>
                <div className="flex items-center space-x-2">
                  {fiiNet >= 0 ? (
                    <ArrowUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowDown className="w-5 h-5 text-red-600" />
                  )}
                  <p className={`text-xl font-bold ${fiiNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(fiiNet)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DII Card */}
          <div className={`card border-l-4 ${diiNet >= 0 ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Domestic Institutional Investors</h3>
                  <p className="text-sm text-gray-600">DII</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Buy</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(dii.buy || dii.buyValue || 0)}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Sell</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(dii.sell || dii.sellValue || 0)}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${diiNet >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Net Investment</p>
                <div className="flex items-center space-x-2">
                  {diiNet >= 0 ? (
                    <ArrowUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowDown className="w-5 h-5 text-red-600" />
                  )}
                  <p className={`text-xl font-bold ${diiNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(diiNet)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Combined Net Investment</p>
            <p className={`text-lg font-bold ${
              (fiiNet + diiNet) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(fiiNet + diiNet)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

