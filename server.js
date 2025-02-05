const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const app = express();

// Environment configuration
const port = process.env.PORT || 5500;
const isProduction = process.env.NODE_ENV === 'production';

// Security middleware
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'"]
  }
}));

// Performance optimization
app.use(compression());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: isProduction ? 31536000000 : 0, // 1 year in production
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Force HTTPS in production
if (isProduction) {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running in ${isProduction ? 'production' : 'development'} mode`);
  console.log(`Listening on port ${port}`);
});

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./messages.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite database');
  
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;