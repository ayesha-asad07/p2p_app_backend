const File = require('../models/file');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Upload a file
const uploadFile = async (req, res) => {
    try {
        const { userId } = req.body; // User ID should be passed in the request body
        const file = req.file; // Assuming you're using Multer for file uploads

        if (!file) {
            return res.status(400).json({ message: 'No file provided' });
        }

        const newFile = new File({
            user: userId,
            filename: file.originalname,
            filePath: file.path,
            fileSize: file.size,
        });

        await newFile.save();
        res.status(201).json({ message: 'File uploaded successfully', file: newFile });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Server error while uploading file' });
    }
};

// Download a file
const downloadFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const filePath = path.resolve(file.filePath);
        res.download(filePath, file.filename, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ message: 'Server error while sending file' });
            }
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: 'Server error while downloading file' });
    }
};

// Get all files uploaded by peers
const getFiles = async (req, res) => {
    try {
        const files = await File.find().populate('user', 'username email');
        res.status(200).json({ files });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Server error while fetching files' });
    }
};

// Delete a file
const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Delete the file from the filesystem
        const filePath = path.resolve(file.filePath);
        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error('Error deleting file from filesystem:', err);
                return res.status(500).json({ message: 'Server error while deleting file' });
            }

            // Remove from database
            await file.remove();
            res.status(200).json({ message: 'File deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Server error while deleting file' });
    }
};

// Synchronize files between peers
const syncFiles = async (req, res) => {
    try {
        const { userId } = req.body; // Assuming the requesting peer's user ID is sent in the request body

        const userFiles = await File.find({ user: userId });
        res.status(200).json({ message: 'Files synced successfully', files: userFiles });
    } catch (error) {
        console.error('Error syncing files:', error);
        res.status(500).json({ message: 'Server error while syncing files' });
    }
};

module.exports = { uploadFile, downloadFile, getFiles, deleteFile, syncFiles };
