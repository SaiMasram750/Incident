# API Integration - Quick Reference

## 🚀 Quick Start

### Local Development

```bash
# Terminal 1: Backend
npm start

# Terminal 2: Frontend
npm run dev:react

# Browser
http://localhost:5173
```

### Deployed Backend

```bash
# Set environment variable
VITE_API_URL=https://your-backend.onrender.com

# Deploy frontend
npm run build
```

---

## 🔧 Configuration

### API Config File
**Location:** `src/config/apiConfig.js`

```javascript
import { API_URL, getApiUrl, API_ENDPOINTS } from '../config/apiConfig';

// Use in components
const url = getApiUrl(API_ENDPOINTS.INCIDENTS);
```

### Environment Variables

**Development (.env):**
```env
VITE_API_URL=http://localhost:3000
```

**Production (.env):**
```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 📡 API Endpoints

### Fetch Incidents
```javascript
const response = await fetch(getApiUrl(API_ENDPOINTS.INCIDENTS));
const incidents = await response.json();
```

### Create Incident
```javascript
const response = await fetch(getApiUrl(API_ENDPOINTS.CREATE_INCIDENT), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type, description, location })
});
```

### Update Incident
```javascript
const response = await fetch(getApiUrl(API_ENDPOINTS.UPDATE_INCIDENT(id)), {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status, verified })
});
```

---

## 🔌 Socket.IO

### Connect
```javascript
import io from 'socket.io-client';
import { API_URL } from '../config/apiConfig';

const socket = io(API_URL);
```

### Listen for Events
```javascript
socket.on('incident:new', (incident) => {
  // Handle new incident
});

socket.on('incident:update', (updatedIncident) => {
  // Handle update
});
```

---

## 🌐 Deployment

### Backend (Render)
1. Push to GitHub
2. Create Web Service
3. Set start command: `npm start`
4. Deploy
5. Copy URL

### Frontend (Vercel)
1. Push to GitHub
2. Import project
3. Set `VITE_API_URL` environment variable
4. Deploy

---

## 🧪 Testing

### Check API URL
```javascript
// Browser console
console.log(import.meta.env.VITE_API_URL);
```

### Test API Call
```bash
curl https://your-backend.onrender.com/incidents
```

### Test Socket.IO
1. Open frontend
2. Create incident
3. Check for real-time update

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| API URL not set | Check `.env` file, restart dev server |
| CORS error | Enable CORS in backend |
| Socket.IO not connecting | Check API URL, verify backend running |
| Offline data not syncing | Check localStorage, refresh page |

---

## 📁 Files

| File | Purpose |
|------|---------|
| `src/config/apiConfig.js` | API configuration |
| `src/components/IncidentDashboard.jsx` | Updated with API calls |
| `.env` | Environment variables |
| `.env.example` | Template for .env |
| `API_INTEGRATION.md` | Full documentation |
| `DEPLOYMENT_GUIDE.md` | Deployment steps |

---

## 🎯 Key Points

✅ Use `API_URL` from config
✅ Use `getApiUrl()` for endpoints
✅ Handle errors with fallback
✅ Set environment variables
✅ Test locally first
✅ Deploy backend before frontend
✅ Verify connection after deployment

---

## 📚 Documentation

- **API_INTEGRATION.md** - Complete reference
- **DEPLOYMENT_GUIDE.md** - Deployment steps
- **API_INTEGRATION_SUMMARY.md** - Detailed summary

---

## ✨ Ready to Deploy!

1. Set environment variables
2. Deploy backend
3. Deploy frontend
4. Verify connection
5. Test features

**Done!** 🎉

