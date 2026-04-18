import { useEffect, useState } from 'react';
import { newsAPI, marketDataAPI } from '../utils/api';
import { TrendingUp, TrendingDown, Share2, ExternalLink, RefreshCw } from 'lucide-react';

export default function MarketNews() {
  const [news, setNews] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [newsItems, gainersData, losersData] = await Promise.all([
        newsAPI.getMarketNews(10),
        marketDataAPI.getTopGainers(10),
        marketDataAPI.getTopLosers(10),
      ]);
      setNews(newsItems);
      setTopGainers(gainersData || []);
      setTopLosers(losersData || []);
    } catch (error) {
      console.error('Error loading market news data:', error);
      setNews([]);
      setTopGainers([]);
      setTopLosers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const refreshInterval = setInterval(loadData, 600000);
    return () => clearInterval(refreshInterval);
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
      hour12: true,
    });
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value || 0);

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
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Latest News</h3>
              <button
                onClick={loadData}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Refresh</span>
              </button>
            </div>

            <div className="space-y-4">
              {news.length === 0 && (
                <div className="text-gray-500 text-sm">No news available right now. Try Refresh.</div>
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
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        {article.titleEn || '—'}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Source: {article.source}</span>
                        <button
                          onClick={() =>
                            shareToWhatsApp(article.titleEn || '', article.url || window.location.href)
                          }
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors duration-200"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                      {article.url ? (
                        <div className="mt-2">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm"
                          >
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

          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-financial-green" />
                <h3 className="text-lg font-semibold text-gray-900">Top Gainers</h3>
              </div>
              <div className="space-y-3">
                {topGainers.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">No gainers data available</div>
                ) : (
                  topGainers.map((stock, index) => (
                    <div
                      key={`gainer-${stock.symbol || index}`}
                      className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{stock.symbol || 'N/A'}</div>
                        <div className="text-sm text-gray-600">{formatPrice(stock.price)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-financial-green font-medium">
                          +{formatPrice(Math.abs(stock.change || 0))}
                        </div>
                        <div className="text-sm text-financial-green">
                          +{(stock.changePercent || 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingDown className="w-5 h-5 text-financial-red" />
                <h3 className="text-lg font-semibold text-gray-900">Top Losers</h3>
              </div>
              <div className="space-y-3">
                {topLosers.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">No losers data available</div>
                ) : (
                  topLosers.map((stock, index) => (
                    <div
                      key={`loser-${stock.symbol || index}`}
                      className="flex items-center justify-between p-2 bg-red-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{stock.symbol || 'N/A'}</div>
                        <div className="text-sm text-gray-600">{formatPrice(stock.price)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-financial-red font-medium">
                          -{formatPrice(Math.abs(stock.change || 0))}
                        </div>
                        <div className="text-sm text-financial-red">
                          -{Math.abs(stock.changePercent || 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
