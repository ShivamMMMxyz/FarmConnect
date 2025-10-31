const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tool name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Tool type is required'],
    enum: ['tractor', 'plough', 'spray_machine', 'thresher', 'harvester', 'other']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  rentalPrice: {
    hourly: Number,
    daily: Number,
    weekly: Number
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair'],
    default: 'good'
  },
  images: [{
    type: String
  }],
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
