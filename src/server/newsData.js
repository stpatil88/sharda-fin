const MARKETAUX_ENDPOINT = 'https://api.marketaux.com/v1/news/all';

function normalizeArticle(article, index) {
  return {
    id: `${article.uuid || article.url || article.title || index}`,
    titleEn: article.title || 'Untitled article',
    source: article.source || 'Unknown source',
    url: article.url || '#',
    category: article.entities?.[0]?.type || 'Market Update',
    publishedAt: article.published_at || new Date().toISOString(),
  };
}

export async function getMarketNews(limit = 10) {
  const apiKey = process.env.MARKETAUX_API_KEY;

  if (!apiKey) {
    return [];
  }

  const query = [
    'India stock market',
    'NSE',
    'BSE',
    'Indian economy',
    'business finance',
  ].join(' OR ');

  const searchParams = new URLSearchParams({
    api_token: apiKey,
    language: 'en',
    countries: 'in',
    limit: String(Math.min(limit * 3, 30)),
    sort: 'published_desc',
    filter_entities: 'true',
    search: query,
  });

  const response = await fetch(`${MARKETAUX_ENDPOINT}?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error(`Marketaux request failed with ${response.status}`);
  }

  const payload = await response.json();
  const seen = new Set();
  const normalized = [];

  for (const article of payload.data || []) {
    const key = article.url || article.title;
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push(normalizeArticle(article, normalized.length));

    if (normalized.length >= limit) {
      break;
    }
  }

  return normalized;
}
