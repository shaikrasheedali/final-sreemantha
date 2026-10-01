const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

const apiRouter = require('./routes');
const openapiSpec = require('./openapi/openapi.json');
const { uploadDir } = require('./controllers/mediaController');

const app = express();

// Security and middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow iframes for Instagram, YouTube, Facebook and local SVGs
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded media
app.use('/uploads', express.static(uploadDir));

// Swagger UI API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get('/api/docs.json', (req, res) => res.json(openapiSpec));

// Ensure all API endpoints provide real-time database data without browser caching
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Mount main API router
app.use('/api', apiRouter);

// Serve frontend production build if present (Single Port Full Stack Serving)
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  console.log('[Server] Serving production frontend build from:', frontendDistPath);
  app.use(express.static(frontendDistPath));

  // SPA fallback for all other GET routes
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
    next();
  });
} else {
  // If frontend is not built yet (dev mode)
  app.get('/', (req, res) => {
    res.json({
      message: 'Sreemantha Hospital Backend API is running.',
      apiDocs: '/api/docs',
      health: '/api/health',
      frontendNote: 'Build the frontend with "npm run build" to serve the SPA on this port.',
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err);
  const status = err.status || 500;
  return res.status(status).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
