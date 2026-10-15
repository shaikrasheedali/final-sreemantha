const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

const apiRouter = require('./routes');
const openapiSpec = require('./openapi/openapi.json');
const { uploadDir } = require('./controllers/mediaController');
const { logger, requestCorrelationMiddleware } = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Request ID and HTTP access correlation logger
app.use(requestCorrelationMiddleware);

// Security and middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow iframes for Instagram, YouTube, Facebook and local SVGs
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve uploaded media with high performance client and proxy caching
app.use(
  '/uploads',
  express.static(uploadDir, {
    maxAge: '30d',
    immutable: true,
  })
);

// Fallback image serving: checks both uploads and frontend public images
const frontendPublicImages = path.resolve(__dirname, '../../frontend/public/images');
app.use(
  '/images',
  express.static(uploadDir, { maxAge: '30d' }),
  express.static(frontendPublicImages, { maxAge: '30d' })
);

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

// Explicit search engine indexing endpoints & web manifest
app.get('/robots.txt', (req, res) => {
  const robotsPath = path.resolve(__dirname, '../../frontend/public/robots.txt');
  if (fs.existsSync(robotsPath)) return res.type('text/plain').sendFile(robotsPath);
  res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: /sitemap.xml\n');
});

app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.resolve(__dirname, '../../frontend/public/sitemap.xml');
  if (fs.existsSync(sitemapPath)) return res.type('application/xml').sendFile(sitemapPath);
  res.status(404).send('Sitemap not found');
});

app.get('/site.webmanifest', (req, res) => {
  const manifestPaths = [
    path.resolve(__dirname, '../../frontend/dist/site.webmanifest'),
    path.resolve(__dirname, '../../frontend/public/site.webmanifest'),
    path.resolve(__dirname, '../../site.webmanifest'),
  ];
  for (const p of manifestPaths) {
    if (fs.existsSync(p)) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.type('application/manifest+json').sendFile(p);
    }
  }
  res.status(404).send('Manifest not found');
});

// Mount main API router
app.use('/api', apiRouter);

// API 404 handler
app.use(notFoundHandler);

// Serve frontend production build if present (Single Port Full Stack Serving)
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  logger.info(`Serving production frontend build from: ${frontendDistPath}`, {}, 'SERVER');
  app.use(express.static(frontendDistPath));

  // SPA fallback for all other GET routes
  app.use((req, res, next) => {
    if (
      req.method === 'GET' &&
      !req.path.startsWith('/api') &&
      !req.path.startsWith('/uploads') &&
      !req.path.startsWith('/images')
    ) {
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

// Enterprise centralized error handler
app.use(errorHandler);

module.exports = app;
