const mongoose = require('mongoose');

// Define UserGallery schema
const userGallerySchema = new mongoose.Schema({
  oktaUserId: { type: String, required: true, unique: true },
  imageUrls: [{ type: String }],
  metadata: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
});

// Create and export the model
module.exports = mongoose.model('UserGallery', userGallerySchema);


