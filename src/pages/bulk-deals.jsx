import Layout from '../components/Layout';
import FeatureUnavailable from '../components/FeatureUnavailable';

export default function BulkDealsPage() {
  return (
    <Layout title="Bulk Deals - Sharada Financial Services">
      <div className="pt-16">
        <FeatureUnavailable
          title="Bulk Deals Are Temporarily Unavailable"
          description="Bulk deal data is part of the backend-only NSE feature set and is not included in the current Vercel deployment."
        />
      </div>
    </Layout>
  );
}

