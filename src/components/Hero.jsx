import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { marketDataAPI } from '../utils/api';

export default function Hero() {
  const [marketData, setMarketData] = useState({
    nifty: { value: 19500, change: 150, changePercent: 0.78 },
    sensex: { value: 65000, change: 200, changePercent: 0.31 },
    banknifty: { value: 45000, change: 300, changePercent: 0.67 }
  });

  useEffect(() => {
    async function loadMarketData() {
      try {
        console.log('[Hero] Loading market data...');
        const quotes = await marketDataAPI.getAllIndexQuotes();
        console.log('[Hero] Received quotes:', quotes);
        
        if (quotes && Object.keys(quotes).length > 0) {
          setMarketData(prev => {
            const updated = { ...prev };
            
            if (quotes.NIFTY && quotes.NIFTY.status === 'ok') {
              updated.nifty = {
                value: quotes.NIFTY.price || 0,
                change: quotes.NIFTY.change || 0,
                changePercent: quotes.NIFTY.changePercent || 0
              };
              console.log('[Hero] Updated NIFTY:', updated.nifty);
            }
            
            if (quotes.SENSEX && quotes.SENSEX.status === 'ok') {
              updated.sensex = {
                value: quotes.SENSEX.price || 0,
                change: quotes.SENSEX.change || 0,
                changePercent: quotes.SENSEX.changePercent || 0
              };
              console.log('[Hero] Updated SENSEX:', updated.sensex);
            }
            
            if (quotes.BANKNIFTY && quotes.BANKNIFTY.status === 'ok') {
              updated.banknifty = {
                value: quotes.BANKNIFTY.price || 0,
                change: quotes.BANKNIFTY.change || 0,
                changePercent: quotes.BANKNIFTY.changePercent || 0
              };
              console.log('[Hero] Updated BANKNIFTY:', updated.banknifty);
            }
            
            console.log('[Hero] Final updated market data:', updated);
            return updated;
          });
        } else {
          console.warn('[Hero] No quotes received or empty response');
        }
      } catch (e) {
        console.error('[Hero] Error loading market data:', e);
      }
    }
    
    loadMarketData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const tickerItems = [
    { name: 'NIFTY 50', value: marketData.nifty.value, change: marketData.nifty.change, changePercent: marketData.nifty.changePercent },
    { name: 'SENSEX', value: marketData.sensex.value, change: marketData.sensex.change, changePercent: marketData.sensex.changePercent },
    { name: 'BANKNIFTY', value: marketData.banknifty.value, change: marketData.banknifty.change, changePercent: marketData.banknifty.changePercent },
  ];

  return (
    <section className="relative min-h-screen flex items-center gradient-bg overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      <div className="relative max-w-[95%] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Empowering Smart
                <span className="text-gradient block">Investments</span>
                <span className="text-gray-700">& Financial Awareness</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Get live market data, expert insights, and comprehensive financial services 
                to make informed investment decisions in Indian markets.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.open('https://angel-one.onelink.me/Wjgr/3mc0nam3', '_blank')}
                className="btn-primary text-lg px-8 py-3"
              >
                Open Demat Account
              </button>
              <Link href="/learn-trading" className="btn-secondary text-lg px-8 py-3 inline-block text-center">
                Learn About Trading
              </Link>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                <span>Live Market Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-financial-green" />
                <span>Expert Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-financial-gold" />
                <span>Financial Services</span>
              </div>
            </div>
          </div>

          {/* Right Content - Live Ticker */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Market Updates</h3>
              <div className="space-y-3">
                {tickerItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ₹{item.value.toLocaleString()}
                      </div>
                      <div className={`text-sm flex items-center ${
                        item.change >= 0 ? 'text-financial-green' : 'text-financial-red'
                      }`}>
                        {item.change >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {item.change >= 0 ? '+' : ''}{item.change} ({item.changePercent >= 0 ? '+' : ''}{item.changePercent}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200">
                  <div className="text-primary-600 font-medium">Market Analysis</div>
                  <div className="text-sm text-gray-600">Get insights</div>
                </button>
                <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                  <div className="text-financial-green font-medium">Portfolio</div>
                  <div className="text-sm text-gray-600">Track investments</div>
                </button>
                <button className="p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200">
                  <div className="text-financial-gold font-medium">Learn</div>
                  <div className="text-sm text-gray-600">Trading basics</div>
                </button>
                <button className="p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors duration-200">
                  <div className="text-secondary-600 font-medium">Support</div>
                  <div className="text-sm text-gray-600">Get help</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
