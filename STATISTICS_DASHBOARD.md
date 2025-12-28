# Statistics Dashboard - Complete Documentation

## Overview

A comprehensive analytics and visualization component for the incident management system. Displays incident data through interactive charts and detailed statistics using Recharts library.

---

## Features

### Charts
1. **Pie Chart** - Incident count by type (Fire, Medical, Accident, Crime, Other)
2. **Bar Chart** - Status breakdown (Open, In Progress, Resolved)
3. **Line Chart** - Incidents over time (grouped by day)

### Tabs
- **Overview Tab** - Visual charts and summary cards
- **Detailed Tab** - Breakdown tables and statistics

### Responsive Design
- Desktop: Full-width charts with grid layout
- Tablet: Adjusted grid columns
- Mobile: Single column layout

---

## Components

### StatisticsDashboard.jsx

Main component that displays all charts and statistics.

**Props:**
```javascript
{
  incidents: Array  // Array of incident objects from localStorage
}
```

**Features:**
- Real-time chart updates
- Tab switching
- Summary cards
- Multiple chart types
- Detailed breakdown tables

**Usage:**
```jsx
import StatisticsDashboard from './components/StatisticsDashboard';

<StatisticsDashboard incidents={incidents} />
```

---

## Utility Functions

### getIncidentsByType()
Groups incidents by type and returns count.

**Returns:**
```javascript
[
  { type: "Fire", count: 5, value: 5 },
  { type: "Medical", count: 3, value: 3 },
  { type: "Accident", count: 2, value: 2 }
]
```

**Usage:**
```javascript
import { getIncidentsByType } from './utils/storageUtils';

const typeData = getIncidentsByType();
```

### getIncidentsByStatus()
Groups incidents by status.

**Returns:**
```javascript
[
  { status: "Open", count: 4, value: 4 },
  { status: "In Progress", count: 3, value: 3 },
  { status: "Resolved", count: 3, value: 3 }
]
```

**Usage:**
```javascript
import { getIncidentsByStatus } from './utils/storageUtils';

const statusData = getIncidentsByStatus();
```

### getIncidentsByDate()
Groups incidents by date (YYYY-MM-DD format).

**Returns:**
```javascript
[
  { date: "2024-01-15", count: 2, displayDate: "Jan 15" },
  { date: "2024-01-16", count: 3, displayDate: "Jan 16" },
  { date: "2024-01-17", count: 2, displayDate: "Jan 17" }
]
```

**Usage:**
```javascript
import { getIncidentsByDate } from './utils/storageUtils';

const dateData = getIncidentsByDate();
```

### getDetailedStats()
Returns comprehensive statistics object.

**Returns:**
```javascript
{
  total: 10,
  byType: [...],
  byStatus: [...],
  byDate: [...],
  verified: 7,
  unverified: 3,
  averagePerDay: "2.50"
}
```

**Usage:**
```javascript
import { getDetailedStats } from './utils/storageUtils';

const stats = getDetailedStats();
```

---

## Chart Types

### Pie Chart (By Type)
- **Data:** Incident count by type
- **Colors:** 8 distinct colors
- **Labels:** Type name and count
- **Interaction:** Hover for details

### Bar Chart (By Status)
- **Data:** Incident count by status
- **Colors:** Status-specific colors
  - Open: #ffc107 (yellow)
  - In Progress: #17a2b8 (blue)
  - Resolved: #28a745 (green)
- **Interaction:** Hover for details

### Line Chart (Over Time)
- **Data:** Incidents per day
- **Color:** #667eea (purple)
- **Points:** Interactive dots
- **Interaction:** Hover for details

---

## Overview Tab

### Summary Cards
Four cards displaying key metrics:
1. **Total Incidents** - Total count
2. **Verified** - Verified incidents
3. **Pending Verification** - Unverified incidents
4. **Avg per Day** - Average incidents per day

### Charts
1. Pie chart (incidents by type)
2. Bar chart (status breakdown)
3. Line chart (incidents over time)

---

## Detailed Tab

### Breakdown by Type
- List of incident types with counts
- Color-coded dots
- Sortable by count

### Breakdown by Status
- List of statuses with counts
- Color-coded dots
- Status-specific colors

### Verification Status
- Verified count
- Pending count
- Verification rate

### Summary Statistics
- Total incidents
- Days with incidents
- Average per day
- Verification rate (%)

---

## Styling

### Colors
```javascript
// Chart colors
COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140']

// Status colors
STATUS_COLORS = {
  'Open': '#ffc107',
  'In Progress': '#17a2b8',
  'Resolved': '#28a745'
}
```

### Responsive Breakpoints
- **Desktop:** 1024px+ (2-column grid)
- **Tablet:** 768px-1023px (1-column grid)
- **Mobile:** <768px (single column, adjusted fonts)

---

## Integration

### With IncidentDashboard
The StatisticsDashboard is integrated into the main IncidentDashboard component.

**Location:** Between report form and incidents table

**Data Flow:**
```
IncidentDashboard
  ↓
incidents state
  ↓
StatisticsDashboard
  ↓
Charts & Statistics
```

