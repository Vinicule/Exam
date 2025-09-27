const mongoose = require('mongoose');
const Reservation = require('./Reservation');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false, // Optional
      default: '',
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
      required: false, // Optional
    },
    status: {
      type: String,
      required: true,
      enum: ['available', 'in-use', 'maintenance'],
      default: 'available',
    },
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

// Middleware to automatically delete reservations
resourceSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await Reservation.deleteMany({ resource: this._id });
    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model('Resource', resourceSchema);