# Portfolio Deployment Guide

## Server Details

- **VPS IP**: 159.198.32.51
- **Domain**: portfolio.blackshadow.software
- **Port**: 80
- **Project Location**: /var/www/portfolio
- **Source Repository**: /root/projects/portfolio_js

## Initial Setup

### 1. DNS Configuration

Set up an A record in your domain registrar:

### 2. Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again to apply docker group
```

### 3. Prepare Project Directory

```bash
# Create web directory
sudo mkdir -p /var/www/portfolio

# Copy project files from source
sudo cp -r /root/projects/portfolio_js/* /var/www/portfolio/

# Set proper ownership
sudo chown -R $USER:$USER /var/www/portfolio
```

## Docker Configuration Files

### 4. Create Dockerfile

```bash
cd /var/www/portfolio
nano Dockerfile
```

**Content:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["npm", "run", "dev"]
```

### 5. Create next.config.js

```bash
nano next.config.js
```

**Content:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
```

### 6. Create docker-compose.yml

```bash
nano docker-compose.yml
```

**Content:**

```yaml
version: '3.8'

services:
  portfolio:
    build: .
    container_name: portfolio-app
    restart: unless-stopped
    networks:
      - portfolio-network

  nginx:
    image: nginx:alpine
    container_name: portfolio-nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - portfolio
    networks:
      - portfolio-network

networks:
  portfolio-network:
    driver: bridge
```

### 7. Create nginx.conf

```bash
nano nginx.conf
```

**Content:**

```nginx
server {
    listen 80;
    server_name portfolio.blackshadow.software;

    location / {
        proxy_pass http://portfolio:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Initial Deployment

### 8. Stop Conflicting Services

```bash
# Stop nginx if running
sudo systemctl stop nginx

# Stop PM2 processes
pm2 delete all

# Kill any process using port 80
sudo fuser -k 80/tcp
```

### 9. Deploy with Docker

```bash
cd /var/www/portfolio

# Build and start containers
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs -f
```

### 10. Verify Deployment

- Visit: `http://portfolio.blackshadow.software`
- Check logs: `docker-compose logs portfolio`

## Redeployment Process (For Code Updates)

### When you pull new code to /root/projects/portfolio_js

```bash
#!/bin/bash
# You can save this as redeploy.sh and make it executable

# 1. Navigate to source directory
cd /root/projects/portfolio_js

# 2. Pull latest code
git pull origin main

# 3. Stop current containers
cd /var/www/portfolio
docker-compose down

# 4. Sync new code (excluding node_modules and .git)
rsync -av --exclude 'node_modules' --exclude '.git' --exclude '.next' --delete /root/projects/portfolio_js/ /var/www/portfolio/

# 5. Rebuild and restart containers
docker-compose up -d --build

# 6. Check status
docker-compose ps
echo "Deployment complete! Check: http://portfolio.blackshadow.software"
```

### Quick Redeploy Commands

```bash
# 1. Pull new code
cd /root/projects/portfolio_js && git pull

# 2. Stop containers
cd /var/www/portfolio && docker-compose down

# 3. Sync code
rsync -av --exclude 'node_modules' --exclude '.git' --exclude '.next' --delete /root/projects/portfolio_js/ /var/www/portfolio/

# 4. Rebuild and start
docker-compose up -d --build
```

### Make redeploy script executable

```bash
# Create redeploy script
nano /var/www/portfolio/redeploy.sh

# Copy the script content above, then:
chmod +x /var/www/portfolio/redeploy.sh

# Run anytime you need to redeploy:
./redeploy.sh
```

## Troubleshooting

### Check Container Status

```bash
docker-compose ps
docker-compose logs portfolio
docker-compose logs nginx
```

### Port Issues

```bash
# Check what's using port 80
sudo netstat -tulpn | grep :80

# Kill process using port
sudo fuser -k 80/tcp
```

### Container Issues

```bash
# Restart containers
docker-compose restart

# Rebuild from scratch
docker-compose down
docker system prune -f
docker-compose up -d --build
```

### Access Container Shell

```bash
# Access portfolio container
docker exec -it portfolio-app sh

# Access nginx container
docker exec -it portfolio-nginx sh
```

## Useful Commands

```bash
# View logs in real-time
docker-compose logs -f

# Stop all containers
docker-compose down

# Start containers
docker-compose up -d

# Rebuild specific service
docker-compose up -d --build portfolio

# Remove all containers and volumes
docker-compose down -v
docker system prune -af
```

## File Structure

```shell
/var/www/portfolio/
   Dockerfile
   docker-compose.yml
   nginx.conf
   next.config.js
   package.json
   redeploy.sh
   deploy.md
   [all project files]
```

## Access URLs

```url
- **Production**: http://portfolio.blackshadow.software
- **Server IP**: http://159.198.32.51
```
