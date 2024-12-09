const express = require('express');

const { uploadFile, downloadFile, getFiles, deleteFile, syncFiles } = require('../controllers/fileController');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.get('/:fileId/download', authMiddleware, downloadFile);
router.get('/', authMiddleware, getFiles);
router.delete('/:fileId', authMiddleware, deleteFile);
router.post('/sync', authMiddleware, syncFiles);

module.exports = router;
