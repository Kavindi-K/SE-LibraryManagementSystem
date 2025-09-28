import React from 'react';
import BookCard from './BookCard';
import './BookGrid.css';

const BookGrid = ({ books, onBookSelect }) => {
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard 
          key={book.id} 
          book={book}
          onViewMore={() => onBookSelect(book)}
        />
      ))}
    </div>
  );
};

export default BookGrid;