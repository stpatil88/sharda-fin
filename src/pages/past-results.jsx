import Layout from '../components/Layout';
import FeatureUnavailable from '../components/FeatureUnavailable';

export default function PastResultsPage() {
  return (
    <Layout title="NSE Past Results - Sharada Financial Services">
      <div className="pt-16">
        <FeatureUnavailable
          title="Past Results Are Temporarily Unavailable"
          description="Company result lookups were served from backend-managed NSE data and are not included in the current Vercel deployment."
        />
      </div>
    </Layout>
  );
}

