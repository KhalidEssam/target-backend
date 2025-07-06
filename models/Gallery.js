const mongoose = require('mongoose');

// Define Image sub-schema
const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false }); // Disable _id if you don't need it for each image

// Define UserGallery schema
const userGallerySchema = new mongoose.Schema({
  oktaUserId: { type: String, required: true, unique: true },
  imageUrls: [imageSchema],
  metadata: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
});

// Create and export the model
module.exports = mongoose.model('UserGallery', userGallerySchema);
