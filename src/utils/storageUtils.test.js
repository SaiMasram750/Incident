/**
 * Example usage and tests for storageUtils
 * These examples demonstrate how to use each function
 */

import {
  saveIncident,
  getIncidents,
  updateIncident,
  deleteIncident,
  getIncidentById,
  getIncidentsByStatus,
  getVerifiedIncidents,
  clearAllIncidents,
  getStorageStats,
  mergeIncidents,
  exportIncidents,
  importIncidents
} from './storageUtils';

// Example 1: Save a new incident
export const exampleSaveIncident = () => {
  const newIncident = {
    id: 1,
    type: 'fire',
    description: 'House fire on Main Street',
    location: '123 Main St, City, State',
    status: 'open',
    verified: false,
    timestamp: new Date().toISOString()
  };

  const success = saveIncident(newIncident);
  console.log('Incident saved:', success);
};

// Example 2: Get all incidents
export const exampleGetIncidents = () => {
  const incidents = getIncidents();
  console.log('All incidents:', incidents);
  console.log('Total count:', incidents.length);
};

// Example 3: Update an incident
export const exampleUpdateIncident = () => {
  const updated = updateIncident(1, {
    status: 'in-progress',
    verified: true
  });
  console.log('Updated incident:', updated);
};

// Example 4: Get incident by ID
export const exampleGetIncidentById = () => {
  const incident = getIncidentById(1);
  console.log('Incident with ID 1:', incident);
};

// Example 5: Get incidents by status
export const exampleGetIncidentsByStatus = () => {
  const openIncidents = getIncidentsByStatus('open');
  console.log('Open incidents:', openIncidents);

  const resolvedIncidents = getIncidentsByStatus('resolved');
  console.log('Resolved incidents:', resolvedIncidents);
};

// Example 6: Get verified incidents
export const exampleGetVerifiedIncidents = () => {
  const verified = getVerifiedIncidents();
  console.log('Verified incidents:', verified);
};

// Example 7: Get storage statistics
export const exampleGetStorageStats = () => {
  const stats = getStorageStats();
  console.log('Storage statistics:', stats);
  console.log(`Total: ${stats.totalIncidents}, Open: ${stats.openCount}, Verified: ${stats.verifiedCount}`);
  console.log(`Storage size: ${stats.storageSizeKB} KB`);
};

// Example 8: Delete an incident
export const exampleDeleteIncident = () => {
  const success = deleteIncident(1);
  console.log('Incident deleted:', success);
};

// Example 9: Merge incidents from backend
export const exampleMergeIncidents = () => {
  const backendIncidents = [
    {
      id: 2,
      type: 'medical',
      description: 'Heart attack at hospital',
      location: 'City Hospital',
      status: 'resolved',
      verified: true,
      timestamp: new Date().toISOString()
    },
    {
      id: 3,
      type: 'accident',
      description: 'Car accident on highway',
      location: 'Highway 101',
      status: 'in-progress',
      verified: false,
      timestamp: new Date().toISOString()
    }
  ];

  const merged = mergeIncidents(backendIncidents);
  console.log('Merged incidents:', merged);
};

// Example 10: Export incidents
export const exampleExportIncidents = () => {
  const jsonString = exportIncidents();
  console.log('Exported incidents:', jsonString);
  // Can be used to download or send to server
};

// Example 11: Import incidents
export const exampleImportIncidents = () => {
  const jsonString = `[
    {
      "id": 4,
      "type": "crime",
      "description": "Robbery at convenience store",
      "location": "Oak Street",
      "status": "open",
      "verified": false,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]`;

  const success = importIncidents(jsonString, true); // true = merge with existing
  console.log('Import successful:', success);
};

// Example 12: Clear all incidents
export const exampleClearAllIncidents = () => {
  const success = clearAllIncidents();
  console.log('All incidents cleared:', success);
};

// Example 13: Complete workflow
export const exampleCompleteWorkflow = () => {
  console.log('=== Complete Workflow Example ===');

  // 1. Save multiple incidents
  const incident1 = {
    id: 1,
    type: 'fire',
    description: 'House fire',
    location: '123 Main St',
    status: 'open',
    verified: false,
    timestamp: new Date().toISOString()
  };

  const incident2 = {
    id: 2,
    type: 'medical',
    description: 'Ambulance needed',
    location: '456 Oak Ave',
    status: 'in-progress',
    verified: true,
    timestamp: new Date().toISOString()
  };

  saveIncident(incident1);
  saveIncident(incident2);
  console.log('✓ Saved 2 incidents');

  // 2. Get all incidents
  let allIncidents = getIncidents();
  console.log(`✓ Retrieved ${allIncidents.length} incidents`);

  // 3. Update an incident
  updateIncident(1, { status: 'resolved', verified: true });
  console.log('✓ Updated incident 1');

  // 4. Get statistics
  const stats = getStorageStats();
  console.log(`✓ Stats: ${stats.totalIncidents} total, ${stats.verifiedCount} verified`);

  // 5. Filter by status
  const openIncidents = getIncidentsByStatus('open');
  console.log(`✓ Found ${openIncidents.length} open incidents`);

  // 6. Export for backup
  const backup = exportIncidents();
  console.log('✓ Exported incidents for backup');

  // 7. Clear and reimport
  clearAllIncidents();
  console.log('✓ Cleared all incidents');

  importIncidents(backup, false);
  console.log('✓ Reimported incidents from backup');

  // 8. Final check
  allIncidents = getIncidents();
  console.log(`✓ Final count: ${allIncidents.length} incidents`);
};
