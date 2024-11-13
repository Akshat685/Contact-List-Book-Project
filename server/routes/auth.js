// routes/auth.js
const express = require('express'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure this model is defined properly
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create new user with plain text password
    const newUser = new User({ name, email, password });
    await newUser.save();
    
    res.status(201).json({ success: true, message: 'User created successfully!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    // Check password (plain text comparison)
    if (password !== user.password) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
