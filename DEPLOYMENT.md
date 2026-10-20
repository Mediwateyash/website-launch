# Production Deployment Guide: Interskill Staffing Solutions

This document outlines the architecture, automated CI/CD pipeline, and manual server setup steps for deploying **Interskill Staffing Solutions** on **AlmaLinux 9 with cPanel/WHM**.

---

## 1. System Architecture & Environment

| Component | Specification |
| :--- | :--- |
| **Repository** | `https://github.com/Interskillsolutions/interskillstaffingsolutions` (Branch: `main`) |
| **Server OS** | AlmaLinux 9 with cPanel / WHM |
| **User Account** | `interski` |
| **Project Directory** | `/home/interski/interskillstaffingsolutions` |
| **cPanel Node.js 22** | `/opt/cpanel/ea-nodejs22/bin/node` |
| **cPanel npm 22** | `/opt/cpanel/ea-nodejs22/bin/npm` |
| **Backend PM2 Process**| `interskill-staffing-api` (Port: `5001`) |
| **Frontend Output** | `/home/interski/interskillstaffingsolutions/dist/` |
| **Temporary Preview** | `http://127.0.0.1:8088` (Apache reverse proxy) |
| **Target Domain** | `interskillstaffingsolutions.in` (Future / Pending purchase) |
| **Existing Website** | `interskillsolutions.com` (**Strictly Isolated — Never modified**) |

> [!IMPORTANT]
> **Zero Disruption Guarantee**: The existing company website (`interskillsolutions.com`), its database, PM2 process, and live Apache VirtualHost configuration are completely untouched by this deployment. Only the dedicated `interskill-staffing-api` process on port `5001` is reloaded.

---

## 2. GitHub Actions Deployment Workflow (`.github/workflows/deploy.yml`)

The repository includes a GitHub Actions workflow that automatically deploys on every push to `main` and supports manual triggering via `workflow_dispatch`.

### Required GitHub Repository Secrets

Configure these under **GitHub Repository** &rarr; **Settings** &rarr; **Secrets and variables** &rarr; **Actions**:

| Secret Name | Description | Example / Format |
| :--- | :--- | :--- |
| `SSH_HOST` | VPS IP address or hostname | `194.xxx.xxx.xxx` or `vps.interskillsolutions.com` |
| `SSH_USER` | cPanel / VPS SSH username | `interski` |
| `SSH_PORT` | SSH port configured on VPS | `22` (or your custom port) |
| `SSH_PRIVATE_KEY` | Dedicated OpenSSH private key | `-----BEGIN OPENSSH PRIVATE KEY----- ... -----END OPENSSH PRIVATE KEY-----` |

---

## 3. VPS Administrator Setup (One-Time Execution)

Run these steps logged in as user `interski` on the AlmaLinux server:

### Step 3.1: Create Dedicated Deployment SSH Key

To follow least-privilege security practices, create a dedicated SSH key pair on the VPS specifically for GitHub Actions:

