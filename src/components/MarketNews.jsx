import { useState, useEffect } from 'react';
import { newsAPI, marketDataAPI } from '../utils/api';
import { TrendingUp, TrendingDown, Share2, ExternalLink, RefreshCw } from 'lucide-react';
import PCRChart from './Charts/PCRChart';

export default function MarketNews() {
  const [news, setNews] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en'); // 'en' | 'mr'

  // Load news from backend CSV via API; keep mock for gainers/losers
  useEffect(() => {
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

    async function loadNews() {
      try {
        setLoading(true);
        const [newsItems, gainersData, losersData] = await Promise.all([
          newsAPI.getMarketNews(10),
          marketDataAPI.getTopGainers(),
          marketDataAPI.getTopLosers()
        ]);
        setNews(newsItems);
        setTopGainers(gainersData || []);
        setTopLosers(losersData || []);
      } catch (e) {
        console.error('Error loading data:', e);
        setNews([]);
        setTopGainers(mockGainers);
        setTopLosers(mockLosers);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
    
    // Auto-refresh every 10 minutes (600000 ms) to get live updates
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing market data...');
      loadNews();
    }, 600000); // 10 minutes

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
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
        <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="flex items-center space-x-3">
                <div className="flex rounded overflow-hidden border border-gray-200">
                  <button
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 text-sm ${lang === 'en' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
                  >EN</button>
                  <button
                    onClick={() => setLang('mr')}
                    className={`px-3 py-1 text-sm ${lang === 'mr' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
                  >MR</button>
                </div>
                <button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const [newsItems, gainersData, losersData] = await Promise.all([
                        newsAPI.getMarketNews(10),
                        marketDataAPI.getTopGainers(),
                        marketDataAPI.getTopLosers()
                      ]);
                      setNews(newsItems);
                      setTopGainers(gainersData || []);
                      setTopLosers(losersData || []);
                    } catch (e) {
                      console.error('Refresh error:', e);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Refresh</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {news.length === 0 && (
                <div className="text-gray-500 text-sm">No news available. Try Refresh.</div>
              )}
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
                      {lang === 'en' ? (
                        <>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">{article.titleEn || '—'}</h4>
                          {article.titleMr ? (
                            <p className="text-gray-700 mb-3">{article.titleMr}</p>
                          ) : null}
                        </>
                      ) : (
                        <>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">{article.titleMr || article.titleEn || '—'}</h4>
                          {article.titleEn ? (
                            <p className="text-gray-700 mb-3">{article.titleEn}</p>
                          ) : null}
                        </>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Source: {article.source}
                        </span>
                        <button
                          onClick={() => shareToWhatsApp(article.titleEn || '', article.url || window.location.href)}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors duration-200"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                      {article.url ? (
                        <div className="mt-2">
                          <a href={article.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm">
                            Read more
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </div>
                      ) : null}
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
                {topGainers.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">No gainers data available</div>
                ) : (
                  topGainers.map((stock, index) => {
                    console.log(`[MarketNews] Rendering gainer ${index}:`, stock);
                    return (
                      <div key={`gainer-${stock.symbolToken || stock.symbol || index}`} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{stock.symbol || 'N/A'}</div>
                          <div className="text-sm text-gray-600">₹{(stock.price || 0).toFixed(2)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-financial-green font-medium">
                            +₹{Math.abs(stock.change || 0).toFixed(2)}
                          </div>
                          <div className="text-sm text-financial-green">
                            +{(stock.changePercent || 0).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Top Losers */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingDown className="w-5 h-5 text-financial-red" />
                <h3 className="text-lg font-semibold text-gray-900">Top Losers</h3>
              </div>
              <div className="space-y-3">
                {topLosers.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">No losers data available</div>
                ) : (
                  topLosers.map((stock, index) => {
                    console.log(`[MarketNews] Rendering loser ${index}:`, stock);
                    return (
                      <div key={`loser-${stock.symbolToken || stock.symbol || index}`} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{stock.symbol || 'N/A'}</div>
                          <div className="text-sm text-gray-600">₹{(stock.price || 0).toFixed(2)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-financial-red font-medium">
                            -₹{Math.abs(stock.change || 0).toFixed(2)}
                          </div>
                          <div className="text-sm text-financial-red">
                            -{Math.abs(stock.changePercent || 0).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* FII/DII Data */}
            {/* <div className="card">
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
            </div> */}
          </div>
        </div>

        {/* Put/Call Ratio Chart Section */}
        <div className="mt-8">
          <PCRChart height={500} />
        </div>
      </div>
    </section>
  );
}
