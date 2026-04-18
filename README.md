# Sharada Financial Services

Sharada Financial Services is a Next.js site focused on Indian market awareness, basic research content, and lead-generation for financial services.

## Vercel Deployment Model

This project now deploys as a pure Next.js app on Vercel Hobby.

Live data is served through same-origin API routes:
- `/api/market/indices`
- `/api/market/index?symbol=NIFTY|SENSEX|BANKNIFTY`
- `/api/market/movers?limit=10`
- `/api/news?limit=10`

The deployed Vercel edition keeps:
- live index quotes
- top gainers and losers
- English market news

The following backend-driven NSE features are intentionally paused in this deployment:
- FII/DII
- block deals
- bulk deals
- put/call ratio
- past results

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- Recharts
- Lucide React
- `yahoo-finance2` for server-side market quotes
- Marketaux for live news

## Environment Variables

Create `.env.local` with:

```bash
MARKETAUX_API_KEY=your_marketaux_key
```

`MARKETAUX_API_KEY` is server-side only and should be added in Vercel project settings for production.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## Notes

- The `backend/` folder is kept for archival/reference purposes and is not part of the Vercel runtime path.
- Yahoo Finance access is handled server-side only.
