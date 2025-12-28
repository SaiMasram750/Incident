# Authentication System Documentation

## Overview

A complete role-based authentication system using browser localStorage with two user roles: **Citizen** and **Responder**.

---

## Features

### User Roles

#### 1. Citizen
- Can **report new incidents**
- Can view all incidents
- Cannot update incident status
- Cannot verify incidents

#### 2. Responder
- Can view all incidents
- Can **update incident status** (open → in-progress → resolved)
- Can **verify incidents**
- Cannot report incidents

### Authentication Features
- User registration with username, password, and role selection
- Secure login with credential validation
- Session persistence across page reloads
- Logout functionality
- Demo users for testing

---

## Components

### 1. LoginForm Component (`src/components/LoginForm.jsx`)

**Purpose:** Allows users to log in with username and password

**Props:**
- `onLoginSuccess(user)` - Callback when login succeeds
- `onSwitchToRegister()` - Callback to switch to register form

**Features:**
- Username and password input fields
- Form validation
- Error/success messages
- Link to registration form
- Demo credentials display

**Usage:**
```jsx
<LoginForm
  onLoginSuccess={(user) => setCurrentUser(user)}
  onSwitchToRegister={() => setAuthMode('register')}
/>
```

### 2. RegisterForm Component (`src/components/RegisterForm.jsx`)

**Purpose:** Allows new users to create an account

**Props:**
- `onRegisterSuccess()` - Callback when registration succeeds

**Features:**
- Username input (min 3 characters)
- Password input (min 6 characters)
- Confirm password field
- Role selection dropdown (Citizen/Responder)
- Role description
- Form validation
- Duplicate username detection

**Usage:**
```jsx
<RegisterForm
  onRegisterSuccess={() => setAuthMode('login')}
/>
```

### 3. IncidentDashboard Component (Updated)

**New Props:**
- `currentUser` - Current logged-in user object
- `onLogout()` - Callback for logout

**New Features:**
- User info display in header (username and role badge)
- Logout button
- Conditional rendering based on user role
- Report form only visible to citizens
- Update buttons only visible to responders

**Usage:**
```jsx
<IncidentDashboard
  currentUser={currentUser}
  onLogout={handleLogout}
/>
```

---

## Storage Utilities (Updated)

### Authentication Functions

#### `saveUser(user)`
Registers a new user in localStorage

**Parameters:**
```javascript
{
  username: string,      // Min 3 characters, must be unique
  password: string,      // Min 6 characters
  role: string          // 'citizen' or 'responder'
}
```

**Returns:** `boolean` - True if successful, false if username exists

**Example:**
```javascript
import { saveUser } from './utils/storageUtils';

const success = saveUser({
  username: 'john_doe',
  password: 'secure123',
  role: 'citizen'
});
```

#### `login(username, password)`
Authenticates user and creates session

**Parameters:**
- `username` (string) - Username
- `password` (string) - Password

**Returns:** `Object|null` - User object if successful, null otherwise

**Example:**
```javascript
import { login } from './utils/storageUtils';

const user = login('john_doe', 'secure123');
if (user) {
  console.log(`Logged in as ${user.username} (${user.role})`);
}
```

#### `getCurrentUser()`
Retrieves the currently logged-in user

**Returns:** `Object|null` - Current user object or null if not logged in

**Example:**
```javascript
import { getCurrentUser } from './utils/storageUtils';

const user = getCurrentUser();
if (user) {
  console.log(`Current user: ${user.username}`);
}
```

#### `logout()`
Logs out the current user

**Returns:** `boolean` - True if successful

**Example:**
```javascript
import { logout } from './utils/storageUtils';

logout();
```

#### `canReportIncident()`
Checks if current user can report incidents (citizen role)

**Returns:** `boolean` - True if user is logged in and is a citizen

**Example:**
```javascript
import { canReportIncident } from './utils/storageUtils';

if (canReportIncident()) {
  // Show report form
}
```

#### `canUpdateIncident()`
Checks if current user can update incidents (responder role)

**Returns:** `boolean` - True if user is logged in and is a responder

**Example:**
```javascript
import { canUpdateIncident } from './utils/storageUtils';

if (canUpdateIncident()) {
  // Show update buttons
}
```

#### `isLoggedIn()`
Checks if any user is currently logged in

**Returns:** `boolean` - True if user is logged in

**Example:**
```javascript
import { isLoggedIn } from './utils/storageUtils';

if (isLoggedIn()) {
  // Show dashboard
} else {
  // Show login form
}
```

#### `getAllUsers()`
Retrieves all registered users

**Returns:** `Array` - Array of user objects

**Example:**
```javascript
import { getAllUsers } from './utils/storageUtils';

const users = getAllUsers();
console.log(`Total users: ${users.length}`);
```

---

## localStorage Structure

### Users Storage
**Key:** `"users"`
**Value:** JSON array of user objects

```javascript
[
  {
    "username": "citizen",
    "password": "password123",
    "role": "citizen",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "username": "responder",
    "password": "password123",
    "role": "responder",
    "createdAt": "2024-01-15T10:35:00Z"
  }
]
```

