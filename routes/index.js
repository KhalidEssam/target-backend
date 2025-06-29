// routes/index.js
const express = require("express");
const router = express.Router();

router.use("/", require("./userRoutes"));
router.use("/", require("./orderRoutes"));
router.use("/", require("./partyRoutes"));
router.use("/", require("./profileRoutes"));
router.use("/", require("./galleryRoutes"));
router.use("/", require("./pageRoutes"));
router.use("/", require("./uploadRoutes"));
router.use("/", require("./paymentRoutes"));

module.exports = router;
