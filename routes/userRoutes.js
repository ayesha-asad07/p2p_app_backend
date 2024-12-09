const express = require('express');
const { registerUser, loginUser, getPeers, authenticatePeer } = require('../controllers/userController');
//const authenticateUser = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/peers', getPeers);
//router.post('/authenticate-peer', authenticateUser, authenticatePeer);

module.exports = router;
