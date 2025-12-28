/**
 * localStorage utility functions for incident management and authentication
 * Incidents stored under key "incidents" as JSON string
 * Users stored under key "users" as JSON string
 * Current user stored under key "currentUser" as JSON string
 */

const INCIDENTS_KEY = 'incidents';
const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

/**
 * Save a single incident to localStorage
 * @param {Object} incident - The incident object to save
 * @param {number} incident.id - Unique incident ID
 * @param {string} incident.type - Incident type (fire, medical, accident, crime, other)
 * @param {string} incident.description - Incident description
 * @param {string} incident.location - Incident location
 * @param {string} incident.status - Incident status (open, in-progress, resolved)
 * @param {boolean} incident.verified - Whether incident is verified
 * @param {string} incident.timestamp - ISO timestamp of incident creation
 * @returns {boolean} True if save was successful, false otherwise
 */
export const saveIncident = (incident) => {
  try {
    if (!incident || typeof incident !== 'object') {
      console.error('Invalid incident object');
      return false;
    }

    // Get existing incidents
    const incidents = getIncidents();

    // Check if incident already exists (by id)
    const existingIndex = incidents.findIndex(i => i.id === incident.id);

    if (existingIndex !== -1) {
      // Update existing incident
      incidents[existingIndex] = { ...incidents[existingIndex], ...incident };
    } else {
      // Add new incident
      incidents.push(incident);
    }

    // Save to localStorage
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
    return true;
  } catch (error) {
    console.error('Failed to save incident to localStorage:', error);
    return false;
  }
};

/**
 * Retrieve all incidents from localStorage
 * @returns {Array} Array of incident objects, empty array if none exist or on error
 */
export const getIncidents = () => {
  try {
    const data = localStorage.getItem(INCIDENTS_KEY);
    
    if (!data) {
      return [];
    }

    const incidents = JSON.parse(data);

    // Validate that it's an array
    if (!Array.isArray(incidents)) {
      console.warn('Stored data is not an array, returning empty array');
      return [];
    }

    return incidents;
  } catch (error) {
    console.error('Failed to retrieve incidents from localStorage:', error);
    return [];
  }
};

/**
 * Update specific fields of an incident in localStorage
 * @param {number} id - The ID of the incident to update
 * @param {Object} updates - Object containing fields to update
 * @param {string} [updates.status] - New status value
 * @param {boolean} [updates.verified] - New verified value
 * @param {string} [updates.description] - New description
 * @param {string} [updates.location] - New location
 * @param {string} [updates.type] - New type
 * @returns {Object|null} Updated incident object or null if not found
 */
export const updateIncident = (id, updates) => {
  try {
    if (!id || typeof updates !== 'object') {
      console.error('Invalid id or updates object');
      return null;
    }

    const incidents = getIncidents();
    const incidentIndex = incidents.findIndex(i => i.id === id);

    if (incidentIndex === -1) {
      console.warn(`Incident with id ${id} not found`);
      return null;
    }

    // Update the incident with new values
    const updatedIncident = {
      ...incidents[incidentIndex],
      ...updates
    };

    incidents[incidentIndex] = updatedIncident;

    // Save updated incidents back to localStorage
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));

    return updatedIncident;
  } catch (error) {
    console.error('Failed to update incident in localStorage:', error);
    return null;
  }
};

/**
 * Delete an incident from localStorage
 * @param {number} id - The ID of the incident to delete
 * @returns {boolean} True if deletion was successful, false otherwise
 */
export const deleteIncident = (id) => {
  try {
    const incidents = getIncidents();
    const filteredIncidents = incidents.filter(i => i.id !== id);

    if (filteredIncidents.length === incidents.length) {
      console.warn(`Incident with id ${id} not found`);
      return false;
    }

    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(filteredIncidents));
    return true;
  } catch (error) {
    console.error('Failed to delete incident from localStorage:', error);
    return false;
  }
};

/**
 * Get a single incident by ID
 * @param {number} id - The ID of the incident to retrieve
 * @returns {Object|null} The incident object or null if not found
 */
export const getIncidentById = (id) => {
  try {
    const incidents = getIncidents();
    return incidents.find(i => i.id === id) || null;
  } catch (error) {
    console.error('Failed to retrieve incident by id:', error);
    return null;
  }
};

/**
 * Get incidents filtered by status
 * @param {string} status - The status to filter by (open, in-progress, resolved)
 * @returns {Array} Array of incidents matching the status
 */
