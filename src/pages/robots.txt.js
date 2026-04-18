const INDEXED_PATHS = [
  '/',
  '/about',
  '/services',
  '/learn-trading',
  '/demat-account',
  '/market-news',
  '/contact',
];

function getBaseUrl(req) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  return `${protocol}://${req.headers.host}`;
}

export async function getServerSideProps({ req, res }) {
  const baseUrl = getBaseUrl(req);
  const allowRules = INDEXED_PATHS.map((path) => `Allow: ${path}`).join('\n');

  const body = `User-agent: *\nAllow: /\n${allowRules}\nDisallow: /api/\nDisallow: /market-results\nDisallow: /block-deals\nDisallow: /bulk-deals\nDisallow: /fii-dii\nDisallow: /past-results\n\nSitemap: ${baseUrl}/sitemap.xml\n`;

  res.setHeader('Content-Type', 'text/plain');
  res.write(body);
  res.end();

  return { props: {} };
}

export default function RobotsTxt() {
  return null;
}
