const Session = require('../models/Session');

// Get all sessions
exports.getSessions = async (req, res) => {
    try {
        const sessions = await Session.find().sort({ date: 1 });
        res.status(200).json({
            success: true,
            data: sessions
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sessions',
            error: error.message
        });
    }
};

// Get single session
exports.getSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }
        res.status(200).json({
            success: true,
            data: session
        });
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching session',
            error: error.message
        });
    }
};

// Create new session
exports.createSession = async (req, res) => {
    try {
        console.log('Received session data:', req.body);
        
        // Validate required fields
        const { sessionName, description, date, startingTime, endingTime, location, photo } = req.body;
        
        const errors = [];
        if (!sessionName) errors.push('Session name is required');
        if (!description) errors.push('Description is required');
        if (!date) errors.push('Date is required');
        if (!startingTime) errors.push('Starting time is required');
        if (!endingTime) errors.push('Ending time is required');
        if (!location) errors.push('Location is required');
        if (!photo) errors.push('Photo is required');

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        // Validate date is in the future
        const sessionDate = new Date(date);
        if (sessionDate < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Session date must be in the future'
            });
        }

        // Create the session
        const session = await Session.create(req.body);
        
        res.status(201).json({
            success: true,
            data: session
        });
    } catch (error) {
        console.error('Session creation error:', error);
        res.status(400).json({
            success: false,
            message: 'Error creating session',
            error: error.message
        });
    }
};

// Update session
exports.updateSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        res.status(200).json({
            success: true,
            data: session
        });
    } catch (error) {
        console.error('Error updating session:', error);
        res.status(400).json({
            success: false,
            message: 'Error updating session',
            error: error.message
        });
    }
};

// Delete session
exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndDelete(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting session',
            error: error.message
        });
    }
}; 