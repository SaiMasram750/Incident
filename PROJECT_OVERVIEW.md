# Incident Management System - Complete Overview

## 🎯 Project Summary

A **real-time incident management system** built with Node.js + Express + React + Socket.IO. It allows users to report incidents, track their status, and verify them with real-time updates across all connected clients.

---

## 📋 Features

### Core Features
1. **Report Incidents** - Users can submit new incidents with type, description, and location
2. **Real-time Updates** - Socket.IO broadcasts changes instantly to all connected clients
3. **Status Management** - Update incident status (open → in-progress → resolved)
4. **Verification System** - Mark incidents as verified
5. **Local Persistence** - Browser localStorage caches incidents for offline access
6. **Backend Sync** - On load, merges backend data with cached data (backend takes precedence)
7. **Statistics Dashboard** - Shows total, open, in-progress, resolved, and verified counts
8. **Responsive UI** - Works on desktop and mobile devices

### Incident Fields
- **ID** - Auto-generated unique identifier
- **Type** - Fire, Medical Emergency, Traffic Accident, Crime, Other
- **Description** - Detailed incident description
- **Location** - Where the incident occurred
- **Status** - open, in-progress, resolved
- **Verified** - Boolean flag for verification
- **Timestamp** - ISO format creation time

---

## 🏗️ Code Structure

```
project-root/
├── server.js                          # Express backend server
├── package.json                       # Dependencies & scripts
├── .env                              # Environment variables
├── index.html                        # React entry point
├── vite.config.js                    # Vite configuration
│
├── src/
│   ├── main.jsx                      # React app entry
│   ├── App.jsx                       # Root React component
│   ├── App.css                       # Global styles
│   │
│   ├── components/
│   │   ├── IncidentDashboard.jsx     # Main dashboard component
│   │   └── IncidentDashboard.css     # Dashboard styles
│   │
│   └── utils/
│       ├── storageUtils.js           # localStorage utility functions
│       ├── storageUtils.test.js      # Usage examples
│       └── README.md                 # Storage utilities documentation
│
└── public/
    └── index.html                    # Static HTML (old)
```

---

## 🔧 Backend Architecture (server.js)

### Technology Stack
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **CORS** - Cross-origin requests
- **In-memory storage** - Array-based incident storage

### API Endpoints

#### 1. POST /incident
**Create a new incident**
```javascript
Request:
{
  "type": "fire",
  "description": "House fire on Main Street",
  "location": "123 Main St, City, State"
}

Response:
{
  "message": "Incident created successfully",
  "incident": {
    "id": 1,
    "type": "fire",
    "description": "House fire on Main Street",
    "location": "123 Main St, City, State",
    "status": "open",
    "verified": false,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### 2. GET /incidents
**Retrieve all incidents (sorted by timestamp, newest first)**
```javascript
Response:
[
  {
    "id": 1,
    "type": "fire",
    "description": "House fire on Main Street",
    "location": "123 Main St, City, State",
    "status": "open",
    "verified": false,
    "timestamp": "2024-01-15T10:30:00Z"
  },
  // ... more incidents
]
```

#### 3. GET /incident/:id
**Retrieve a single incident by ID**
```javascript
Response:
{
  "id": 1,
  "type": "fire",
  // ... incident data
}
```

#### 4. PATCH /incident/:id
**Update incident status or verification**
```javascript
Request:
{
  "status": "in-progress",
  "verified": true
}

Response:
{
  "message": "Incident updated successfully",
  "incident": {
    "id": 1,
    // ... updated incident data
  }
}
```

### Socket.IO Events

#### Server → Client
- **incident:new** - Broadcast when new incident is created
- **incident:update** - Broadcast when incident is updated
- **incidents:load** - Send all incidents to newly connected client

#### Client → Server
- (No custom events; uses HTTP for communication)

### In-Memory Storage
```javascript
let incidents = [];           // Array of incident objects
let incidentIdCounter = 1;    // Auto-incrementing ID counter

