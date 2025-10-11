import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStatus, setForgotStatus] = useState('');

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

  const handleForgotRequest = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    setError('');
    setForgotStatus('');
    try {
      await axios.post('http://localhost:8081/api/users/password/forgot', { email: forgotEmail });
      setForgotStatus('If the email exists, a reset token has been sent to your EMAIL.');
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Failed to request reset');
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetToken || !newPassword) {
      setError('Please enter token and new password');
      return;
    }
    setLoading(true);
    setError('');
    setForgotStatus('');
    try {
      await axios.post('http://localhost:8081/api/users/password/reset', { token: resetToken, newPassword });
      setForgotStatus('Password reset successful. You can now log in.');
      setShowForgot(false);
      setResetToken('');
      setNewPassword('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Failed to reset password');
      } else if (err.request) {
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
      <div className="login-background">
        <img src="/herosection.avif" alt="SARASAVI Library" className="login-bg-img" />
        <img src="/overlay.jpg" alt="Overlay" className="login-overlay-img" />
      </div>
      <div className="login-card">
        {/* Logo Section */}
        <div className="logo-section">
          <img src="/logo.png" alt="SARASAVI Logo" className="login-logo" />
          <div className="logo-text">
            <h1 className="main-title">SARASAVI</h1>
            <p className="subtitle">LIBRARY & LEARNING HUB</p>
          </div>
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
          <button type="button" className="forgot-link as-button" onClick={() => { setShowForgot(v => !v); setError(''); setForgotStatus(''); }}>
            {showForgot ? 'Hide Reset Options' : 'Forgot Password?'}
          </button>
          {showForgot && (
            <div className="forgot-panel">
              <form onSubmit={handleForgotRequest} className="forgot-form">
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your account email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>
                <button type="submit" className="forgot-button" disabled={loading}>Request Reset Token</button>
              </form>

              <form onSubmit={handlePasswordReset} className="forgot-form">
                <div className="input-group">
                  <label className="input-label">Reset Token</label>
                  <input
                    type="text"
                    placeholder="Paste token from email"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>
                {forgotStatus && <div className="success-message">{forgotStatus}</div>}
                <button type="submit" className="forgot-button" disabled={loading}>Reset Password</button>
              </form>
            </div>
          )}
          <p className="signup-text">
            Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
