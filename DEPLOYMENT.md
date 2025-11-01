# Deployment Guide for Google Cloud VM (Ubuntu)

This guide covers deploying Sharada Financial Services backend and frontend on a Google Cloud VM instance running Ubuntu with 4GB RAM.

## Prerequisites

1. Google Cloud Platform account
2. A VM instance with Ubuntu 20.04 or later
3. At least 4GB RAM (minimum recommended)
4. Domain name (optional, for production - you can use the VM's external IP instead)

## Step 1: Create Google Cloud VM Instance

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Compute Engine** > **VM instances**
3. Click **Create Instance**
4. Configure:
   - **Name**: `sharda-fin-services`
   - **Machine type**: `e2-standard-2` (2 vCPU, 8GB RAM) or `e2-small` (2 vCPU, 2GB RAM) for budget
   - **Boot disk**: Ubuntu 20.04 LTS or later, 20GB minimum
   - **Firewall**: Allow HTTP and HTTPS traffic
5. Click **Create**

## Step 2: SSH into VM

```bash
gcloud compute ssh sharda-fin-services
# Or use regular SSH with your key
ssh username@VM_EXTERNAL_IP
```

## Step 3: Install Docker and Docker Compose

```bash
# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
newgrp docker
```

## Step 4: Install Git and Clone Repository

```bash
# Install Git
sudo apt-get install -y git

# Clone your repository (replace with your repo URL)
cd ~
git clone <YOUR_REPOSITORY_URL> sharda-fin
cd sharda-fin
```

Or upload files manually using `scp`:
```bash
# From your local machine
scp -r ./sharda-fin username@VM_EXTERNAL_IP:~/
```

## Step 5: Configure Environment Variables

### Backend Environment

```bash
# Copy example env file
cd backend
cp env.example .env

# Edit .env file with your actual values
nano .env
```

Update the following in `backend/.env`:
```env
API_KEY=your_angel_one_api_key
USERID=your_angel_one_userid
PASSWORD=your_angel_one_password
TOTP=your_totp_key
FINNHUB_API_KEY=your_finnhub_key
HF_TOKEN=your_huggingface_token
DEEPSEEK_API_KEY=your_deepseek_key
k2=your_k2_api_key
HOST=0.0.0.0
PORT=8000
DEBUG=False
CORS_ORIGINS=http://YOUR_EXTERNAL_IP:3000,http://localhost:3000
# Replace YOUR_EXTERNAL_IP with your VM's external IP address (e.g., http://34.123.45.67:3000)
```

### Frontend Environment (Optional)

Create `.env.local` in the root directory:
```bash
cd ~/sharda-fin
nano .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Step 6: Set Timezone (Important for Scheduler)

The scheduler runs on IST (Indian Standard Time). Ensure the VM is set to IST:

```bash
sudo timedatectl set-timezone Asia/Kolkata
timedatectl status
```

## Step 7: Build and Run Docker Containers

```bash
cd ~/sharda-fin

# Build and start all services
docker compose up -d --build

# Check running containers
docker compose ps

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f scheduler
```

## Step 8: Verify Deployment

### Check Services

```bash
# Backend health check
curl http://localhost:8000/health

# Frontend check
curl http://localhost:3000
```

### Check Scheduler

```bash
# View scheduler logs
docker compose logs scheduler

# The scheduler should show:
# - angel_one_api.py running every 5 minutes (9 AM - 3:30 PM IST, Mon-Fri)
# - scape_market_news.py running every hour (9 AM - 3:30 PM IST, Mon-Fri)
```

## Step 8.5: Access Your Web App (Without Domain)

### Find Your VM's External IP Address

**Option 1: From Google Cloud Console**
1. Go to **Compute Engine** > **VM instances**
2. Find your VM instance
3. Copy the **External IP** address (e.g., `34.123.45.67`)

**Option 2: From SSH Terminal**
```bash
# Get external IP
curl -H "Metadata-Flavor: Google" http://169.254.169.254/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip

# Or check from VM
hostname -I
```

### Access Your Application

After configuring firewall rules (Step 9), you can access:

- **Frontend**: `http://YOUR_EXTERNAL_IP:3000`
- **Backend API**: `http://YOUR_EXTERNAL_IP:8000`
- **Backend Health**: `http://YOUR_EXTERNAL_IP:8000/health`

**Example:**
- If your external IP is `34.123.45.67`:
  - Frontend: `http://34.123.45.67:3000`
  - Backend: `http://34.123.45.67:8000`

### Update CORS Settings (Important)

Update `backend/.env` to allow requests from your IP:

```bash
cd ~/sharda-fin/backend
nano .env
```

Update the CORS_ORIGINS line:
```env
CORS_ORIGINS=http://YOUR_EXTERNAL_IP:3000,http://localhost:3000,http://127.0.0.1:3000
```

Replace `YOUR_EXTERNAL_IP` with your actual IP (e.g., `http://34.123.45.67:3000`).

Then restart the backend:
```bash
docker compose restart backend
```

### Update Frontend Backend URL

The frontend needs to know where the backend is. You have two options:

**Option 1: Set Environment Variable (Recommended)**

Create or update `.env` file in the root directory:

```bash
cd ~/sharda-fin
nano .env
```

Add:
```env
NEXT_PUBLIC_BACKEND_URL=http://YOUR_EXTERNAL_IP:8000
```

Replace `YOUR_EXTERNAL_IP` with your actual VM IP (e.g., `http://34.123.45.67:8000`).

Then update docker-compose.yml to use it, or export before running docker compose:

```bash
export NEXT_PUBLIC_BACKEND_URL=http://YOUR_EXTERNAL_IP:8000
docker compose up -d --build frontend
```

**Option 2: Automatic Detection (Works but less reliable)**

The frontend code now automatically detects the backend URL based on the current hostname. If you access the frontend at `http://34.123.45.67:3000`, it will automatically use `http://34.123.45.67:8000` for the backend.

However, **Option 1 is recommended** for production as it's more explicit and reliable.

**After updating, rebuild frontend:**
```bash
docker compose up -d --build frontend
```

## Step 9: Configure Firewall Rules

### Recommended: Google Cloud Firewall (For Google Cloud VM)

For Google Cloud VMs, firewall rules are managed through Google Cloud Console. This is the recommended approach:

1. Go to **VPC Network** > **Firewall Rules**
2. Create rules:
   - **Name**: `allow-http-frontend`
     - **Direction**: Ingress
     - **Targets**: All instances
     - **Source IP ranges**: 0.0.0.0/0
     - **Protocols and ports**: TCP 3000
   
   - **Name**: `allow-http-backend`
     - **Direction**: Ingress
     - **Targets**: All instances
     - **Source IP ranges**: 0.0.0.0/0
     - **Protocols and ports**: TCP 8000

**Note**: After creating these rules, they apply immediately. You don't need to configure anything on the VM itself.

### Alternative: UFW (If needed for non-Google Cloud or additional security)

If you want to use UFW on the VM itself (optional), first install it:

```bash
# Install UFW
sudo apt-get update
sudo apt-get install -y ufw

# Allow traffic on ports 3000 and 8000
sudo ufw allow 3000/tcp
sudo ufw allow 8000/tcp
sudo ufw enable
sudo ufw status
```

### Alternative: Using iptables (If UFW is not available)

If you prefer iptables or UFW is not available:

```bash
# Allow traffic on ports 3000 and 8000
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 8000 -j ACCEPT

# Save iptables rules (Ubuntu/Debian)
sudo apt-get install -y iptables-persistent
sudo netfilter-persistent save
```

**Note**: For Google Cloud VMs, the Google Cloud Firewall Rules (above) are sufficient and recommended.

## Step 10: Set Up Nginx Reverse Proxy (Optional but Recommended)

Install Nginx:

```bash
sudo apt-get install -y nginx
```

Create configuration file:

```bash
sudo nano /etc/nginx/sites-available/sharda-fin
```

Add:

```nginx
server {
    listen 80;
    server_name YOUR_EXTERNAL_IP;  # Use your VM's external IP (e.g., 34.123.45.67)
    # Or use _ (underscore) to accept any domain/IP

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        rewrite ^/api(.*)$ $1 break;
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/sharda-fin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 11: Set Up SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

## Step 12: Monitoring and Maintenance

### View Container Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f scheduler

# Last 100 lines
docker compose logs --tail=100 scheduler
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart backend
docker compose restart scheduler
```

### Update Deployment

```bash
cd ~/sharda-fin
git pull  # Or upload new files
docker compose up -d --build
```

### Check Resource Usage

```bash
# Docker stats
docker stats

# System resources
htop  # Install with: sudo apt-get install htop
```

## Step 13: Schedule Backups (Optional)

Create backup script:

```bash
nano ~/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/USERNAME/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup data directory
tar -czf $BACKUP_DIR/data_$DATE.tar.gz ~/sharda-fin/backend/data

# Backup CSV files
tar -czf $BACKUP_DIR/csv_$DATE.tar.gz ~/sharda-fin/backend/*.csv

# Keep only last 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Make executable and add to crontab:

```bash
chmod +x ~/backup.sh
crontab -e
# Add: 0 2 * * * /home/USERNAME/backup.sh
```

## Troubleshooting

### Check Container Status

```bash
docker compose ps
docker ps -a
```

### View Detailed Logs

```bash
docker compose logs --tail=200 backend
docker compose logs --tail=200 scheduler
```

### Restart Failed Container

```bash
docker compose restart scheduler
```

### Check Disk Space

```bash
df -h
docker system df
```

### Clear Docker Cache (if low on space)

```bash
docker system prune -a
```

### Scheduler Not Running

1. Check timezone: `timedatectl status`
2. Check logs: `docker compose logs scheduler`
3. Verify market hours (9 AM - 3:30 PM IST, Mon-Fri)
4. Manually test: `docker compose exec scheduler python scheduler.py`

### Memory Issues (4GB RAM)

If you encounter OOM (Out of Memory) errors:

1. Reduce container limits in `docker-compose.yml`
2. Add swap space:
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

## Resource Allocation (4GB RAM VM)

Based on `docker-compose.yml`, memory allocation:
- **Backend**: 512MB-1.5GB
- **Frontend**: 512MB-1.5GB
- **Scheduler**: 256MB-512MB
- **System**: ~500MB
- **Total**: ~2.5-4GB (within limits)

## Production Checklist

- [ ] Environment variables configured
- [ ] Timezone set to Asia/Kolkata
- [ ] Firewall rules configured
- [ ] SSL certificate installed (if using domain)
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Scheduler logs verified
- [ ] Health checks passing
- [ ] Resource usage within limits

## Support

For issues or questions:
1. Check container logs: `docker compose logs`
2. Verify environment variables
3. Check system resources: `htop`
4. Review scheduler logs for market hours execution

