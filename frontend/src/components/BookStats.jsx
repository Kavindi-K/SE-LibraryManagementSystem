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
    <div className="book-stats"></div>
  );
};

export default BookStats;