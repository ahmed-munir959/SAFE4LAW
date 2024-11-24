// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/router');
const router = require('./routes/router');

// Initialize dotenv to use environment variables from .env
dotenv.config();

const app = express();

// Middleware setup - Add these before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
  });

// Use routes
app.use('/api', userRoutes);

// Connect to MongoDB and only start the server if the connection is successful
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected successfully');
    
    // Define PORT from .env file or default to 5000
    const PORT = process.env.PORT || 5000;
    
    // Start the server only after MongoDB connection is established
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});

// Basic route
app.get('/', (req, res) => {
    res.send('Server is running.....!');
});