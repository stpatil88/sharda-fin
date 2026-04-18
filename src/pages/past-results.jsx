import Layout from '../components/Layout';
import FeatureUnavailable from '../components/FeatureUnavailable';

export default function PastResultsPage() {
  return (
    <Layout
      title="Past Results - Sharada Financial Services"
      description="Company past results are temporarily unavailable in the current Vercel edition."
      canonicalPath="/past-results"
      noindex
    >
      <div className="pt-16">
        <FeatureUnavailable
          title="Past Results Are Temporarily Unavailable"
          description="Company result lookups were served from backend-managed NSE data and are not included in the current Vercel deployment."
        />
      </div>
    </Layout>
  );
}

