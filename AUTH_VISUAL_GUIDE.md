# Authentication System - Visual Guide

## Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Start                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
                ┌───────────────────────┐
                │  Check localStorage   │
                │  for currentUser      │
                └───────────────────────┘
                    ↙                 ↘
            User Found          No User Found
                ↓                      ↓
        ┌──────────────┐      ┌──────────────────┐
        │  Dashboard   │      │  Create Demo     │
        │  (Logged In) │      │  Users (First    │
        └──────────────┘      │  Time Only)      │
                              └──────────────────┘
                                    ↓
                              ┌──────────────┐
                              │  Login Form  │
                              └──────────────┘
```

---

## Authentication Screens

### Login Screen
```
┌─────────────────────────────────────────┐
│                                         │
│     Incident Management System          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Login                   │   │
│  │  Sign in to your account        │   │
│  │                                 │   │
│  │  Username: [____________]       │   │
│  │  Password: [____________]       │   │
│  │                                 │   │
│  │  [    Login Button    ]         │   │
│  │                                 │   │
│  │  Don't have an account?         │   │
│  │  Create one now                 │   │
│  │                                 │   │
│  │  Demo Credentials:              │   │
│  │  Citizen: citizen / password123 │   │
│  │  Responder: responder / pass... │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Registration Screen
```
┌─────────────────────────────────────────┐
│                                         │
│     Incident Management System          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Create Account             │   │
│  │  Register as citizen or responder│  │
│  │                                 │   │
│  │  Username: [____________]       │   │
│  │  Password: [____________]       │   │
│  │  Confirm:  [____________]       │   │
│  │                                 │   │
│  │  Role: [Citizen ▼]              │   │
│  │  Citizens can report incidents  │   │
│  │                                 │   │
│  │  [   Register Button   ]        │   │
│  │                                 │   │
│  │  Already have an account?       │   │
│  │  Login here                     │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Dashboard Screens

### Citizen Dashboard
```
┌──────────────────────────────────────────────────────────────┐
│  Incident Management Dashboard                               │
│  Real-time incident tracking and management                  │
│                                                               │
│  [Citizen Badge]  citizen  [Logout]                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Report New Incident                                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Type: [Fire ▼]                                         │  │
│  │ Description: [_____________________________]           │  │
│  │ Location: [_____________________________]              │  │
│  │ [Report Incident]                                      │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Statistics                                                  │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │  5   │  │  2   │  │  1   │  │  2   │  │  3   │          │
│  │Total │  │ Open │  │ In   │  │Resol-│  │Verif-│          │
│  │      │  │      │  │Prog  │  │ ved  │  │ ied  │          │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Incidents                                                   │
│  ┌────┬──────┬──────────┬──────────┬────────┬────────┐      │
│  │ ID │ Type │ Desc     │ Location │ Status │ Verify │      │
│  ├────┼──────┼──────────┼──────────┼────────┼────────┤      │
│  │ #1 │ FIRE │ House... │ Main St  │ Open   │ Pend.  │      │
│  │ #2 │ MED  │ Heart... │ Hospital │ Resol. │ ✓ Yes  │      │
│  └────┴──────┴──────────┴──────────┴────────┴────────┘      │
│                                                               │
│  Note: Update buttons NOT visible (citizen role)             │
└──────────────────────────────────────────────────────────────┘
```

### Responder Dashboard
```
┌──────────────────────────────────────────────────────────────┐
│  Incident Management Dashboard                               │
│  Real-time incident tracking and management                  │
│                                                               │
│  [Responder Badge]  responder  [Logout]                      │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Statistics                                                  │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │  5   │  │  2   │  │  1   │  │  2   │  │  3   │          │
│  │Total │  │ Open │  │ In   │  │Resol-│  │Verif-│          │
│  │      │  │      │  │Prog  │  │ ved  │  │ ied  │          │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Incidents                                                   │
│  ┌────┬──────┬──────────┬──────────┬────────┬────────┐      │
│  │ ID │ Type │ Desc     │ Location │ Status │ Verify │      │
│  ├────┼──────┼──────────┼──────────┼────────┼────────┤      │
│  │ #1 │ FIRE │ House... │ Main St  │[Open▼] │[Verify]│      │
│  │ #2 │ MED  │ Heart... │ Hospital │[Resol▼]│✓ Yes  │      │
│  └────┴──────┴──────────┴──────────┴────────┴────────┘      │
│                                                               │
│  Note: Update buttons VISIBLE (responder role)               │
│        Report form HIDDEN                                    │
└──────────────────────────────────────────────────────────────┘
```

---

## User Role Comparison

```
┌─────────────────────────────────────────────────────────────┐
│                    CITIZEN vs RESPONDER                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Feature                    Citizen      Responder          │
│  ─────────────────────────────────────────────────────────  │
│  Report Incidents             ✅            ❌              │
│  View Incidents               ✅            ✅              │
│  Update Status                ❌            ✅              │
│  Verify Incidents             ❌            ✅              │
│  View Statistics              ✅            ✅              │
│  See Report Form              ✅            ❌              │
│  See Update Buttons           ❌            ✅              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Registration Flow
```
┌──────────────┐
│ RegisterForm │
└──────────────┘
       ↓
   [Input Data]
   - username
   - password
   - role
       ↓
   [Validation]
   - Min lengths
   - Password match
   - Unique username
       ↓
   saveUser()
       ↓
   localStorage['users']
       ↓
   [Success]
   Switch to LoginForm
```

