const express = require("express");
const router = express.Router();
const partyController = require("../controllers/partyController");

// PartyOrg routes
router.get("/parties", partyController.getAllParties);
router.post("/parties", partyController.createParty);
router.get("/parties/:id", partyController.getPartyById);
router.put("/parties/:id", partyController.updateParty);
router.delete("/parties/:id", partyController.deleteParty);
router.get("/parties/type/:type", partyController.getPartyByType);

module.exports = router; 