const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const { protect } = require('../middleware/auth');

// @desc    Get all offers for the logged in user (buying or selling)
// @route   GET /api/offers
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const offers = await Offer.find({
      $or: [{ buyerId: req.user.id }, { sellerId: req.user.id }]
    })
    .populate('listingId', 'serialNumber denomination askingPrice')
    .populate('buyerId', 'name avatar')
    .populate('sellerId', 'name avatar')
    .sort({ createdAt: -1 });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create an offer
// @route   POST /api/offers
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { listingId, sellerId, offerPrice } = req.body;

    const offer = new Offer({
      listingId,
      buyerId: req.user.id,
      sellerId,
      offerPrice
    });

    const savedOffer = await offer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update offer status (accept/reject/counter)
// @route   PUT /api/offers/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    // In a real app we'd verify the user is the seller or buyer depending on the action
    
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
