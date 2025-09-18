import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'LIBRARIAN':
        return '#e74c3c';
      case 'STAFF':
        return '#f39c12';
      case 'MEMBER':
        return '#27ae60';
      default:
        return '#3498db';
    }
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Library Management Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome back, {user.firstName} {user.lastName}!</h2>
          <p>Here's your dashboard overview</p>
        </div>

        <div className="dashboard-grid">
          {/* User Profile Card */}
          <div className="dashboard-card profile-card">
            <div className="card-header">
              <h3>Your Profile</h3>
              <span 
                className="role-badge" 
                style={{ backgroundColor: getRoleColor(user.role) }}
              >
                {user.role}
              </span>
            </div>
            <div className="card-content">
              <div className="profile-info">
                <div className="info-item">
                  <span className="label">Username:</span>
                  <span className="value">{user.username}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Date of Birth:</span>
                  <span className="value">{formatDate(user.dateOfBirth)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Address:</span>
                  <span className="value">{user.address || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Status:</span>
                  <span className={`status ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Member Since:</span>
                  <span className="value">{formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="dashboard-card stats-card">
            <div className="card-header">
              <h3>Library Stats</h3>
            </div>
            <div className="card-content">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Books Borrowed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Books Returned</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Overdue Books</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Pending Reservations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="dashboard-card actions-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="card-content">
              <div className="actions-grid">
                <button className="action-button">
                  <span className="action-icon">📚</span>
                  <span>Browse Books</span>
                </button>
                <button className="action-button">
                  <span className="action-icon">🔍</span>
                  <span>Search Catalog</span>
                </button>
                <button className="action-button">
                  <span className="action-icon">📖</span>
                  <span>My Borrowed Books</span>
                </button>
                <button className="action-button">
                  <span className="action-icon">⭐</span>
                  <span>My Reservations</span>
                </button>
                <button className="action-button">
                  <span className="action-icon">👤</span>
                  <span>Edit Profile</span>
                </button>
                <button className="action-button">
                  <span className="action-icon">📊</span>
                  <span>View History</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="dashboard-card activity-card">
            <div className="card-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="card-content">
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-content">
                    <div className="activity-text">Account created successfully</div>
                    <div className="activity-time">{formatDate(user.createdAt)}</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🎉</div>
                  <div className="activity-content">
                    <div className="activity-text">Welcome to the library system!</div>
                    <div className="activity-time">Just now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;