// Data resets when server restarts
// No database persistence
```

---

## 🎨 Frontend Architecture (React)

### Main Component: IncidentDashboard.jsx

#### State Management
```javascript
const [incidents, setIncidents] = useState([]);        // All incidents
const [socket, setSocket] = useState(null);            // Socket.IO connection
const [formData, setFormData] = useState({...});       // Form input
const [loading, setLoading] = useState(true);          // Loading state
const [message, setMessage] = useState({...});         // Notification messages
```

#### Key Functions

1. **loadIncidents()** - Fetches from backend and merges with localStorage
2. **handleSubmit()** - Creates new incident via POST /incident
3. **updateIncidentStatus()** - Updates status via PATCH /incident/:id
4. **verifyIncident()** - Marks incident as verified
5. **showMessage()** - Displays temporary notifications

#### Socket.IO Integration
```javascript
// Listen for new incidents
initSocket.on('incident:new', (incident) => {
  saveIncident(incident);  // Save to localStorage
  setIncidents(prev => [incident, ...prev]);
});

// Listen for incident updates
initSocket.on('incident:update', (updatedIncident) => {
  updateIncident(updatedIncident.id, updatedIncident);
  setIncidents(prev => prev.map(i => 
    i.id === updatedIncident.id ? updatedIncident : i
  ));
});
```

#### UI Sections
1. **Header** - Title and description
2. **Report Form** - Input fields for new incidents
3. **Statistics Cards** - Shows counts by status
4. **Incidents Table** - Displays all incidents with actions

---

## 💾 Storage Utilities (storageUtils.js)

### Core Functions

#### 1. saveIncident(incident)
Adds or updates incident in localStorage under key "incidents"
```javascript
saveIncident({
  id: 1,
  type: 'fire',
  description: 'House fire',
  location: '123 Main St',
  status: 'open',
  verified: false,
  timestamp: '2024-01-15T10:30:00Z'
});
```

#### 2. getIncidents()
Retrieves all incidents from localStorage
```javascript
const incidents = getIncidents();
// Returns: Array of incident objects
```

#### 3. updateIncident(id, updates)
Updates specific fields of an incident
```javascript
updateIncident(1, {
  status: 'in-progress',
  verified: true
});
```

#### 4. mergeIncidents(backendIncidents)
Merges backend data with cached data (backend takes precedence)
```javascript
const merged = mergeIncidents(backendIncidents);
// Returns: Merged array sorted by timestamp
```

### Additional Utilities
- **deleteIncident(id)** - Remove incident
- **getIncidentById(id)** - Get single incident
- **getIncidentsByStatus(status)** - Filter by status
- **getVerifiedIncidents()** - Get verified only
- **getStorageStats()** - Get storage statistics
- **clearAllIncidents()** - Clear all data
- **exportIncidents()** - Export as JSON
- **importIncidents(json, merge)** - Import from JSON

### localStorage Format
```javascript
// Key: "incidents"
// Value: JSON string of array
localStorage.getItem('incidents')
// Returns: '[{"id":1,"type":"fire",...}]'
```

---

## 🚀 How It Works (Data Flow)

### Creating an Incident
```
User fills form
    ↓
handleSubmit() called
    ↓
POST /incident (to backend)
    ↓
Backend creates incident with auto-ID
    ↓
Backend broadcasts via Socket.IO: incident:new
    ↓
All connected clients receive incident:new event
    ↓
Frontend saves to localStorage via saveIncident()
    ↓
Frontend updates state and re-renders table
```

### Updating an Incident
```
User changes status dropdown
    ↓
updateIncidentStatus() called
    ↓
PATCH /incident/:id (to backend)
    ↓
Backend updates incident
    ↓
Backend broadcasts via Socket.IO: incident:update
    ↓
All connected clients receive incident:update event
    ↓
Frontend updates localStorage via updateIncident()
    ↓
Frontend updates state and re-renders table
```

### Loading Incidents on Page Load
```
Component mounts
    ↓
