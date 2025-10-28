import Layout from '../components/Layout';
import MarketNews from '../components/MarketNews';

export default function MarketNewsPage() {
  return (
    <Layout title="Market News & Research - Sharada Financial Services">
      <div className="pt-16">
        <MarketNews />
      </div>
    </Layout>
  );
}
