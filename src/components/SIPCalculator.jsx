import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);
  const [results, setResults] = useState(null);

  const calculateSIP = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = investmentPeriod * 12;
    
    // SIP Future Value Formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    const futureValue = monthlyInvestment * 
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    
    const totalInvestment = monthlyInvestment * months;
    const totalReturns = futureValue - totalInvestment;
    const returnPercentage = ((futureValue - totalInvestment) / totalInvestment) * 100;

    setResults({
      futureValue,
      totalInvestment,
      totalReturns,
      returnPercentage
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <Calculator className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">SIP Calculator</h3>
          <p className="text-sm text-gray-600">Calculate your Systematic Investment Plan returns</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Monthly Investment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Investment (₹)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              min="500"
              max="1000000"
              step="500"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="mt-2 flex gap-2">
            {[5000, 10000, 25000, 50000].map((amount) => (
              <button
                key={amount}
                onClick={() => setMonthlyInvestment(amount)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-md transition-colors"
              >
                ₹{amount.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Expected Annual Return */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Annual Return (%)
          </label>
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              min="6"
              max="30"
              step="0.5"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="mt-2 flex gap-2">
            {[10, 12, 15, 18].map((rate) => (
              <button
                key={rate}
                onClick={() => setAnnualReturn(rate)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-md transition-colors"
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

        {/* Investment Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Period (Years)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={investmentPeriod}
              onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
              min="1"
              max="50"
              step="1"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="mt-2 flex gap-2">
            {[5, 10, 15, 20].map((years) => (
              <button
                key={years}
                onClick={() => setInvestmentPeriod(years)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-md transition-colors"
              >
                {years}Y
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateSIP}
          className="w-full btn-primary py-3 text-lg font-semibold"
        >
          Calculate SIP Returns
        </button>

        {/* Results */}
        {results && (
          <div className="mt-6 p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Your SIP Returns</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Investment</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(results.totalInvestment)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Estimated Returns</p>
                <p className="text-xl font-bold text-primary-600">{formatCurrency(results.totalReturns)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg col-span-2">
                <p className="text-sm text-gray-600 mb-1">Maturity Value</p>
                <p className="text-2xl font-bold text-secondary-600">{formatCurrency(results.futureValue)}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-primary-200">
              <p className="text-sm text-gray-600">
                Return Percentage: <span className="font-semibold text-primary-700">{results.returnPercentage.toFixed(2)}%</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

