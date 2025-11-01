# Scheduler Service Documentation

## Overview

The scheduler service (`scheduler.py`) automatically runs data collection scripts during Indian stock market hours:

- **angel_one_api.py**: Runs every 5 minutes from 9:00 AM to 3:30 PM IST, Monday-Friday
- **scape_market_news.py**: Runs every hour from 9:00 AM to 3:30 PM IST, Monday-Friday

## Market Hours

- **Time**: 9:00 AM - 3:30 PM IST
- **Days**: Monday - Friday
- **Timezone**: Asia/Kolkata (IST)

## Running the Scheduler

### Standalone (Development)

```bash
cd backend
python scheduler.py
```

### With Docker Compose

```bash
# Start scheduler service
docker compose up scheduler -d

# View logs
docker compose logs -f scheduler
```

### As a System Service (Production)

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/sharda-scheduler.service
```

```ini
[Unit]
Description=Sharada Financial Services Scheduler
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/sharda-fin/backend
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/python scheduler.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable sharda-scheduler
sudo systemctl start sharda-scheduler
sudo systemctl status sharda-scheduler
```

## Logging

Logs are written to:
- Console (stdout)
- File: `backend/scheduler.log`

Example log entry:
```
2024-01-15 09:00:00 - INFO - Starting angel_one_api.py...
2024-01-15 09:00:05 - INFO - ✅ angel_one_api.py completed successfully
```

## Troubleshooting

### Scheduler Not Running

1. Check if it's market hours:
   ```bash
   python -c "from scheduler import is_market_hours; print(is_market_hours())"
   ```

2. Check timezone:
   ```bash
   timedatectl status
   # Should show Asia/Kolkata or IST
   ```

3. Check logs:
   ```bash
   tail -f backend/scheduler.log
   ```

### Scripts Failing

1. Check environment variables:
   ```bash
   # Verify .env file exists and has required variables
   cat backend/.env | grep -E "API_KEY|USERID|PASSWORD|TOTP"
   ```

2. Test scripts manually:
   ```bash
   cd backend
   python angel_one_api.py --all
   python scape_market_news.py
   ```

3. Check dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Timezone Issues

If scheduler runs at wrong times:

1. Set system timezone:
   ```bash
   sudo timedatectl set-timezone Asia/Kolkata
   ```

2. Verify in Python:
   ```python
   import pytz
   from datetime import datetime
   ist = pytz.timezone('Asia/Kolkata')
   print(datetime.now(ist))
   ```

## Configuration

### Environment Variables

The scheduler uses the same `.env` file as the backend. Required variables:
- `API_KEY` - Angel One API key
- `USERID` - Angel One user ID
- `PASSWORD` - Angel One password
- `TOTP` - TOTP key for 2FA
- `DEEPSEEK_API_KEY` - DeepSeek API key (for news scraper)
- `k2` - K2 API key (for translation)

### Scheduling Behavior

- Scripts only run during market hours (9 AM - 3:30 PM IST, Mon-Fri)
- If a script is triggered outside market hours, it will skip execution
- Logs indicate when scripts are skipped due to market hours

## Manual Execution

To manually trigger scripts:

```bash
# Angel One API (all data)
cd backend
python angel_one_api.py --all

# Market news scraper
python scape_market_news.py
```

## Monitoring

Monitor scheduler health:

```bash
# Docker
docker compose logs -f scheduler

# System service
sudo systemctl status sharda-scheduler
journalctl -u sharda-scheduler -f
```

