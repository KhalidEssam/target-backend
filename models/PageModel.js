const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["text", "image", "slider", "gallery"], required: true },
  content: mongoose.Schema.Types.Mixed,
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
});

const PageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  sections: [SectionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PageModel = mongoose.model("Page", PageSchema);

module.exports = PageModel; // ✅ Ensure this is `module.exports`
