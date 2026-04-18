import Layout from '../components/Layout';
import FeatureUnavailable from '../components/FeatureUnavailable';

export default function MarketResultsPage() {
  return (
    <Layout
      title="Market Results - Sharada Financial Services"
      description="Market results are temporarily unavailable in the current Vercel edition."
      canonicalPath="/market-results"
      noindex
    >
      <div className="pt-16">
        <FeatureUnavailable
          title="Market Results Are Not In The Vercel Edition Yet"
          description="This page depended on backend-only NSE data feeds, so it has been paused for the lean Vercel deployment."
        />
      </div>
    </Layout>
  );
}

