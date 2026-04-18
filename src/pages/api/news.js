import { setCacheHeaders } from '../../server/http';
import { getMarketNews } from '../../server/newsData';

export default async function handler(req, res) {
  setCacheHeaders(res, 's-maxage=900, stale-while-revalidate=1800');

  const requestedLimit = Number.parseInt(String(req.query.limit || '10'), 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 20)
    : 10;

  try {
    const articles = await getMarketNews(limit);
    res.status(200).json({ articles });
  } catch (error) {
    res.status(200).json({ articles: [], error: error.message });
  }
}
