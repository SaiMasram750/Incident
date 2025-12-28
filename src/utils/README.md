# Storage Utilities

This module provides a comprehensive set of utility functions for managing incidents in browser localStorage.

## Overview

All incidents are stored under the key `"incidents"` as a JSON string in localStorage. The utilities handle serialization, deserialization, and data validation automatically.

## Core Functions

### `saveIncident(incident)`
Adds or updates a single incident in localStorage.

**Parameters:**
- `incident` (Object): The incident object with the following structure:
  - `id` (number): Unique incident ID
  - `type` (string): Incident type (fire, medical, accident, crime, other)
  - `description` (string): Incident description
  - `location` (string): Incident location
  - `status` (string): Incident status (open, in-progress, resolved)
  - `verified` (boolean): Whether incident is verified
  - `timestamp` (string): ISO timestamp of incident creation

**Returns:** `boolean` - True if successful, false otherwise

**Example:**
```javascript
import { saveIncident } from './utils/storageUtils';

const incident = {
  id: 1,
  type: 'fire',
  description: 'House fire on Main Street',
  location: '123 Main St, City, State',
  status: 'open',
  verified: false,
  timestamp: new Date().toISOString()
};

saveIncident(incident);
```

### `getIncidents()`
Retrieves all incidents from localStorage.

**Returns:** `Array` - Array of incident objects, empty array if none exist or on error

**Example:**
```javascript
import { getIncidents } from './utils/storageUtils';

const incidents = getIncidents();
console.log(`Total incidents: ${incidents.length}`);
```

### `updateIncident(id, updates)`
Updates specific fields of an incident in localStorage.

**Parameters:**
- `id` (number): The ID of the incident to update
- `updates` (Object): Object containing fields to update
  - `status` (string, optional): New status value
  - `verified` (boolean, optional): New verified value
  - `description` (string, optional): New description
  - `location` (string, optional): New location
  - `type` (string, optional): New type

**Returns:** `Object|null` - Updated incident object or null if not found

**Example:**
```javascript
import { updateIncident } from './utils/storageUtils';

const updated = updateIncident(1, {
  status: 'in-progress',
  verified: true
});

if (updated) {
  console.log('Incident updated:', updated);
}
```

## Additional Functions

### `deleteIncident(id)`
Deletes an incident from localStorage.

**Parameters:**
- `id` (number): The ID of the incident to delete

**Returns:** `boolean` - True if successful, false otherwise

### `getIncidentById(id)`
Retrieves a single incident by ID.

**Parameters:**
- `id` (number): The ID of the incident to retrieve

**Returns:** `Object|null` - The incident object or null if not found

### `getIncidentsByStatus(status)`
Filters incidents by status.

**Parameters:**
- `status` (string): The status to filter by (open, in-progress, resolved)

**Returns:** `Array` - Array of incidents matching the status

**Example:**
```javascript
import { getIncidentsByStatus } from './utils/storageUtils';

const openIncidents = getIncidentsByStatus('open');
const resolvedIncidents = getIncidentsByStatus('resolved');
```

### `getVerifiedIncidents()`
Retrieves all verified incidents.

**Returns:** `Array` - Array of verified incidents

### `clearAllIncidents()`
Clears all incidents from localStorage.

**Returns:** `boolean` - True if successful

### `getStorageStats()`
Gets storage statistics.

**Returns:** `Object` - Statistics object containing:
- `totalIncidents` (number): Total number of incidents
- `verifiedCount` (number): Number of verified incidents
- `openCount` (number): Number of open incidents
- `inProgressCount` (number): Number of in-progress incidents
- `resolvedCount` (number): Number of resolved incidents
- `storageSizeBytes` (number): Storage size in bytes
- `storageSizeKB` (string): Storage size in KB

**Example:**
```javascript
import { getStorageStats } from './utils/storageUtils';

const stats = getStorageStats();
console.log(`Total: ${stats.totalIncidents}, Verified: ${stats.verifiedCount}`);
console.log(`Storage size: ${stats.storageSizeKB} KB`);
```

### `mergeIncidents(backendIncidents)`
Merges incidents from an external source with localStorage. Backend incidents take precedence over cached ones.

**Parameters:**
- `backendIncidents` (Array): Array of incidents from backend

**Returns:** `Array` - Merged array of incidents sorted by timestamp

**Example:**
```javascript
import { mergeIncidents } from './utils/storageUtils';

const backendIncidents = await fetch('/incidents').then(r => r.json());
const merged = mergeIncidents(backendIncidents);
```

### `exportIncidents()`
Exports all incidents as a JSON string.

**Returns:** `string` - JSON string of all incidents

**Example:**
```javascript
import { exportIncidents } from './utils/storageUtils';

const backup = exportIncidents();
// Can be used to download or send to server
```

### `importIncidents(jsonString, merge = true)`
Imports incidents from a JSON string.

**Parameters:**
- `jsonString` (string): JSON string of incidents
- `merge` (boolean, optional): If true, merge with existing; if false, replace. Default: true

**Returns:** `boolean` - True if successful

**Example:**
```javascript
import { importIncidents } from './utils/storageUtils';

const jsonString = '[{"id": 1, "type": "fire", ...}]';
importIncidents(jsonString, true); // Merge with existing
```

## Storage Format

Incidents are stored in localStorage under the key `"incidents"` as a JSON string:

```javascript
localStorage.getItem('incidents')
// Returns: '[{"id":1,"type":"fire","description":"...","location":"...","status":"open","verified":false,"timestamp":"2024-01-15T10:30:00Z"}]'
```

## Error Handling

All functions include try-catch blocks and return appropriate values on error:
- Functions returning boolean return `false` on error
- Functions returning objects return `null` on error
- Functions returning arrays return empty arrays on error

Errors are logged to the console for debugging.

## Usage in React Components

```javascript
import React, { useState, useEffect } from 'react';
import {
  saveIncident,
  getIncidents,
  updateIncident,
  getStorageStats
} from '../utils/storageUtils';

function MyComponent() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    // Load incidents from localStorage on mount
    const cached = getIncidents();
    setIncidents(cached);
  }, []);

  const handleSaveIncident = (incident) => {
    saveIncident(incident);
    setIncidents(getIncidents());
  };

  const handleUpdateIncident = (id, updates) => {
    updateIncident(id, updates);
    setIncidents(getIncidents());
  };

  return (
    // Component JSX
  );
}
```

## Best Practices

1. **Always check return values** - Functions may return null or false on error
2. **Use mergeIncidents** - When syncing with backend, use mergeIncidents to avoid data loss
3. **Monitor storage size** - Use getStorageStats() to monitor localStorage usage
4. **Backup data** - Use exportIncidents() to create backups before major operations
5. **Handle errors gracefully** - Provide fallback UI when localStorage operations fail

## Browser Compatibility

These utilities work in all modern browsers that support:
- localStorage API
- JSON.stringify() and JSON.parse()
- Array methods (map, filter, find, etc.)

## Limitations

- localStorage has a typical limit of 5-10MB per domain
- Data persists only for the same origin (protocol, domain, port)
- Data is cleared when browser cache is cleared (depending on browser settings)
- No built-in encryption - don't store sensitive data
