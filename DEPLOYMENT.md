# 🚀 Deployment Guide - Dowry System

Complete step-by-step guide to deploy your Dowry System application on **Vercel (Frontend) + Render (Backend)**.

---

## 📋 Quick Overview

| Component | Platform | URL | Status |
|-----------|----------|-----|--------|
| Frontend (React) | Vercel | `https://your-app.vercel.app` | ✅ Free |
| Backend (Node.js) | Render | `https://your-backend.onrender.com` | ✅ Free |

---

## 🔥 Option 1: Vercel + Render (Recommended)

### Step 1: Deploy Backend to Render

1. **Go to [Render.com](https://render.com/)** and sign up (free tier available)

2. **Create a new Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository: `SarveshCodes398/Dowry-system`

3. **Configure the service:**
   ```
   Name: dowry-system-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variable:**
   ```
   Key: PORT
   Value: 5000
   ```

5. **Click "Create Web Service"**

6. **Wait for deployment** (2-5 minutes)
   - Your backend URL will be: `https://dowry-system-backend.onrender.com`

7. **Test your backend:**
   ```bash
   curl https://dowry-system-backend.onrender.com
   # Should return: {"message":"Dowry System API",...}
   ```

---

### Step 2: Update Frontend API URL

1. **In Vercel dashboard**, go to your project settings

2. **Add Environment Variable:**
   ```
   Name: REACT_APP_API_URL
   Value: https://dowry-system-backend.onrender.com
   ```

3. **Redeploy your frontend** (if already deployed)

---

### Step 3: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com/)** and sign up (free tier available)

2. **Create a new project:**
   - Click "Add New" → "Project"
   - Import your GitHub repository: `SarveshCodes398/Dowry-system`

3. **Configure the project:**
   ```
   Project Name: dowry-system-frontend
   Framework Preset: React
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

4. **Add Environment Variable:**
   ```
   Name: REACT_APP_API_URL
   Value: https://dowry-system-backend.onrender.com
   ```

5. **Click "Deploy"**

6. **Wait for deployment** (2-5 minutes)
   - Your frontend URL will be: `https://dowry-system-frontend.vercel.app`

---

## 🎯 Option 2: Single Platform Deployment

### Vercel Only (Frontend + Serverless Functions)

1. **Create `vercel.json` in project root:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "frontend/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build"
         }
       },
       {
         "src": "backend/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "backend/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "frontend/$1"
       }
     ]
   }
   ```

2. **Update API calls in frontend:**
   ```javascript
   // In frontend/src/services/api.js
   baseURL: '/api',  // Points to serverless functions
   ```

3. **Deploy to Vercel** (same steps as above)

---

## 📝 Configuration Files

### render.yaml (Already in your repo)
```yaml
services:
  - type: web
    name: dowry-system-backend
    runtime: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: PORT
        value: 5000
    autoDeploy: true
```

### Environment Variables

#### Backend (Render):
```
PORT=5000
```

#### Frontend (Vercel):
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

---

## 🧪 Testing Your Deployment

### Test Backend API:
```bash
# Health check
curl https://your-backend.onrender.com

# Test prediction
curl -X POST https://your-backend.onrender.com/api/predict \
  -H "Content-Type: application/json" \
  -d '{"appearanceScore": 8.5, "gender": "Female"}'
```

### Test Frontend:
1. Open: `https://your-frontend.vercel.app`
2. Navigate to Predict page
3. Enter appearance score: 8.5
4. Select gender: Female
5. Click "Predict Dowry"
6. Verify results appear

---

## 🔧 Troubleshooting

### CORS Errors
**Problem:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution:**
1. Your backend already has CORS enabled
2. Make sure `REACT_APP_API_URL` is set correctly in Vercel
3. Check that backend is running on Render

### File Uploads Not Working
**Problem:** Images not uploading

**Solution:**
1. Render has 100MB file upload limit (enough for images)
2. Check Multer configuration in `backend/server.js`
3. Verify file size limits in Multer config

### Backend Crashes
**Problem:** Backend shows "Application error" on Render

**Solution:**
1. Go to Render dashboard
2. Click on your service
3. Check "Logs" tab
4. Look for error messages
5. Common fixes:
   - Make sure `PORT` is set to 5000
   - Check that all dependencies are installed
   - Verify Node.js version (Render uses latest)

### Frontend Shows Loading Forever
**Problem:** Spinner keeps spinning, no data

**Solution:**
1. Open browser console (F12 → Console)
2. Check for errors
3. Verify API URL is correct
4. Test API endpoint directly in browser

### 404 Errors on API Calls
**Problem:** `404 Not Found` when calling API

**Solution:**
1. Check that backend URL is correct
2. Verify backend is running
3. Test backend URL directly in browser
4. Make sure routes are correct in `backend/server.js`

---

## 📊 Monitoring

### Render Dashboard
- **URL:** https://dashboard.render.com
- **Features:**
  - View logs in real-time
  - Monitor CPU/Memory usage
  - Set up auto-deploy
  - Scale your service

### Vercel Dashboard
- **URL:** https://vercel.com/dashboard
- **Features:**
  - View deployment logs
  - Monitor performance
  - Set up custom domains
  - Configure environment variables

---

## 💰 Cost Estimate

| Service | Platform | Free Tier | Estimated Cost |
|---------|----------|-----------|----------------|
| Frontend | Vercel | ✅ Yes | $0 (for low traffic) |
| Backend | Render | ✅ Yes | $0 (for low traffic) |
| **Total** | | | **$0** |

**Note:** Both platforms offer generous free tiers that should handle moderate traffic for your application.

---

## 🎉 Success Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL is working
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL is working
- [ ] API calls work between frontend and backend
- [ ] All pages load without errors
- [ ] Predictions work correctly
- [ ] Image uploads work (if using)
- [ ] History and Statistics pages work

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [React Deployment](https://create-react-app.dev/docs/deployment)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)

---

## 🚀 Next Steps

1. **Set up custom domain** (optional)
   - Buy a domain from Namecheap, Google Domains, etc.
   - Connect to Vercel and Render

2. **Set up monitoring** (optional)
   - Add error tracking (Sentry, LogRocket)
   - Set up uptime monitoring (UptimeRobot)

3. **Add analytics** (optional)
   - Google Analytics
   - Vercel Analytics (built-in)

4. **Scale up** (when needed)
   - Upgrade Render plan for more CPU/Memory
   - Add database for persistent storage

---

**Need help?** Open an issue on GitHub or ask in the community!

Happy deploying! 🚀
