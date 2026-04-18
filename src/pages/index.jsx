import Layout from '../components/Layout';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import MarketNews from '../components/MarketNews';

export default function Home() {
  return (
    <Layout title="Sharada Financial Services - Empowering Smart Investments">
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <MarketNews />
    </Layout>
  );
}
