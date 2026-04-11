// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./backend/config/db');
const cors = require('cors');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS

// Routes
const authRoutes = require('./backend/routes/auth');
const settingsRoutes = require('./backend/routes/settings');
const classesRoutes = require('./backend/routes/classes');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/classes', classesRoutes);

// Simple root route
app.get('/', (req, res) => res.send('API is running...'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});