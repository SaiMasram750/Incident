import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  getIncidentsByType,
  getIncidentsByStatusGrouped,
  getIncidentsByDate,
  getDetailedStats
} from '../utils/storageUtils';
import './StatisticsDashboard.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140'];
const STATUS_COLORS = {
  'Open': '#ffc107',
  'In Progress': '#17a2b8',
  'Resolved': '#28a745'
};

const StatisticsDashboard = ({ incidents }) => {
  const [typeData, setTypeData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [dateData, setDateData] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Update charts whenever incidents change
  useEffect(() => {
    updateCharts();
  }, [incidents]);

  const updateCharts = () => {
    try {
      const byType = getIncidentsByType();
      const byStatus = getIncidentsByStatusGrouped();
      const byDate = getIncidentsByDate();
      const detailedStats = getDetailedStats();

      setTypeData(byType);
      setStatusData(byStatus);
      setDateData(byDate);
      setStats(detailedStats);
    } catch (error) {
      console.error('Failed to update charts:', error);
    }
  };

  const renderCustomLabel = (entry) => {
    return `${entry.value}`;
  };

  return (
    <div className="statistics-dashboard">
      <div className="stats-header">
        <h2>Analytics & Statistics</h2>
        <div className="stats-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'detailed' ? 'active' : ''}`}
            onClick={() => setActiveTab('detailed')}
          >
            Detailed
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="stats-overview">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-label">Total Incidents</div>
              <div className="card-value">{stats?.total || 0}</div>
            </div>
            <div className="summary-card">
              <div className="card-label">Verified</div>
              <div className="card-value">{stats?.verified || 0}</div>
            </div>
            <div className="summary-card">
              <div className="card-label">Pending Verification</div>
              <div className="card-value">{stats?.unverified || 0}</div>
            </div>
            <div className="summary-card">
              <div className="card-label">Avg per Day</div>
              <div className="card-value">{stats?.averagePerDay || 0}</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            {/* Pie Chart - By Type */}
            <div className="chart-container">
              <h3>Incidents by Type</h3>
              {typeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">No incident data available</div>
              )}
            </div>

            {/* Bar Chart - By Status */}
            <div className="chart-container">
              <h3>Status Breakdown</h3>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" radius={[8, 8, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">No status data available</div>
              )}
            </div>
          </div>

          {/* Line Chart - Over Time */}
          <div className="chart-container full-width">
            <h3>Incidents Over Time</h3>
            {dateData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayDate" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#667eea"
                    strokeWidth={2}
                    dot={{ fill: '#667eea', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Incidents"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data">No time series data available</div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Tab */}
      {activeTab === 'detailed' && (
        <div className="stats-detailed">
          <div className="detailed-grid">
            {/* Type Breakdown */}
            <div className="detailed-section">
              <h3>Breakdown by Type</h3>
              <div className="breakdown-list">
                {typeData.length > 0 ? (
                  typeData.map((item, index) => (
                    <div key={index} className="breakdown-item">
                      <div className="breakdown-label">
                        <span
                          className="color-dot"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></span>
                        {item.type}
                      </div>
                      <div className="breakdown-value">{item.count}</div>
                    </div>
                  ))
                ) : (
                  <p>No data</p>
                )}
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="detailed-section">
              <h3>Breakdown by Status</h3>
              <div className="breakdown-list">
                {statusData.length > 0 ? (
                  statusData.map((item, index) => (
                    <div key={index} className="breakdown-item">
                      <div className="breakdown-label">
                        <span
                          className="color-dot"
                          style={{ backgroundColor: STATUS_COLORS[item.status] }}
                        ></span>
                        {item.status}
                      </div>
                      <div className="breakdown-value">{item.count}</div>
                    </div>
                  ))
                ) : (
                  <p>No data</p>
                )}
              </div>
            </div>

            {/* Verification Status */}
            <div className="detailed-section">
              <h3>Verification Status</h3>
              <div className="breakdown-list">
                <div className="breakdown-item">
                  <div className="breakdown-label">
                    <span className="color-dot" style={{ backgroundColor: '#28a745' }}></span>
                    Verified
                  </div>
                  <div className="breakdown-value">{stats?.verified || 0}</div>
                </div>
                <div className="breakdown-item">
                  <div className="breakdown-label">
                    <span className="color-dot" style={{ backgroundColor: '#ffc107' }}></span>
                    Pending
                  </div>
                  <div className="breakdown-value">{stats?.unverified || 0}</div>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="detailed-section">
              <h3>Summary</h3>
              <div className="summary-list">
                <div className="summary-item">
                  <span>Total Incidents:</span>
                  <strong>{stats?.total || 0}</strong>
                </div>
                <div className="summary-item">
                  <span>Days with Incidents:</span>
                  <strong>{dateData.length || 0}</strong>
                </div>
                <div className="summary-item">
                  <span>Avg per Day:</span>
                  <strong>{stats?.averagePerDay || 0}</strong>
                </div>
                <div className="summary-item">
                  <span>Verification Rate:</span>
                  <strong>
                    {stats?.total > 0
                      ? ((stats.verified / stats.total) * 100).toFixed(1)
                      : 0}
                    %
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsDashboard;
