import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      toast.success('Logged in successfully!');
      navigate('/contacts');
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      toast.error(error.response ? error.response.data.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      {/* Left Image Section */}
      <div className="login-image-section">
        <div>
          <h1>Contact List Manager</h1>
          <p>Keep your connections organized and accessible anytime, anywhere.</p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="login-form-section">
        <div className="login-form">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
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
            <button type="submit">Login</button>
          </form>
          
          <p className="signup-link">
            Don't have an account? <span onClick={() => navigate('/signup')}>Register Now</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
