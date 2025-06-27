const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    status: 429,
    error: 'Too many requests, please try again later.'
  }
});

module.exports = limiter; 