import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from '../api';
import MemberManagement from "./MemberManagement";
import Reservations from "./Reservations";
import Borrowings from "./Borrowings";
import DashboardStats from "./DashboardStats";
import BookList from "./BookList";
import BookForm from "./BookForm";
import BookStats from "./BookStats";
// Use /logo.png directly for logout button (Vite public asset)
import "./AdminHome.css";

const AdminHome = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Book management state
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
  const [nextBookNo, setNextBookNo] = useState('B10001');

  // Using api.js for production-ready API calls

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isAdmin");
    // Navigate to landing page
    navigate("/");
  };

  // Generate next book number
  const generateNextBookNo = (booksList) => {
    if (booksList.length === 0) {
      return 'B10001';
    }
    
    // Extract numbers from bookNo and find the max
    const numbers = booksList
      .map(book => {
        const match = book.bookNo?.match(/B(\d+)/);
        return match ? parseInt(match[1]) : 10000;
      })
      .filter(num => !isNaN(num));
    
    if (numbers.length === 0) return 'B10001';
    
    const maxNum = Math.max(...numbers);
    const nextNum = maxNum + 1;
    return `B${nextNum}`;
  };

  // Book management functions
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await api.listBooks();
      console.log('Fetched books:', data);
      setBooks(data);
      // Generate next book number after fetching
      setNextBookNo(generateNextBookNo(data));
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.getBookStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const addBook = async (bookData) => {
    setLoading(true);
    try {
      // Auto-generate bookNo if not provided
      const bookWithNo = {
        ...bookData,
        bookNo: bookData.bookNo || nextBookNo
      };

      await api.createBook(bookWithNo);
      setSuccess('Book added successfully!');
      setShowForm(false);
      console.log('Book added successfully, refreshing list...');
      fetchBooks();
      fetchStats();
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Error adding book');
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id, bookData) => {
    setLoading(true);
    try {
      await api.updateBook(id, bookData);
      setSuccess('Book updated successfully!');
      setEditingBook(null);
      setShowForm(false);
      fetchBooks();
      fetchStats();
    } catch (err) {
      console.error('Error updating book:', err);
      setError('Error updating book');
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setLoading(true);
      try {
        await api.deleteBook(id);
        setSuccess('Book deleted successfully!');
        fetchBooks();
        fetchStats();
      } catch (err) {
        console.error('Error deleting book:', err);
        setError('Error deleting book');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleFormSubmit = (bookData) => {
    if (editingBook) {
      updateBook(editingBook.id, bookData);
    } else {
      addBook(bookData);
    }
  };

  const handleFormCancel = () => {
    setEditingBook(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  // Authentication check on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Double verification: check both admin flag and username
    if (!isAuthenticated || !isAdmin || user.username !== 'Admin') {
      // Redirect to login if not properly authenticated as admin
      navigate('/login');
    }
  }, [navigate]);

  // Load books when Books Management section is active
  useEffect(() => {
    if (activeSection === 'books') {
      fetchBooks();
      fetchStats();
    }
  }, [activeSection]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const renderContent = () => {
    switch(activeSection) {
      case 'members':
        return <MemberManagement />;
      case 'books':
        return (
          <div className="books-management">
            <h2>Books Management</h2>

            {/* Success/Error Messages */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Add Book Button */}
            {!showForm && (
              <div className="book-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                  disabled={loading}
                >
                  Add New Book
                </button>
                <span className="next-book-no">Next Book No: {nextBookNo}</span>
              </div>
            )}

            {/* Book Form */}
            {showForm && (
              <BookForm
                book={editingBook}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                loading={loading}
                suggestedBookNo={!editingBook ? nextBookNo : null}
              />
            )}

            {/* Book List */}
            {!showForm && (
              <>
                <div style={{ marginBottom: '20px' }}></div>
                <BookList
                  books={books}
                  onEdit={handleEditBook}
                  onDelete={deleteBook}
                  loading={loading}
                />
              </>
            )}
          </div>
        );
      case 'reservations':
        return <Reservations />;
      case 'borrowing':
        return <Borrowings />;
      default:
        return (
          <div className="dashboard-overview">
            <h1>Welcome, Admin</h1>
            <p>Here's your comprehensive library management dashboard with live member statistics.</p>

            <DashboardStats />
          </div>
        );
    }
  };

  return (
    <div className="admin-home">
      {/* Sidebar */}
      <nav className="admin-sidebar">
        <h2 className="logo">Navigation</h2>
        <ul>
          <li>
            <button
              className={activeSection === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveSection('dashboard')}
            >
              📊 Dashboard
            </button>
          </li>
          <li>
            <button
              className={activeSection === 'members' ? 'active' : ''}
              onClick={() => setActiveSection('members')}
            >
              👥 Member Management
            </button>
          </li>
          <li>
            <button
              className={activeSection === 'books' ? 'active' : ''}
              onClick={() => setActiveSection('books')}
            >
              � Books Management
            </button>
          </li>
          <li>
            <button
              className={activeSection === 'borrowing' ? 'active' : ''}
              onClick={() => setActiveSection('borrowing')}
            >
              � Borrowing & Fines
            </button>
          </li>
          <li>
            <button
              className={activeSection === 'reservations' ? 'active' : ''}
              onClick={() => setActiveSection('reservations')}
            >
              � Reservations
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="admin-content">
        {/* Header Bar */}
        <header className="admin-header">
          <div className="admin-header-content">
            <div className="admin-logo-section">
              <img 
                src="/logo.png" 
                alt="SARASAVI Logo" 
                className="admin-logo-image"
              />
              <div className="admin-logo-text">
                <h1 className="admin-logo-title">SARASAVI</h1>
                <p className="admin-logo-subtitle">LIBRARY & LEARNING HUB</p>
              </div>
            </div>
            
            <h2 className="admin-title">Admin Dashboard</h2>
            
            <button className="logout-btn" onClick={handleLogout}>
              <img src="/logout.png" alt="Logout" className="logout-icon" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="dashboard-overview">
          {renderContent()}
        </main>

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

export default AdminHome;
