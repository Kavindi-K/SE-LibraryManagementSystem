import React from 'react';
import './BookDetails.css';

const BookDetails = ({ book, onClose }) => {
  if (!book) return null;

  const {
    title,
    image,
    author,
    genre,
    year,
    edition,
    description,
    language,
    availability,
    availableCopies,
    location,
    createdAt,
    updatedAt
  } = book;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="book-details-overlay" onClick={onClose}>
      <div className="book-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>
          ×
        </button>
        
        <div className="book-details-content">
          <div className="book-details-image">
            {image ? (
              <img
                src={image}
                alt={title}
                className="details-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="details-placeholder" style={{ display: 'flex' }}>
                <span>📚</span>
              </div>
            )}
            {image && (
              <div className="details-placeholder" style={{ display: 'none' }}>
                <span>📚</span>
              </div>
            )}
          </div>
          
          <div className="book-details-info">
            <div className="details-header">
              <h2 className="details-title">{title}</h2>
              {edition && (
                <span className="details-edition">({edition})</span>
              )}
            </div>
            
            <p className="details-author">by {author}</p>
            
            <div className="details-status">
              <span className={`status-indicator ${availability ? 'available' : 'unavailable'}`}>
                {availability ? '✅ Available' : '❌ Unavailable'}
              </span>
              {availability && availableCopies && (
                <span className="copies-available">
                  {availableCopies} {availableCopies === 1 ? 'copy' : 'copies'} available
                </span>
              )}
            </div>
            
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Genre:</span>
                <span className="detail-value genre-tag">{genre}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Year:</span>
                <span className="detail-value">{year}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Language:</span>
                <span className="detail-value">{language}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Location:</span>
                <span className="detail-value location-tag">{location}</span>
              </div>
              
              {createdAt && (
                <div className="detail-item">
                  <span className="detail-label">Added:</span>
                  <span className="detail-value">{formatDate(createdAt)}</span>
                </div>
              )}
              
              {updatedAt && updatedAt !== createdAt && (
                <div className="detail-item">
                  <span className="detail-label">Updated:</span>
                  <span className="detail-value">{formatDate(updatedAt)}</span>
                </div>
              )}
            </div>
            
            {description && (
              <div className="description-section">
                <h3 className="description-title">Description</h3>
                <p className="description-text">{description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;