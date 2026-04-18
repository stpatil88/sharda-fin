import Layout from '../components/Layout';
import FeatureUnavailable from '../components/FeatureUnavailable';

export default function BulkDealsPage() {
  return (
    <Layout
      title="Bulk Deals - Sharada Financial Services"
      description="Bulk deals are temporarily unavailable in the current Vercel edition."
      canonicalPath="/bulk-deals"
      noindex
    >
      <div className="pt-16">
        <FeatureUnavailable
          title="Bulk Deals Are Temporarily Unavailable"
          description="Bulk deal data is part of the backend-only NSE feature set and is not included in the current Vercel deployment."
        />
      </div>
    </Layout>
  );
}

