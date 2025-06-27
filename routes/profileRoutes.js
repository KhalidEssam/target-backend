const express = require("express");
const router = express.Router();
const profileInfoController = require("../controllers/profileInfoController");

/**
 * @swagger
 * /profile/{userId}:
 *   post:
 *     summary: Edit profile info
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *   get:
 *     summary: Get profile data
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile data
 * /profiles/{userId}:
 *   post:
 *     summary: Edit profile info (alternate)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *   get:
 *     summary: Get profile data (alternate)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile data
 * /profile-asign/{userId}:
 *   post:
 *     summary: Assign user profile
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile assigned
 */

// ProfileInfo routes
router.post("/profile/:userId", profileInfoController.editProfileController);
router.post("/profiles/:userId", profileInfoController.editProfileControllers);
router.get("/profile/:userId", profileInfoController.getProfileData);
router.get("/profiles/:userId", profileInfoController.getProfileDatas);
router.post("/profile-asign/:userId", profileInfoController.edit_User_Profile_App_Asignment_Controller);

module.exports = router; 