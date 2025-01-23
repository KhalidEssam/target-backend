const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");


// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });


// Configure Multer-Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "order-items", // Folder name in Cloudinary
      allowed_formats: ["jpg", "png", "jpeg"], // Allowed file formats
    },
  });

// Multer middleware
const upload = multer({ storage });

module.exports = upload;