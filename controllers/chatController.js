const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
const sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id; // Assumes user ID is extracted from an authenticated JWT

        if (!receiverId || !message) {
            return res.status(400).json({ error: 'Receiver and message content are required.' });
        }

        // Check if the receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ error: 'Receiver not found.' });
        }

        // Create a new message
        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            message,
        });

        await newMessage.save();

        // Emit the message to the receiver via WebSocket if using Socket.IO
        if (req.io) {
            req.io.to(receiver.peerId).emit('receive-message', {
                sender: senderId,
                message,
                createdAt: newMessage.createdAt,
            });
        }

        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while sending the message.' });
    }
};

// Get messages for a peer-to-peer conversation
const getMessages = async (req, res) => {
    try {
        const { peerId } = req.params; // Peer ID of the user you are communicating with
        const userId = req.user.id; // Assumes user ID is extracted from an authenticated JWT

        // Fetch messages between the two users
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: peerId },
                { sender: peerId, receiver: userId },
            ],
        })
            .populate('sender', 'username email')
            .populate('receiver', 'username email')
            .sort({ createdAt: 1 }); // Sort by date, oldest first

        res.status(200).json({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while fetching messages.' });
    }
};

// Delete a specific message
const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id; // Assumes user ID is extracted from an authenticated JWT

        // Find and delete the message if the user is the sender
        const message = await Message.findOneAndDelete({
            _id: messageId,
            sender: userId,
        });

        if (!message) {
            return res.status(404).json({ error: 'Message not found or not authorized to delete.' });
        }

        res.status(200).json({ message: 'Message deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while deleting the message.' });
    }
};

module.exports = { sendMessage, getMessages, deleteMessage };
