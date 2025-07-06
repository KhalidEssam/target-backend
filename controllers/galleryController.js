const UserGallery = require('../models/Gallery');

// 🆕 CREATE gallery with image objects containing createdAt
exports.createGallery = async (req, res) => {
    try {
        const { oktaUserId, imageUrls } = req.body;

        if (!Array.isArray(imageUrls)) {
            return res.status(400).json({ message: 'imageUrls must be an array' });
        }

        const imageObjects = imageUrls.map(url => ({
            url,
            createdAt: new Date()
        }));

        const newGallery = new UserGallery({
            oktaUserId,
            imageUrls: imageObjects,
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        const savedGallery = await newGallery.save();
        res.status(201).json(savedGallery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 🆕 GET all galleries with at least one recent image
exports.getAllGalleries = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const galleries = await UserGallery.find({
            "imageUrls.createdAt": { $gte: sevenDaysAgo }
        });

        res.status(200).json(galleries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🆕 GET single gallery and filter only recent images
exports.getGalleryByOktaId = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const gallery = await UserGallery.findOne({ oktaUserId: req.params.oktaUserId });

        if (!gallery) {
            return res.status(404).json({ message: 'Gallery not found' });
        }

        const recentImages = gallery.imageUrls.filter(img =>
            new Date(img.createdAt) >= sevenDaysAgo
        );

        res.status(200).json({
            oktaUserId: gallery.oktaUserId,
            recentImages,
            count: recentImages.length
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🆕 UPDATE gallery by appending new image objects with timestamps
exports.updateGallery = async (req, res) => {
    try {
        const oktaUserId = req.params.oktaUserId;
        const newUrls = req.body.imageUrls;

        if (!Array.isArray(newUrls)) {
            return res.status(400).json({ message: 'imageUrls must be an array' });
        }

        const newImageObjects = newUrls.map(url => ({
            url,
            createdAt: new Date()
        }));

        let gallery = await UserGallery.findOne({ oktaUserId });

        if (!gallery) {
            gallery = new UserGallery({
                oktaUserId,
                imageUrls: newImageObjects,
                metadata: {
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
        } else {
            gallery.imageUrls.push(...newImageObjects);
            gallery.metadata.updatedAt = new Date();
        }

        const updatedGallery = await gallery.save();
        res.status(200).json(updatedGallery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