**Usage:**
```jsx
import StatisticsDashboard from './StatisticsDashboard';

<StatisticsDashboard incidents={incidents} />
```

---

## Real-Time Updates

Charts automatically update when:
- New incident is created
- Incident status is updated
- Incident is verified
- Page is reloaded

**Update Mechanism:**
```javascript
useEffect(() => {
  updateCharts();
}, [incidents]);
```

---

## Data Flow

### 1. Data Retrieval
```
localStorage['incidents']
  ↓
getIncidents()
  ↓
Incident array
```

### 2. Data Processing
```
Incident array
  ↓
getIncidentsByType()
getIncidentsByStatus()
getIncidentsByDate()
getDetailedStats()
  ↓
Processed data
```

### 3. Chart Rendering
```
Processed data
  ↓
Recharts components
  ↓
Visual charts
```

---

## Performance Considerations

### Optimization
- Memoization of chart data
- Efficient data grouping
- Minimal re-renders
- Lazy loading of charts

### Scalability
- Handles 1000+ incidents
- Smooth animations
- Responsive to large datasets
- Efficient sorting and filtering

---

## Browser Compatibility

Works in all modern browsers supporting:
- ES6+ JavaScript
- React 18+
- Recharts library
- CSS Grid/Flexbox

---

## Dependencies

### Required
- React 18+
- Recharts 2.10+

### Installation
```bash
npm install recharts
```

---

## Customization

### Change Colors
```javascript
const COLORS = ['#your-color-1', '#your-color-2', ...];
const STATUS_COLORS = {
  'Open': '#your-color',
  'In Progress': '#your-color',
  'Resolved': '#your-color'
};
```

### Add New Chart Type
```javascript
// Add to StatisticsDashboard.jsx
<ResponsiveContainer width="100%" height={300}>
  <YourChartType data={yourData}>
    {/* Chart configuration */}
  </YourChartType>
</ResponsiveContainer>
```

### Modify Summary Cards
```javascript
// Add new card in summary-cards section
<div className="summary-card">
  <div className="card-label">Your Label</div>
  <div className="card-value">{yourValue}</div>
</div>
```

---

## Troubleshooting

### Charts Not Displaying
- Check if incidents exist in localStorage
- Verify Recharts is installed
- Check browser console for errors

### Data Not Updating
- Verify incidents state is being updated
- Check useEffect dependency array
- Ensure localStorage is enabled

### Responsive Issues
- Check CSS media queries
- Verify viewport meta tag
- Test on actual devices

### Performance Issues
- Reduce number of incidents displayed
- Optimize chart rendering
- Use React.memo for components

---

## Examples

### Example 1: Display Type Statistics
```javascript
const typeData = getIncidentsByType();
console.log(typeData);
// Output: [
//   { type: "Fire", count: 5, value: 5 },
//   { type: "Medical", count: 3, value: 3 }
// ]
```

### Example 2: Get Verification Rate
```javascript
const stats = getDetailedStats();
const verificationRate = (stats.verified / stats.total) * 100;
console.log(`Verification Rate: ${verificationRate}%`);
```

### Example 3: Filter Incidents by Date
```javascript
const dateData = getIncidentsByDate();
const recentIncidents = dateData.slice(-7); // Last 7 days
```

---

## Future Enhancements

1. **Export Charts** - Download as PNG/PDF
2. **Custom Date Range** - Filter by date range
3. **Advanced Filters** - Filter by type, status, etc.
4. **Comparison Charts** - Compare periods
5. **Heatmaps** - Show incident density
6. **Predictions** - Forecast future incidents
7. **Alerts** - Alert on anomalies
8. **Custom Reports** - Generate reports
9. **Data Export** - Export to CSV/Excel
10. **Real-time Updates** - WebSocket integration

---

## API Reference

### getIncidentsByType()
```javascript
getIncidentsByType(): Array<{type: string, count: number, value: number}>
```

### getIncidentsByStatus()
```javascript
getIncidentsByStatus(): Array<{status: string, count: number, value: number}>
```

### getIncidentsByDate()
```javascript
getIncidentsByDate(): Array<{date: string, count: number, displayDate: string}>
```

### getDetailedStats()
```javascript
getDetailedStats(): {
  total: number,
  byType: Array,
  byStatus: Array,
  byDate: Array,
  verified: number,
  unverified: number,
  averagePerDay: string
}
```

---

## Best Practices

1. **Always check data exists** before rendering charts
2. **Use responsive containers** for mobile support
3. **Optimize data processing** for large datasets
4. **Handle errors gracefully** with try-catch
5. **Update charts on data change** using useEffect
6. **Use meaningful colors** for data visualization
7. **Provide fallback UI** when no data available
8. **Test on multiple devices** for responsiveness

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify localStorage has incident data
3. Ensure Recharts is properly installed
4. Check component props are correct
5. Review documentation examples

---

## Summary

The Statistics Dashboard provides:
- ✅ Interactive charts
- ✅ Real-time updates
- ✅ Responsive design
- ✅ Detailed statistics
- ✅ Multiple visualization types
- ✅ Easy integration
- ✅ Customizable styling
- ✅ Performance optimized

Ready to use and extend!

