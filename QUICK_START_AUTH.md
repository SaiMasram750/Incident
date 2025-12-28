# Quick Start Guide - Authentication System

## What's New

A complete role-based authentication system has been added to the incident management application.

---

## Running the Application

### Terminal 1 - Start Backend
```bash
npm start
```
Server runs on `http://localhost:3000`

### Terminal 2 - Start Frontend
```bash
npm run dev:react
```
Frontend runs on `http://localhost:5173`

### Open Browser
Navigate to `http://localhost:5173`

---

## First Time Setup

### Demo Users (Pre-Created)
The system automatically creates two demo users on first load:

**Citizen Account:**
- Username: `citizen`
- Password: `password123`

**Responder Account:**
- Username: `responder`
- Password: `password123`

---

## User Workflows

### As a Citizen

1. **Login**
   - Click "Create one now" if first time
   - Or use demo: `citizen` / `password123`

2. **Report Incident**
   - Fill in incident type, description, location
   - Click "Report Incident"
   - See incident appear in table

3. **View Incidents**
   - See all incidents in the table
   - View statistics dashboard
   - Cannot update status or verify

4. **Logout**
   - Click "Logout" button in top right
   - Returns to login form

### As a Responder

1. **Login**
   - Use demo: `responder` / `password123`

2. **View Incidents**
   - See all incidents in the table
   - View statistics dashboard
   - Report form is hidden

3. **Update Incident Status**
   - Click status dropdown
   - Select: Open, In Progress, or Resolved
   - Changes broadcast to all users

4. **Verify Incidents**
   - Click "Verify" button
   - Marks incident as verified
   - Button changes to "✓ Yes"

5. **Logout**
   - Click "Logout" button in top right

---

## Creating New Users

### Register New Account

1. On login page, click "Create one now"
2. Enter username (min 3 characters)
3. Enter password (min 6 characters)
4. Confirm password
5. Select role: Citizen or Responder
6. Click "Register"
7. Login with new credentials

---

## Key Features

### Authentication
✅ User registration with role selection
✅ Secure login with credential validation
✅ Session persistence across page reloads
✅ Logout functionality
✅ Demo users for testing

### Role-Based Access Control
✅ Citizens can report incidents
✅ Responders can update incident status
✅ Responders can verify incidents
✅ UI adapts based on user role

### User Interface
✅ User info displayed in header
✅ Role badge (Citizen/Responder)
✅ Logout button
✅ Conditional form visibility
✅ Role-based button visibility

---

## File Structure

```
src/
├── components/
│   ├── LoginForm.jsx              # Login component
│   ├── RegisterForm.jsx           # Registration component
│   ├── AuthForms.css              # Auth styling
│   ├── IncidentDashboard.jsx      # Updated with auth
│   └── IncidentDashboard.css      # Updated styling
│
├── utils/
│   └── storageUtils.js            # Updated with auth functions
│
├── App.jsx                        # Updated with auth flow
└── App.css                        # Updated styling
```

---

## New Components

### LoginForm
- Username and password input
- Form validation
- Error/success messages
- Link to registration
- Demo credentials display

### RegisterForm
- Username, password, confirm password
- Role selection dropdown
- Form validation
- Duplicate username detection
- Role description

---

## New Storage Functions

```javascript
// User Management
saveUser(user)              // Register new user
login(username, password)   // Login user
getCurrentUser()            // Get logged-in user
logout()                    // Logout user
getAllUsers()               // Get all users

// Permission Checks
canReportIncident()         // Check if citizen
canUpdateIncident()         // Check if responder
isLoggedIn()                // Check if logged in
```

---

## localStorage Keys

```javascript
// Users database
localStorage.getItem('users')

// Current session
localStorage.getItem('currentUser')

// Incidents (existing)
localStorage.getItem('incidents')
```

---

## Testing Checklist

- [ ] Login with demo citizen account
- [ ] Report incident as citizen
- [ ] Verify report form visible
- [ ] Verify update buttons hidden
- [ ] Logout and login as responder
- [ ] Verify report form hidden
- [ ] Update incident status
- [ ] Verify incident
- [ ] Logout and login again
- [ ] Verify session persists
- [ ] Register new user
- [ ] Login with new user
- [ ] Test all validations

---

## Troubleshooting

### Can't Login
- Check username and password
- Try demo credentials: `citizen` / `password123`
- Clear browser cache

### Session Lost
- Check if localStorage is enabled
- Try incognito/private mode
- Check browser privacy settings

### Can't Register
- Username must be 3+ characters
- Password must be 6+ characters
- Username might already exist

### Role Features Not Working
- Verify you're logged in
- Check user role in header badge
- Refresh page and try again

---

## Next Steps

1. **Test the system** - Try both user roles
2. **Create custom users** - Register with your own credentials
3. **Report incidents** - Test as citizen
4. **Update incidents** - Test as responder
5. **Check localStorage** - Open DevTools → Application → localStorage

---

## Demo Workflow

### Complete Test Scenario

1. **Start Application**
   ```bash
   npm start          # Terminal 1
   npm run dev:react  # Terminal 2
   ```

2. **Login as Citizen**
   - Username: `citizen`
   - Password: `password123`

3. **Report Incident**
   - Type: Fire
   - Description: House fire on Main Street
   - Location: 123 Main St
   - Click "Report Incident"

4. **Logout**
   - Click "Logout" button

5. **Login as Responder**
   - Username: `responder`
   - Password: `password123`

6. **Update Incident**
   - Change status to "In Progress"
   - Click "Verify" button

7. **Verify Changes**
   - Status updated
   - Incident marked as verified
   - Statistics updated

8. **Logout**
   - Click "Logout" button

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         React Application               │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │         App.jsx                  │  │
│  │  (Auth Flow Management)          │  │
│  └──────────────────────────────────┘  │
│           ↓                             │
│  ┌──────────────────────────────────┐  │
│  │  LoginForm / RegisterForm        │  │
│  │  (User Authentication)           │  │
│  └──────────────────────────────────┘  │
│           ↓                             │
│  ┌──────────────────────────────────┐  │
│  │  IncidentDashboard               │  │
│  │  (Role-Based UI)                 │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│      storageUtils.js                    │
│  (Auth + Incident Functions)            │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│      Browser localStorage               │
│  (users, currentUser, incidents)        │
└─────────────────────────────────────────┘
```

---

## Support

For detailed documentation, see:
- `AUTHENTICATION.md` - Complete auth system docs
- `PROJECT_OVERVIEW.md` - Full project overview
- `src/utils/README.md` - Storage utilities docs

