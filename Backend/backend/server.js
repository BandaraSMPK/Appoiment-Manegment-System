const express = require("express");
const mongoose = require('mongoose');
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const appointmentRoutes = require('./routes/appointment');
const sessionRoutes = require('./routes/sessions');

// dotenv config
dotenv.config();

// mongoDB connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/fitlife', {
    dbName: 'fitlife'
})
    .then(() => {
        console.log('MongoDB Connected Successfully'.bgGreen.white);
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:'.bgRed.white, err);
        process.exit(1);
    });

// Add error handling for MongoDB connection
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:'.bgRed.white, err);
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected to database'.bgGreen.white);
});

// rest object
const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan("dev"));

// Test MongoDB connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// routes
app.use('/api/appointment', appointmentRoutes);
app.use('/api/sessions', sessionRoutes);

// port
const port = 3000;

// listen port
app.listen(port, () => {
    console.log(`Server Running on port ${port}`.bgCyan.white);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please try these solutions:
        1. Close other applications that might be using port ${port}
        2. Wait a few seconds and try again
        3. Use a different port by setting the PORT environment variable`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});