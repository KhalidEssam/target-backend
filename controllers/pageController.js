const PageModel = require("../models/PageModel");

// Get all pages
exports.getAllPages = async (req, res) => {
  try {
    const pages = await PageModel.find();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: "Error fetching pages" });
  }
};

// Get page by name
exports.getPageByName = async (req, res) => {
  const isVisible= true;
    try {
      const { name } = req.params;
      const page = await PageModel.findOne({ name  });
  
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      const visibleSections = page.sections.filter(section => section.isVisible);
  
      res.json({ ...page.toObject(), sections: visibleSections });
    } catch (err) {
      console.error("Error fetching page:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

// create a page

exports.createPage = async (req, res) => {
    try {
      console.log("Incoming request to create page:", req.body);
  
      const { name, slug } = req.body;
      if (!name || !slug) {
        return res.status(400).json({ error: "Page name and slug are required" });
      }
  
      console.log("Creating page...");
  
      // Check if page already exists
      const existingPage = await PageModel.findOne({ slug });
      console.log("Page is existing", existingPage?.slug); // Should log existing page or undefined
  
      if (existingPage) {
        return res.status(400).json({ error: "Page with this slug already exists" });
      }
  
      const newPage = new PageModel({
        name,
        slug,
        sections: [],
      });
  
      await newPage.save();
      res.json(newPage);
    } catch (err) {
      console.error("Error in createPage:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

// Get sections of a specific page
exports.getPageSections = async (req, res) => {
  try {
    const page = await PageModel.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: "Page not found" });

    res.json(page.sections);
  } catch (err) {
    res.status(500).json({ error: "Error fetching sections" });
  }
};

// Update a section within a page
exports.updateSection = async (req, res) => {
  try {
    const { content, isVisible } = req.body;

    const page = await PageModel.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: "Page not found" });

    const section = page.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ error: "Section not found" });

    section.content = content;
    section.isVisible = isVisible;
    page.updatedAt = new Date();

    await page.save();
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: "Error updating section" });
  }
};

// Add a new section to a page
exports.addSection = async (req, res) => {
  try {
    const { name, type, content, isVisible } = req.body;

    const page = await PageModel.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: "Page not found" });

    const newSection = {
      name,
      type,
      content,
      isVisible,
      order: page.sections.length + 1,
    };

    page.sections.push(newSection);
    await page.save();
    res.json(newSection);
  } catch (err) {
    res.status(500).json({ error: "Error adding section" });
  }
};

// Delete a section from a page
exports.deleteSection = async (req, res) => {
  try {
    const page = await PageModel.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: "Page not found" });

    const section = page.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ error: "Section not found" });

    page.sections.pull(section);
    await page.save();
    res.json({ message: "Section deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting section" });
  }
};
