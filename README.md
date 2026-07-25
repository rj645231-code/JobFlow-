# ⚡ JobFlow Deployment & Setup Guide

This guide describes how to deploy both the **React Frontend** and the **Node.js Extractor API** to production so that they are live for all users.

---

## 🎨 1. Deploy Frontend (Vercel)

The frontend is a React application built with Vite. It can be hosted on **Vercel** for free:

### Step 1: Connect to GitHub
- Push the `jobflow/frontend` directory to a new GitHub repository.

### Step 2: Import to Vercel
- Log in to [Vercel](https://vercel.com).
- Click **"Add New"** -> **"Project"** -> import your GitHub repository.

### Step 3: Configure Settings
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Step 4: Environment Variables
Add the following key under the Environment Variables section in Vercel:
* `VITE_API_BASE_URL` = `https://your-extractor-api.onrender.com` (use your deployed backend URL from the next step)

Click **Deploy**! Vercel will build and provide a public URL for your dashboard.

---

## 🐍 2. Deploy Extractor API (Render.com)

The extractor microservice is an Express/Node.js API. It can be hosted on **Render** for free:

### Step 1: Push to GitHub
- Push the `jobflow/job-saas-main` directory to a GitHub repository.

### Step 2: Create Web Service on Render
- Log in to [Render](https://render.com).
- Click **"New +"** -> **"Web Service"**.
- Connect your GitHub repository containing the extractor.

### Step 3: Configure Settings
- **Language:** Node
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Instance Type:** Free

Click **Create Web Service**! Render will build and deploy the Node.js API, giving you a public URL (e.g. `https://jobflow-extractor.onrender.com`).

---

## ⚡ 3. Update Connections
Once your backend is live on Render:
1. Go back to Vercel.
2. Update the `VITE_API_BASE_URL` environment variable to point to your new Render web service URL.
3. Redeploy your frontend.

Now your entire JobFlow system is live on the web!
