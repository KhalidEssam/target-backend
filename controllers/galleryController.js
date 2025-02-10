// create gallery controller

const UserGallery = require('../models/Gallery');

exports.createGallery = async (req, res) => {
    try {
        const newGallery = new UserGallery(req.body);
        const savedGallery = await newGallery.save();
        res.status(201).json(savedGallery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    
};

exports.getAllGalleries = async (req, res) => {
    try {
        const galleries = await UserGallery.find();
        res.status(200).json(galleries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
};

exports.getGalleryByOktaId = async (req, res) => {
    try {
        const gallery = await UserGallery.findOne({ oktaUserId: req.params.oktaUserId });
        if (!gallery) {
            return res.status(404).json({ message: 'Gallery not found' });
        }
        res.status(200).json(gallery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
};


// update gallery controller

exports.updateGallery = async (req, res) => {
    try {
        // Find the gallery by oktaUserId
        let gallery = await UserGallery.findOne({ oktaUserId: req.params.oktaUserId });

        // If no gallery exists, create a new one
        if (!gallery) {
            gallery = new UserGallery({ oktaUserId: req.params.oktaUserId, imageUrls: [] });
        }

        // Check if req.body.imageUrls is an array and contains URLs
        if (!Array.isArray(req.body.imageUrls)) {
            return res.status(400).json({ message: 'imageUrls must be an array' });
        }

        // Add the new image URLs to the existing array
        gallery.imageUrls.push(...req.body.imageUrls);

        // Save the updated gallery
        const updatedGallery = await gallery.save();

        // Return the updated gallery
        res.status(200).json(updatedGallery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};