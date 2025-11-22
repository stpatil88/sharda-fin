import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [interestRate, setInterestRate] = useState(7);
  const [tenure, setTenure] = useState(1);
  const [tenureType, setTenureType] = useState('years'); // 'years' or 'months'
  const [results, setResults] = useState(null);

  const calculateFD = () => {
    const rate = interestRate / 100;
    let time;
    
    if (tenureType === 'years') {
      time = tenure;
    } else {
      time = tenure / 12; // Convert months to years
    }

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    // For FD, typically compounded quarterly (n=4)
    const n = 4; // Quarterly compounding
    const amount = principal * Math.pow(1 + rate / n, n * time);
    const interest = amount - principal;
    const effectiveRate = ((amount - principal) / principal) * 100;

    setResults({
      maturityAmount: amount,
      principal,
      interest,
      effectiveRate
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
        <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
          <Calculator className="w-6 h-6 text-secondary-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Fixed Deposit Calculator</h3>
          <p className="text-sm text-gray-600">Calculate your Fixed Deposit maturity amount</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Principal Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Principal Amount (₹)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              min="1000"
              max="10000000"
              step="1000"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            />
          </div>
          <div className="mt-2 flex gap-2">
            {[50000, 100000, 500000, 1000000].map((amount) => (
              <button
                key={amount}
                onClick={() => setPrincipal(amount)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-secondary-100 text-gray-700 hover:text-secondary-700 rounded-md transition-colors"
              >
                ₹{amount.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Interest Rate (%)
          </label>
          <div className="relative">
            <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              min="3"
              max="15"
              step="0.25"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            />
          </div>
          <div className="mt-2 flex gap-2">
            {[5.5, 6.5, 7.5, 8.5].map((rate) => (
              <button
                key={rate}
                onClick={() => setInterestRate(rate)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-secondary-100 text-gray-700 hover:text-secondary-700 rounded-md transition-colors"
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

        {/* Tenure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tenure
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              min="1"
              max={tenureType === 'years' ? 20 : 240}
              step="1"
              className="flex-1 pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            />
            <select
              value={tenureType}
              onChange={(e) => setTenureType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
          <div className="mt-2 flex gap-2">
            {tenureType === 'years' 
              ? [1, 3, 5, 10].map((years) => (
                  <button
                    key={years}
                    onClick={() => setTenure(years)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-secondary-100 text-gray-700 hover:text-secondary-700 rounded-md transition-colors"
                  >
                    {years}Y
                  </button>
                ))
              : [6, 12, 24, 36].map((months) => (
                  <button
                    key={months}
                    onClick={() => setTenure(months)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-secondary-100 text-gray-700 hover:text-secondary-700 rounded-md transition-colors"
                  >
                    {months}M
                  </button>
                ))
            }
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateFD}
          className="w-full btn-primary py-3 text-lg font-semibold bg-secondary-600 hover:bg-secondary-700"
        >
          Calculate FD Returns
        </button>

        {/* Results */}
        {results && (
          <div className="mt-6 p-6 bg-gradient-to-br from-secondary-50 to-primary-50 rounded-xl border border-secondary-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Your FD Returns</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Principal Amount</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(results.principal)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Interest Earned</p>
                <p className="text-xl font-bold text-secondary-600">{formatCurrency(results.interest)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg col-span-2">
                <p className="text-sm text-gray-600 mb-1">Maturity Amount</p>
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(results.maturityAmount)}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-secondary-200">
              <p className="text-sm text-gray-600">
                Effective Return: <span className="font-semibold text-secondary-700">{results.effectiveRate.toFixed(2)}%</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                *Interest is compounded quarterly
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

