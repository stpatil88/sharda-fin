import { setCacheHeaders } from '../../../../server/http';
import { getIndexQuote, INDEX_SYMBOLS } from '../../../../server/marketData';

export default async function handler(req, res) {
  setCacheHeaders(res, 's-maxage=300, stale-while-revalidate=600');

  const symbol = String(req.query.symbol || '').toUpperCase();
  if (!symbol || !INDEX_SYMBOLS[symbol]) {
    res.status(400).json({
      status: 'error',
      error: 'Invalid symbol. Use NIFTY, SENSEX, or BANKNIFTY.',
    });
    return;
  }

  try {
    const quote = await getIndexQuote(symbol);
    res.status(200).json(quote);
  } catch (error) {
    res.status(200).json({
      status: 'error',
      symbol,
      price: 0,
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      change: 0,
      changePercent: 0,
      error: error.message,
    });
  }
}
