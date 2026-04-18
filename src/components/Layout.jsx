import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DEFAULT_TITLE = 'Sharada Financial Services';
const DEFAULT_DESCRIPTION =
  'Sharada Financial Services offers Indian market news, financial awareness content, and demat account guidance for smarter investment decisions.';
const DEFAULT_IMAGE = '/stp.jpg';

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://www.sharadafinancial.com'
  );
}

export default function Layout({
  children,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = '',
  image = DEFAULT_IMAGE,
  noindex = false,
}) {
  const siteUrl = getSiteUrl();
  const canonical = canonicalPath ? `${siteUrl}${canonicalPath}` : siteUrl;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
        <link rel="canonical" href={canonical} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${siteUrl}${image}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}${image}`} />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
