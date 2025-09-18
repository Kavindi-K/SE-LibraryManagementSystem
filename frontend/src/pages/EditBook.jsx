import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookById, updateBook } from '../api/bookService';
import './EditBook.css';

const EditBook = () => {
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await getBookById(id);
        setBook(response.data);
      } catch (err) {
        console.error('Error fetching book:', err);
      }
    }
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBook(id, book);
      navigate('/');
    } catch (err) {
      console.error('Error updating book:', err);
      alert('Failed to update book');
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="edit-book-container">
      <h2 className="title">Edit Book</h2>
      <form onSubmit={handleSubmit} className="book-form">
        {['title', 'author', 'genre', 'year', 'edition', 'description', 'language', 'borrower', 'availableCopies', 'location'].map((field) => (
          <div className="form-group" key={field}>
            <label className="form-label">{field}</label>
            <input
              type={field === 'year' || field === 'availableCopies' ? 'number' : 'text'}
              name={field}
              value={book[field] || ''}
              onChange={handleChange}
              className="form-input"
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

        <div className="form-group">
          <label className="form-label">Created At</label>
          <input
            className="form-input"
            readOnly
            value={book.createdAt?.substring(0, 10)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Updated At</label>
          <input
            className="form-input"
            readOnly
            value={book.updatedAt?.substring(0, 10)}
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

export default EditBook;
