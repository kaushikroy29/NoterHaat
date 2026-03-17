const mongoose = require('mongoose');

const wantedPostSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    denomination: {
      type: Number,
    },
    targetDate: {
      type: String, // e.g., '14/02/1995'
      default: '',
    },
    targetSerial: {
      type: String, // e.g., '7777777'
      default: '',
    },
    occasion: {
      type: String,
      enum: ['birthday', 'anniversary', 'wedding', 'graduation', 'other'],
      default: 'other',
    },
    maxBudget: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'fulfilled', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
wantedPostSchema.index({ occasion: 1 });
wantedPostSchema.index({ createdAt: -1 });

const WantedPost = mongoose.model('WantedPost', wantedPostSchema);

module.exports = WantedPost;
