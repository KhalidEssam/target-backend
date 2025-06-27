const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Home route
router.get("/", userController.home);
// Other routes for user-related actions (e.g., login, registration, etc.)
router.get("/user/:id", userController.getUser);

module.exports = router; 