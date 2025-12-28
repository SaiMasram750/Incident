import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage
let incidents = [];
let incidentIdCounter = 1;

// Helper function to generate unique ID
function generateId() {
  return incidentIdCounter++;
}

// Routes
app.get('/', (req, res) => {
  res.send('Incident Management Server');
});

// POST /incident - Create new incident
app.post('/incident', (req, res) => {
  try {
    const { type, description, location } = req.body;

    if (!type || !description || !location) {
      return res.status(400).json({ 
        message: 'Missing required fields: type, description, location' 
      });
    }

    const incident = {
      id: generateId(),
      type,
      description,
      location,
      status: 'open',
      verified: false,
      timestamp: new Date().toISOString()
    };

    incidents.push(incident);

    // Broadcast to all connected clients
    io.emit('incident:new', incident);

    res.status(201).json({
      message: 'Incident created successfully',
      incident
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to create incident', 
      error: error.message 
    });
  }
});

// GET /incidents - Return all incidents sorted by timestamp
app.get('/incidents', (req, res) => {
  try {
    const sorted = [...incidents].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch incidents', 
      error: error.message 
    });
  }
});

// GET /incident/:id - Get single incident
app.get('/incident/:id', (req, res) => {
  try {
    const incident = incidents.find(i => i.id === parseInt(req.params.id));

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(incident);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch incident', 
      error: error.message 
    });
  }
});

// PATCH /incident/:id - Update incident status or verification
app.patch('/incident/:id', (req, res) => {
  try {
    const { status, verified } = req.body;
    const incident = incidents.find(i => i.id === parseInt(req.params.id));

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    if (status && ['open', 'in-progress', 'resolved'].includes(status)) {
      incident.status = status;
    }

    if (typeof verified === 'boolean') {
      incident.verified = verified;
    }

    // Broadcast update to all connected clients
    io.emit('incident:update', incident);

    res.json({
      message: 'Incident updated successfully',
      incident
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update incident', 
      error: error.message 
    });
  }
});

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send all incidents to newly connected client
  socket.emit('incidents:load', incidents);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
