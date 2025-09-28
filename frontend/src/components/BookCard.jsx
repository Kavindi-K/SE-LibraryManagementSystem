import React from 'react';
import './BookCard.css';

const BookCard = ({ book, onViewMore }) => {
  const {
    title,
    image,
    author,
    genre,
    year,
    availability,
    availableCopies,
    description
  } = book;

  return (
    <div className="book-card">
      <div className="book-image-container">
        {image ? (
          <img
            src={image}
            alt={title}
            className="book-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <div className="book-placeholder" style={{ display: 'flex' }}>
            <span>📚</span>
          </div>
        )}
        {image && (
          <div className="book-placeholder" style={{ display: 'none' }}>
            <span>📚</span>
          </div>
        )}
      </div>

      <div className="book-info">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">by {author}</p>
      </div>

      <div className="book-actions">
        <button
          onClick={onViewMore}
          className="view-more-btn"
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default BookCard;