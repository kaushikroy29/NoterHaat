const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    denomination: {
      type: Number,
      required: true,
      enum: [10, 20, 50, 100, 200, 500, 1000],
    },
    serialNumber: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
    },
    serialPatterns: {
      type: [String], // "radar", "dateMatch", "fancy", "solid", "lowSerial"
      default: [],
    },
    matchingDates: {
      type: [String], // e.g. ["14021995", "1402"]
      default: [],
    },
    occasion: {
      type: String, // "birthday", "anniversary", etc.
      default: '',
    },
    isGiftable: {
      type: Boolean,
      default: false,
    },
    condition: {
      type: String,
      enum: ['uncirculated', 'good', 'fair'],
      default: 'uncirculated',
    },
    images: {
      type: [String], // Array of Cloudinary URLs
      default: [],
    },
    askingPrice: {
      type: Number,
      required: true,
    },
    allowOffers: {
      type: Boolean,
      default: true,
    },
    minOfferPrice: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'reserved'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Search indexing
listingSchema.index({ serialNumber: 'text', description: 'text' });
listingSchema.index({ askingPrice: 1 });
listingSchema.index({ denomination: 1 });

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
