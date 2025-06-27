const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryController");

/**
 * @swagger
 * /galleries:
 *   get:
 *     summary: Get all galleries
 *     responses:
 *       200:
 *         description: List of galleries
 * /galleries/{id}:
 *   post:
 *     summary: Create a new gallery
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Gallery created
 * /galleries/{oktaUserId}:
 *   get:
 *     summary: Get gallery by Okta user ID
 *     parameters:
 *       - in: path
 *         name: oktaUserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gallery data
 *   put:
 *     summary: Update gallery by Okta user ID
 *     parameters:
 *       - in: path
 *         name: oktaUserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gallery updated
 */

// Gallery routes
router.get("/galleries", galleryController.getAllGalleries);
router.post("/galleries/:id", galleryController.createGallery);
router.get("/galleries/:oktaUserId", galleryController.getGalleryByOktaId);
router.put("/galleries/:oktaUserId", galleryController.updateGallery);

module.exports = router; 