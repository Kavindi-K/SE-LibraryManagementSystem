import React, { useState } from 'react';
import './Login.css';

const Login = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, get user by username to verify credentials
      const response = await fetch(`http://localhost:8080/api/users/username/${formData.username}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // In a real app, you'd verify password with backend
          // For now, we'll just simulate successful login
          console.log('Login successful:', result.data);
          alert(`Welcome back, ${result.data.firstName}!`);
          
          // Store user data in localStorage or context
          localStorage.setItem('user', JSON.stringify(result.data));
        } else {
          setError('Invalid username or password');
        }
      } else if (response.status === 404) {
        setError('User not found. Please check your username.');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">LOGIN</h2>
        <p className="login-subtitle">Please enter your login and password!</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="login-input"
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="login-input"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="forgot-password">
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="signup-link">
          <p>Don't have an account? 
            <button 
              onClick={onSwitchToSignup}
              className="switch-button"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;