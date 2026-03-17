const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Listing = require('../models/Listing');

// @desc    Get user profile with public listings
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch public stats needed for the profile
    const activeListings = await Listing.find({ sellerId: req.params.id, status: 'active' });
    const soldListings = await Listing.find({ sellerId: req.params.id, status: 'sold' });

    res.json({
      user,
      activeListings,
      soldListings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
