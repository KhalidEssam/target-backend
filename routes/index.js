// routes/index.js
const express = require("express");
const router = express.Router();
const authenticationRequired = require("../middleware/auth");




router.use("/", require("./partyRoutes"));
router.use("/", require("./supplyItems"));
router.use("/", require("./profileRoutes"));


// ✅ Protect all routes under `/api`
router.use("/", authenticationRequired);



router.use("/", require("./userRoutes"));
router.use("/", require("./orderRoutes"));
router.use("/", require("./galleryRoutes"));
router.use("/", require("./pageRoutes"));
router.use("/", require("./uploadRoutes"));
router.use("/", require("./paymentRoutes"));

module.exports = router;
