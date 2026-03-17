const express = require('express');
const router = express.Router();
const GiftOrder = require('../models/GiftOrder');
const { protect } = require('../middleware/auth');

// @desc    Create new gift order
// @route   POST /api/gifts
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { 
      listingId, recipientName, recipientPhone, 
      deliveryAddress, specialMessage, giftCardDesign, totalAmount 
    } = req.body;

    const orderNumber = 'GFT-' + Date.now() + Math.floor(Math.random() * 1000);

    const giftOrder = new GiftOrder({
      orderNumber,
      buyerId: req.user.id,
      listingId,
      recipientName,
      recipientPhone,
      deliveryAddress,
      specialMessage,
      giftCardDesign,
      totalAmount,
    });

    const savedOrder = await giftOrder.save();
    
    // In real app, we would process payment and then update status here
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get user's gift orders
// @route   GET /api/gifts/my-orders
// @access  Private
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await GiftOrder.find({ buyerId: req.user.id })
      .populate('listingId', 'serialNumber denomination')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