```bash
# Generate dedicated Ed25519 key pair
ssh-keygen -t ed25519 -f ~/.ssh/github_actions_staffing -C "github-actions-staffing-deploy" -N ""

# Authorize the public key with restricted execution flags
cat <<EOF >> ~/.ssh/authorized_keys
no-port-forwarding,no-X11-forwarding,no-agent-forwarding $(cat ~/.ssh/github_actions_staffing.pub)
EOF

# Ensure proper permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Display the private key to copy into GitHub Secret `SSH_PRIVATE_KEY`:

```bash
cat ~/.ssh/github_actions_staffing
```

*(Do not commit or expose this key anywhere else).*

---

### Step 3.2: Create the Production Environment File (`.env`)

Create the `.env` file inside `/home/interski/interskillstaffingsolutions` with strict `600` permissions:

```bash
cd /home/interski/interskillstaffingsolutions
install -o interski -g interski -m 600 /dev/null .env
nano .env
```

Paste your actual credentials:

```env
NODE_ENV=production
PORT=5001
MONGO_URI="YOUR_STAFFING_MONGODB_ATLAS_CONNECTION_STRING"
JWT_SECRET="YOUR_STRONG_RANDOM_SECRET"
CLOUDINARY_CLOUD_NAME="YOUR_CLOUDINARY_CLOUD_NAME"
CLOUDINARY_API_KEY="YOUR_CLOUDINARY_API_KEY"
CLOUDINARY_API_SECRET="YOUR_CLOUDINARY_API_SECRET"
```

Save and exit (`Ctrl + O`, `Enter`, `Ctrl + X`).

---

### Step 3.3: Install the Server Deployment Script

The repository includes `scripts/deploy-staffing.sh`. Install it to `/home/interski/bin/deploy-staffing.sh` so both manual runs and GitHub Actions can call it:

```bash
mkdir -p /home/interski/bin
cp /home/interski/interskillstaffingsolutions/scripts/deploy-staffing.sh /home/interski/bin/deploy-staffing.sh
chmod +x /home/interski/bin/deploy-staffing.sh
```

---

### Step 3.4: Initial PM2 Process Registration

Register `interskill-staffing-api` with PM2 using the cPanel Node 22 binary:

```bash
cd /home/interski/interskillstaffingsolutions
pm2 start server/server.js \
  --name "interskill-staffing-api" \
  --interpreter "/opt/cpanel/ea-nodejs22/bin/node" \
  --update-env

pm2 save
```

Verify PM2 status:
```bash
pm2 status
```
*(You will see both the existing company website process and `interskill-staffing-api` running independently).*

---

## 4. Apache Configuration for Temporary Preview & Final Domain

### Temporary Preview (127.0.0.1:8088)
To view the staffing application while the final domain is pending purchase, Apache can route port `8088` (or a dedicated staging subdomain) to serve static files from `dist/` and proxy `/api` calls to `http://127.0.0.1:5001`.

Example Apache VirtualHost snippet (for WHM/cPanel Apache Include):
```apache
<VirtualHost *:8088>
    DocumentRoot "/home/interski/interskillstaffingsolutions/dist"
    
    <Directory "/home/interski/interskillstaffingsolutions/dist">
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Single Page Application (SPA) routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Proxy API requests to backend port 5001
    ProxyPreserveHost On
    ProxyPass /api http://127.0.0.1:5001/api
    ProxyPassReverse /api http://127.0.0.1:5001/api
</VirtualHost>
```

### Final Domain (`interskillstaffingsolutions.in`)
Once the domain is registered and pointed to the VPS IP via DNS:
1. In cPanel, create a new Addon Domain / VirtualHost for `interskillstaffingsolutions.in`.
2. Set DocumentRoot to `/home/interski/interskillstaffingsolutions/dist`.
3. Configure reverse proxy for `/api` &rarr; `http://127.0.0.1:5001/api`.
4. Issue Let's Encrypt / AutoSSL certificate in cPanel.

---

## 5. Rollback Procedure

If a deployed commit causes an issue, perform a fast rollback without downtime:

```bash
cd /home/interski/interskillstaffingsolutions

# 1. Rollback code to last known stable commit
git checkout <STABLE_COMMIT_HASH>

# 2. Re-install exact lockfile dependencies & rebuild
/opt/cpanel/ea-nodejs22/bin/npm ci
/opt/cpanel/ea-nodejs22/bin/npm run build

# 3. Reload only the staffing backend
pm2 reload interskill-staffing-api --update-env

# 4. Verify health check
curl -I http://127.0.0.1:5001/api/health
```

---

## 6. Health & Diagnostic Commands

```bash
# Check backend health response
curl -s http://127.0.0.1:5001/api/health | jq

# View real-time logs of the staffing backend
pm2 logs interskill-staffing-api --lines 50

# Check listening ports
ss -tulpn | grep 5001

# Test manual deployment script execution
/home/interski/bin/deploy-staffing.sh
```
