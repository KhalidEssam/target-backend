const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryController");

// Gallery routes
router.get("/galleries", galleryController.getAllGalleries);
router.post("/galleries/:id", galleryController.createGallery);
router.get("/galleries/:oktaUserId", galleryController.getGalleryByOktaId);
router.put("/galleries/:oktaUserId", galleryController.updateGallery);

module.exports = router; 