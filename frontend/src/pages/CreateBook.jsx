import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook } from '../api/bookService'; // Make sure you have this API function
import './CreateBook.css';

const CreateBook = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: '',
    year: '',
    edition: '',
    description: '',
    language: '',
    availability: true,
    borrower: '',
    availableCopies: 1,
    location: '',
    createdAt: '',
    updatedAt: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBook(book);
    navigate('/');
  };

  return (
    <div className="create-book-container">
      <h2 className="title">Add New Book</h2>
      <form onSubmit={handleSubmit} className="book-form">
        {['title', 'author', 'genre', 'year', 'edition', 'description', 'language', 'borrower', 'availableCopies', 'location', 'createdAt', 'updatedAt'].map((field) => (
          <div className="form-group" key={field}>
            <label className="form-label">{field}</label>
            <input
              className="form-input"
              type={field === 'year' || field === 'availableCopies' ? 'number' : field.includes('At') ? 'date' : 'text'}
              name={field}
              value={book[field]}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="form-group checkbox-group">
          <label className="form-label">Availability</label>
          <input
            type="checkbox"
            name="availability"
            checked={book.availability}
            onChange={handleChange}
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn-submit">Submit</button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateBook;
