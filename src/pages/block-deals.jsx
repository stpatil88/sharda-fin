import Layout from '../components/Layout';
import FeatureUnavailable from '../components/FeatureUnavailable';

export default function BlockDealsPage() {
  return (
    <Layout title="Block Deals - Sharada Financial Services">
      <div className="pt-16">
        <FeatureUnavailable
          title="Block Deals Are Temporarily Unavailable"
          description="Block deal data is part of the backend-only NSE feature set and is not included in the current Vercel deployment."
        />
      </div>
    </Layout>
  );
}

