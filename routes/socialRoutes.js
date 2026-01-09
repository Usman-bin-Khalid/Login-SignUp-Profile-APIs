const express = require('express');
const router = express.Router();
const socialCtrl = require('../controllers/socialController');
const authMiddleware = require('../middleware/auth'); // Your JWT middleware
const { upload } = require('../config/cloudinary');

// All routes require login
router.post('/post', authMiddleware, upload.single('image'), socialCtrl.createPost); // Create
router.put('/post/:postId', authMiddleware, upload.single('image'), socialCtrl.updatePost); // Update
router.delete('/post/:postId', authMiddleware, socialCtrl.deletePost); // Delete
router.get('/all-posts', authMiddleware, socialCtrl.getAllPosts); // Discovery
router.get('/search', authMiddleware, socialCtrl.searchUsers);
router.get('/feed', authMiddleware, socialCtrl.getFeed);
router.put('/like/:postId', authMiddleware, socialCtrl.toggleLike);
router.post('/follow/:id', authMiddleware, socialCtrl.followUser);


module.exports = router;  