require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); 
const resourceRoutes = require('./routes/resourceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const PORT = process.env.PORT || 5001;

// Connect to the database
connectDB();

const app = express();

//Initialize Middleware to accept JSON data
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Define Routes
app.use('/api/users', userRoutes); //Use user routes
app.use('/api/resources', resourceRoutes); //Use resource routes 
app.use('/api/reservations', reservationRoutes); //Use reservation routes

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));