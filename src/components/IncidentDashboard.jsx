import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
  saveIncident,
  getIncidents,
  updateIncident,
  getStorageStats,
  mergeIncidents,
  canReportIncident,
  canUpdateIncident
} from '../utils/storageUtils';
import { API_URL, getApiUrl, API_ENDPOINTS } from '../config/apiConfig';
import StatisticsDashboard from './StatisticsDashboard';
import './IncidentDashboard.css';

const IncidentDashboard = ({ currentUser, onLogout }) => {
  const [incidents, setIncidents] = useState([]);
  const [socket, setSocket] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Initialize Socket.IO and fetch incidents on mount
  useEffect(() => {
    const initSocket = io(API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
    setSocket(initSocket);

    // Listen for new incidents
    initSocket.on('incident:new', (incident) => {
      saveIncident(incident);
      setIncidents(prev => {
        const updated = [incident, ...prev];
        return updated;
      });
      showMessage('New incident reported!', 'success');
    });

    // Listen for incident updates
    initSocket.on('incident:update', (updatedIncident) => {
      updateIncident(updatedIncident.id, updatedIncident);
      setIncidents(prev => {
        const updated = prev.map(i => 
          i.id === updatedIncident.id ? updatedIncident : i
        );
        return updated;
      });
      showMessage('Incident updated!', 'success');
    });

    // Load incidents from backend and localStorage
    loadIncidents();

    return () => {
      initSocket.disconnect();
    };
  }, []);

  // Fetch incidents from backend
  const loadIncidents = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(API_ENDPOINTS.INCIDENTS));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch incidents: ${response.statusText}`);
      }

      const backendIncidents = await response.json();

      // Merge backend incidents with localStorage
      const merged = mergeIncidents(backendIncidents);
      setIncidents(merged);
    } catch (error) {
      console.error('Failed to load incidents:', error);
      // Fall back to localStorage
      const cached = getIncidents();
      setIncidents(cached);
      showMessage('Using cached data (backend unavailable)', 'info');
    } finally {
      setLoading(false);
    }
  };

  // Save incidents to localStorage
  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  // Get incidents from localStorage
  const getFromLocalStorage = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return [];
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit new incident
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.type || !formData.description || !formData.location) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.CREATE_INCIDENT), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ type: '', description: '', location: '' });
        showMessage('Incident reported successfully', 'success');
        // Socket.IO will broadcast the new incident
      } else {
        const data = await response.json();
        showMessage(data.message || 'Failed to create incident', 'error');
      }
    } catch (error) {
      showMessage('Error: ' + error.message, 'error');
    }
  };

  // Update incident status
  const updateIncidentStatus = async (id, status) => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.UPDATE_INCIDENT(id)), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        showMessage('Failed to update status', 'error');
      } else {
        // Update in localStorage
        updateIncident(id, { status });
        // Socket.IO will broadcast the update
      }
    } catch (error) {
      showMessage('Error: ' + error.message, 'error');
    }
  };

  // Verify incident
  const verifyIncident = async (id) => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.UPDATE_INCIDENT(id)), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: true })
      });

      if (!response.ok) {
        showMessage('Failed to verify incident', 'error');
      } else {
        // Update in localStorage
        updateIncident(id, { verified: true });
        // Socket.IO will broadcast the update
      }
    } catch (error) {
      showMessage('Error: ' + error.message, 'error');
    }
  };

  // Show message notification
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Calculate statistics
  const stats = {
    total: incidents.length,
    open: incidents.filter(i => i.status === 'open').length,
    inProgress: incidents.filter(i => i.status === 'in-progress').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    verified: incidents.filter(i => i.verified).length
  };

  return (
    <div className="incident-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Incident Management Dashboard</h1>
            <p>Real-time incident tracking and management</p>
          </div>
          <div className="header-user-info">
            <div className="user-badge">
              <span className="user-role" data-role={currentUser.role}>
                {currentUser.role.toUpperCase()}
              </span>
              <span className="user-name">{currentUser.username}</span>
            </div>
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="dashboard-container">
        {/* Report Form - Only for Citizens */}
        {canReportIncident() && (
          <section className="form-section">
            <h2>Report New Incident</h2>
            <form onSubmit={handleSubmit} className="incident-form">
              <div className="form-group">
                <label htmlFor="type">Incident Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select type...</option>
                  <option value="fire">Fire</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="accident">Traffic Accident</option>
                  <option value="crime">Crime</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the incident in detail..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Street address or coordinates..."
                  required
                />
              </div>

              <button type="submit" className="btn-submit">Report Incident</button>
            </form>
          </section>
        )}

        {/* Statistics Dashboard */}
        <StatisticsDashboard incidents={incidents} />

        {/* Statistics */}
        <section className="stats-section">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Incidents</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.open}</div>
              <div className="stat-label">Open</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.verified}</div>
              <div className="stat-label">Verified</div>
            </div>
          </div>
        </section>

        {/* Incidents Table */}
        <section className="table-section">
          <h2>Incidents</h2>
          {loading ? (
            <div className="loading">Loading incidents...</div>
          ) : incidents.length === 0 ? (
            <div className="empty-state">No incidents yet. Create one to get started.</div>
          ) : (
            <div className="table-wrapper">
              <table className="incidents-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Verified</th>
                    <th>Timestamp</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map(incident => (
                    <tr key={incident.id} className={`status-${incident.status}`}>
                      <td className="id-cell">#{incident.id}</td>
                      <td className="type-cell">
                        <span className="type-badge">{incident.type.toUpperCase()}</span>
                      </td>
                      <td className="description-cell">{incident.description}</td>
                      <td className="location-cell">{incident.location}</td>
                      <td className="status-cell">
                        {canUpdateIncident() ? (
                          <select
                            value={incident.status}
                            onChange={(e) => updateIncidentStatus(incident.id, e.target.value)}
                            className={`status-select status-${incident.status}`}
                          >
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        ) : (
                          <span className={`status-badge status-${incident.status}`}>
                            {incident.status.toUpperCase()}
                          </span>
                        )}
                      </td>
                      <td className="verified-cell">
                        {incident.verified ? (
                          <span className="verified-badge">✓ Yes</span>
                        ) : canUpdateIncident() ? (
                          <button
                            className="btn-verify"
                            onClick={() => verifyIncident(incident.id)}
                          >
                            Verify
                          </button>
                        ) : (
                          <span className="unverified-badge">Pending</span>
                        )}
                      </td>
                      <td className="timestamp-cell">
                        {new Date(incident.timestamp).toLocaleString()}
                      </td>
                      <td className="actions-cell">
                        <span className="action-info">
                          {incident.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default IncidentDashboard;
