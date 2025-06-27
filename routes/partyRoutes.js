const express = require("express");
const router = express.Router();
const partyController = require("../controllers/partyController");

/**
 * @swagger
 * /parties:
 *   get:
 *     summary: Get all parties
 *     responses:
 *       200:
 *         description: List of parties
 *   post:
 *     summary: Create a new party
 *     responses:
 *       201:
 *         description: Party created
 * /parties/{id}:
 *   get:
 *     summary: Get party by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Party data
 *   put:
 *     summary: Update party by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Party updated
 *   delete:
 *     summary: Delete party by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Party deleted
 * /parties/type/{type}:
 *   get:
 *     summary: Get parties by type
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parties by type
 */

// PartyOrg routes
router.get("/parties", partyController.getAllParties);
router.post("/parties", partyController.createParty);
router.get("/parties/:id", partyController.getPartyById);
router.put("/parties/:id", partyController.updateParty);
router.delete("/parties/:id", partyController.deleteParty);
router.get("/parties/type/:type", partyController.getPartyByType);

module.exports = router; 