loadIncidents() called
    ↓
GET /incidents (fetch from backend)
    ↓
mergeIncidents() combines backend + localStorage
    ↓
Backend data takes precedence
    ↓
Merged data saved to localStorage
    ↓
Frontend state updated with merged data
    ↓
Table renders with all incidents
```

---

## 📦 Dependencies

### Production
- **express** (4.18.2) - Web framework
- **socket.io** (4.5.4) - Real-time communication (server)
- **socket.io-client** (4.5.4) - Real-time communication (client)
- **cors** (2.8.5) - Cross-origin requests
- **dotenv** (16.0.3) - Environment variables
- **react** (18.2.0) - UI library
- **react-dom** (18.2.0) - React DOM rendering

### Development
- **vite** (7.3.0) - Build tool
- **@vitejs/plugin-react** (4.0.0) - React plugin for Vite
- **nodemon** (3.1.11) - Auto-restart server on changes

---

## 🎮 Running the Application

### Terminal 1 - Start Backend
```bash
npm install          # Install dependencies (first time only)
npm start            # Start Express server on port 3000
```

### Terminal 2 - Start Frontend
```bash
npm run dev:react    # Start Vite dev server on port 5173
```

### Access Application
Open browser: `http://localhost:5173`

---

## 🔄 Real-Time Features

### Multi-Client Synchronization
When multiple users are connected:
1. User A creates incident → Socket.IO broadcasts to all clients
2. User B's dashboard updates instantly without refresh
3. User C's localStorage is updated automatically
4. All users see the same data in real-time

### Offline Support
1. User goes offline
2. localStorage still has cached incidents
3. User can view cached data
4. When back online, data syncs with backend

---

## 📊 Statistics Calculation

```javascript
const stats = {
  total: incidents.length,
  open: incidents.filter(i => i.status === 'open').length,
  inProgress: incidents.filter(i => i.status === 'in-progress').length,
  resolved: incidents.filter(i => i.status === 'resolved').length,
  verified: incidents.filter(i => i.verified).length
};
```

---

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Grid layout for statistics
- Scrollable table on small screens
- Touch-friendly buttons

### Visual Feedback
- Color-coded status badges
- Loading states
- Success/error messages
- Verified checkmarks
- Status-based row highlighting

### Accessibility
- Semantic HTML
- Form labels
- Keyboard navigation
- Color contrast compliance

---

## 🔐 Data Validation

### Backend Validation
- Required fields: type, description, location
- Status values: open, in-progress, resolved
- Verified must be boolean

### Frontend Validation
- Form fields required before submit
- Status dropdown restricted to valid values
- Error messages displayed to user

---

## 💡 Key Design Decisions

1. **In-Memory Storage** - Fast, simple, no database setup needed
2. **localStorage Caching** - Offline support and reduced server load
3. **Socket.IO Broadcasting** - Real-time updates to all clients
4. **Merge Strategy** - Backend data takes precedence to prevent conflicts
5. **Auto-Incrementing IDs** - Simple, predictable incident IDs
6. **Utility Functions** - Reusable storage logic separated from components

---

## 🚀 Future Enhancements

1. **Database Integration** - Replace in-memory with MongoDB/PostgreSQL
2. **User Authentication** - Login/logout with JWT
3. **Role-Based Access** - Admin, responder, citizen roles
4. **Incident Categories** - More detailed incident types
5. **Search & Filter** - Advanced filtering options
6. **Export Reports** - PDF/CSV export functionality
7. **Notifications** - Email/SMS alerts for new incidents
8. **Maps Integration** - Show incidents on map
9. **File Uploads** - Attach photos/documents to incidents
10. **Audit Logs** - Track all changes to incidents

---

## 📝 Notes

- Data resets when server restarts (in-memory storage)
- localStorage persists across browser sessions
- Socket.IO requires WebSocket support
- CORS enabled for all origins (change in production)
- No authentication currently implemented
- Single-threaded server (use clustering for production)

