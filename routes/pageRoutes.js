const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");

// pages routes
router.get("/pages", pageController.getAllPages);
router.post("/pages", pageController.createPage);
router.get("/pages/:slug", pageController.getPageSections);
router.get("/pages/name/:name", pageController.getPageByName);
router.put("/pages/:slug/sections/:sectionId", pageController.updateSection);
router.post("/pages/:slug/sections", pageController.addSection);
router.delete("/pages/:slug/sections/:sectionId", pageController.deleteSection);

module.exports = router; 