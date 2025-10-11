import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MemberManagement from "./MemberManagement";
import Reservations from "./Reservations";
import Borrowings from "./Borrowings";
import DashboardStats from "./DashboardStats";
import BookList from "./BookList";
import BookForm from "./BookForm";
import BookStats from "./BookStats";
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

  const API_BASE_URL = 'http://localhost:8081/api/books';

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
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
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched books:', data);
        setBooks(data);
        // Generate next book number after fetching
        setNextBookNo(generateNextBookNo(data));
      } else {
        console.error('Failed to fetch books - Status:', response.status);
        setError('Failed to fetch books');
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

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

  const addBook = async (bookData) => {
    setLoading(true);
    try {
      // Auto-generate bookNo if not provided
      const bookWithNo = {
        ...bookData,
        bookNo: bookData.bookNo || nextBookNo
      };

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookWithNo),
      });

      if (response.ok) {
        setSuccess('Book added successfully!');
        setShowForm(false);
        console.log('Book added successfully, refreshing list...');
        fetchBooks();
        fetchStats();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add book');
      }
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

            {/* Book Stats */}
            <BookStats stats={stats} />

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

            <div className="overview-stats">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>Member Management</h3>
                  <p>Manage library members, memberships, and profiles</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveSection('members')}
                  >
                    Go to Members
                  </button>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <h3>Books Management</h3>
                  <p>Catalog management and book inventory</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveSection('books')}
                  >
                    Go to Books
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-home">
      {/* Sidebar */}
      <nav className="admin-sidebar">
        <h2 className="logo">Admin Dashboard</h2>
        <ul>
          <li>
            <button
              className={activeSection === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={activeSection === 'members' ? 'active' : ''}
              onClick={() => setActiveSection('members')}
            >
              Member Management
            </button>
          </li>
          <li>
            <button
              className={activeSection === 'books' ? 'active' : ''}
              onClick={() => setActiveSection('books')}
            >
              Books Management
            </button>
          </li>
          <li>
            <button
              className={activeSection === 'borrowing' ? 'active' : ''}
              onClick={() => setActiveSection('borrowing')}
            >
              Books Borrowing & Fine Management
            </button>
          </li>
          <li>
            <button
              className={activeSection === 'reservations' ? 'active' : ''}
              onClick={() => setActiveSection('reservations')}
            >
              Book Reservations Management
            </button>
          </li>
        </ul>

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      {/* Main Content */}
      <div className="admin-content">
        {renderContent()}

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
