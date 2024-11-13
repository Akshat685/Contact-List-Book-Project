const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
  // console.log("Request Headers:", req.headers);
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) {
              console.error("JWT verification failed:", err);
              return res.sendStatus(403);
          }
          req.user = user; 
          next();
      });
  } else {
      console.warn("No token provided");
      res.sendStatus(401); 
  }
});


router.post('/add-contact', async (req, res) => {
  try {
    const { name, phone, email, city, country } = req.body;
    
    
    const newContact = new Contact({
      name,
      phone,
      email,
      city,
      country,
      userId: req.user.id // Associate contact with the logged-in user
    });
    
    await newContact.save();
    res.status(201).json({ message: 'Contact added successfully!', contact: newContact });
  } catch (error) {
    res.status(400).json({ message: 'Error adding contact', error });
  }
});

// Get contacts for the logged-in user
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
});

// Get a specific contact for the logged-in user
router.get('/contacts/:id', async (req, res) => {
  const { id } = req.params; // Get the contact ID from the request parameters
  try {
    const contact = await Contact.findOne({ _id: id, userId: req.user.id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ message: 'Error fetching contact', error });
  }
});


// Update a contact
router.put('/contacts/:id', async (req, res) => {
  const { id } = req.params; // Get the contact ID from the request parameters
  
  try {
    // Find the contact and ensure it belongs to the logged-in user
    const contact = await Contact.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // Ensure the contact belongs to the logged-in user
      req.body, // Update the contact with the new data
      { new: true, runValidators: true } // Return the updated contact and run validators
    );

    // Check if the contact was found
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }

    // Send the updated contact
    res.json(contact);
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error updating contact:', error);

    // Send a 400 status with an error message
    res.status(400).json({ message: 'Error updating contact', error: error.message });
  }
});

// Delete a contact
router.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error });
  }
});

module.exports = router;
