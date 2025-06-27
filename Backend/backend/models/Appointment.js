// server/models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true,
        minlength: [2, 'Client name must be at least 2 characters']
    },
    sessionType: {
        type: String,
        required: [true, 'Session type is required'],
        enum: ['Personal Training', 'Group Class', 'Yoga', 'CrossFit']
    },
    classType: {
        type: String,
        default: 'N/A',
        enum: ['N/A', 'Beginner', 'Intermediate', 'Advanced']
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        validate: {
            validator: function(value) {
                return value > new Date();
            },
            message: 'Date must be in the future'
        }
    },
    time: {
        type: String,
        required: [true, 'Time is required'],
        validate: {
            validator: function(value) {
                const [hours, minutes] = value.split(':').map(Number);
                return hours >= 6 && hours < 21; // Sessions between 6 AM and 9 PM
            },
            message: 'Time must be between 6:00 AM and 9:00 PM'
        }
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be a positive number']
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
        default: 'Pending'
    },
    trainer: {
        type: String,
        required: [true, 'Trainer is required'],
        enum: ['Select Trainer', 'John Smith', 'Sarah Johnson', 'Mike Williams', 'Emily Davis', 'David Brown'],
        default: 'Select Trainer'
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        enum: [30, 45, 60, 90],
        default: 60
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);