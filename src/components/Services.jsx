import { useState } from 'react';
import { 
  CreditCard, 
  Shield, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  ChevronRight,
  X
} from 'lucide-react';

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 1,
      title: 'Demat Account Opening',
      description: 'Open your Demat account with Angel One - India\'s leading broker with 2+ crore downloads.',
      icon: CreditCard,
      features: [
        'Zero account opening charges',
        'Minimum documents (PAN Card)',
        'Access to NSE & BSE',
        'Mobile trading app',
        'Quick onboarding process'
      ],
      cta: 'Open Account Now',
      link: 'https://angel-one.onelink.me/Wjgr/3mc0nam3'
    },
    {
      id: 2,
      title: 'Insurance Services',
      description: 'Comprehensive insurance solutions for life, health, and general insurance needs.',
      icon: Shield,
      features: [
        'Life insurance plans',
        'Health insurance coverage',
        'Motor insurance',
        'Travel insurance',
        'Customized policies'
      ],
      cta: 'Get Quote'
    },
    {
      id: 3,
      title: 'Mutual Funds',
      description: 'Invest in professionally managed mutual funds with expert guidance and portfolio diversification.',
      icon: TrendingUp,
      features: [
        'SIP investments',
        'Lump sum investments',
        'Tax-saving ELSS',
        'Portfolio rebalancing',
        'Regular monitoring'
      ],
      cta: 'Start Investing'
    },
    {
      id: 4,
      title: 'Loans',
      description: 'Personal, home, and business loans with competitive interest rates and quick approval.',
      icon: DollarSign,
      features: [
        'Personal loans',
        'Home loans',
        'Business loans',
        'Quick approval',
        'Competitive rates'
      ],
      cta: 'Apply Now'
    },
    {
      id: 5,
      title: 'Financial Research',
      description: 'In-depth market analysis, company research, and investment recommendations.',
      icon: BarChart3,
      features: [
        'Daily market updates',
        'Company analysis',
        'Sector research',
        'Technical analysis',
        'Investment recommendations'
      ],
      cta: 'View Research'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Financial Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive financial solutions designed to help you achieve your investment 
            goals with expert guidance and cutting-edge technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="card hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedService(service)}
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200">
                  <service.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-primary-600 font-medium text-sm group-hover:text-primary-700">
                  Know More
                </span>
                <ChevronRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          ))}
        </div>

        {/* Service Detail Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <selectedService.icon className="w-6 h-6 text-secondary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedService.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <p className="text-gray-600 mb-6">
                  {selectedService.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                  <div className="grid gap-3">
                    {selectedService.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button 
                    className="btn-primary flex-1"
                    onClick={() => {
                      if (selectedService.link) {
                        window.open(selectedService.link, '_blank');
                      }
                    }}
                  >
                    {selectedService.cta}
                  </button>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="btn-secondary px-6"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
