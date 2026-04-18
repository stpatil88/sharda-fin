import Layout from '../components/Layout';
import MarketNews from '../components/MarketNews';

export default function MarketNewsPage() {
  return (
    <Layout
      title="Market News India | Sharada Financial Services"
      description="Stay updated with Indian market news, top gainers, top losers, and live index moves from Sharada Financial Services."
      canonicalPath="/market-news"
    >
      <div className="pt-16">
        <MarketNews />
      </div>
    </Layout>
  );
}
