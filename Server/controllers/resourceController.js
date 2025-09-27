const Resource = require('../models/Resource');

// @desc    Get all PUBLISHED resources for public users
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ publishStatus: 'published' });
    res.json(resources);
  } catch (error) {
    console.error('Error in getResources:', error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get ALL resources for an admin
// @route   GET /api/resources/all-for-admin
// @access  Private/Admin
const getAllResourcesForAdmin = async (req, res) => {
    try {
        const resources = await Resource.find({}); // Find all, no filter
        res.json(resources);
    } catch (error) {
        console.error('Error in getAllResourcesForAdmin:', error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a single resource by ID
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

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private/Admin
const createResource = async (req, res) => {
  try {
    const { name, type, details, hourlyRate, description } = req.body;

    if (!name || !type || !hourlyRate || parseFloat(hourlyRate) <= 0) {
        return res.status(400).json({ message: 'Please provide a valid name, type, and a positive hourly rate.' });
    }

    const resource = new Resource({
      name,
      type,
      details: details || {},
      status: 'available',
      publishStatus: 'published',
      hourlyRate,
      description: description || '', 
    });

    const createdResource = await resource.save();
    res.status(201).json(createdResource);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private/Admin
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (resource) {
      // Dynamically update fields that are present in the request body
      Object.assign(resource, req.body);
      const updatedResource = await resource.save();
      res.json(updatedResource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    console.error('Error in updateResource:', error.message);
    res.status(500).send('Server Error');
  }
};

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
  getResources,
  getAllResourcesForAdmin,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};

