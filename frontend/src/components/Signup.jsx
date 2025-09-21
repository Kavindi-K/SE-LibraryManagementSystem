import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    dateOfBirth: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    role: 'MEMBER'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...userData } = formData;
      
      const response = await axios.post('http://localhost:8080/api/users', userData);

      if (response.data.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        console.log('User created:', response.data.data);
        
        // Navigate to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        
      } else {
        setError(response.data.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to create account';
        setError(errorMessage);
        
        if (error.response.status === 400 && error.response.data?.data) {
          const fieldErrors = error.response.data.data;
          const errorMessages = Object.values(fieldErrors).join(', ');
          setError(errorMessages);
        }
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">SIGN UP</h2>
        <p className="signup-subtitle">Create your account to get started!</p>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-row">
            <div className="input-group">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="signup-input"
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="signup-input"
              />
            </div>
          </div>
          
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              className="signup-input"
            />
          </div>
          
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="signup-input"
            />
          </div>
          
          <div className="input-group">
            <input
              type="date"
              name="dateOfBirth"
              placeholder="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="signup-input"
            />
          </div>
          
          <div className="input-group">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="signup-input"
            />
          </div>
          
          <div className="input-group">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="signup-select"
            >
              <option value="MEMBER">Member</option>
              <option value="LIBRARIAN">Librarian</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
          
          <div className="input-row">
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="signup-input"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="signup-input"
              />
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <button 
            type="submit" 
            className="signup-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="login-link">
          <p>Already have an account? 
            <Link to="/login" className="switch-button">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;