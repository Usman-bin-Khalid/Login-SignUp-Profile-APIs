const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// @route   POST api/auth/signup
// @desc    Register a new user
router.post('/signup', authController.signup);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', authController.login);

// @route   PUT api/auth/profile
// @desc    Update profile details (Protected Route)
// Note: We use the authMiddleware here to ensure only logged-in users can access this
const upload = require('../config/cloudinary'); // Path to your config file

router.put(
    '/profile', 
    authMiddleware, 
    upload.single('profileImage'), 
    authController.completeProfile
);

module.exports = router;