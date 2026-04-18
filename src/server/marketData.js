import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export const INDEX_SYMBOLS = {
  NIFTY: '^NSEI',
  SENSEX: '^BSESN',
  BANKNIFTY: '^NSEBANK',
};

function toNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function normalizeIndexQuote(symbolKey, quote) {
  const price = toNumber(quote?.regularMarketPrice);
  const close = toNumber(
    quote?.regularMarketPreviousClose ?? quote?.regularMarketOpen ?? price
  );

  return {
    status: price ? 'ok' : 'error',
    symbol: symbolKey,
    exchange: symbolKey === 'SENSEX' ? 'BSE' : 'NSE',
    price,
    open: toNumber(quote?.regularMarketOpen),
    high: toNumber(quote?.regularMarketDayHigh),
    low: toNumber(quote?.regularMarketDayLow),
    close,
    change: toNumber(quote?.regularMarketChange),
    changePercent: toNumber(quote?.regularMarketChangePercent),
  };
}

function normalizeMoverQuote(quote) {
  const symbol = quote?.symbol?.replace(/\.NS$/, '') || quote?.shortName || 'N/A';
  const price = toNumber(quote?.regularMarketPrice);
  const change = toNumber(quote?.regularMarketChange);
  const changePercent = toNumber(quote?.regularMarketChangePercent);

  return {
    symbol,
    name: quote?.shortName || symbol,
    price,
    change,
    changePercent,
  };
}

export async function getAllIndexQuotes() {
  const entries = await Promise.all(
    Object.entries(INDEX_SYMBOLS).map(async ([key, yahooSymbol]) => {
      try {
        const quote = await yahooFinance.quote(yahooSymbol);
        return [key, normalizeIndexQuote(key, quote)];
      } catch (error) {
        return [
          key,
          {
            status: 'error',
            symbol: key,
            exchange: key === 'SENSEX' ? 'BSE' : 'NSE',
            price: 0,
            open: 0,
            high: 0,
            low: 0,
            close: 0,
            change: 0,
            changePercent: 0,
            error: error.message,
          },
        ];
      }
    })
  );

  return Object.fromEntries(entries);
}

export async function getIndexQuote(symbolKey) {
  const yahooSymbol = INDEX_SYMBOLS[symbolKey];
  if (!yahooSymbol) {
    return null;
  }

  const quote = await yahooFinance.quote(yahooSymbol);
  return normalizeIndexQuote(symbolKey, quote);
}

export async function getTopMovers(symbols, limit = 10) {
  const quotes = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const quote = await yahooFinance.quote(symbol);
        return normalizeMoverQuote(quote);
      } catch (error) {
        return null;
      }
    })
  );

  const validQuotes = quotes.filter(
    (quote) =>
      quote &&
      Number.isFinite(quote.changePercent) &&
      Number.isFinite(quote.price) &&
      quote.price > 0
  );

  const sorted = [...validQuotes].sort(
    (left, right) => right.changePercent - left.changePercent
  );

  return {
    gainers: sorted.slice(0, limit),
    losers: [...sorted].reverse().slice(0, limit),
    asOf: new Date().toISOString(),
  };
}