export const getIncidentsByStatus = (status) => {
  try {
    const incidents = getIncidents();
    return incidents.filter(i => i.status === status);
  } catch (error) {
    console.error('Failed to filter incidents by status:', error);
    return [];
  }
};

/**
 * Get verified incidents
 * @returns {Array} Array of verified incidents
 */
export const getVerifiedIncidents = () => {
  try {
    const incidents = getIncidents();
    return incidents.filter(i => i.verified === true);
  } catch (error) {
    console.error('Failed to retrieve verified incidents:', error);
    return [];
  }
};

/**
 * Clear all incidents from localStorage
 * @returns {boolean} True if clear was successful
 */
export const clearAllIncidents = () => {
  try {
    localStorage.removeItem(INCIDENTS_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear incidents from localStorage:', error);
    return false;
  }
};

/**
 * Get storage statistics
 * @returns {Object} Object containing storage statistics
 */
export const getStorageStats = () => {
  try {
    const incidents = getIncidents();
    const data = localStorage.getItem(INCIDENTS_KEY);
    const sizeInBytes = data ? new Blob([data]).size : 0;

    return {
      totalIncidents: incidents.length,
      verifiedCount: incidents.filter(i => i.verified).length,
      openCount: incidents.filter(i => i.status === 'open').length,
      inProgressCount: incidents.filter(i => i.status === 'in-progress').length,
      resolvedCount: incidents.filter(i => i.status === 'resolved').length,
      storageSizeBytes: sizeInBytes,
      storageSizeKB: (sizeInBytes / 1024).toFixed(2)
    };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return null;
  }
};

/**
 * Merge incidents from an external source with localStorage
 * Backend incidents take precedence over cached ones
 * @param {Array} backendIncidents - Array of incidents from backend
 * @returns {Array} Merged array of incidents
 */
export const mergeIncidents = (backendIncidents) => {
  try {
    if (!Array.isArray(backendIncidents)) {
      console.error('backendIncidents must be an array');
      return getIncidents();
    }

    const cachedIncidents = getIncidents();
    const backendIds = new Set(backendIncidents.map(i => i.id));

    // Combine backend incidents with cached ones not in backend
    const merged = [
      ...backendIncidents,
      ...cachedIncidents.filter(i => !backendIds.has(i.id))
    ];

    // Sort by timestamp (newest first)
    merged.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Save merged data
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(merged));

    return merged;
  } catch (error) {
    console.error('Failed to merge incidents:', error);
    return getIncidents();
  }
};

/**
 * Export incidents as JSON string
 * @returns {string} JSON string of all incidents
 */
export const exportIncidents = () => {
  try {
    const incidents = getIncidents();
    return JSON.stringify(incidents, null, 2);
  } catch (error) {
    console.error('Failed to export incidents:', error);
    return '[]';
  }
};

/**
 * Import incidents from JSON string
 * @param {string} jsonString - JSON string of incidents
 * @param {boolean} merge - If true, merge with existing; if false, replace
 * @returns {boolean} True if import was successful
 */
export const importIncidents = (jsonString, merge = true) => {
  try {
    const importedIncidents = JSON.parse(jsonString);

    if (!Array.isArray(importedIncidents)) {
      console.error('Imported data must be an array');
      return false;
    }

    if (merge) {
      mergeIncidents(importedIncidents);
    } else {
      localStorage.setItem(INCIDENTS_KEY, JSON.stringify(importedIncidents));
    }

    return true;
  } catch (error) {
    console.error('Failed to import incidents:', error);
    return false;
  }
};

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Save a new user to localStorage
 * @param {Object} user - User object
 * @param {string} user.username - Username (must be unique)
 * @param {string} user.password - Password (stored as-is, no hashing in browser)
 * @param {string} user.role - User role ('citizen' or 'responder')
 * @returns {boolean} True if save was successful, false if username exists
 */
export const saveUser = (user) => {
  try {
    if (!user || !user.username || !user.password || !user.role) {
      console.error('Invalid user object: missing required fields');
      return false;
    }

    if (!['citizen', 'responder'].includes(user.role)) {
      console.error('Invalid role: must be "citizen" or "responder"');
      return false;
    }

    const users = getAllUsers();

    // Check if username already exists
    if (users.some(u => u.username === user.username)) {
      console.warn(`Username "${user.username}" already exists`);
      return false;
    }

    // Add new user
    users.push({
      username: user.username,
      password: user.password,
      role: user.role,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Failed to save user:', error);
    return false;
  }
};

/**
 * Get all users from localStorage
 * @returns {Array} Array of user objects
 */
export const getAllUsers = () => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) return [];

    const users = JSON.parse(data);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error('Failed to retrieve users:', error);
    return [];
  }
};

