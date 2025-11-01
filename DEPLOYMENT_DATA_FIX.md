# Fixing Data Folder Issues in Deployment

## Problem
Data files from `backend/data/` folder are not visible on the deployed website.

## Solution

### 1. Data Files Initialization

I've created `backend/init_data.py` that automatically creates default data files if they don't exist. This ensures:
- API doesn't crash when data files are missing
- Frontend can display empty states instead of errors
- Scheduler will populate real data during market hours

### 2. Deployment Steps

**On your deployment server:**

1. **Ensure data directory exists and has write permissions:**
   ```bash
   cd ~/sharda-fin/backend
   mkdir -p data
   chmod 755 data
   ```

2. **Initialize data files manually (optional, for immediate testing):**
   ```bash
   docker compose exec backend python init_data.py
   ```
   Or run the scheduler once (even outside market hours it will create files):
   ```bash
   docker compose exec scheduler python angel_one_api.py --all
   ```

3. **Verify data files exist:**
   ```bash
   ls -la backend/data/
   # Should show:
   # - top_gainers.json
   # - top_losers.json
   # - put_call_ratio.json
   # - index_quotes.json
   ```

4. **Check if backend can read them:**
   ```bash
   curl http://localhost:8000/top-gainers
   curl http://localhost:8000/index-quotes
   ```

### 3. Volume Mounting (Already Configured)

The `docker-compose.yml` already mounts the data directory:
```yaml
volumes:
  - ./backend/data:/app/data
```

This means:
- Data files on the host (`backend/data/`) are accessible in the container
- Changes made by the scheduler persist on the host
- You can manually add/edit files on the host

### 4. Troubleshooting

**If data files still don't appear:**

1. **Check volume mounting:**
   ```bash
   docker compose exec backend ls -la /app/data
   ```

2. **Check file permissions:**
   ```bash
   docker compose exec backend ls -la /app/data
   # Files should be readable
   ```

3. **Manually create files if needed:**
   ```bash
   docker compose exec backend python init_data.py
   ```

4. **Run scheduler manually (even outside market hours for testing):**
   ```bash
   # This will create/update data files
   docker compose exec scheduler python angel_one_api.py --all
   ```

5. **Check backend logs:**
   ```bash
   docker compose logs backend | grep -i data
   ```

### 5. Copy Existing Data Files (If You Have Them Locally)

If you have data files on your local machine:

```bash
# From your local machine
scp backend/data/*.json username@VM_IP:~/sharda-fin/backend/data/
```

Then restart the backend:
```bash
docker compose restart backend
```

### 6. Verify Everything Works

```bash
# Test API endpoints
curl http://YOUR_VM_IP:8000/top-gainers
curl http://YOUR_VM_IP:8000/top-losers
curl http://YOUR_VM_IP:8000/index-quotes
curl http://YOUR_VM_IP:8000/putcallratio

# Should return JSON data (even if empty initially)
```

## Expected Behavior

1. **On first deployment**: Data files will be empty/default structures
2. **During market hours**: Scheduler will populate real data every 5 minutes
3. **Outside market hours**: Data files remain with last fetched values
4. **After scheduler runs**: Data files contain real market data

The frontend should now be able to access the data even if it's empty initially!

