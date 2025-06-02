// server.js (or index.js)
import express from 'express';
import cors from 'cors';
import axios from 'axios'; // ✅ Required for PageSpeed API
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  getIPInfo,
  getPingResult,
  getSSLInfo,
  getDNSRecords,
  getPortInfo,
  getSecurityHeaders,
  getMalwareInfo,
  getCookieInfo
} from './controllers/scannerController.js';

import scannerRoutes from './routes/scannerRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));
app.use('/screenshots', express.static(join(__dirname, 'controllers/screenshots')));

// PageSpeed API Route
app.get('/api/pagespeed', async (req, res) => {
  const { url } = req.query;
  const apiKey = "AIzaSyB7hhMFUBsdbd7FL7uaZN5q-r4orJBwnAQ";

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  console.log(`Fetching PageSpeed data for URL: ${url}`);

  try {
    const response = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching PageSpeed data:', error.message);
    res.status(500).json({ error: 'Failed to fetch PageSpeed data' });
  }
});

// API Routes
app.use('/api', scannerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Internal error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API accessible at http://localhost:${PORT}/api`);
});
