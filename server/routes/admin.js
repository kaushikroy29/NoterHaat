const express = require('express');
const router = express.Router();
// const { protect, admin } = require('../middleware/auth'); // Will be added later
const Listing = require('../models/Listing');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeListings = await Listing.countDocuments({ status: 'active' });
    const pendingListings = await Listing.countDocuments({ status: 'pending' });
    const unverifiedUsers = await User.countDocuments({ verificationStatus: 'pending' });

    res.json({
      totalUsers,
      activeListings,
      pendingListings,
      unverifiedUsers,
      totalSalesVolume: 12500 // Mock for now
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Approve or reject a listing
// @route   PUT /api/admin/listings/:id
// @access  Private/Admin
router.put('/listings/:id', async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const status = action === 'approve' ? 'active' : 'rejected';
    
    const listing = await Listing.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Verify or reject a user
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
router.put('/users/:id/verify', async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const isVerified = action === 'approve';
    const verificationStatus = action === 'approve' ? 'approved' : 'rejected';
    
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { isVerified, verificationStatus }, 
      { new: true }
    );
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
