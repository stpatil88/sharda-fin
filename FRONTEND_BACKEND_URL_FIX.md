# Fix: Frontend Calling localhost:8000 Instead of Actual IP

## Problem
The frontend is calling `localhost:8000` instead of the actual VM IP address when deployed.

## Solution

I've updated the code to automatically detect the backend URL. Here's how to configure it:

### Method 1: Environment Variable (Recommended for Production)

1. **Set environment variable before building:**

   ```bash
   # On your deployment server
   cd ~/sharda-fin
   export NEXT_PUBLIC_BACKEND_URL=http://YOUR_EXTERNAL_IP:8000
   ```

   Replace `YOUR_EXTERNAL_IP` with your actual VM IP (e.g., `34.123.45.67`).

2. **Rebuild frontend with the environment variable:**
   ```bash
   docker compose up -d --build frontend
   ```

### Method 2: Create .env File

1. **Create `.env` file in the root directory:**
   ```bash
   cd ~/sharda-fin
   nano .env
   ```

2. **Add the backend URL:**
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://YOUR_EXTERNAL_IP:8000
   ```

3. **Update docker-compose.yml** to read from .env, or export it:
   ```bash
   export $(cat .env | xargs)
   docker compose up -d --build frontend
   ```

### Method 3: Automatic Detection (Already Implemented)

The code now automatically detects the backend URL:
- If accessing frontend from `http://localhost:3000` → uses `http://localhost:8000`
- If accessing frontend from `http://34.123.45.67:3000` → uses `http://34.123.45.67:8000`

This works automatically, but **Method 1 is recommended** for production.

### Method 4: Update docker-compose.yml Directly

Edit `docker-compose.yml` and set the environment variable:

```yaml
frontend:
  environment:
    - NEXT_PUBLIC_BACKEND_URL=http://YOUR_EXTERNAL_IP:8000
```

Then rebuild:
```bash
docker compose up -d --build frontend
```

## Verify It's Working

1. **Check browser console:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Look for API calls
   - They should show requests to `http://YOUR_EXTERNAL_IP:8000` instead of `localhost:8000`

2. **Check the BACKEND_URL in logs:**
   The frontend logs should show:
   ```
   [API] Fetching index quote from http://YOUR_EXTERNAL_IP:8000/index-quote/NIFTY
   ```

3. **Test an API endpoint:**
   ```bash
   curl http://YOUR_EXTERNAL_IP:3000
   # Then check browser console - API calls should go to YOUR_EXTERNAL_IP:8000
   ```

## Code Changes Made

**File: `src/utils/api.js`**
- Added `getBackendURL()` function that:
  - First checks `NEXT_PUBLIC_BACKEND_URL` environment variable
  - Then automatically detects from `window.location.hostname`
  - Falls back to `localhost:8000` for server-side rendering

**File: `docker-compose.yml`**
- Added `NEXT_PUBLIC_BACKEND_URL` environment variable support

## Quick Fix Command

```bash
# Replace YOUR_EXTERNAL_IP with your actual IP
export NEXT_PUBLIC_BACKEND_URL=http://YOUR_EXTERNAL_IP:8000
docker compose up -d --build frontend
```

## Troubleshooting

**If still calling localhost:**

1. **Check environment variable is set:**
   ```bash
   echo $NEXT_PUBLIC_BACKEND_URL
   ```

2. **Verify it's in docker-compose:**
   ```bash
   docker compose exec frontend printenv | grep NEXT_PUBLIC_BACKEND_URL
   ```

3. **Check browser console for actual URL being used:**
   - Open DevTools → Console
   - Look for `[API]` log messages
   - They show the actual BACKEND_URL being used

4. **Hard refresh browser:**
   - Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   - This clears browser cache

5. **Check Next.js build:**
   - Environment variables starting with `NEXT_PUBLIC_` are baked into the build
   - You may need to rebuild if you change them:
   ```bash
   docker compose build --no-cache frontend
   docker compose up -d frontend
   ```

