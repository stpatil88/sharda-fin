# Sharada Financial Services - Backend API

This is the backend API for Sharada Financial Services, providing market data, news, and AI-powered summarization services.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Git

### Setup (Windows)
1. Open Command Prompt or PowerShell
2. Navigate to the backend directory:
   ```cmd
   cd backend
   ```
3. Run the setup script:
   ```cmd
   setup_backend.bat
   ```
4. Update the `.env` file with your API keys
5. Start the server:
   ```cmd
   start_backend.bat
   ```

### Setup (Linux/Mac)
1. Open Terminal
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Make scripts executable:
   ```bash
   chmod +x setup_backend.sh start_backend.sh
   ```
4. Run the setup script:
   ```bash
   ./setup_backend.sh
   ```
5. Update the `.env` file with your API keys
6. Start the server:
   ```bash
   ./start_backend.sh
   ```

### Manual Setup
1. Create virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file:
   ```bash
   cp env.example .env
   ```

5. Update `.env` with your API keys

6. Start the server:
   ```bash
   python app.py
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file with the following variables:

```env
# Angel One API Credentials
API_KEY=your_angel_one_api_key
SECRET_KEY=your_angel_one_secret_key
TOTP=your_angel_one_totp_key

# Finnhub API Key for Market Data
FINNHUB_API_KEY=your_finnhub_api_key
FINNHUB_WEBHOOK=your_finnhub_webhook_key

# Hugging Face Token for AI Summarization
HF_TOKEN=your_hugging_face_token

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS Settings
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 📚 API Endpoints

### Base URL
- Development: `http://localhost:8000`
- Production: `https://your-domain.com`

### Available Endpoints

#### Health Check
- **GET** `/health`
- Returns server health status

#### Root
- **GET** `/`
- Returns API information

#### Market News
- **GET** `/market-news?limit=20`
- Fetch latest market news
- Parameters:
  - `limit` (optional): Number of articles to fetch (default: 20)

#### Summarized News
- **GET** `/latest-summaries?limit=10`
- Fetch news with AI-generated summaries
- Parameters:
  - `limit` (optional): Number of articles to fetch (default: 10)

### API Documentation
Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🛠️ Development

### Project Structure
```
backend/
├── app.py                 # Main FastAPI application
├── fetch_news.py          # News fetching utilities
├── hf_summarise.py        # AI summarization utilities
├── requirements.txt       # Python dependencies
├── env.example           # Environment variables template
├── setup_backend.sh      # Linux/Mac setup script
├── setup_backend.bat     # Windows setup script
├── start_backend.sh      # Linux/Mac start script
├── start_backend.bat     # Windows start script
└── README.md             # This file
```

### Testing
Test individual modules:
```bash
# Test news fetching
python fetch_news.py

# Test summarization
python hf_summarise.py
```

### Adding New Endpoints
1. Add new functions to appropriate modules
2. Import and register endpoints in `app.py`
3. Update this README with endpoint documentation

## 🔑 API Keys Setup

### Finnhub API
1. Visit [Finnhub.io](https://finnhub.io)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to `.env` file as `FINNHUB_API_KEY`

### Hugging Face API
1. Visit [Hugging Face](https://huggingface.co)
2. Create an account
3. Go to Settings > Access Tokens
4. Create a new token
5. Add to `.env` file as `HF_TOKEN`

### Angel One API
1. Visit [Angel One](https://www.angelone.in)
2. Sign up for API access
3. Get your API credentials
4. Add to `.env` file as `API_KEY`, `SECRET_KEY`, and `TOTP`

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production with Uvicorn
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker (Optional)
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🐛 Troubleshooting

### Common Issues

1. **ModuleNotFoundError**: Make sure virtual environment is activated
2. **API Key Errors**: Check that all API keys are correctly set in `.env`
3. **Port Already in Use**: Change the port in `.env` or kill the process using port 8000
4. **CORS Errors**: Update `CORS_ORIGINS` in `.env` to include your frontend URL

### Logs
Check the console output for error messages. The API includes detailed error handling and logging.

## 📞 Support

For issues and questions:
- Email: stpatill@gmail.com
- Phone: +91 70201 30986

## 📄 License

This project is licensed under the MIT License.
