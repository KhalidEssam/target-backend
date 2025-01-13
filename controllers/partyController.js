const PartyOrganization= require("../models/PartyOrg");

exports.getAllParties = async (req, res) => {
  try {
    console.log("Getting all party organizations...");
    const parties = await PartyOrganization.find();
    res.status(200).json(parties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPartyById = async (req, res) => {
  console.log("Getting party organization by ID...");
  try {
    const party = await PartyOrganization.findById(req.params.id);
    if (!party) {
      return res.status(404).json({ message: "Party organization not found" });
    }
    res.status(200).json(party);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createParty = async (req, res) => {
  try {
    const newParty = new PartyOrganization(req.body);
    const savedParty = await newParty.save();
    res.status(201).json(savedParty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



exports.updateParty = async (req, res) => {
  try {
    const updatedParty = await PartyOrganization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedParty) {
      return res.status(404).json({ message: "Party organization not found" });
    }
    res.status(200).json(updatedParty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



exports.deleteParty = async (req, res) => {
  try {
    const deletedParty = await PartyOrganization.findByIdAndDelete(req.params.id);
    if (!deletedParty) {
      return res.status(404).json({ message: "Party organization not found" });
    }
    res.status(200).json({ message: "Party organization deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getPartyByType = async (req, res) => {
  console.log("Getting party organization by type...");
  try {
    const party = await PartyOrganization.find({ type: req.params.type });
    if (!party) {
      return res.status(404).json({ message: "Party organization not found" });
    }
    res.status(200).json(party);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


