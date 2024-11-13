// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/auth'); // Authentication routes
const contactRoutes = require('./routes/contacts'); // Adjust path if necessary

const app = express();
app.use(express.json());

// Configure CORS
const cors = require('cors');
app.use(cors({
  origin: 'https://contact-list-book-project.onrender.com' || 'https://contact-listbook.netlify.app/', // Adjust as necessary
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api', contactRoutes); // Other routes

// Set PORT and listen
const PORT = process.env.PORT || 8000; // Default to 8000 if not set
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
