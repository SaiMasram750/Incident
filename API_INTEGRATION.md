# API Integration Guide

## Overview

The React frontend is now configured to connect with a deployed backend API. This guide explains how to set up and use the API integration.

---

## Configuration

### API Config File

**Location:** `src/config/apiConfig.js`

This file centralizes all API configuration and endpoints.

```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const API_ENDPOINTS = {
  INCIDENTS: '/incidents',
  INCIDENT: (id) => `/incident/${id}`,
  CREATE_INCIDENT: '/incident',
  UPDATE_INCIDENT: (id) => `/incident/${id}`
};
```

### Environment Variables

#### Local Development

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:3000
```

#### Deployed Backend

For deployed backend (e.g., Render, Heroku, AWS):

```env
VITE_API_URL=https://your-backend.onrender.com
```

#### Using .env.example

Copy `.env.example` to `.env` and update the URL:

```bash
cp .env.example .env
```

---

## How It Works

### 1. Local Development

**Backend:** `http://localhost:3000`
**Frontend:** `http://localhost:5173`

```bash
# Terminal 1: Start backend
npm start

# Terminal 2: Start frontend
npm run dev:react
```

Vite proxy automatically forwards API calls to backend.

### 2. Deployed Backend

**Backend:** `https://your-backend.onrender.com`
**Frontend:** `https://your-frontend.vercel.com`

Set environment variable:
```env
VITE_API_URL=https://your-backend.onrender.com
```

Frontend connects directly to deployed backend.

---

## API Endpoints

### GET /incidents
Fetch all incidents from backend.

**Usage:**
```javascript
const response = await fetch(getApiUrl(API_ENDPOINTS.INCIDENTS));
const incidents = await response.json();
```

**Response:**
```javascript
[
  {
    id: 1,
    type: "fire",
    description: "House fire",
    location: "123 Main St",
    status: "open",
    verified: false,
    timestamp: "2024-01-15T10:30:00Z"
  },
  ...
]
```

### POST /incident
Create a new incident.

**Usage:**
```javascript
const response = await fetch(getApiUrl(API_ENDPOINTS.CREATE_INCIDENT), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: "fire",
    description: "House fire",
    location: "123 Main St"
  })
});
```

**Response:**
```javascript
{
  message: "Incident created successfully",
  incident: {
    id: 1,
    type: "fire",
    description: "House fire",
    location: "123 Main St",
    status: "open",
    verified: false,
    timestamp: "2024-01-15T10:30:00Z"
  }
}
```

### PATCH /incident/:id
Update incident status or verification.

**Usage:**
```javascript
const response = await fetch(getApiUrl(API_ENDPOINTS.UPDATE_INCIDENT(id)), {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: "in-progress",
    verified: true
  })
});
```

**Response:**
```javascript
{
  message: "Incident updated successfully",
  incident: {
    id: 1,
    type: "fire",
    description: "House fire",
    location: "123 Main St",
    status: "in-progress",
    verified: true,
    timestamp: "2024-01-15T10:30:00Z"
  }
}
```

---

## Socket.IO Integration

### Connection

```javascript
import io from 'socket.io-client';
import { API_URL } from '../config/apiConfig';

const socket = io(API_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});
```

### Events

#### Listen for New Incidents
```javascript
socket.on('incident:new', (incident) => {
  // Handle new incident
  saveIncident(incident);
  setIncidents(prev => [incident, ...prev]);
});
```

#### Listen for Updates
```javascript
socket.on('incident:update', (updatedIncident) => {
  // Handle incident update
  updateIncident(updatedIncident.id, updatedIncident);
  setIncidents(prev => prev.map(i => 
    i.id === updatedIncident.id ? updatedIncident : i
  ));
});
```

---

## Data Flow

### 1. Load Incidents on Page Load

```
Frontend loads
  ↓
GET /incidents from backend
  ↓
Merge with localStorage
  ↓
Display in UI
  ↓
Listen for Socket.IO events
```

### 2. Create Incident

```
User submits form
  ↓
POST /incident to backend
  ↓
Backend creates incident
  ↓
Backend broadcasts via Socket.IO
  ↓
Frontend receives incident:new event
  ↓
Save to localStorage
  ↓
Update UI
```

### 3. Update Incident

```
User updates status
  ↓
PATCH /incident/:id to backend
  ↓
Backend updates incident
  ↓
Backend broadcasts via Socket.IO
  ↓
Frontend receives incident:update event
  ↓
Update localStorage
  ↓
Update UI
```

---

## Offline Support

### localStorage Caching

All incidents are cached in localStorage:

```javascript
localStorage.getItem('incidents')
```

### Fallback Behavior

If backend is unavailable:

