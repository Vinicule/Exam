const Reservation = require('../models/Reservation');
const Resource = require('../models/Resource');

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  const { resourceId, startTime, endTime } = req.body;
  const userId = req.user.id; // From our 'protect' middleware

  try {
    // --- Validation ---
    if (new Date(startTime) < new Date()) {
      return res.status(400).json({ message: 'Cannot make a reservation in the past' });
    }
    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // --- Check for booking conflicts ---
    const existingReservation = await Reservation.findOne({
      resource: resourceId,
      // Find a reservation where the requested start time is before an existing end time,
      // AND the requested end time is after an existing start time. This means there's an overlap.
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
      status: { $in: ['pending', 'confirmed'] } // Only check against active reservations
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'Resource is already booked for this time period' });
    }

    // --- Create and save the new reservation ---
    const reservation = new Reservation({
      user: userId,
      resource: resourceId,
      startTime,
      endTime,
    });

    const createdReservation = await reservation.save();
    res.status(201).json(createdReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Get logged in user's reservations
// @route   GET /api/reservations/myreservations
// @access  Private
const getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user.id }).populate('resource', 'name type hourlyRate');
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all reservations (Admin)
// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({})
            .populate('user', 'name email') // Get user's name and email
            .populate('resource', 'name'); // Get resource's name
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update reservation status (Admin)
// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
// @access  Private/Admin
const updateReservationStatus = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (reservation) {
            reservation.status = req.body.status || reservation.status;
            const updatedReservation = await reservation.save();
            res.json(updatedReservation);
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a reservation (User) ***
// @desc    Delete a reservation
// @route   DELETE /api/reservations/:id
// @access  Private
const deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // --- Security Check: Ensure the user owns this reservation ---
        if (reservation.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await reservation.deleteOne();
        res.json({ message: 'Reservation cancelled successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
};
