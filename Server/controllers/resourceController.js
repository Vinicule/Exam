const Resource = require('../models/Resource');

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private/Admin
const createResource = async (req, res) => {
  // existing createResource function 
  try {
    const { name, type, details, status, hourlyRate } = req.body;

    const resource = new Resource({
      name,
      type,
      details,
      status,
      hourlyRate,
    });

    const createdResource = await resource.save();
    res.status(201).json(createdResource);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  // ... existing getResources function ...
  try {
    const resources = await Resource.find({});
    res.json(resources);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Get a single resource by ID 
// @desc    Get a single resource
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Update a resource 
// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private/Admin
const updateResource = async (req, res) => {
  try {
    const { name, type, details, status, hourlyRate } = req.body;

    const resource = await Resource.findById(req.params.id);

    if (resource) {
      resource.name = name || resource.name;
      resource.type = type || resource.type;
      resource.details = details || resource.details;
      resource.status = status || resource.status;
      resource.hourlyRate = hourlyRate || resource.hourlyRate;

      const updatedResource = await resource.save();
      res.json(updatedResource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Delete a resource
// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (resource) {
      await resource.deleteOne();
      res.json({ message: 'Resource removed' });
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
};