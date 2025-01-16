// app.js
const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const dotenv = require('dotenv');
const app = express();
const db = require('./config/db');
const cors = require('cors');

app.use(cors());

// Connect to database
db();

// Load environment variables
dotenv.config();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for serving static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing request body (form data, JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import routes
const indexRoutes = require('./routes/index');

// Use routes
app.use('/', indexRoutes);

//cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
