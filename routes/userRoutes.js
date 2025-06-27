const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/**
 * @swagger
 * /:
 *   get:
 *     summary: Home route
 *     responses:
 *       200:
 *         description: Returns the home page
 *
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 */
// Home route
router.get("/", userController.home);
// Other routes for user-related actions (e.g., login, registration, etc.)
router.get("/user/:id", userController.getUser);

module.exports = router; 