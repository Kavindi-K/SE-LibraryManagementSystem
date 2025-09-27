import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8081/api/users/login', {
        username: formData.username,
        password: formData.password
      });

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        localStorage.setItem('isAuthenticated', 'true');

        if (formData.username === 'Admin' && formData.password === 'admin123') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.message || 'Login failed');
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
    <div className="login-container">
      <div className="login-card">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="book-logo">
            <div className="book book1"></div>
            <div className="book book2"></div>
            <div className="book book3"></div>
          </div>
          <h1 className="main-title">LIBRARY</h1>
          <p className="subtitle">MANAGEMENT SYSTEM</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">User Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                className="login-input"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="login-input"
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <span className="loading-text">
                <span className="loading-spinner"></span> Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Additional Links */}
        <div className="additional-links">
          <a href="#" className="forgot-link">Forgot Password?</a>
          <p className="signup-text">
            Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
