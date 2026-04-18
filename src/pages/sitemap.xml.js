const INDEXED_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/services', changefreq: 'weekly', priority: '0.9' },
  { path: '/learn-trading', changefreq: 'weekly', priority: '0.8' },
  { path: '/demat-account', changefreq: 'weekly', priority: '0.9' },
  { path: '/market-news', changefreq: 'hourly', priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
];

function getBaseUrl(req) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  return `${protocol}://${req.headers.host}`;
}

export async function getServerSideProps({ req, res }) {
  const baseUrl = getBaseUrl(req);
  const lastmod = new Date().toISOString();

  const urls = INDEXED_ROUTES.map(
    ({ path, changefreq, priority }) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  ).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(xml);
  res.end();

  return { props: {} };
}

export default function SitemapXml() {
  return null;
}
