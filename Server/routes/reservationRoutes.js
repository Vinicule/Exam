const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
  updateMyReservation,
} = require('../controllers/reservationController');
const { protect, isAdmin } = require('../middleware/authMiddleware'); 

// Route for a user to get their own reservations
router.route('/myreservations').get(protect, getMyReservations);

// Routes for the base '/api/reservations' path
router
  .route('/')
  .post(protect, createReservation) // For any logged-in user to create
  .get(protect, isAdmin, getAllReservations); // For admins to get all

// Route for an admin to update the status of a specific reservation
router
  .route('/:id/status')
  .put(protect, isAdmin, updateReservationStatus);

// Routes for a user to manage their own specific reservation
router
  .route('/:id')
  .put(protect, updateMyReservation) // For a user to update their own
  .delete(protect, deleteReservation); // For a user to cancel their own

module.exports = router;
