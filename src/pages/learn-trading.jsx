import Layout from '../components/Layout';
import LearnTrading from '../components/LearnTrading';

export default function LearnTradingPage() {
  return (
    <Layout
      title="Learn Trading Basics | Sharada Financial Services"
      description="Learn trading basics, market concepts, and beginner-friendly investment education from Sharada Financial Services."
      canonicalPath="/learn-trading"
    >
      <div className="pt-16">
        <LearnTrading />
      </div>
    </Layout>
  );
}

