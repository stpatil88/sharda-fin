import { useState } from 'react';
import { TrendingUp, TrendingDown, Globe, FileText, RefreshCw, Calendar, Search } from 'lucide-react';
import { nseDataAPI } from '../utils/api';
import BlockDeals from './BlockDeals';
import BulkDeals from './BulkDeals';
import FIIDIIData from './FIIDIIData';
import PastResults from './PastResults';

export default function MarketResults() {
  const [activeTab, setActiveTab] = useState('fii-dii');

  const tabs = [
    { id: 'fii-dii', name: 'FII/DII', icon: Globe },
    { id: 'block-deals', name: 'Block Deals', icon: TrendingUp },
    { id: 'bulk-deals', name: 'Bulk Deals', icon: TrendingDown },
    { id: 'past-results', name: 'Past Results', icon: FileText },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Market Results</h2>
              <p className="text-gray-600">Comprehensive market data and financial results</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                      ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'fii-dii' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <FIIDIIData />
            </div>
          )}

          {activeTab === 'block-deals' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <BlockDeals />
            </div>
          )}

          {activeTab === 'bulk-deals' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <BulkDeals />
            </div>
          )}

          {activeTab === 'past-results' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <PastResults />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

