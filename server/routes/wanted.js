const express = require('express');
const router = express.Router();
const WantedPost = require('../models/WantedPost');
const { protect } = require('../middleware/auth');

// @desc    Get all wanted posts
// @route   GET /api/wanted
// @access  Public
router.get('/', async (req, res) => {
  try {
    const query = { status: 'active' };
    
    // Filter by occasion if provided
    if (req.query.occasion && req.query.occasion !== 'all') {
      query.occasion = req.query.occasion;
    }

    const posts = await WantedPost.find(query)
      .populate('buyerId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new wanted post
// @route   POST /api/wanted
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const newPost = new WantedPost({
      ...req.body,
      buyerId: req.user.id,
    });

    const createdPost = await newPost.save();
    await createdPost.populate('buyerId', 'name avatar');
    
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
