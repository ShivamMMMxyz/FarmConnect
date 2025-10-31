const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tool name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Tool category is required'],
    enum: ['harvesting', 'planting', 'irrigation', 'processing', 'transport', 'other']
  },
  description: {
    type: String
  },
  rentalPrice: {
    perDay: Number,
    perWeek: Number,
    perMonth: Number
  },
  available: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerName: String,
  location: String,
  isAvailable: {
    type: Boolean,
    default: true
  },
  specifications: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tool', toolSchema);
