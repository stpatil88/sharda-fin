import Layout from '../components/Layout';
import FeatureUnavailable from '../components/FeatureUnavailable';

export default function FIIDIIPage() {
  return (
    <Layout title="FII/DII Data - Sharada Financial Services">
      <div className="pt-16">
        <FeatureUnavailable
          title="FII/DII Data Is Temporarily Unavailable"
          description="Institutional flow data was powered by the Python backend and has been paused for the Vercel-first version."
        />
      </div>
    </Layout>
  );
}