1. Frontend shows cached data from localStorage
2. User can view incidents offline
3. New incidents are saved to localStorage
4. When backend is available, data syncs

### Merge Logic

When backend is available:

```javascript
const merged = mergeIncidents(backendIncidents);
// Backend incidents take precedence
// Cached incidents not in backend are kept
```

---

## Deployment

### Render.com Example

1. **Deploy Backend**
   - Push code to GitHub
   - Create new Web Service on Render
   - Set environment variables
   - Deploy

2. **Deploy Frontend**
   - Create new Static Site on Render
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```

3. **Verify Connection**
   - Open frontend URL
   - Check browser console for API URL
   - Create test incident
   - Verify it appears in backend

### Vercel Example

1. **Deploy Frontend**
   - Push code to GitHub
   - Import project in Vercel
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```
   - Deploy

2. **Verify Connection**
   - Open frontend URL
   - Check browser console
   - Test API calls

---

## Environment Variables

### Development

`.env` file:
```env
VITE_API_URL=http://localhost:3000
```

### Production

Set in deployment platform:

**Render:**
- Environment → Add Environment Variable
- Key: `VITE_API_URL`
- Value: `https://your-backend.onrender.com`

**Vercel:**
- Settings → Environment Variables
- Name: `VITE_API_URL`
- Value: `https://your-backend.onrender.com`

**GitHub Actions:**
```yaml
env:
  VITE_API_URL: https://your-backend.onrender.com
```

---

## Error Handling

### Network Errors

```javascript
try {
  const response = await fetch(getApiUrl(API_ENDPOINTS.INCIDENTS));
  if (!response.ok) {
    throw new Error(`Failed: ${response.statusText}`);
  }
  const data = await response.json();
} catch (error) {
  console.error('API Error:', error);
  // Fall back to localStorage
  const cached = getIncidents();
}
```

### Connection Errors

```javascript
const socket = io(API_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});
```

---

## Testing

### Test Local Connection

1. Start backend: `npm start`
2. Start frontend: `npm run dev:react`
3. Open browser console
4. Check for API URL log
5. Create test incident
6. Verify in backend logs

### Test Deployed Connection

1. Deploy backend
2. Deploy frontend with correct API URL
3. Open frontend in browser
4. Check browser console
5. Create test incident
6. Verify in backend

### Test Offline Mode

1. Open DevTools (F12)
2. Go to Network tab
3. Check "Offline"
4. Try to create incident
5. Should save to localStorage
6. Go back online
7. Data should sync

---

## Troubleshooting

### API URL Not Set

**Problem:** API calls fail, console shows `http://localhost:3000`

**Solution:**
1. Check `.env` file exists
2. Verify `VITE_API_URL` is set
3. Restart dev server
4. Check browser console

### CORS Errors

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Ensure backend has CORS enabled
2. Check backend `cors()` middleware
3. Verify API URL is correct
4. Check browser console for exact error

### Socket.IO Connection Failed

**Problem:** Socket.IO events not received

**Solution:**
1. Check backend Socket.IO is running
2. Verify API URL is correct
3. Check browser console for errors
4. Verify WebSocket is not blocked

### Offline Data Not Syncing

**Problem:** Offline changes don't sync when online

**Solution:**
1. Check localStorage has data
2. Verify backend is accessible
3. Check merge logic in code
4. Refresh page to force sync

---

## Best Practices

1. **Always use API_URL** - Don't hardcode URLs
2. **Handle errors gracefully** - Show user-friendly messages
3. **Use localStorage fallback** - Ensure offline support
4. **Test both modes** - Local and deployed
5. **Monitor API calls** - Use browser DevTools
6. **Log API URL** - Helps with debugging
7. **Set timeouts** - Prevent hanging requests
8. **Validate responses** - Check status codes

---

## API Reference

### getApiUrl(endpoint)
Build full API URL from endpoint.

```javascript
import { getApiUrl, API_ENDPOINTS } from '../config/apiConfig';

const url = getApiUrl(API_ENDPOINTS.INCIDENTS);
// Returns: http://localhost:3000/incidents
```

### API_ENDPOINTS
Centralized endpoint definitions.

```javascript
API_ENDPOINTS.INCIDENTS           // /incidents
API_ENDPOINTS.INCIDENT(id)        // /incident/:id
API_ENDPOINTS.CREATE_INCIDENT     // /incident
API_ENDPOINTS.UPDATE_INCIDENT(id) // /incident/:id
```

---

## Summary

The frontend is now configured to:

✅ Connect to deployed backend API
✅ Use environment variables for configuration
✅ Support offline mode with localStorage
✅ Handle errors gracefully
✅ Sync data when backend is available
✅ Work in both local and production environments

Ready for deployment!

