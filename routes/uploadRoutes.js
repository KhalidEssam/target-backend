const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinaryConfig"); // Multer configuration
const uploaderController = require("../controllers/uploaderController");

/**
 * @swagger
 * /upload-single:
 *   post:
 *     summary: Upload a single file
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded
 * /upload-multiple:
 *   post:
 *     summary: Upload multiple files
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded
 */

// Route for uploading a single file
router.post("/upload-single", upload.single("file"), uploaderController.uploadImage);

// Route for uploading multiple files
router.post("/upload-multiple", upload.array("files", 5), uploaderController.uploadImages);

module.exports = router; 