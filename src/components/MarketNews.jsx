import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Share2, ExternalLink, RefreshCw } from 'lucide-react';

export default function MarketNews() {
  const [news, setNews] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockNews = [
      {
        id: 1,
        title: 'Nifty 50 crosses 19,500 mark as banking stocks rally',
        summary: 'The benchmark index gained 0.8% led by strong performance in banking and IT sectors.',
        source: 'Economic Times',
        publishedAt: '2024-01-15T10:30:00Z',
        category: 'Market Update'
      },
      {
        id: 2,
        title: 'RBI keeps repo rate unchanged at 6.5%',
        summary: 'Central bank maintains status quo on interest rates citing inflation concerns.',
        source: 'Business Standard',
        publishedAt: '2024-01-15T09:00:00Z',
        category: 'Policy'
      },
      {
        id: 3,
        title: 'FIIs turn net buyers with ₹2,500 crore inflow',
        summary: 'Foreign institutional investors show renewed confidence in Indian markets.',
        source: 'Money Control',
        publishedAt: '2024-01-15T08:45:00Z',
        category: 'FII/DII'
      }
    ];

    const mockGainers = [
      { symbol: 'RELIANCE', price: 2450, change: 45, changePercent: 1.87 },
      { symbol: 'TCS', price: 3850, change: 38, changePercent: 1.00 },
      { symbol: 'HDFC', price: 1650, change: 25, changePercent: 1.54 },
      { symbol: 'INFY', price: 1850, change: 22, changePercent: 1.20 },
      { symbol: 'ICICIBANK', price: 950, change: 15, changePercent: 1.60 }
    ];

    const mockLosers = [
      { symbol: 'ADANIPORTS', price: 850, change: -25, changePercent: -2.86 },
      { symbol: 'BAJFINANCE', price: 7200, change: -180, changePercent: -2.44 },
      { symbol: 'MARUTI', price: 10500, change: -200, changePercent: -1.87 },
      { symbol: 'TITAN', price: 3200, change: -45, changePercent: -1.39 },
      { symbol: 'NESTLEIND', price: 18500, change: -200, changePercent: -1.07 }
    ];

    setTimeout(() => {
      setNews(mockNews);
      setTopGainers(mockGainers);
      setTopLosers(mockLosers);
      setLoading(false);
    }, 1000);
  }, []);

  const shareToWhatsApp = (text, url = '') => {
    const shareText = `${text} ${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading market data...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Market News & Research Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest market movements, news, and expert analysis 
            to make informed investment decisions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* News Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Latest News</h3>
              <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200">
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Refresh</span>
              </button>
            </div>

            <div className="space-y-4">
              {news.map((article) => (
                <div key={article.id} className="card hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded">
                          {article.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatTime(article.publishedAt)}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h4>
                      <p className="text-gray-600 mb-3">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Source: {article.source}
                        </span>
                        <button
                          onClick={() => shareToWhatsApp(article.title, window.location.href)}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors duration-200"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Data Sidebar */}
          <div className="space-y-6">
            {/* Top Gainers */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-financial-green" />
                <h3 className="text-lg font-semibold text-gray-900">Top Gainers</h3>
              </div>
              <div className="space-y-3">
                {topGainers.map((stock, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{stock.symbol}</div>
                      <div className="text-sm text-gray-600">₹{stock.price}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-financial-green font-medium">
                        +₹{stock.change}
                      </div>
                      <div className="text-sm text-financial-green">
                        +{stock.changePercent}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Losers */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingDown className="w-5 h-5 text-financial-red" />
                <h3 className="text-lg font-semibold text-gray-900">Top Losers</h3>
              </div>
              <div className="space-y-3">
                {topLosers.map((stock, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{stock.symbol}</div>
                      <div className="text-sm text-gray-600">₹{stock.price}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-financial-red font-medium">
                        ₹{stock.change}
                      </div>
                      <div className="text-sm text-financial-red">
                        {stock.changePercent}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FII/DII Data */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">FII/DII Data</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-900">FII Net</span>
                  <span className="text-financial-green font-semibold">+₹2,500 Cr</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-900">DII Net</span>
                  <span className="text-financial-green font-semibold">+₹1,200 Cr</span>
                </div>
                <div className="text-center">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View Detailed Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
