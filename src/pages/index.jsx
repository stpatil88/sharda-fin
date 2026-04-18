import Layout from '../components/Layout';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import MarketNews from '../components/MarketNews';

export default function Home() {
  return (
    <Layout
      title="Sharada Financial Services | Market News, Demat Account, Financial Services"
      description="Explore Indian market news, demat account guidance, and financial services from Sharada Financial Services to support smarter investing."
      canonicalPath="/"
    >
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <MarketNews />
    </Layout>
  );
}