### Current User Storage
**Key:** `"currentUser"`
**Value:** JSON object of logged-in user

```javascript
{
  "username": "citizen",
  "role": "citizen",
  "loginTime": "2024-01-15T10:40:00Z"
}
```

---

## App Flow

### 1. Initial Load
```
App mounts
  ↓
Check localStorage for currentUser
  ↓
If exists → Show Dashboard
If not → Show Login Form
  ↓
Create demo users if none exist
```

### 2. Registration Flow
```
User clicks "Create Account"
  ↓
RegisterForm displayed
  ↓
User enters username, password, role
  ↓
Form validates input
  ↓
saveUser() called
  ↓
If username exists → Show error
If valid → Save to localStorage
  ↓
Switch to LoginForm
```

### 3. Login Flow
```
User enters username and password
  ↓
Form validates input
  ↓
login() called
  ↓
Check credentials against localStorage users
  ↓
If invalid → Show error
If valid → Save currentUser to localStorage
  ↓
Show Dashboard
```

### 4. Dashboard Access
```
Citizen logged in
  ↓
Report form visible
  ↓
Update buttons hidden
  ↓
Can only view incidents

Responder logged in
  ↓
Report form hidden
  ↓
Update buttons visible
  ↓
Can update status and verify
```

### 5. Logout Flow
```
User clicks Logout
  ↓
logout() called
  ↓
Remove currentUser from localStorage
  ↓
Show Login Form
```

---

## Demo Users

Pre-created demo users for testing:

### Citizen Account
- **Username:** `citizen`
- **Password:** `password123`
- **Role:** Citizen
- **Permissions:** Report incidents, view all incidents

### Responder Account
- **Username:** `responder`
- **Password:** `password123`
- **Role:** Responder
- **Permissions:** Update incident status, verify incidents, view all incidents

---

## Security Considerations

### Current Implementation
- Passwords stored in plain text in localStorage (for demo purposes)
- No encryption
- No server-side validation
- Client-side only

### Production Recommendations
1. **Hash Passwords** - Use bcrypt or similar
2. **Server-Side Validation** - Validate credentials on backend
3. **JWT Tokens** - Use JWT for session management
4. **HTTPS Only** - Encrypt data in transit
5. **Secure Cookies** - Use httpOnly, secure flags
6. **Rate Limiting** - Prevent brute force attacks
7. **Input Sanitization** - Prevent injection attacks
8. **CORS Configuration** - Restrict origins

---

## Validation Rules

### Username
- Minimum 3 characters
- Must be unique
- Alphanumeric recommended

### Password
- Minimum 6 characters
- Must match confirmation
- No complexity requirements (add in production)

### Role
- Must be "citizen" or "responder"
- Required field

---

## Error Handling

### Registration Errors
- Username already exists
- Username too short
- Password too short
- Passwords don't match
- Missing required fields

### Login Errors
- Invalid username or password
- Missing username or password

### Session Errors
- User logged out
- Session expired (not implemented)
- Invalid user data

---

## Testing Scenarios

### Scenario 1: Citizen Workflow
1. Login as citizen
2. See report form
3. Report incident
4. See incident in table
5. Cannot update status
6. Logout

### Scenario 2: Responder Workflow
1. Login as responder
2. Report form hidden
3. See all incidents
4. Update incident status
5. Verify incident
6. Logout

### Scenario 3: Registration
1. Click "Create Account"
2. Enter new username
3. Select role
4. Register
5. Login with new account

### Scenario 4: Session Persistence
1. Login as user
2. Refresh page
3. Still logged in
4. Logout
5. Refresh page
6. Back to login form

---

## Integration with Incident Management

### Citizen Permissions
```javascript
// Can see this
canReportIncident() → true
canUpdateIncident() → false

// Report form visible
// Update buttons hidden
```

### Responder Permissions
```javascript
// Can see this
canReportIncident() → false
canUpdateIncident() → true

// Report form hidden
// Update buttons visible
```

---

## Future Enhancements

1. **Password Reset** - Email-based password recovery
2. **Two-Factor Authentication** - SMS or authenticator app
3. **User Profiles** - Edit profile information
4. **Account Deactivation** - Disable accounts
5. **Login History** - Track login attempts
6. **Session Timeout** - Auto-logout after inactivity
7. **Remember Me** - Extended session duration
8. **Social Login** - Google, GitHub authentication
9. **Role Management** - Admin panel for role assignment
10. **Audit Logs** - Track user actions

---

## Troubleshooting

### User Can't Login
- Check username and password spelling
- Verify user exists in localStorage
- Clear browser cache and try again

### Session Lost After Refresh
- Check if localStorage is enabled
- Check browser privacy settings
- Try incognito/private mode

### Can't Register New User
- Username might already exist
- Username must be 3+ characters
- Password must be 6+ characters

### Role-Based Features Not Working
- Verify currentUser is set correctly
- Check canReportIncident() / canUpdateIncident() return values
- Verify user role in localStorage

