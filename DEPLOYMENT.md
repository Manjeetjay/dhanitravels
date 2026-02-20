# Deploying Dhani Travels on Render + Hostinger Custom Domain

Complete guide to deploy your full-stack app (React + Node.js + Supabase) on **Render** and connect your **Hostinger** custom domain.

---

## Architecture Overview

```
Browser → dhanitravels.com (Hostinger domain)
           ↓ (DNS points to Render)
        Render
         ├── Static Site  → client/dist (React SPA)
         └── Web Service  → server/src/index.js (Express API)
                              ↓
                          Supabase (cloud database)
```

You will create **two services on Render**:

| Service        | Type         | What it does                |
| -------------- | ------------ | --------------------------- |
| `dhani-client` | Static Site  | Serves the React frontend   |
| `dhani-api`    | Web Service  | Runs the Express backend    |

---

## Prerequisites

- A [Render](https://render.com) account (free tier works)
- Your code pushed to **GitHub** (Render deploys from a Git repo)
- A domain purchased on **Hostinger** (e.g., `dhanitravels.com`)
- Your Supabase credentials ready

---

## Step 1 — Push Code to GitHub

If your code isn't on GitHub yet:

```bash
cd "m:\projects\New folder"
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/dhani-travels.git
git branch -M main
git push -u origin main
```

> [!TIP]
> Make sure your `.env` files are in `.gitignore` so secrets don't get pushed.

---

## Step 2 — Deploy the Backend (Web Service)

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:

| Setting           | Value                          |
| ----------------- | ------------------------------ |
| **Name**          | `dhani-api`                    |
| **Region**        | Choose nearest (e.g., Singapore) |
| **Root Directory**| `server`                       |
| **Runtime**       | Node                           |
| **Build Command** | `npm install`                  |
| **Start Command** | `node src/index.js`            |
| **Instance Type** | Free                           |

4. Under **Environment Variables**, add:

| Key                        | Value                                       |
| -------------------------- | ------------------------------------------- |
| `PORT`                     | `10000` (Render's default)                  |
| `FRONTEND_ORIGIN`         | `https://dhanitravels.com` *(your domain)*  |
| `SUPABASE_URL`            | `https://your-project.supabase.co`          |
| `SUPABASE_SERVICE_ROLE_KEY`| *your service role key*                    |
| `WHATSAPP_NUMBER`         | `919876543210`                              |
| `ADMIN_PANEL_KEY`         | *your secret admin key*                     |
| `SUPABASE_STORAGE_BUCKET` | `agency-images`                             |

> [!IMPORTANT]
> Render assigns port via the `PORT` env var automatically. Your server already reads
> `process.env.PORT`, so this works out of the box.

5. Click **Create Web Service**
6. Wait for the deploy to finish. Your API will be live at something like:
   ```
   https://dhani-api.onrender.com
   ```
7. Test it: visit `https://dhani-api.onrender.com/health` — you should see `{"status":"ok"}`

---

## Step 3 — Deploy the Frontend (Static Site)

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Static Site**
2. Connect the **same GitHub repo**
3. Configure:

| Setting             | Value                          |
| ------------------- | ------------------------------ |
| **Name**            | `dhani-client`                 |
| **Root Directory**  | `client`                       |
| **Build Command**   | `npm install && npm run build` |
| **Publish Directory**| `dist`                        |

4. Under **Environment Variables**, add:

| Key                   | Value                                          |
| --------------------- | ---------------------------------------------- |
| `VITE_API_URL`        | `https://dhani-api.onrender.com/api`           |
| `VITE_ADMIN_API_URL`  | `https://dhani-api.onrender.com/api/admin`     |

> [!NOTE]
> `VITE_` env vars are embedded at **build time**, not runtime. If you change them,
> you must trigger a **redeploy** of the static site.

5. Under **Redirects/Rewrites** (in the Static Site settings), add a rewrite rule so
   React Router works correctly:

| Source    | Destination   | Action    |
| --------- | ------------- | --------- |
| `/*`      | `/index.html` | Rewrite   |

6. Click **Create Static Site**
7. Wait for deploy. Your frontend will be live at something like:
   ```
   https://dhani-client.onrender.com
   ```

---

## Step 4 — Verify Before Adding Domain

Test everything using the Render URLs first:

| Check              | URL                                             |
| ------------------ | ----------------------------------------------- |
| API health         | `https://dhani-api.onrender.com/health`         |
| API data           | `https://dhani-api.onrender.com/api/destinations`|
| Website loads      | `https://dhani-client.onrender.com`             |
| Admin panel        | `https://dhani-client.onrender.com/admin`       |

> [!WARNING]
> Render's free tier spins down after 15 minutes of inactivity. The first request
> after inactivity may take ~30 seconds. Consider upgrading to a paid plan for
> always-on performance.

---

## Step 5 — Add Custom Domain on Render

### For the frontend (`dhani-client` Static Site):

1. Go to your **dhani-client** service on Render
2. Click **Settings** → scroll to **Custom Domains**
3. Click **Add Custom Domain**
4. Add both:
   - `dhanitravels.com`
   - `www.dhanitravels.com`
5. Render will show you the **DNS records** you need to add. They will look like:

| Type    | Name  | Value                              |
| ------- | ----- | ---------------------------------- |
| `A`     | `@`   | `216.24.57.1` *(Render's IP)*      |
| `CNAME` | `www` | `dhani-client.onrender.com`        |

> [!NOTE]
> The exact IP may differ — **always use the values Render shows you** in the dashboard.

### (Optional) For the backend API subdomain:

If you want `api.dhanitravels.com` instead of the Render URL:

1. Go to your **dhani-api** service on Render → **Settings** → **Custom Domains**
2. Add `api.dhanitravels.com`
3. Render will show you the CNAME record needed

---

## Step 6 — Configure DNS on Hostinger

1. Log in to [Hostinger](https://www.hostinger.com) → **hPanel**
2. Go to **Domains** → click on your domain (`dhanitravels.com`)
3. Click **DNS / Nameservers** → **DNS Records**
4. **Delete** any existing `A` records for `@` and `CNAME` records for `www` that
   Hostinger may have auto-created
5. **Add** the records from Step 5:

### For the main site:

| Type    | Name  | Value                              | TTL  |
| ------- | ----- | ---------------------------------- | ---- |
| `A`     | `@`   | *(IP from Render dashboard)*       | 3600 |
| `CNAME` | `www` | `dhani-client.onrender.com`        | 3600 |

### (Optional) For the API subdomain:

| Type    | Name  | Value                              | TTL  |
| ------- | ----- | ---------------------------------- | ---- |
| `CNAME` | `api` | `dhani-api.onrender.com`           | 3600 |

6. **Save** and wait for DNS to propagate (usually 5–30 minutes, can take up to 48 hours)

> [!TIP]
> Check propagation status at [dnschecker.org](https://dnschecker.org) — search for your domain.

---

## Step 7 — Update Environment Variables

Once your custom domain is working, update these env vars on Render:

### Backend (`dhani-api`) — Environment Variables:

| Key               | New Value                          |
| ----------------- | ---------------------------------- |
| `FRONTEND_ORIGIN` | `https://dhanitravels.com`         |

### Frontend (`dhani-client`) — Environment Variables:

If you set up an API subdomain:

| Key                  | New Value                                |
| -------------------- | ---------------------------------------- |
| `VITE_API_URL`       | `https://api.dhanitravels.com/api`       |
| `VITE_ADMIN_API_URL` | `https://api.dhanitravels.com/api/admin` |

> [!IMPORTANT]
> After changing `VITE_*` variables, you **must trigger a manual deploy** of the
> static site for the changes to take effect (Settings → Manual Deploy → Deploy latest commit).

---

## Step 8 — SSL Certificate (Automatic)

Render provides **free SSL certificates** automatically for custom domains. Once DNS
is properly configured, Render will issue and renew Let's Encrypt certificates —
**no action needed from you**.

You can verify the SSL status in your service's **Custom Domains** section on the
Render dashboard. It should show a green checkmark.

---

## Step 9 — Final Verification

| Check               | URL                                          |
| -------------------- | -------------------------------------------- |
| Website loads        | `https://dhanitravels.com`                   |
| WWW redirect         | `https://www.dhanitravels.com`               |
| API health           | `https://dhani-api.onrender.com/health`      |
| API data             | `https://dhanitravels.com` (check API calls) |
| Admin panel          | `https://dhanitravels.com/admin`             |
| SSL certificate      | Green padlock in browser                     |

---

## Updating the Website

Render auto-deploys when you push to your `main` branch:

```bash
git add .
git commit -m "your changes"
git push origin main
```

Both the frontend and backend will automatically rebuild and redeploy.

> [!TIP]
> You can disable auto-deploy in Render settings and deploy manually if you prefer.

---

## Troubleshooting

| Problem                    | Fix                                                              |
| -------------------------- | ---------------------------------------------------------------- |
| Site not loading           | Check DNS records on Hostinger match Render's instructions       |
| API returns errors         | Check Render logs: Dashboard → dhani-api → Logs                  |
| Blank page                 | Ensure the rewrite rule `/* → /index.html` is configured         |
| SSL not working            | DNS may still be propagating — wait and check dnschecker.org     |
| CORS errors                | Verify `FRONTEND_ORIGIN` matches your actual domain (with https) |
| API slow on first request  | Free tier cold start — wait ~30s or upgrade to paid              |
| Domain still shows Hostinger| Delete Hostinger's default parking page / A records              |
| Changes not reflecting     | For `VITE_*` changes, trigger a manual redeploy                  |

---

## Render Free Tier Limitations

| Limitation              | Detail                                              |
| ----------------------- | --------------------------------------------------- |
| Cold starts             | Web services spin down after 15 min inactivity      |
| Monthly hours           | 750 free hours/month (enough for 1 service 24/7)    |
| Static sites            | Unlimited on free tier                              |
| SSL                     | Free and automatic                                  |
| Custom domains          | Supported on free tier                              |
| Bandwidth               | 100 GB/month on free tier                           |
