const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    sessionName: {
        type: String,
        required: [true, 'Session name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    startingTime: {
        type: String,
        required: [true, 'Starting time is required']
    },
    endingTime: {
        type: String,
        required: [true, 'Ending time is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    photo: {
        type: String,
        required: [true, 'Photo is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Session', sessionSchema); 