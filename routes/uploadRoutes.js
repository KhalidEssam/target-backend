const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinaryConfig"); // Multer configuration
const uploaderController = require("../controllers/uploaderController");

// Route for uploading a single file
router.post("/upload-single", upload.single("file"), uploaderController.uploadImage);

// Route for uploading multiple files
router.post("/upload-multiple", upload.array("files", 5), uploaderController.uploadImages);

module.exports = router; 