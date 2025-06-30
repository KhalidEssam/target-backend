// app.js
require('dotenv').config(); // FIRST
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimiter = require('./config/rateLimiter');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const http = require('http');
const { handlePaymentWebhook, handleWebSocket } = require('./controllers/webhookController');

const app = express();

const server = http.createServer(app);
const db = require('./config/db');

// Connect to DB
db();

// Rate limiter
app.use(rateLimiter);
app.set('trust proxy', true);

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
app.use(morgan('dev'));

// Parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Webhook route for PayMob
app.post('/api/webhook/paymob', handlePaymentWebhook);

// WebSocket upgrade handler on /api/websocket
server.on('upgrade', (request, socket, head) => {
  if (request.url === '/api/websocket') {
    handleWebSocket(request, socket, head);
  } else {
    socket.destroy();
  }
});

// WebSocket route
app.get('/api/websocket', handleWebSocket);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API',
      version: '1.0.0',
      description: 'API documentation for the Express backend',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found'
  });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;