const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authMiddleware = require('./middleware/authMiddleware'); // Middleware to authenticate users
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: '*' } });

// Pass io to request object
app.use((req, res, next) => {
    req.io = io; // Attach the io instance to the request object
    next();
});

// Connect to MongoDB
connectDB();

// Middleware
//app.use(cors());
app.use(express.json());

// Routes

app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes); // Protect chat routes with authentication

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join specific peer rooms based on their unique peer ID
    socket.on('join', (peerId) => {
        socket.join(peerId);
        console.log(`User with peer ID ${peerId} joined their room`);
    });

    // Handle real-time chat messages
    socket.on('chat-message', ({ sender, receiver, message }) => {
        console.log(`Message from ${sender} to ${receiver}: ${message}`);

        // Emit the message to the receiver's room
        io.to(receiver).emit('receive-message', {
            sender,
            message,
            timestamp: new Date(),
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
