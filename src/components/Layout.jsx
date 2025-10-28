import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Layout({ children, title = 'Sharada Financial Services' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Empowering Smart Investments & Financial Awareness" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
