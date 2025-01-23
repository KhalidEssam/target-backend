const { v2: cloudinary } = require("cloudinary");

// Upload a single image
const uploadImage = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path);

        if (!result || !result.secure_url) {
            return res.status(400).json({ error: "Failed to upload image to Cloudinary" });
        }
        console.log(result.secure_url);
        res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Failed to upload file" });
    }
};

// Upload multiple images
const uploadImages = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const urls = [];

        for (const file of files) {
            // Upload each file to Cloudinary
            const result = await cloudinary.uploader.upload(file.path);

            if (!result || !result.secure_url) {
                return res.status(400).json({ error: "Failed to upload one or more files to Cloudinary" });
            }

            urls.push(result.secure_url);
        }

        res.status(200).json({ imageUrls: urls });
    } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ error: "Failed to upload files" });
    }
};

module.exports = { uploadImage, uploadImages };
