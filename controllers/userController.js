const User = require('../models/User');
const jwt = require('jsonwebtoken');



// Register User
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = user.generateAuthToken();
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Peers
const getPeers = async (req, res) => {
    try {
        const peers = await User.find({}, 'username peerId'); // List of users with peerId
        res.json({ peers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching peers' });
    }
};

// Authenticate Peer
const authenticatePeer = async (req, res) => {
    const { peerId } = req.body;

    try {
        const peer = await User.findOne({ peerId });
        if (!peer) {
            return res.status(404).json({ message: 'Peer not found' });
        }

        res.json({ message: 'Peer authenticated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = { registerUser, loginUser, getPeers, authenticatePeer };