/**
 * Login user with username and password
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Object|null} User object if login successful, null otherwise
 */
export const login = (username, password) => {
  try {
    if (!username || !password) {
      console.error('Username and password required');
      return null;
    }

    const users = getAllUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      console.warn('Invalid username or password');
      return null;
    }

    // Save current user
    const currentUser = {
      username: user.username,
      role: user.role,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    return currentUser;
  } catch (error) {
    console.error('Failed to login:', error);
    return null;
  }
};

/**
 * Get current logged-in user
 * @returns {Object|null} Current user object or null if not logged in
 */
export const getCurrentUser = () => {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

/**
 * Logout current user
 * @returns {boolean} True if logout was successful
 */
export const logout = () => {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
    return true;
  } catch (error) {
    console.error('Failed to logout:', error);
    return false;
  }
};

/**
 * Check if current user can report incidents (citizen role)
 * @returns {boolean} True if user is logged in and is a citizen
 */
export const canReportIncident = () => {
  const user = getCurrentUser();
  return user && user.role === 'citizen';
};

/**
 * Check if current user can update incidents (responder role)
 * @returns {boolean} True if user is logged in and is a responder
 */
export const canUpdateIncident = () => {
  const user = getCurrentUser();
  return user && user.role === 'responder';
};

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isLoggedIn = () => {
  return getCurrentUser() !== null;
};


// ============================================================================
// STATISTICS FUNCTIONS
// ============================================================================

/**
 * Get incidents grouped by type
 * @returns {Array} Array of objects with type and count
 */
export const getIncidentsByType = () => {
  try {
    const incidents = getIncidents();
    const typeMap = {};

    incidents.forEach(incident => {
      const type = incident.type || 'unknown';
      typeMap[type] = (typeMap[type] || 0) + 1;
    });

    return Object.entries(typeMap).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      value: count
    }));
  } catch (error) {
    console.error('Failed to get incidents by type:', error);
    return [];
  }
};

/**
 * Get incidents grouped by status
 * @returns {Array} Array of objects with status and count
 */
export const getIncidentsByStatusGrouped = () => {
  try {
    const incidents = getIncidents();
    const statusMap = {
      'open': 0,
      'in-progress': 0,
      'resolved': 0
    };

    incidents.forEach(incident => {
      const status = incident.status || 'open';
      if (status in statusMap) {
        statusMap[status]++;
      }
    });

    return [
      { status: 'Open', count: statusMap['open'], value: statusMap['open'] },
      { status: 'In Progress', count: statusMap['in-progress'], value: statusMap['in-progress'] },
      { status: 'Resolved', count: statusMap['resolved'], value: statusMap['resolved'] }
    ];
  } catch (error) {
    console.error('Failed to get incidents by status:', error);
    return [];
  }
};

/**
 * Get incidents grouped by date
 * @returns {Array} Array of objects with date and count
 */
export const getIncidentsByDate = () => {
  try {
    const incidents = getIncidents();
    const dateMap = {};

    incidents.forEach(incident => {
      const date = new Date(incident.timestamp);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
    });

    // Sort by date and return
    return Object.entries(dateMap)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, count]) => ({
        date,
        count,
        displayDate: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }));
  } catch (error) {
    console.error('Failed to get incidents by date:', error);
    return [];
  }
};

/**
 * Get detailed statistics
 * @returns {Object} Statistics object
 */
export const getDetailedStats = () => {
  try {
    const incidents = getIncidents();
    const byType = getIncidentsByType();
    const byStatus = getIncidentsByStatus();
    const byDate = getIncidentsByDate();

    return {
      total: incidents.length,
      byType,
      byStatus,
      byDate,
      verified: incidents.filter(i => i.verified).length,
      unverified: incidents.filter(i => !i.verified).length,
      averagePerDay: incidents.length > 0 ? (incidents.length / (byDate.length || 1)).toFixed(2) : 0
    };
  } catch (error) {
    console.error('Failed to get detailed stats:', error);
    return null;
  }
};