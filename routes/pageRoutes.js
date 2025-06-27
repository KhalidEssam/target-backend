const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");

/**
 * @swagger
 * /pages:
 *   get:
 *     summary: Get all pages
 *     responses:
 *       200:
 *         description: List of pages
 *   post:
 *     summary: Create a new page
 *     responses:
 *       201:
 *         description: Page created
 * /pages/{slug}:
 *   get:
 *     summary: Get page sections by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page sections
 * /pages/name/{name}:
 *   get:
 *     summary: Get page by name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page data
 * /pages/{slug}/sections/{sectionId}:
 *   put:
 *     summary: Update section by ID
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Section updated
 *   delete:
 *     summary: Delete section by ID
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Section deleted
 * /pages/{slug}/sections:
 *   post:
 *     summary: Add section to page
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Section added
 */

// pages routes
router.get("/pages", pageController.getAllPages);
router.post("/pages", pageController.createPage);
router.get("/pages/:slug", pageController.getPageSections);
router.get("/pages/name/:name", pageController.getPageByName);
router.put("/pages/:slug/sections/:sectionId", pageController.updateSection);
router.post("/pages/:slug/sections", pageController.addSection);
router.delete("/pages/:slug/sections/:sectionId", pageController.deleteSection);

module.exports = router; 