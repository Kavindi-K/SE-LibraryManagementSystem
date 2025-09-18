// src/pages/BookList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, deleteBook } from '../api/bookService';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        fetchBooks();
      } catch (err) {
        console.error('Error deleting book:', err);
      }
    }
  };

  return (
    <div className="book-list-container">
      <h1 className="book-list-title">Library Books</h1>
      <div className="create-btn-wrapper">
        <Link to="/create" className="btn btn-primary">Add New Book</Link>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Year</th>
              <th>Edition</th>
              <th>Description</th>
              <th>Language</th>
              <th>Availability</th>
              <th>Borrower</th>
              <th>Available Copies</th>
              <th>Location</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="15" className="text-center">No books found.</td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.year}</td>
                  <td>{book.edition}</td>
                  <td>{book.description}</td>
                  <td>{book.language}</td>
                  <td>{book.availability ? 'Yes' : 'No'}</td>
                  <td>{book.borrower || '-'}</td>
                  <td>{book.availableCopies}</td>
                  <td>{book.location}</td>
                  <td>{book.createdAt?.substring(0, 10)}</td>
                  <td>{book.updatedAt?.substring(0, 10)}</td>
                  <td className="action-buttons">
                    <Link to={`/edit/${book.id}`} className="btn btn-sm btn-primary me-2">Edit</Link>
                    <button onClick={() => handleDelete(book.id)} className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;
