const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['VM', 'GPU'],
    },
    details: {
      vcpu: { type: Number },
      ramGB: { type: Number },
      storageGB: { type: Number },
      gpuModel: { type: String },
    },
    // This status is for availability (e.g., in use, maintenance)
    status: {
      type: String,
      required: true,
      enum: ['available', 'in-use', 'maintenance'],
      default: 'available',
    },
    // *** NEW: This status is for visibility (published/draft) ***
    publishStatus: {
        type: String,
        required: true,
        enum: ['published', 'draft'],
        default: 'published',
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

