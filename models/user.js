// models/user.js
const { Schema, model } = require('mongoose');

// Define user schema
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create and export the model
module.exports = model('User', userSchema);
