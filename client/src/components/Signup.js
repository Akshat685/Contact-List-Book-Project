import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; 
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address (e.g., akshat@gmail.com).');
      return;
    }

    // Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await axios.post('https://contact-list-book-project.onrender.com/api/auth/signup', { name, email, password });
      
      // Save the name to localStorage after successful signup
      localStorage.setItem('name', response.data.name); // Assuming response includes the user's name

      toast.success('Registered successfully!');
      navigate('/'); // Redirect to login page after signup
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      {/* Left Image Section */}
      <div className="signup-image-section">
        <div>
          <h1>Join Us</h1>
          <p>Become a part of our community and manage your contacts effortlessly.</p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="signup-form-section">
        <div className="signup-form">
          <h1>Sign Up</h1>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSignup}>
            <input 
              type="text" 
              placeholder="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password"  
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="submit">Sign Up</button>
          </form>
          <p className="login-link">
            Already have an account? <span onClick={() => navigate('/')}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
