import Layout from '../components/Layout';
import Services from '../components/Services';
import SIPCalculator from '../components/SIPCalculator';
import FDCalculator from '../components/FDCalculator';

export default function ServicesPage() {
  return (
    <Layout title="Our Services - Sharada Financial Services">
      <div className="pt-16">
        <Services />
        
        {/* Financial Calculators Section */}
        <section className="py-20 bg-white">
          <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Financial Calculators
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Plan your investments and savings with our easy-to-use financial calculators
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <SIPCalculator />
              <FDCalculator />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
