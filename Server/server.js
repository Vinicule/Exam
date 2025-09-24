require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); // *** NEW: Import user routes ***

const PORT = process.env.PORT || 5001;

// Connect to the database
connectDB();

const app = express();

// *** NEW: Init Middleware to accept JSON data ***
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// *** NEW: Define Routes ***
app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));