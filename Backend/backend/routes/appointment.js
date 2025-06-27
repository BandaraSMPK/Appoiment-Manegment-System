const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// GET all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ date: 1 });
        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: err.message
        });
    }
});

// GET single appointment by ID
router.get('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        console.error('Error fetching appointment:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointment',
            error: err.message
        });
    }
});

// POST new appointment
router.post('/', async (req, res) => {
    try {
        const { clientName, sessionType, classType, date, time, duration, amount, notes, trainer } = req.body;

        // Input validation
        const errors = [];
        if (!clientName || clientName.trim().length < 2) {
            errors.push('Client name must be at least 2 characters');
        }
        if (!sessionType || !['Personal Training', 'Group Class', 'Yoga', 'CrossFit'].includes(sessionType)) {
            errors.push('Invalid session type');
        }
        if (sessionType === 'Group Class' && !['Beginner', 'Intermediate', 'Advanced'].includes(classType)) {
            errors.push('Invalid class type for Group Class');
        }
        if (!date || new Date(date) < new Date()) {
            errors.push('Date must be in the future');
        }
        if (!time) {
            errors.push('Time is required');
        } else {
            const [hours, minutes] = time.split(':').map(Number);
            if (hours < 6 || hours >= 21) {
                errors.push('Time must be between 6:00 AM and 9:00 PM');
            }
        }
        if (!duration || ![30, 45, 60, 90].includes(Number(duration))) {
            errors.push('Invalid duration selected');
        }
        if (!amount || isNaN(amount) || amount <= 0) {
            errors.push('Invalid amount');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        const appointment = new Appointment({
            clientName,
            sessionType,
            classType: classType || 'N/A',
            date: new Date(date),
            time,
            duration: Number(duration),
            amount: Number(amount),
            notes: notes || '',
            status: 'Pending',
            trainer: trainer || 'Select Trainer'
        });

        const savedAppointment = await appointment.save();
        res.status(201).json({
            success: true,
            message: 'Session booked successfully',
            data: savedAppointment
        });
    } catch (err) {
        console.error('Error creating appointment:', err);
        res.status(500).json({
            success: false,
            message: 'Error creating appointment',
            error: err.message
        });
    }
});

// PATCH update appointment
router.patch('/:id', async (req, res) => {
    try {
        const { clientName, sessionType, classType, date, time, duration, amount, notes, status, trainer } = req.body;

        // Input validation
        const errors = [];
        if (clientName && clientName.trim().length < 2) {
            errors.push('Client name must be at least 2 characters');
        }
        if (sessionType && !['Personal Training', 'Group Class', 'Yoga', 'CrossFit'].includes(sessionType)) {
            errors.push('Invalid session type');
        }
        if (sessionType === 'Group Class' && !['Beginner', 'Intermediate', 'Advanced'].includes(classType)) {
            errors.push('Invalid class type for Group Class');
        }
        if (date && new Date(date) < new Date()) {
            errors.push('Date must be in the future');
        }
        if (time) {
            const [hours, minutes] = time.split(':').map(Number);
            if (hours < 6 || hours >= 21) {
                errors.push('Time must be between 6:00 AM and 9:00 PM');
            }
        }
        if (duration && ![30, 45, 60, 90].includes(Number(duration))) {
            errors.push('Invalid duration selected');
        }
        if (amount && (isNaN(amount) || amount <= 0)) {
            errors.push('Invalid amount');
        }
        if (status && !['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
            errors.push('Invalid status value');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { 
                clientName,
                sessionType,
                classType,
                date: date && new Date(date),
                time,
                duration: duration && Number(duration),
                amount: amount && Number(amount),
                notes,
                status,
                trainer
            },
            { new: true, runValidators: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedAppointment
        });
    } catch (err) {
        console.error('Error updating appointment:', err);
        res.status(500).json({
            success: false,
            message: 'Error updating appointment',
            error: err.message
        });
    }
});

// DELETE appointment
router.delete('/:id', async (req, res) => {
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!deletedAppointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting appointment:', err);
        res.status(500).json({
            success: false,
            message: 'Error deleting appointment',
            error: err.message
        });
    }
});

// PATCH approve appointment
router.patch('/approve/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: 'Approved' },
            { new: true }
        );
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        console.error('Error approving appointment:', err);
        res.status(500).json({
            success: false,
            message: 'Error approving appointment',
            error: err.message
        });
    }
});

// Add new route for rejecting appointments
router.patch('/reject/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: 'Rejected' },
            { new: true }
        );
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        console.error('Error rejecting appointment:', err);
        res.status(500).json({
            success: false,
            message: 'Error rejecting appointment',
            error: err.message
        });
    }
});

module.exports = router;