### Login Flow
```
┌──────────────┐
│  LoginForm   │
└──────────────┘
       ↓
   [Input Data]
   - username
   - password
       ↓
   [Validation]
   - Required fields
       ↓
   login()
       ↓
   [Check Credentials]
   Against localStorage['users']
       ↓
   [Valid]              [Invalid]
      ↓                    ↓
   Save currentUser    Show Error
   to localStorage
      ↓
   Show Dashboard
```

### Session Persistence
```
┌──────────────┐
│ Page Reload  │
└──────────────┘
       ↓
   getCurrentUser()
       ↓
   Check localStorage['currentUser']
       ↓
   [Found]              [Not Found]
      ↓                    ↓
   Show Dashboard      Show LoginForm
```

---

## Component Hierarchy

```
App
├── LoginForm
│   ├── Form inputs
│   ├── Validation
│   └── Demo credentials
│
├── RegisterForm
│   ├── Form inputs
│   ├── Role selector
│   └── Validation
│
└── IncidentDashboard
    ├── Header
    │   ├── User badge
    │   ├── Role display
    │   └── Logout button
    │
    ├── Report Form (Citizens only)
    │   ├── Type selector
    │   ├── Description
    │   └── Location
    │
    ├── Statistics
    │   ├── Total count
    │   ├── Status counts
    │   └── Verified count
    │
    └── Incidents Table
        ├── ID
        ├── Type
        ├── Description
        ├── Location
        ├── Status (Responders: editable)
        ├── Verified (Responders: button)
        └── Timestamp
```

---

## State Management

```
App State
├── currentUser
│   ├── username
│   ├── role
│   └── loginTime
│
├── authMode
│   ├── 'login'
│   └── 'register'
│
└── loading
    ├── true (checking session)
    └── false (ready)

IncidentDashboard State
├── incidents []
├── socket
├── formData {}
├── loading
└── message {}
```

---

## localStorage Structure

```
Browser localStorage
│
├── users (Array)
│   ├── {username, password, role, createdAt}
│   ├── {username, password, role, createdAt}
│   └── ...
│
├── currentUser (Object)
│   ├── username
│   ├── role
│   └── loginTime
│
└── incidents (Array)
    ├── {id, type, description, location, status, verified, timestamp}
    ├── {id, type, description, location, status, verified, timestamp}
    └── ...
```

---

## Permission Matrix

```
┌──────────────────────────────────────────────────────────┐
│              PERMISSION MATRIX                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Action                  Citizen    Responder           │
│  ─────────────────────────────────────────────────────  │
│  canReportIncident()       true       false             │
│  canUpdateIncident()       false      true              │
│  isLoggedIn()              true       true              │
│  getCurrentUser()          user       user              │
│  logout()                  works      works             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
User Action
    ↓
Input Validation
    ↓
    ├─ Invalid → Show Error Message
    │              (3 second timeout)
    │
    └─ Valid → Process Action
                   ↓
              Success/Failure
                   ↓
              Show Message
              (Success: 1-3 sec)
              (Error: 3 sec)
```

---

## Session Lifecycle

```
1. Application Start
   ↓
2. Check localStorage
   ↓
3. User Not Found
   ├─ Show LoginForm
   ├─ User registers or logs in
   └─ Save currentUser
   ↓
4. User Logged In
   ├─ Show Dashboard
   ├─ User interacts
   └─ Session persists
   ↓
5. Page Reload
   ├─ Check localStorage
   ├─ currentUser found
   └─ Show Dashboard (no re-login)
   ↓
6. User Logout
   ├─ Remove currentUser
   ├─ Clear session
   └─ Show LoginForm
```

---

## UI State Transitions

```
┌─────────────┐
│   Loading   │
└─────────────┘
      ↓
┌─────────────┐
│   Login     │ ← Register
└─────────────┘
      ↓
┌─────────────┐
│  Register   │ → Login
└─────────────┘
      ↓
┌─────────────┐
│  Dashboard  │
└─────────────┘
      ↓
┌─────────────┐
│   Logout    │ → Login
└─────────────┘
```

---

## Demo User Workflow

```
Start App
   ↓
Demo users created
   ↓
┌─────────────────────────────────────┐
│  Login as Citizen                   │
│  Username: citizen                  │
│  Password: password123              │
└─────────────────────────────────────┘
   ↓
Report Incident
   ↓
View in Table
   ↓
Logout
   ↓
┌─────────────────────────────────────┐
│  Login as Responder                 │
│  Username: responder                │
│  Password: password123              │
└─────────────────────────────────────┘
   ↓
Update Incident Status
   ↓
Verify Incident
   ↓
Logout
```

---

## Key Takeaways

✅ **Two-Role System** - Citizen and Responder
✅ **Role-Based UI** - Different views for each role
✅ **Session Persistence** - Survives page reload
✅ **localStorage Storage** - No server needed
✅ **Demo Users** - Pre-created for testing
✅ **Validation** - Input and credential checks
✅ **Error Handling** - User-friendly messages
✅ **Responsive Design** - Works on all devices

