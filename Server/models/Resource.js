const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['VM', 'GPU'],
    },
    details: {
      vcpu: { type: Number, required: true },
      ramGB: { type: Number, required: true },
      storageGB: { type: Number, required: true },
      gpuModel: { type: String }, // Optional, for GPU types
    },
    status: {
      type: String,
      required: true,
      enum: ['available', 'in-use', 'maintenance'],
      default: 'available',
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resource', resourceSchema);
