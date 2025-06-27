const express = require('express');
const router = express.Router();
const {
    getSessions,
    getSession,
    createSession,
    updateSession,
    deleteSession
} = require('../controllers/sessionController');

// Get all sessions
router.get('/', getSessions);

// Get single session
router.get('/:id', getSession);

// Create new session
router.post('/', createSession);

// Update session
router.put('/:id', updateSession);

// Delete session
router.delete('/:id', deleteSession);

module.exports = router; 