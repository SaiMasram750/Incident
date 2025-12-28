# Deployment Guide

## Overview

Complete guide for deploying the incident management system to production.

---

## Prerequisites

- GitHub account
- Render.com account (or similar platform)
- Git installed locally
- Node.js installed

---

## Part 1: Deploy Backend

### Option 1: Render.com

#### Step 1: Prepare Backend

1. Ensure `server.js` is in root directory
2. Ensure `package.json` has correct scripts:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

#### Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Step 3: Create Render Service

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name:** incident-management-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid)

#### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. Copy the URL (e.g., `https://incident-management-backend.onrender.com`)

#### Step 5: Verify Backend

```bash
curl https://incident-management-backend.onrender.com/
# Should return: "Incident Management Server"
```

---

## Part 2: Deploy Frontend

### Option 1: Vercel

#### Step 1: Prepare Frontend

1. Ensure `vite.config.js` is configured
2. Ensure `.env.example` exists
3. Ensure `package.json` has build script:
   ```json
   {
     "scripts": {
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

#### Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare frontend for deployment"
git push origin main
```

#### Step 3: Deploy on Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import GitHub repository
4. Configure:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

#### Step 4: Add Environment Variables

1. Go to Settings → Environment Variables
2. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://incident-management-backend.onrender.com`
3. Click "Save"

#### Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment (1-2 minutes)
3. Copy the URL (e.g., `https://incident-management.vercel.app`)

#### Step 6: Verify Frontend

1. Open frontend URL in browser
2. Check browser console for API URL
3. Should show: `API URL: https://incident-management-backend.onrender.com`

---

### Option 2: Render.com (Frontend)

#### Step 1: Create Static Site

1. Go to https://render.com
2. Click "New +" → "Static Site"
3. Connect GitHub repository
4. Configure:
   - **Name:** incident-management-frontend
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

#### Step 2: Add Environment Variables

1. Go to Environment
2. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://incident-management-backend.onrender.com`

#### Step 3: Deploy

1. Click "Create Static Site"
2. Wait for deployment
3. Copy the URL

---

## Part 3: Configure CORS

### Backend CORS Setup

Ensure backend has CORS enabled for frontend URL:

**server.js:**
```javascript
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://incident-management.vercel.app',
    'https://incident-management-frontend.onrender.app'
  ],
  credentials: true
}));
```

---

## Part 4: Test Deployment

### Test Backend

```bash
# Test API endpoint
curl https://incident-management-backend.onrender.com/incidents

# Should return: []
```

### Test Frontend

1. Open frontend URL
2. Check browser console (F12)
3. Should show API URL
4. Create test incident
5. Verify it appears in backend

### Test Socket.IO

1. Open frontend
2. Create incident
3. Watch for real-time update
4. Check browser console for Socket.IO connection

---

## Part 5: Environment Variables

### Frontend (.env)

```env
VITE_API_URL=https://incident-management-backend.onrender.com
```

### Backend (.env)

```env
PORT=3000
NODE_ENV=production
```

---

## Troubleshooting

### Frontend Can't Connect to Backend

**Problem:** API calls fail, CORS error

**Solution:**
1. Check backend CORS configuration
2. Verify API URL in frontend environment variables
3. Check backend is running
4. Check firewall/network settings

### Socket.IO Connection Failed

**Problem:** Real-time updates not working

**Solution:**
1. Check backend Socket.IO is enabled
2. Verify API URL is correct
3. Check WebSocket is not blocked
4. Check browser console for errors

### Build Fails

**Problem:** Deployment fails during build

**Solution:**
1. Check `npm run build` works locally
2. Check all dependencies are in `package.json`
3. Check for TypeScript errors
4. Check for missing environment variables

### Blank Page

**Problem:** Frontend loads but shows blank page

**Solution:**
1. Check browser console for errors
2. Check `index.html` exists
3. Check `src/main.jsx` is correct
4. Check build output in `dist/`

---

## Monitoring

### Check Backend Logs

**Render:**
1. Go to Web Service
2. Click "Logs"
3. View real-time logs

### Check Frontend Logs

**Vercel:**
1. Go to Project
2. Click "Deployments"
3. Click deployment
4. View build logs

**Browser Console:**
1. Open frontend
2. Press F12
3. Check Console tab for errors

---

## Updates & Redeployment

### Update Backend

```bash
# Make changes
git add .
git commit -m "Update backend"
git push origin main

# Render auto-deploys on push
```

### Update Frontend

```bash
# Make changes
git add .
git commit -m "Update frontend"
git push origin main

# Vercel auto-deploys on push
```

---

## Performance Optimization

### Frontend

1. **Enable Gzip compression** - Vercel does this automatically
2. **Optimize images** - Use appropriate formats
3. **Lazy load components** - Use React.lazy()
4. **Minimize bundle size** - Check with `npm run build`

### Backend

1. **Enable caching** - Use Redis if needed
2. **Optimize database queries** - Not applicable (in-memory)
3. **Use CDN** - For static files
4. **Monitor performance** - Use Render metrics

---

## Security

### Frontend

1. **Never commit secrets** - Use environment variables
2. **Validate user input** - Check all forms
3. **Use HTTPS** - Automatic on Vercel/Render
4. **Set security headers** - Configure in deployment

### Backend

1. **Validate all inputs** - Check request data
2. **Use HTTPS** - Automatic on Render
3. **Set CORS properly** - Only allow trusted origins
4. **Rate limiting** - Consider adding for production

---

## Scaling

### If Traffic Increases

**Backend:**
1. Upgrade Render plan
2. Add database (MongoDB, PostgreSQL)
3. Implement caching (Redis)
4. Use load balancing

**Frontend:**
1. Upgrade Vercel plan
2. Use CDN for assets
3. Optimize bundle size
4. Enable caching

---

## Backup & Recovery

### Backup Data

Since using in-memory storage:
1. Implement database (MongoDB)
2. Regular backups to cloud storage
3. Version control for code

### Recovery

1. Redeploy from GitHub
2. Restore data from backups
3. Verify all systems working

---

## Maintenance

### Regular Tasks

- Monitor logs for errors
- Check performance metrics
- Update dependencies
- Test new features
- Backup data

### Monthly

- Review logs
- Update packages
- Check security
- Performance review

### Quarterly

- Major updates
- Security audit
- Performance optimization
- Capacity planning

---

## Checklist

### Before Deployment

- [ ] Code committed to GitHub
- [ ] `.env.example` created
- [ ] `package.json` has correct scripts
- [ ] `vite.config.js` configured
- [ ] CORS configured
- [ ] Environment variables documented

### After Deployment

- [ ] Backend URL accessible
- [ ] Frontend URL accessible
- [ ] API calls working
- [ ] Socket.IO connected
- [ ] Create test incident
- [ ] Verify real-time updates
- [ ] Test offline mode
- [ ] Check browser console

---

## Support

For issues:
1. Check browser console (F12)
2. Check backend logs
3. Check deployment logs
4. Review API_INTEGRATION.md
5. Check environment variables

---

## Summary

Deployment steps:
1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Set environment variables
4. Configure CORS
5. Test all features
6. Monitor logs

**Ready for production!**

