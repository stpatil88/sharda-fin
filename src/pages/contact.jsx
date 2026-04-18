import Layout from '../components/Layout';
import Contact from '../components/Contact';

export default function ContactPage() {
  return (
    <Layout
      title="Contact Sharada Financial Services"
      description="Contact Sharada Financial Services for investment support, service inquiries, demat account help, and financial guidance."
      canonicalPath="/contact"
    >
      <div className="pt-16">
        <Contact />
      </div>
    </Layout>
  );
}
