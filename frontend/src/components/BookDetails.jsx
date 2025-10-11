import React, { useState } from 'react';
import { api } from '../api';
import './BookDetails.css';

const BookDetails = ({ book, onClose, onBorrowSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [borrowing, setBorrowing] = useState(false);
  const [error, setError] = useState('');

  if (!book) {
    return null;
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(Math.max(1, Math.min(value, book.availableCopies || 1)));
  };

  const handleBorrow = async () => {
    if (!book.availability || quantity <= 0) {
      setError('This book is not available for borrowing');
      return;
    }

    // Get user and member info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.id) {
      setError('Please log in to borrow books');
      return;
    }

    setBorrowing(true);
    setError('');

    try {
      // Get member info using user ID
      const memberResponse = await fetch(`http://localhost:8081/api/members/user/${user.id}`);
      if (!memberResponse.ok) {
        throw new Error('Member information not found');
      }

      const memberData = await memberResponse.json();
      if (!memberData.success || !memberData.data) {
        throw new Error('Member information not found');
      }

      const member = memberData.data;
      const memberId = member.memberId || member.id;

      // Create borrowing record
      const borrowingData = {
        memberId: memberId,
        bookId: book.id,
        borrowDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        status: 'ACTIVE',
        lateFee: 0,
        quantity: quantity
      };

      const borrowingResult = await api.createBorrowing(borrowingData);

      // Update book availability if needed
      const newAvailableCopies = book.availableCopies - quantity;
      const updateBookData = {
        ...book,
        availableCopies: newAvailableCopies,
        availability: newAvailableCopies > 0
      };

      // Update book in the backend
      await fetch(`http://localhost:8081/api/books/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateBookData),
      });

      // Success - call callback if provided
      if (onBorrowSuccess) {
        onBorrowSuccess(borrowingResult, book);
      }

      alert(`Successfully borrowed ${quantity} copy(ies) of "${book.title}". Due date: ${new Date(borrowingData.dueDate).toLocaleDateString()}`);
      onClose();

    } catch (err) {
      console.error('Error borrowing book:', err);
      setError(err.message || 'Failed to borrow book. Please try again.');
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <div className="book-details-overlay" onClick={onClose}>
      <div className="book-details-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="book-details-container">
          
          {/* Book Image */}
          {book.image && (
            <div className="book-details-image">
              <img 
                src={book.image} 
                alt={book.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Book Information */}
          <div className="book-details-info">
            
            {/* Book Number Badge */}
            <div className="book-no-detail">
              <span className="book-no-badge-detail">{book.bookNo}</span>
            </div>

            {/* Title */}
            <h2 className="book-title-detail">{book.title}</h2>

            {/* Author */}
            <p className="book-author-detail">
              <span className="label">Author:</span>
              <span className="value">{book.author}</span>
            </p>

            {/* Genre */}
            <p className="book-genre-detail">
              <span className="label">Genre:</span>
              <span className="value genre-tag">{book.genre}</span>
            </p>

            {/* Year */}
            <p className="book-year-detail">
              <span className="label">Year:</span>
              <span className="value">{book.year}</span>
            </p>

            {/* Edition */}
            {book.edition && (
              <p className="book-edition-detail">
                <span className="label">Edition:</span>
                <span className="value">{book.edition}</span>
              </p>
            )}

            {/* Language */}
            <p className="book-language-detail">
              <span className="label">Language:</span>
              <span className="value">{book.language}</span>
            </p>

            {/* Location */}
            <p className="book-location-detail">
              <span className="label">Location:</span>
              <span className="value location-tag">{book.location}</span>
            </p>

            {/* Available Copies */}
            <p className="book-copies-detail">
              <span className="label">Available Copies:</span>
              <span className={`value copies-badge ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                {book.availableCopies}
              </span>
            </p>

            {/* Availability Status */}
            <div className="book-availability-detail">
              <span className="label">Status:</span>
              <span className={`status-badge ${book.availability ? 'available' : 'unavailable'}`}>
                {book.availability ? 'Available for Borrowing' : 'Currently Unavailable'}
              </span>
            </div>

            {/* Description */}
            {book.description && (
              <div className="book-description-detail">
                <h3>Description</h3>
                <p>{book.description}</p>
              </div>
            )}

            {/* Borrow Section */}
            {book.availability && book.availableCopies > 0 && (
              <div className="borrow-section">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <select 
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-select"
                  >
                    {[...Array(book.availableCopies)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  className="btn btn-borrow"
                  onClick={handleBorrow}
                  disabled={borrowing}
                >
                  {borrowing ? 'Borrowing...' : 'Borrow Book'}
                </button>
              </div>
            )}

            {/* Unavailable Message */}
            {(!book.availability || book.availableCopies === 0) && (
              <div className="unavailable-message">
                This book is currently unavailable. Please check back later or reserve it.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

