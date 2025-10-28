# Sharada Financial Services - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation Steps

1. **Clone/Download the project**
   ```bash
   cd D:\CURSOR\Sharda
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   # Market Data APIs
   NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key
   NEXT_PUBLIC_NSE_API_URL=https://api.nseindia.com
   NEXT_PUBLIC_BSE_API_URL=https://api.bseindia.com

   # News API
   NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
   NEXT_PUBLIC_GNEWS_API_KEY=your_gnews_api_key

   # EmailJS Configuration
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
SharadaFinancialServices/
├── public/
│   ├── images/          # Static images
│   ├── icons/           # Icon files
│   ├── favicon.ico      # Website favicon
│   ├── manifest.json    # PWA manifest
│   └── index.html       # HTML template
├── src/
│   ├── components/       # React components
│   │   ├── Layout.jsx   # Main layout wrapper
│   │   ├── Navbar.jsx   # Navigation component
│   │   ├── Hero.jsx     # Hero section
│   │   ├── About.jsx    # About section
│   │   ├── Services.jsx # Services section
│   │   ├── MarketNews.jsx # Market news section
│   │   ├── Contact.jsx  # Contact form
│   │   ├── Footer.jsx   # Footer component
│   │   ├── Charts/      # Chart components
│   │   │   └── IndexChart.jsx
│   │   └── WhatsAppShare.jsx # WhatsApp sharing
│   ├── pages/           # Next.js pages
│   │   ├── _app.js      # App wrapper
│   │   ├── index.jsx    # Home page
│   │   ├── about.jsx    # About page
│   │   ├── services.jsx # Services page
│   │   ├── market-news.jsx # Market news page
│   │   └── contact.jsx  # Contact page
│   ├── hooks/           # Custom React hooks
│   │   ├── useMarketData.js
│   │   └── useNewsFeed.js
│   ├── utils/           # Utility functions
│   │   ├── api.js       # API functions
│   │   ├── constants.js # Constants
│   │   └── formatter.js # Formatting utilities
│   └── styles/
│       └── globals.css  # Global styles
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
├── next.config.js       # Next.js configuration
├── postcss.config.js    # PostCSS configuration
├── .eslintrc.js         # ESLint configuration
└── README.md           # Project documentation
```

## 🔧 Configuration

### API Keys Setup

1. **Finnhub API** (for market data)
   - Visit: https://finnhub.io/
   - Sign up and get your free API key
   - Add to `.env.local` as `NEXT_PUBLIC_FINNHUB_API_KEY`

2. **News API** (for market news)
   - Visit: https://newsapi.org/
   - Get your free API key
   - Add to `.env.local` as `NEXT_PUBLIC_NEWS_API_KEY`

3. **GNews API** (alternative news source)
   - Visit: https://gnews.io/
   - Get your free API key
   - Add to `.env.local` as `NEXT_PUBLIC_GNEWS_API_KEY`

4. **EmailJS** (for contact form)
   - Visit: https://www.emailjs.com/
   - Create account and service
   - Add credentials to `.env.local`

### Customization

1. **Colors and Branding**
   - Edit `tailwind.config.js` to change color scheme
   - Update logo and branding in components

2. **Content Updates**
   - Modify text content in component files
   - Update contact information in `Contact.jsx` and `Footer.jsx`

3. **API Integration**
   - Replace mock data in `utils/api.js` with real API calls
   - Update endpoints in `utils/constants.js`

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload `out` folder to Netlify
3. Configure environment variables

### Manual Deployment
1. Build: `npm run build`
2. Start: `npm start`
3. Configure reverse proxy (nginx/Apache)

## 📱 Features Implemented

✅ **Core Features**
- Responsive design with Tailwind CSS
- Live market data display (mock data)
- News feed with auto-refresh
- WhatsApp sharing functionality
- Contact form with validation
- SEO optimization
- PWA support

✅ **Components**
- Hero section with live ticker
- About section with stats
- Services section with modals
- Market news with top gainers/losers
- Interactive charts
- Contact form
- Footer with legal information

✅ **Technical Features**
- Next.js 14 with App Router
- Custom React hooks
- API integration setup
- Form validation
- Local storage utilities
- Error handling
- Loading states

## 🔄 Next Steps

1. **API Integration**
   - Replace mock data with real API calls
   - Implement proper error handling
   - Add data caching strategies

2. **Enhanced Features**
   - Add more chart types
   - Implement user authentication
   - Add portfolio tracking
   - Create admin dashboard

3. **Performance**
   - Implement lazy loading
   - Add image optimization
   - Set up CDN
   - Add analytics

4. **Testing**
   - Add unit tests
   - Implement E2E testing
   - Set up CI/CD pipeline

## 🆘 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

2. **API Issues**
   - Verify API keys in `.env.local`
   - Check API rate limits
   - Test API endpoints manually

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Verify responsive breakpoints

### Support
For issues and questions, please check the documentation or create an issue in the repository.

## 📄 License
This project is licensed under the MIT License.
