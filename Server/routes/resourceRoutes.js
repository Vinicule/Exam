const express = require('express');
const router = express.Router();
const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Route to get all resources (public) and create a resource (admin)
router.route('/').get(getResources).post(protect, isAdmin, createResource);

// Routes for a single resource 
router
  .route('/:id')
  .get(getResourceById)
  .put(protect, isAdmin, updateResource)
  .delete(protect, isAdmin, deleteResource);

module.exports = router;