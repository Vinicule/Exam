const express = require('express');
const router = express.Router();
const {
  getResources,
  getAllResourcesForAdmin,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public route to get published resources
router.route('/').get(getResources);

// Admin-only route to get ALL resources (including drafts)
router.route('/all-for-admin').get(protect, isAdmin, getAllResourcesForAdmin);

// Routes for creating a new resource (admin) and getting a single resource (public)
router
    .route('/')
    .post(protect, isAdmin, createResource);
    
router
    .route('/:id')
    .get(getResourceById)
    .put(protect, isAdmin, updateResource)
    .delete(protect, isAdmin, deleteResource);


module.exports = router;