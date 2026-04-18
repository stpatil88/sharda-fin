import Layout from '../components/Layout';
import FeatureUnavailable from '../components/FeatureUnavailable';

export default function FIIDIIPage() {
  return (
    <Layout
      title="FII DII Data - Sharada Financial Services"
      description="FII and DII data are temporarily unavailable in the current Vercel edition."
      canonicalPath="/fii-dii"
      noindex
    >
      <div className="pt-16">
        <FeatureUnavailable
          title="FII/DII Data Is Temporarily Unavailable"
          description="Institutional flow data was powered by the Python backend and has been paused for the Vercel-first version."
        />
      </div>
    </Layout>
  );
}

