# Scheduling and Deployment Summary

## Overview

This document summarizes the scheduling system and Docker deployment setup for Sharada Financial Services.

## ✅ Completed Tasks

### 1. Scheduler Service

**File**: `backend/scheduler.py`

- Runs `angel_one_api.py` every 5 minutes during market hours (9 AM - 3:30 PM IST, Mon-Fri)
- Runs `scape_market_news.py` every hour during market hours (9 AM - 3:30 PM IST, Mon-Fri)
- Includes timezone handling with IST (Asia/Kolkata)
- Comprehensive logging to file and console
- Automatic market hours detection (skips on weekends and outside trading hours)

**Dependencies Added**:
- `schedule` - For job scheduling
- `pytz` - For timezone handling

### 2. Docker Configuration

#### Backend Dockerfile
**File**: `backend/Dockerfile`
- Python 3.11 slim base image
- Optimized for production
- Health checks included
- Exposes port 8000

#### Frontend Dockerfile
**File**: `Dockerfile` (root)
- Next.js standalone build
- Multi-stage build for optimization
- Production-ready configuration
- Exposes port 3000

#### Docker Compose
**File**: `docker-compose.yml`
- Three services: backend, frontend, scheduler
- Resource limits configured for 4GB RAM VM
- Volume mounts for data persistence
- Network isolation
- Health checks for all services

### 3. Documentation

- **DEPLOYMENT.md**: Complete deployment guide for Google Cloud VM Ubuntu
- **backend/SCHEDULER.md**: Scheduler service documentation
- **backend/.dockerignore**: Optimized Docker build for backend
- **.dockerignore**: Optimized Docker build for frontend

### 4. Configuration Updates

- Updated `backend/requirements.txt` with scheduler dependencies
- Updated `backend/env.example` with all required environment variables
- Updated `next.config.js` for standalone Docker output

## 📋 Usage

### Running Locally (Development)

```bash
# Backend scheduler
cd backend
python scheduler.py

# Or with Docker Compose
docker compose up scheduler
```

### Deploying to Production

```bash
# 1. Set up VM (see DEPLOYMENT.md)
# 2. Clone repository
# 3. Configure .env files
# 4. Build and run
docker compose up -d --build
```

## 🕐 Schedule Details

### angel_one_api.py
- **Frequency**: Every 5 minutes
- **Market Hours**: 9:00 AM - 3:30 PM IST
- **Days**: Monday - Friday
- **What it does**: Fetches market data (gainers, losers, PCR, index quotes)

### scape_market_news.py
- **Frequency**: Every hour (at :00 minutes)
- **Market Hours**: 9:00 AM - 3:30 PM IST
- **Days**: Monday - Friday
- **What it does**: Scrapes market news and translates to Marathi

## 🐳 Docker Services

### Backend Service
- **Port**: 8000
- **Memory**: 512MB - 1.5GB
- **CPU**: 0.5 - 1.0 cores
- **Health Check**: `/health` endpoint

### Frontend Service
- **Port**: 3000
- **Memory**: 512MB - 1.5GB
- **CPU**: 0.5 - 1.0 cores
- **Health Check**: Root endpoint

### Scheduler Service
- **No exposed ports**
- **Memory**: 256MB - 512MB
- **CPU**: 0.25 - 0.5 cores
- **Timezone**: Asia/Kolkata

## 📁 File Structure

```
sharda-fin/
├── backend/
│   ├── Dockerfile
│   ├── scheduler.py          # ⭐ NEW: Scheduler service
│   ├── SCHEDULER.md          # ⭐ NEW: Scheduler docs
│   ├── .dockerignore         # ⭐ NEW
│   ├── requirements.txt      # ⭐ UPDATED: Added schedule, pytz
│   └── env.example           # ⭐ UPDATED: Added USERID, PASSWORD, etc.
├── Dockerfile                 # ⭐ NEW: Frontend Dockerfile
├── docker-compose.yml        # ⭐ NEW: Orchestration
├── .dockerignore             # ⭐ NEW
├── DEPLOYMENT.md             # ⭐ NEW: Deployment guide
├── SCHEDULING_AND_DEPLOYMENT_SUMMARY.md  # ⭐ This file
└── next.config.js            # ⭐ UPDATED: Added standalone output
```

## 🔧 Environment Variables

### Backend (.env)
```env
API_KEY=your_angel_one_api_key
USERID=your_angel_one_userid
PASSWORD=your_angel_one_password
TOTP=your_totp_key
FINNHUB_API_KEY=your_finnhub_key
HF_TOKEN=your_huggingface_token
DEEPSEEK_API_KEY=your_deepseek_key
k2=your_k2_api_key
```

## 🚀 Quick Start Commands

```bash
# Build all services
docker compose build

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Restart scheduler
docker compose restart scheduler

# Check status
docker compose ps
```

## 📊 Resource Allocation (4GB RAM VM)

- Backend: ~1GB
- Frontend: ~1GB
- Scheduler: ~512MB
- System: ~500MB
- **Total**: ~3GB (within 4GB limit)

## ⚠️ Important Notes

1. **Timezone**: Ensure VM timezone is set to `Asia/Kolkata` for accurate scheduling
2. **Market Hours**: Scheduler only runs during trading hours (9 AM - 3:30 PM IST, Mon-Fri)
3. **Environment**: All services share the same backend `.env` file
4. **Data Persistence**: Data directory is mounted as volume to persist JSON files
5. **Logs**: Check scheduler logs regularly: `docker compose logs scheduler`

## 🔍 Monitoring

```bash
# Check scheduler logs
docker compose logs -f scheduler

# Check if scheduler is running
docker compose ps scheduler

# Check resource usage
docker stats

# Manual test (should skip outside market hours)
docker compose exec scheduler python scheduler.py
```

## 📝 Next Steps

1. Deploy to Google Cloud VM following DEPLOYMENT.md
2. Configure environment variables
3. Set timezone to Asia/Kolkata
4. Verify scheduler logs during market hours
5. Set up monitoring and alerts
6. Configure backups for data directory

## 📚 Additional Documentation

- See `DEPLOYMENT.md` for detailed deployment steps
- See `backend/SCHEDULER.md` for scheduler documentation
- See `backend/README.md` for backend API documentation

