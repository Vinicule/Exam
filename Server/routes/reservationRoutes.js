const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
    deleteReservation,
} = require('../controllers/reservationController');
const { protect, isAdmin } = require('../middleware/authMiddleware'); 

router.route('/myreservations').get(protect, getMyReservations);

// root route to include GET for admin
router
    .route('/')
    .get(protect, isAdmin, getAllReservations) // <-- Add this
    .post(protect, createReservation);

// Add new route for deleting a reservation
router.route('/:id').delete(protect, deleteReservation);

// route for updating reservation status
router
    .route('/:id/status')
    .put(protect, isAdmin, updateReservationStatus);


module.exports = router;