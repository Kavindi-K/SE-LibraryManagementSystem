import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Homepage from './components/Homepage';
import MemberProfile from './components/MemberProfile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LandingPage from './components/LandingPage';
import AdminHome from './components/AdminHome';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import BookStats from './components/BookStats';
import './App.css';

// Using api.js for production-ready API calls

// Library Management Component (your original App logic)
const LibraryManagement = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    unavailableBooks: 0,
    totalCopies: 0,
    availableCopies: 0
  });

  // Fetch all books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        setError('Failed to fetch books');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Fetch book statistics
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Add new book
  const addBook = async (bookData) => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        setSuccess('Book added successfully!');
        setShowForm(false);
        fetchBooks();
        fetchStats();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add book');
      }
    } catch (err) {
      setError('Error adding book');
    } finally {
      setLoading(false);
    }
  };

  // Update book
  const updateBook = async (id, bookData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        setSuccess('Book updated successfully!');
        setEditingBook(null);
        setShowForm(false);
        fetchBooks();
        fetchStats();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update book');
      }
    } catch (err) {
      setError('Error updating book');
    } finally {
      setLoading(false);
    }
  };

  // Delete book
  const deleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Book deleted successfully!');
          fetchBooks();
          fetchStats();
        } else {
          setError('Failed to delete book');
        }
      } catch (err) {
        setError('Error deleting book');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit book
  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  // Handle form submit
  const handleFormSubmit = (bookData) => {
    if (editingBook) {
      updateBook(editingBook.id, bookData);
    } else {
      addBook(bookData);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setEditingBook(null);
    setShowForm(false);
  };

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="library-management">
      <div className="container">
        <header className="app-header">
          <h1>📚 Library Management System - Admin Panel</h1>
        </header>

        {/* Messages */}
        {error && (
          <div className="message error">
            {error}
            <button onClick={clearMessages} className="close-btn">×</button>
          </div>
        )}
        
        {success && (
          <div className="message success">
            {success}
            <button onClick={clearMessages} className="close-btn">×</button>
          </div>
        )}

        {/* Book Statistics */}
        <BookStats stats={stats} />

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            disabled={loading}
          >
            ➕ Add New Book
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={() => {
              fetchBooks();
              fetchStats();
            }}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Book Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <BookForm
                book={editingBook}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                loading={loading}
              />
            </div>
          </div>
        )}

        {/* Book List */}
        <BookList
          books={books}
          onEdit={handleEditBook}
          onDelete={deleteBook}
          loading={loading}
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component with Routing
const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Homepage (formerly Dashboard) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            } 
          />

          {/* Member Profile Page */}
          <Route 
            path="/member-profile" 
            element={
              <ProtectedRoute>
                <MemberProfile />
              </ProtectedRoute>
            } 
          />

          {/* Admin Home (protected) */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminHome />
              </AdminRoute>
            } 
          />

          {/* Library Management System (your original functionality) */}
          <Route 
            path="/admin/library" 
            element={
              <ProtectedRoute>
                <LibraryManagement />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  ); 
};

export default App;