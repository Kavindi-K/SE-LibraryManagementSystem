import React from 'react';
import './BookStats.css';

const BookStats = ({ stats }) => {
  const {
    totalBooks = 0,
    availableBooks = 0,
    unavailableBooks = 0,
  } = stats;

  const availabilityPercentage = totalBooks > 0 ? Math.round((availableBooks / totalBooks) * 100) : 0;
  
  const statsData = [
    {
      icon: '📚',
      title: 'Total Books',
      value: totalBooks,
      subtitle: 'Unique titles',
      color: 'primary',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
    },
    {
      icon: '✅',
      title: 'Available Books',
      value: availableBooks,
      subtitle: `${availabilityPercentage}% of collection`,
      color: 'success',
      gradient: 'linear-gradient(135deg, #51cf66, #40c057)'
    },
    {
      icon: '❌',
      title: 'Unavailable Books',
      value: unavailableBooks,
      subtitle: 'Currently borrowed/reserved',
      color: 'danger',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a52)'
    },
    
  ];

  return (
    <div className="book-stats">
      <div className="stats-header">
        <h2>📊 Library Statistics</h2>
        <p>Real-time overview of your library collection</p>
      </div>
      
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div 
            key={index} 
            className={`stat-card ${stat.color}`}
            style={{ background: stat.gradient }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
              <div className="stat-subtitle">{stat.subtitle}</div>
            </div>
            <div className="stat-decoration">
              <div className="decoration-circle"></div>
              <div className="decoration-circle"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      <div className="progress-section">
        <div className="progress-item">
          <div className="progress-header">
            <span className="progress-label">📚 Book Availability</span>
            <span className="progress-value">{availabilityPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill availability"
              style={{ width: `${availabilityPercentage}%` }}
            ></div>
          </div>
          <div className="progress-info">
            <span>{availableBooks} available</span>
            <span>{unavailableBooks} unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookStats;