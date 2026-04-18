import { setCacheHeaders } from '../../../server/http';
import { getAllIndexQuotes } from '../../../server/marketData';

export default async function handler(req, res) {
  setCacheHeaders(res, 's-maxage=300, stale-while-revalidate=600');

  try {
    const quotes = await getAllIndexQuotes();
    res.status(200).json(quotes);
  } catch (error) {
    res.status(200).json({
      NIFTY: { status: 'error', symbol: 'NIFTY', error: error.message },
      SENSEX: { status: 'error', symbol: 'SENSEX', error: error.message },
      BANKNIFTY: { status: 'error', symbol: 'BANKNIFTY', error: error.message },
    });
  }
}
