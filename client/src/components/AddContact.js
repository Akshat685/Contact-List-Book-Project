import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AddContact.css'; // Import the same CSS file

const AddContact = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState({}); // State for errors
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/; // Regex for 10-digit phone number
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Regex for email validation

    // Validate Name
    if (!name) {
      newErrors.name = 'Name is required';
    }

    // Validate Phone
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    // Validate Email
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email must be in the format name@gmail.com';
    }

    // Validate City
    if (!city) {
      newErrors.city = 'City is required';
    }

    // Validate Country
    if (!country) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Don't proceed if validation fails
    }

    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post('https://contact-list-book-project.onrender.com/api/add-contact', 
        { name, phone, email, city, country }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Contact added successfully!', { position: "top-right" });
      navigate('/contacts');
    } catch (error) {
      console.error('Error adding contact:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="addUser">
      <Link to={"/contacts"} className="back">Back</Link>
      <h1>Add New Contact</h1>
      <form className="addUserForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            autoComplete="off"
            placeholder="Enter your Name"
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="inputGroup">
          <label htmlFor="phone">Phone No.:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            id="phone"
            autoComplete="off"
            placeholder="Enter your Phone no."
            required
          />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            autoComplete="off"
            placeholder="Email"
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="inputGroup">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            id="city"
            autoComplete="off"
            placeholder="City"
            required
          />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>
        <div className="inputGroup">
          <label htmlFor="country">Country:</label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="">Select Country</option>
            <option value="USA">USA</option>
            <option value="India">India</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="UK">UK</option>
            <option value="Germany">Germany</option>
          </select>
          {errors.country && <p className="error">{errors.country}</p>}
        </div>
        <div className="inputGroup">
          <button type="submit">Add Contact</button>
        </div>
      </form>
    </div>
  );
};

export default AddContact;
