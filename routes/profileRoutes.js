const express = require("express");
const router = express.Router();
const profileInfoController = require("../controllers/profileInfoController");

// ProfileInfo routes
router.post("/profile/:userId", profileInfoController.editProfileController);
router.post("/profiles/:userId", profileInfoController.editProfileControllers);
router.get("/profile/:userId", profileInfoController.getProfileData);
router.get("/profiles/:userId", profileInfoController.getProfileDatas);
router.post("/profile-asign/:userId", profileInfoController.edit_User_Profile_App_Asignment_Controller);

module.exports = router; 