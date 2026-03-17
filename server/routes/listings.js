const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Only return active listings to the public
    const query = { status: 'active' };
    
    // Simplistic text search
    if (req.query.q) {
      query.$text = { $search: req.query.q };
    }
    
    // Denomination filter
    if (req.query.denomination) {
       query.denomination = parseInt(req.query.denomination);
    }
    
    const listings = await Listing.find(query)
      .populate('sellerId', 'name avatar rating totalSales isVerified')
      .sort({ createdAt: -1 });
      
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const newListing = new Listing({
      ...req.body,
      sellerId: req.user.id,
      status: 'pending', // Requires admin approval
    });
    
    const createdListing = await newListing.save();
    
    // Populate seller info before returning
    await createdListing.populate('sellerId', 'name avatar rating totalSales isVerified');
    
    res.status(201).json(createdListing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get listing by ID
// @route   GET /api/listings/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('sellerId', 'name avatar rating totalSales isVerified reviewsCount joinDate');
      
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
