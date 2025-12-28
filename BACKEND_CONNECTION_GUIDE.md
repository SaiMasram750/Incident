# Backend Connection Guide

## ✅ Backend Connected Successfully

Your React frontend is now configured to connect with the deployed backend API.

---

## 🔗 Connection Details

### Backend URL
```
https://incident-pl11.onrender.com
```

### Frontend Configuration
**File:** `.env`
```env
VITE_API_URL=https://incident-pl11.onrender.com
```

### API Config
**File:** `src/config/apiConfig.js`
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// Will use: https://incident-pl11.onrender.com
```

---

## 🚀 How to Run

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Frontend
```bash
npm run dev:react
```

The frontend will automatically connect to:
```
https://incident-pl11.onrender.com
```

### Step 3: Open in Browser
```
http://localhost:5173
```

---

## 🧪 Testing the Connection

### Check API URL in Console
1. Open browser (http://localhost:5173)
2. Press F12 to open DevTools
3. Go to Console tab
4. You should see:
   ```
   API URL: https://incident-pl11.onrender.com
   ```

### Test API Endpoints

#### Get All Incidents
```javascript
// In browser console
fetch('https://incident-pl11.onrender.com/incidents')
  .then(r => r.json())
  .then(data => console.log(data))
```

#### Create Test Incident
1. Login to frontend
2. Report a new incident
3. Check if it appears in the table
4. Verify real-time update

#### Update Incident
1. Change incident status
2. Verify status updates in real-time
3. Check backend logs

---

## 📊 Data Flow

### Page Load
```
Frontend loads
  ↓
GET https://incident-pl11.onrender.com/incidents
  ↓
Merge with localStorage
  ↓
Display incidents
  ↓
Connect Socket.IO to backend
```

### Create Incident
```
User submits form
  ↓
POST https://incident-pl11.onrender.com/incident
  ↓
Backend creates incident
  ↓
Backend broadcasts via Socket.IO
  ↓
Frontend receives incident:new
  ↓
Update UI
```

### Update Incident
```
User updates status
  ↓
PATCH https://incident-pl11.onrender.com/incident/:id
  ↓
Backend updates incident
  ↓
Backend broadcasts via Socket.IO
  ↓
Frontend receives incident:update
  ↓
Update UI
```

---

## 🔌 Socket.IO Connection

### Real-Time Events
The frontend listens for:
- `incident:new` - New incident created
- `incident:update` - Incident updated

### Connection Status
Check browser console for Socket.IO connection:
```
Socket.IO connected to: https://incident-pl11.onrender.com
```

---

## 💾 Offline Support

### How It Works
1. All incidents cached in localStorage
2. If backend unavailable, shows cached data
3. New incidents saved to localStorage
4. When backend available, data syncs

### Test Offline Mode
1. Open DevTools (F12)
2. Network tab → Offline
3. Try to create incident
4. Should save to localStorage
5. Go back online
6. Data syncs automatically

---

## 🎯 Features Working

✅ **Fetch Incidents** - GET /incidents
✅ **Create Incident** - POST /incident
✅ **Update Status** - PATCH /incident/:id
✅ **Verify Incident** - PATCH /incident/:id
✅ **Real-Time Updates** - Socket.IO events
✅ **Offline Support** - localStorage caching
✅ **Error Handling** - Graceful fallbacks

---

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend

**Problem:** API calls fail, CORS error

**Solution:**
1. Check backend is running: https://incident-pl11.onrender.com/
2. Check `.env` has correct URL
3. Restart frontend: `npm run dev:react`
4. Check browser console for errors

### Socket.IO Not Connecting

**Problem:** Real-time updates not working

**Solution:**
1. Check backend Socket.IO is enabled
2. Verify API URL in console
3. Check browser console for errors
4. Verify WebSocket not blocked

### Offline Data Not Syncing

**Problem:** Changes made offline don't sync

**Solution:**
1. Check localStorage has data
2. Verify backend is accessible
3. Refresh page to force sync
4. Check browser console

---

## 📱 API Endpoints

### GET /incidents
Fetch all incidents
```javascript
fetch('https://incident-pl11.onrender.com/incidents')
  .then(r => r.json())
```

### POST /incident
Create new incident
```javascript
fetch('https://incident-pl11.onrender.com/incident', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'fire',
    description: 'House fire',
    location: '123 Main St'
  })
})
```

### PATCH /incident/:id
Update incident
```javascript
fetch('https://incident-pl11.onrender.com/incident/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'in-progress',
    verified: true
  })
})
```

---

## 🔐 CORS Configuration

The backend has CORS enabled for:
- Local development: `http://localhost:5173`
- Deployed frontend: Your Vercel/Render URL

If deploying frontend, update backend CORS with your frontend URL.

---

## 📊 Testing Checklist

- [ ] Frontend starts: `npm run dev:react`
- [ ] Browser opens: `http://localhost:5173`
- [ ] Console shows API URL
- [ ] Can login/register
- [ ] Can create incident
- [ ] Incident appears in table
- [ ] Can update status
- [ ] Can verify incident
- [ ] Real-time updates work
- [ ] Offline mode works

---

## 🚀 Next Steps

### Local Testing
1. Run frontend: `npm run dev:react`
2. Test all features
3. Check console for errors
4. Verify real-time updates

### Deploy Frontend
1. Push to GitHub
2. Deploy to Vercel/Render
3. Set `VITE_API_URL` environment variable
4. Verify connection

### Monitor Backend
1. Check backend logs
2. Monitor API calls
3. Check Socket.IO connections
4. Monitor performance

---

## 📚 Documentation

- **API_INTEGRATION.md** - Complete API reference
- **DEPLOYMENT_GUIDE.md** - Deployment steps
- **QUICK_REFERENCE_API.md** - Quick reference

---

## ✨ Summary

Your frontend is now connected to:
```
https://incident-pl11.onrender.com
```

### What's Working
✅ API calls to backend
✅ Real-time Socket.IO updates
✅ Offline support with localStorage
✅ Error handling and fallbacks
✅ Data persistence

### Ready to Use
1. Run `npm run dev:react`
2. Open `http://localhost:5173`
3. Test features
4. Deploy when ready

---

## 🎉 Connection Complete!

Your React frontend is now fully connected to the deployed backend API.

**Start the frontend and begin using the application!**

```bash
npm run dev:react
```

Then open: `http://localhost:5173`

