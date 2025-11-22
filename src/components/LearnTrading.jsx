import { useState } from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Clock, 
  Shield,
  Target,
  Users,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  FileText,
  Calculator
} from 'lucide-react';
import Link from 'next/link';

export default function LearnTrading() {
  const [activeSection, setActiveSection] = useState('basics');

  const sections = [
    { id: 'basics', name: 'Trading Basics', icon: BookOpen },
    { id: 'nse', name: 'NSE Market', icon: TrendingUp },
    { id: 'types', name: 'Trading Types', icon: BarChart3 },
    { id: 'strategies', name: 'Strategies', icon: Target },
    { id: 'risks', name: 'Risk Management', icon: Shield },
  ];

  const tradingBasics = [
    {
      title: 'What is Stock Trading?',
      content: 'Stock trading involves buying and selling shares of publicly listed companies on stock exchanges like NSE (National Stock Exchange) and BSE (Bombay Stock Exchange). When you buy a stock, you become a partial owner of that company.',
      icon: DollarSign
    },
    {
      title: 'How Stock Exchanges Work',
      content: 'Stock exchanges are marketplaces where buyers and sellers come together to trade stocks. NSE is India\'s largest stock exchange by volume, facilitating millions of trades daily through an electronic trading system.',
      icon: BarChart3
    },
    {
      title: 'Market Timings',
      content: 'NSE operates from 9:15 AM to 3:30 PM IST, Monday to Friday. Pre-market session runs from 9:00 AM to 9:15 AM. Markets are closed on weekends and public holidays.',
      icon: Clock
    },
    {
      title: 'Key Market Participants',
      content: 'The market includes retail investors, institutional investors (FII/DII), brokers, market makers, and regulatory bodies like SEBI that ensure fair trading practices.',
      icon: Users
    }
  ];

  const nseInfo = [
    {
      title: 'About NSE',
      content: 'The National Stock Exchange (NSE) was established in 1992 and is India\'s leading stock exchange. It introduced electronic trading in India and is known for its transparency, efficiency, and advanced technology.',
      icon: TrendingUp
    },
    {
      title: 'Major Indices',
      content: 'NSE hosts several key indices including NIFTY 50 (top 50 companies), NIFTY Bank, NIFTY IT, and sectoral indices. These indices help track overall market performance and specific sectors.',
      icon: BarChart3
    },
    {
      title: 'Trading Segments',
      content: 'NSE offers trading in Equity, Derivatives (Futures & Options), Currency, Commodities, and Debt instruments. Each segment has different risk profiles and trading requirements.',
      icon: Target
    },
    {
      title: 'Market Capitalization',
      content: 'NSE is one of the world\'s largest stock exchanges by market capitalization, with thousands of listed companies representing various sectors of the Indian economy.',
      icon: DollarSign
    }
  ];

  const tradingTypes = [
    {
      type: 'Intraday Trading',
      description: 'Buying and selling stocks within the same trading day. Positions are closed before market close.',
      features: ['Quick profits', 'No overnight risk', 'Requires active monitoring', 'Higher risk'],
      icon: Clock
    },
    {
      type: 'Swing Trading',
      description: 'Holding stocks for a few days to weeks to capture price movements.',
      features: ['Less time intensive', 'Moderate risk', 'Technical analysis based', 'Good for part-time traders'],
      icon: TrendingUp
    },
    {
      type: 'Position Trading',
      description: 'Long-term holding of stocks for months or years based on fundamental analysis.',
      features: ['Lower transaction costs', 'Fundamental analysis', 'Long-term wealth building', 'Less stress'],
      icon: Target
    },
    {
      type: 'Options Trading',
      description: 'Trading in derivative contracts that give the right to buy/sell stocks at a predetermined price.',
      features: ['Limited risk', 'High leverage', 'Complex strategies', 'Requires knowledge'],
      icon: BarChart3
    }
  ];

  const strategies = [
    {
      title: 'Technical Analysis',
      description: 'Analyzing price charts, patterns, and indicators to predict future price movements.',
      points: [
        'Study candlestick patterns',
        'Use technical indicators (RSI, MACD, Moving Averages)',
        'Identify support and resistance levels',
        'Follow volume trends'
      ]
    },
    {
      title: 'Fundamental Analysis',
      description: 'Evaluating company financials, industry trends, and economic factors.',
      points: [
        'Analyze financial statements',
        'Study P/E ratio, debt levels, growth prospects',
        'Understand industry dynamics',
        'Monitor economic indicators'
      ]
    },
    {
      title: 'Risk Management',
      description: 'Protecting capital through proper position sizing and stop-loss orders.',
      points: [
        'Never risk more than 2% per trade',
        'Use stop-loss orders',
        'Diversify your portfolio',
        'Keep emotions in check'
      ]
    },
    {
      title: 'Market Psychology',
      description: 'Understanding market sentiment and crowd behavior.',
      points: [
        'Buy when others are fearful',
        'Sell when others are greedy',
        'Avoid FOMO (Fear of Missing Out)',
        'Stick to your trading plan'
      ]
    }
  ];

  const riskManagement = [
    {
      title: 'Stop Loss Orders',
      content: 'A stop-loss order automatically sells your stock when it reaches a predetermined price, limiting your losses. Always set stop-losses to protect your capital.',
      icon: Shield
    },
    {
      title: 'Position Sizing',
      content: 'Never invest more than you can afford to lose. A common rule is to risk only 1-2% of your trading capital on a single trade.',
      icon: Calculator
    },
    {
      title: 'Diversification',
      content: 'Don\'t put all your eggs in one basket. Spread your investments across different stocks, sectors, and asset classes to reduce risk.',
      icon: Target
    },
    {
      title: 'Risk-Reward Ratio',
      content: 'Always aim for a risk-reward ratio of at least 1:2 or higher. This means for every ₹1 you risk, you should target ₹2 or more in profit.',
      icon: TrendingUp
    }
  ];

  const getSectionContent = () => {
    switch (activeSection) {
      case 'basics':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Trading Basics</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {tradingBasics.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="card">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'nse':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding NSE Market</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {nseInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="card">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-secondary-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Key NSE Statistics</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Listed Companies</p>
                  <p className="text-2xl font-bold text-primary-600">2000+</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Daily Trading Volume</p>
                  <p className="text-2xl font-bold text-primary-600">₹50K+ Cr</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Market Cap</p>
                  <p className="text-2xl font-bold text-primary-600">₹300L+ Cr</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'types':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of Trading</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {tradingTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <div key={index} className="card">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.type}</h3>
                        <p className="text-gray-600 mb-4">{type.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {type.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'strategies':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Trading Strategies</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {strategies.map((strategy, index) => (
                <div key={index} className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{strategy.title}</h3>
                  <p className="text-gray-600 mb-4">{strategy.description}</p>
                  <div className="space-y-2">
                    {strategy.points.map((point, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <ArrowRight className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'risks':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Risk Management</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {riskManagement.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="card border-l-4 border-primary-500">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card bg-red-50 border border-red-200 mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-red-600" />
                <span>Important Risk Warning</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Trading in the stock market involves substantial risk of loss. Past performance 
                is not indicative of future results. Only invest money you can afford to lose. 
                Always do your own research and consider consulting with a financial advisor 
                before making investment decisions.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Learn About Trading
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Master the fundamentals of NSE trading
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                      ${
                        activeSection === section.id
                          ? 'border-primary-500 text-primary-600 bg-primary-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {getSectionContent()}
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Link href="/services" className="card hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <Calculator className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Financial Calculators</h3>
                <p className="text-sm text-gray-600">SIP & FD Calculators</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 ml-auto transition-colors" />
            </div>
          </Link>

          <Link href="/market-results" className="card hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Market Results</h3>
                <p className="text-sm text-gray-600">FII/DII, Block & Bulk Deals</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-secondary-600 ml-auto transition-colors" />
            </div>
          </Link>

          <Link href="/demat-account" className="card hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Open Demat Account</h3>
                <p className="text-sm text-gray-600">Start your trading journey</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 ml-auto transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

