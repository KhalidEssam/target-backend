// routes/index.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// Import order controller
const orderController = require("../controllers/orderController");
// Import party controller
const partyController = require("../controllers/partyController");
// import profile info controller
const profileInfoController = require("../controllers/profileInfoController");

// import gallery controller
const galleryController = require("../controllers/galleryController");


// Import page controller
const pageController = require("../controllers/pageController");

// Import cloudinary controller

const upload = require("../config/cloudinaryConfig"); // Multer configuration
const uploaderController = require("../controllers/uploaderController");

// Home route
router.get("/", userController.home);

// Other routes for user-related actions (e.g., login, registration, etc.)
router.get("/user/:id", userController.getUser);

// Order Routes
router.get("/orders", orderController.getAllOrders);
router.post("/orders", orderController.createOrder);
router.get("/orders/:id", orderController.getOrderById);
router.put("/orders/:id", orderController.updateOrder);
router.delete("/orders/:id", orderController.deleteOrder);
// router.get('/orders/party/:phoneNumber', orderController.getOrdersByParty);
router.get("/orders/admin/:id", orderController.getOrdersByAdminId);
router.get(
  "/orders/party/:phoneNumber",
  orderController.getOrdersByParty_phoneNumber
);

// OrderItem routes
router.get("/orderItems", orderController.getAllOrderItems);
router.post("/orderItems", orderController.createOrderItem);
router.get("/orderItems/:id", orderController.getOrderItemById);
router.put("/orderItems/:id", orderController.updateOrderItem);
router.delete("/orderItems/:id", orderController.deleteOrderItem);

// PartyOrg routes
router.get("/parties", partyController.getAllParties);
router.post("/parties", partyController.createParty);
router.get("/parties/:id", partyController.getPartyById);
router.put("/parties/:id", partyController.updateParty);
router.delete("/parties/:id", partyController.deleteParty);
router.get("/parties/type/:type", partyController.getPartyByType);

// ProfileInfo routes
// router.get('/profile', profileInfoController.getProfileInfo);
router.post("/profile/:userId", profileInfoController.editProfileController);
router.post("/profiles/:userId", profileInfoController.editProfileControllers);
router.get("/profile/:userId", profileInfoController.getProfileData);
router.get("/profiles/:userId", profileInfoController.getProfileDatas);
router.post(
  "/profile-asign/:userId",
  profileInfoController.edit_User_Profile_App_Asignment_Controller
);

// Gallery routes
router.get("/galleries", galleryController.getAllGalleries);
router.post("/galleries/:id", galleryController.createGallery);
router.get("/galleries/:oktaUserId", galleryController.getGalleryByOktaId);
router.put("/galleries/:oktaUserId", galleryController.updateGallery);


// pages routes

router.get("/pages", pageController.getAllPages);
router.post("/pages", pageController.createPage);
router.get("/pages/:slug", pageController.getPageSections);
router.get("/pages/name/:name", pageController.getPageByName);
router.put("/pages/:slug/sections/:sectionId", pageController.updateSection);
router.post("/pages/:slug/sections", pageController.addSection);
router.delete("/pages/:slug/sections/:sectionId", pageController.deleteSection);

// cloudinary routes

// Route for uploading a single file
router.post(
  "/upload-single",
  upload.single("file"),
  uploaderController.uploadImage
);

// Route for uploading multiple files
router.post(
  "/upload-multiple",
  upload.array("files", 5),
  uploaderController.uploadImages
);

module.exports = router;
