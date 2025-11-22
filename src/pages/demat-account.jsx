import Layout from '../components/Layout';
import DematAccountQR from '../components/DematAccountQR';
import { ExternalLink, CheckCircle, Shield, Smartphone, Clock } from 'lucide-react';

export default function DematAccountPage() {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'SEBI registered broker with 2+ crore downloads'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Trade on the go with our mobile app'
    },
    {
      icon: Clock,
      title: 'Quick Onboarding',
      description: 'Start with just PAN Card, complete in minutes'
    },
    {
      icon: CheckCircle,
      title: 'Zero Charges',
      description: 'No account opening or maintenance charges'
    }
  ];

  return (
    <Layout title="Open Demat Account - Sharada Financial Services">
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Open Your Demat Account
                <span className="text-gradient block">in Minutes</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Start your investment journey with Angel One - India's leading broker. 
                Trade stocks, derivatives, commodities, mutual funds, and currencies all in one platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.open('https://angel-one.onelink.me/Wjgr/3mc0nam3', '_blank')}
                  className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Open Account Now</span>
                </button>
                <button className="btn-secondary text-lg px-8 py-3">
                  Learn More
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {features.map((feature, index) => (
                <div key={index} className="card text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-white">
          <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Account Opening Options */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Choose Your Preferred Method
                </h2>
                <DematAccountQR />
              </div>

              {/* Benefits Section */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Why Choose Angel One?
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">One Platform for Everything</h4>
                        <p className="text-gray-600">Stocks, derivatives, commodities, mutual funds, or currencies — find everything in one place</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Minimum Documents Required</h4>
                        <p className="text-gray-600">Start with just PAN Card. Bank Statements, Aadhaar Card, and Cancelled Cheque required only if needed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Get Context, Make Smart Decisions</h4>
                        <p className="text-gray-600">Understand the what and the why behind the market. Learn on-the-go with our educational content</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Trusted by Millions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-1">2Cr+</div>
                      <div className="text-sm text-gray-600">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-1">15+</div>
                      <div className="text-sm text-gray-600">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-1">SEBI</div>
                      <div className="text-sm text-gray-600">INZ000161534</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-1">24/7</div>
                      <div className="text-sm text-gray-600">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join millions of investors who trust Angel One for their trading and investment needs.
            </p>
            <button 
              onClick={() => window.open('https://angel-one.onelink.me/Wjgr/3mc0nam3', '_blank')}
              className="btn-primary text-lg px-8 py-3"
            >
              Open Demat Account Now
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
