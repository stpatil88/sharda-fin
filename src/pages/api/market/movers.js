import { setCacheHeaders } from '../../../server/http';
import { getTopMovers } from '../../../server/marketData';
import { TRACKED_NSE_SYMBOLS } from '../../../server/marketSymbols';

export default async function handler(req, res) {
  setCacheHeaders(res, 's-maxage=300, stale-while-revalidate=600');

  const requestedLimit = Number.parseInt(String(req.query.limit || '10'), 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 20)
    : 10;

  try {
    const movers = await getTopMovers(TRACKED_NSE_SYMBOLS, limit);
    res.status(200).json(movers);
  } catch (error) {
    res.status(200).json({
      gainers: [],
      losers: [],
      asOf: new Date().toISOString(),
      error: error.message,
    });
  }
}
