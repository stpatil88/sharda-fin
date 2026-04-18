import Layout from '../components/Layout';
import About from '../components/About';

export default function AboutPage() {
  return (
    <Layout
      title="About Sharada Financial Services | Financial Awareness And Support"
      description="Learn about Sharada Financial Services, our mission, and how we help clients with financial awareness, investment guidance, and service support."
      canonicalPath="/about"
    >
      <div className="pt-16">
        <About />
      </div>
    </Layout>
  );
}
