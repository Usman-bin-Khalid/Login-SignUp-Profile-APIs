// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { createEvent, bookEvent, getUpcomingEvents } = require('../controllers/eventController');
const protect = require('../middleware/authMiddleware'); // Your existing JWT protector
const authorize = require('../middleware/roleMiddleware');

// Public/All users: Get upcoming events
router.get('/upcoming', getUpcomingEvents);

// Authenticated users: Book an event
router.post('/book/:id', protect, bookEvent);

// Organizer Only: Create an event
router.post('/create', protect, authorize(['organizer', 'admin']), createEvent);

module.exports = router;