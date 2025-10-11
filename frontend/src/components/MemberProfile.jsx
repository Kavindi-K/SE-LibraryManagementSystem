import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';
import './MemberProfile.css';

// Import missing components
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import BookGrid from '../components/BookGrid';
import BookDetails from '../components/BookDetails';

const MemberProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    dateOfBirth: ''
  });

  // Book related states
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [genres, setGenres] = useState([]);

  // Borrowings & Reservations
  const [myBorrowings, setMyBorrowings] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [newReservation, setNewReservation] = useState({ bookId: '', reservationDate: new Date().toISOString().slice(0,10) });

  // Professional modal state for borrowing details
  const [showBorrowingModal, setShowBorrowingModal] = useState(false);
  const [selectedBorrowingDetails, setSelectedBorrowingDetails] = useState(null);

  // Professional modal state for reservation details
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedReservationDetails, setSelectedReservationDetails] = useState(null);

  const API_BASE_URL = 'http://localhost:8081/api/books';

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData || !userData.id) {
      navigate('/login');
      return;
    }
    setUser(userData);
    loadMemberProfile(userData.id);
  }, [navigate]);

  const loadMemberProfile = async (userId) => {
    try {
      const memberResponse = await axios.get(`http://localhost:8081/api/members/user/${userId}`);
      if (memberResponse.data.success) {
        setMember(memberResponse.data.data);
        const userResponse = await axios.get(`http://localhost:8081/api/users/${userId}`);
        if (userResponse.data.success) {
          const userData = userResponse.data.data;
          setProfileData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phone: userData.phone || '',
            address: userData.address || '',
            dateOfBirth: userData.dateOfBirth || ''
          });
        }
      }
    } catch (err) {
      console.error('Error loading member profile:', err);
      setError('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(`http://localhost:8081/api/users/${user.id}`, profileData);
      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setEditMode(false);
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Profile picture must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setProfilePicture(imageData);
        if (user?.id) {
          localStorage.setItem(`profilePicture_${user.id}`, imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Fetch all books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
        setFilteredBooks(data);
        const uniqueGenres = [...new Set(data.map(book => book.genre))].sort();
        setGenres(uniqueGenres);
      } else {
        setError('Failed to fetch books');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search books
  useEffect(() => {
    let filtered = books;
    if (selectedGenre !== 'all') filtered = filtered.filter(book => book.genre === selectedGenre);
    if (availabilityFilter === 'available') filtered = filtered.filter(book => book.availability === true);
    else if (availabilityFilter === 'unavailable') filtered = filtered.filter(book => book.availability === false);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query)
      );
    }
    setFilteredBooks(filtered);
  }, [books, selectedGenre, searchQuery, availabilityFilter]);

  useEffect(() => {
    if (member?.id || member?.memberId) {
      const memberKey = member.memberId || member.id;
      (async () => {
        try {
          const borrowings = await api.listBorrowings({ memberId: memberKey });
          const reservations = await api.listReservations({ memberId: memberKey });
          setMyBorrowings(Array.isArray(borrowings) ? borrowings.filter(b => b.memberId === memberKey) : []);
          setMyReservations(Array.isArray(reservations) ? reservations.filter(r => r.memberId === memberKey) : []);
        } catch (err) {
          // ignore
        }
      })();
    }
  }, [member]);

  useEffect(() => {
    if (user?.id) {
      const savedPicture = localStorage.getItem(`profilePicture_${user.id}`);
      if (savedPicture) setProfilePicture(savedPicture);
    }
  }, [user]);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function createMyReservation(e) {
    e.preventDefault();
    if (!member?.memberId || !newReservation.bookId) return;
    try {
      const payload = { memberId: member.memberId, bookId: newReservation.bookId, reservationDate: newReservation.reservationDate, status: 'PENDING' };
      const created = await api.createReservation(payload);
      setMyReservations((prev) => [created, ...prev]);
      setNewReservation({ bookId: '', reservationDate: new Date().toISOString().slice(0,10) });
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteReservation(reservationId) {
    if (!window.confirm('Are you sure you want to delete this reservation?')) {
      return;
    }
    
    try {
      await api.deleteReservation(reservationId);
      setMyReservations((prev) => prev.filter(reservation => reservation.id !== reservationId));
      setSuccess('Reservation deleted successfully!');
    } catch (err) {
      console.error('Error deleting reservation:', err);
      setError('Failed to delete reservation. Please try again.');
    }
  }

  const booksByGenre = {};
  if (selectedGenre === 'all' && !searchQuery && availabilityFilter === 'all') {
    filteredBooks.forEach(book => {
      if (!booksByGenre[book.genre]) booksByGenre[book.genre] = [];
      booksByGenre[book.genre].push(book);
    });
  }
  const showCategorized = selectedGenre === 'all' && !searchQuery && availabilityFilter === 'all' && Object.keys(booksByGenre).length > 0;

  const handleSearch = (query) => setSearchQuery(query);
  const handleGenreFilter = (genre) => setSelectedGenre(genre);
  const handleAvailabilityFilter = (availability) => setAvailabilityFilter(availability);
  const handleBookSelect = (book) => setSelectedBook(book);
  const handleCloseDetails = () => setSelectedBook(null);

  // Handle successful borrowing - refresh borrowings list
  const handleBorrowSuccess = async (borrowingResult, book) => {
    try {
      // Refresh borrowings list to show the new borrowing
      if (member?.id || member?.memberId) {
        const memberKey = member.memberId || member.id;
        const borrowings = await api.listBorrowings({ memberId: memberKey });
        setMyBorrowings(Array.isArray(borrowings) ? borrowings.filter(b => b.memberId === memberKey) : []);
      }

      // Refresh books list to update availability
      await fetchBooks();

      // Show success message
      setSuccess(`Successfully borrowed "${book.title}"`);

      // Auto-switch to borrowings tab to show the new borrowing
      setActiveTab('borrowing-reservation-fines');
    } catch (err) {
      console.error('Error refreshing data after borrowing:', err);
    }
  };

  // Professional View borrowing details function - Enhanced with card-style modal
  const handleViewBorrowingDetails = async (borrowing) => {
    try {
      setLoading(true);

      // Get book details from backend
      const bookResponse = await fetch(`${API_BASE_URL}/${borrowing.bookId}`);
      let bookData = null;

      if (bookResponse.ok) {
        bookData = await bookResponse.json();
      }

      // Calculate borrowing details
      const dueDate = new Date(borrowing.dueDate);
      const borrowDate = new Date(borrowing.borrowDate);
      const today = new Date();
      const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      const isOverdue = daysRemaining < 0;

      // Set the selected borrowing details for professional modal
      setSelectedBorrowingDetails({
        ...borrowing,
        bookData,
        dueDate,
        borrowDate,
        daysRemaining,
        isOverdue
      });

      setShowBorrowingModal(true);
    } catch (err) {
      console.error('Error viewing borrowing details:', err);
      setError('Failed to load borrowing details');
    } finally {
      setLoading(false);
    }
  };

  // Close modal function
  const closeBorrowingModal = () => {
    setShowBorrowingModal(false);
    setSelectedBorrowingDetails(null);
  };

  // Professional View reservation details function - Similar to borrowing details
  const handleViewReservationDetails = async (reservation) => {
    try {
      setLoading(true);

      // Get book details from backend
      const bookResponse = await fetch(`${API_BASE_URL}/${reservation.bookId}`);
      let bookData = null;

      if (bookResponse.ok) {
        bookData = await bookResponse.json();
      }

      // Calculate reservation details
      const reservationDate = new Date(reservation.reservationDate);
      const expectedPickup = new Date(reservationDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days from reservation
      const today = new Date();
      const daysUntilPickup = Math.ceil((expectedPickup - today) / (1000 * 60 * 60 * 24));
      const isExpired = daysUntilPickup < 0;

      // Set the selected reservation details for professional modal
      setSelectedReservationDetails({
        ...reservation,
        bookData,
        reservationDate,
        expectedPickup,
        daysUntilPickup,
        isExpired
      });

      setShowReservationModal(true);
    } catch (err) {
      console.error('Error viewing reservation details:', err);
      setError('Failed to load reservation details');
    } finally {
      setLoading(false);
    }
  };

  // Close reservation modal function
  const closeReservationModal = () => {
    setShowReservationModal(false);
    setSelectedReservationDetails(null);
  };

  // Professional Borrowing Details Modal Component
  const BorrowingDetailsModal = () => {
    if (!showBorrowingModal || !selectedBorrowingDetails) return null;

    const { bookData, dueDate, borrowDate, daysRemaining, isOverdue } = selectedBorrowingDetails;

    return (
      <div className="book-details-overlay" onClick={closeBorrowingModal}>
        <div className="professional-book-card" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={closeBorrowingModal}>×</button>

          <div className="book-card-content">
            {/* Book Image Section */}
            <div className="book-image-section">
              {bookData?.image ? (
                <img
                  src={bookData.image}
                  alt={bookData.title || 'Book cover'}
                  className="book-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="book-cover-placeholder"
                style={{ display: bookData?.image ? 'none' : 'flex' }}
              >
                <div className="book-icon">📚</div>
                <span>1984</span>
                <span style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                  {bookData?.title || 'Book Title'}
                </span>
              </div>
            </div>

            {/* Book Details Section */}
            <div className="book-info-section">
              <div className="availability-indicator">
                <span className={`availability-status ${selectedBorrowingDetails.status === 'ACTIVE' ? 'borrowed' : 'returned'}`}>
                  {selectedBorrowingDetails.status === 'ACTIVE' ? 'CURRENTLY BORROWED' : 'RETURNED'}
                </span>
              </div>

              <h2 className="book-title">{bookData?.title || 'Unknown Title'}</h2>

              <div className="book-details-grid">
                <div className="detail-row">
                  <span className="detail-label">Author:</span>
                  <span className="detail-value author-name">{bookData?.author || 'Unknown Author'}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Genre:</span>
                  <span className="detail-value genre-badge">{bookData?.genre || 'Unknown'}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Year:</span>
                  <span className="detail-value">{bookData?.year || 'N/A'}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Edition:</span>
                  <span className="detail-value">{bookData?.edition || 'N/A'}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Language:</span>
                  <span className="detail-value">{bookData?.language || 'English'}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value location-badge">{bookData?.location || 'Unknown'}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Borrowed Date:</span>
                  <span className="detail-value">{borrowDate.toLocaleDateString()}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Due Date:</span>
                  <span className={`detail-value ${isOverdue ? 'overdue-date' : ''}`}>
                    {dueDate.toLocaleDateString()}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Days Status:</span>
                  <span className={`detail-value ${isOverdue ? 'overdue-status' : daysRemaining <= 3 ? 'warning-status' : 'normal-status'}`}>
                    {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Late Fee:</span>
                  <span className={`detail-value ${selectedBorrowingDetails.lateFee > 0 ? 'fee-amount' : 'no-fee'}`}>
                    {selectedBorrowingDetails.lateFee > 0 ? `$${selectedBorrowingDetails.lateFee.toFixed(2)}` : 'No fee'}
                  </span>
                </div>
              </div>

              {/* Book Description */}
              {bookData?.description && (
                <div className="description-section">
                  <h4>Description</h4>
                  <p className="book-description-text">{bookData.description}</p>
                </div>
              )}

              {/* Status Alerts */}
              {isOverdue && (
                <div className="status-alert overdue-alert">
                  <span className="alert-icon">⚠️</span>
                  <span className="alert-text">This book is overdue! Please return it immediately to avoid additional late fees.</span>
                </div>
              )}

              {!isOverdue && daysRemaining <= 3 && selectedBorrowingDetails.status === 'ACTIVE' && (
                <div className="status-alert warning-alert">
                  <span className="alert-icon">⏰</span>
                  <span className="alert-text">This book is due soon! Please return it within {daysRemaining} days.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="modal-actions">
                {selectedBorrowingDetails.status === 'ACTIVE' && (
                  <button
                    className="return-book-btn"
                    onClick={() => {
                      closeBorrowingModal();
                      handleReturnBook(selectedBorrowingDetails);
                    }}
                  >
                    Return Book
                  </button>
                )}
                <button className="close-modal-btn" onClick={closeBorrowingModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Professional Reservation Details Modal Component
  const ReservationDetailsModal = () => {
    if (!showReservationModal || !selectedReservationDetails) return null;

    const { bookData, reservationDate, expectedPickup, daysUntilPickup, isExpired } = selectedReservationDetails;

    return (
      <div className="book-details-overlay" onClick={closeReservationModal}>
        <div className="professional-book-card" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={closeReservationModal}>×</button>

          <div className="book-card-content">
            {/* Book Image Section */}
            <div className="book-image-section">
              {bookData?.image ? (
                <img
                  src={bookData.image}
                  alt={bookData.title || 'Book cover'}
                  className="book-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="book-cover-placeholder"
                style={{ display: bookData?.image ? 'none' : 'flex' }}
              >
                <div className="book-icon">📋</div>
                <span>RESERVED</span>
                <span style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                  {bookData?.title || 'Book Title'}
                </span>
              </div>
            </div>

            {/* Book Details Section */}
            <div className="book-info-section">
              <div className="availability-indicator">
                <span className={`availability-status ${selectedReservationDetails.status === 'PENDING' ? 'reserved' : selectedReservationDetails.status.toLowerCase()}`}>
                  {selectedReservationDetails.status === 'PENDING' ? 'RESERVATION PENDING' : `RESERVATION ${selectedReservationDetails.status}`}
                </span>
              </div>

              <h2 className="book-title">{bookData?.title || 'Unknown Title'}</h2>

              <div className="book-details-grid">
                <div className="detail-row">
                  <span className="detail-label">Author:</span>
                  <span className="detail-value author-name">{bookData?.author || 'Unknown Author'}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Genre:</span>
                  <span className="detail-value genre-badge">{bookData?.genre || 'Unknown'}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Year:</span>
                  <span className="detail-value">{bookData?.year || 'N/A'}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Edition:</span>
                  <span className="detail-value">{bookData?.edition || 'N/A'}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Language:</span>
                  <span className="detail-value">{bookData?.language || 'English'}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value location-badge">{bookData?.location || 'Unknown'}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Reservation Date:</span>
                  <span className="detail-value">{reservationDate.toLocaleDateString()}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Expected Pickup:</span>
                  <span className={`detail-value ${isExpired ? 'overdue-date' : ''}`}>
                    {expectedPickup.toLocaleDateString()}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Pickup Status:</span>
                  <span className={`detail-value ${isExpired ? 'overdue-status' : daysUntilPickup <= 3 ? 'warning-status' : 'normal-status'}`}>
                    {isExpired ? `${Math.abs(daysUntilPickup)} days expired` : `${daysUntilPickup} days until pickup`}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Reservation Status:</span>
                  <span className={`detail-value status-badge ${selectedReservationDetails.status.toLowerCase()}`}>
                    {selectedReservationDetails.status}
                  </span>
                </div>
              </div>

              {/* Book Description */}
              {bookData?.description && (
                <div className="description-section">
                  <h4>Description</h4>
                  <p className="book-description-text">{bookData.description}</p>
                </div>
              )}

              {/* Status Alerts */}
              {isExpired && (
                <div className="status-alert overdue-alert">
                  <span className="alert-icon">⚠️</span>
                  <span className="alert-text">This reservation has expired! Please contact the library to extend or renew your reservation.</span>
                </div>
              )}

              {!isExpired && daysUntilPickup <= 3 && selectedReservationDetails.status === 'PENDING' && (
                <div className="status-alert warning-alert">
                  <span className="alert-icon">⏰</span>
                  <span className="alert-text">Your book will be available for pickup soon! Please collect it within {daysUntilPickup} days.</span>
                </div>
              )}

              {selectedReservationDetails.status === 'RECEIVED' && (
                <div className="status-alert success-alert">
                  <span className="alert-icon">✅</span>
                  <span className="alert-text">Great! You have successfully received this reserved book.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="modal-actions">
                {selectedReservationDetails.status === 'PENDING' && (
                  <button
                    className="cancel-reservation-btn"
                    onClick={() => {
                      closeReservationModal();
                      deleteReservation(selectedReservationDetails.id);
                    }}
                  >
                    Cancel Reservation
                  </button>
                )}
                <button className="close-modal-btn" onClick={closeReservationModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="tab-content">
            <h3>👤 Profile Settings</h3>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleProfileUpdate}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={user?.email || ''} disabled />
                </div>
                <div className="form-group">
                  <label>User ID</label>
                  <input type="text" value={user?.id || ''} disabled />
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    disabled={!editMode}
                  />
                </div>
              </div>
              {editMode ? (
                <div className="button-group">
                  <button type="submit" className="save-btn">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => { setEditMode(false); loadMemberProfile(user.id); }}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" className="edit-btn" onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>
              )}
            </form>
          </div>
        );

      case 'books':
        return (
          <div className="app">
            <div className="container">
              {/* Search & Filters */}
              <div className="controls-section">
                <SearchBar onSearch={handleSearch} />
                <div className="filters">
                  <GenreFilter genres={genres} selectedGenre={selectedGenre} onGenreChange={handleGenreFilter} />
                  <div className="availability-filter">
                    <label>Availability:</label>
                    <select value={availabilityFilter} onChange={(e) => handleAvailabilityFilter(e.target.value)} className="filter-select">
                      <option value="all">All Books</option>
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Books display */}
              {!loading && (
                <>
                  {showCategorized ? (
                    Object.entries(booksByGenre).map(([genre, genreBooks]) => (
                      <div key={genre} className="genre-section">
                        <h2 className="genre-title">{genre}</h2>
                        <BookGrid books={genreBooks} onBookSelect={handleBookSelect} />
                      </div>
                    ))
                  ) : (
                    <BookGrid books={filteredBooks} onBookSelect={handleBookSelect} />
                  )}
                </>
              )}

              {selectedBook && <BookDetails book={selectedBook} onClose={handleCloseDetails} onBorrowSuccess={handleBorrowSuccess} />}
            </div>
          </div>
        );

      case 'borrowing-reservation-fines':
        return (
          <div className="tab-content">
            <h3>📋 Borrowing, Reservations & Fines</h3>
            {/* Create New Reservation (moved to top) */}
            <div className="section">
              <h4>➕ Create New Reservation</h4>
              <form onSubmit={createMyReservation} className="reservation-form">
                <div className="form-group">
                  <label>Book ID:</label>
                  <input
                    type="text"
                    value={newReservation.bookId}
                    onChange={(e) => setNewReservation({ ...newReservation, bookId: e.target.value })}
                    placeholder="Enter book ID"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Reservation Date:</label>
                  <input
                    type="date"
                    value={newReservation.reservationDate}
                    onChange={(e) => setNewReservation({ ...newReservation, reservationDate: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">Create Reservation</button>
              </form>
            </div>

            {/* Current Borrowings */}
            <div className="section">
              <h4>📚 Current Borrowings ({myBorrowings.length})</h4>
              {myBorrowings.length > 0 ? (
                <div className="table-wrapper">
                  <table className="detailed-table">
                    <thead>
                      <tr>
                        <th>Book ID</th>
                        <th>Borrow Date</th>
                        <th>Due Date</th>
                        <th>Days Remaining</th>
                        <th>Status</th>
                        <th>Late Fee</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myBorrowings.map((borrowing) => {
                        const dueDate = new Date(borrowing.dueDate);
                        const today = new Date();
                        const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                        const isOverdue = daysRemaining < 0;

                        return (
                          <tr key={borrowing.id} className={isOverdue ? 'overdue-row' : ''}>
                            <td className="book-id-cell">
                              <div className="book-id-info">
                                <span className="book-id">{borrowing.bookId}</span>
                              </div>
                            </td>
                            <td className="date-cell">
                              <div className="date-info">
                                <span className="date">{new Date(borrowing.borrowDate).toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="date-cell">
                              <div className="date-info">
                                <span className="date">{dueDate.toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="days-cell">
                              <span className={`days-remaining ${isOverdue ? 'overdue' : daysRemaining <= 3 ? 'warning' : 'normal'}`}>
                                {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
                              </span>
                            </td>
                            <td className="status-cell">
                              <span className={`status-badge ${borrowing.status.toLowerCase()}`}>
                                {borrowing.status}
                              </span>
                            </td>
                            <td className="fee-cell">
                              {borrowing.lateFee > 0 ? (
                                <span className="late-fee-amount">${borrowing.lateFee.toFixed(2)}</span>
                              ) : (
                                <span className="no-fee">No fee</span>
                              )}
                            </td>
                            <td className="actions-cell">
                              <button className="action-btn view-btn" onClick={() => handleViewBorrowingDetails(borrowing)}>View Details</button>
                              {borrowing.status === 'ACTIVE' && (
                                <button className="action-btn return-btn" onClick={() => handleReturnBook(borrowing)}>Return</button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-data-container">
                  <div className="no-data-icon">📚</div>
                  <p className="no-data">No current borrowings</p>
                  <p className="no-data-subtitle">You haven't borrowed any books yet</p>
                </div>
              )}
            </div>

            {/* Reservations */}
            <div className="section">
              <h4>📋 Reservations ({myReservations.length})</h4>
              {myReservations.length > 0 ? (
                <div className="table-wrapper">
                  <table className="detailed-table">
                    <thead>
                      <tr>
                        <th>Book ID</th>
                        <th>Reservation Date</th>
                        <th>Status</th>
                        <th>Expected Pickup</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myReservations.map((reservation) => {
                        const reservationDate = new Date(reservation.reservationDate);
                        const expectedPickup = new Date(reservationDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days from reservation

                        return (
                          <tr key={reservation.id}>
                            <td className="book-id-cell">
                              <div className="book-id-info">
                                <span className="book-id">{reservation.bookId}</span>
                              </div>
                            </td>
                            <td className="date-cell">
                              <div className="date-info">
                                <span className="date">{reservationDate.toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="status-cell">
                              <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                                {reservation.status}
                              </span>
                            </td>
                            <td className="date-cell">
                              <div className="date-info">
                                <span className="date">{expectedPickup.toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="actions-cell">
                              <button className="action-btn view-btn" onClick={() => handleViewReservationDetails(reservation)}>View Details</button>
                              <button
                                className="action-btn delete-btn"
                                onClick={() => deleteReservation(reservation.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-data-container">
                  <div className="no-data-icon">📋</div>
                  <p className="no-data">No current reservations</p>
                  <p className="no-data-subtitle">You haven't made any reservations yet</p>
                </div>
              )}
            </div>

            {/* Borrowing Details Modal */}
            {showBorrowingModal && selectedBorrowingDetails && (
              <div className="borrowing-details-modal">
                <div className="modal-content">
                  <span className="close-modal" onClick={() => setShowBorrowingModal(false)}>&times;</span>
                  <h4>📚 Borrowing Details</h4>
                  <div className="details-section">
                    <div className="detail-item">
                      <span className="detail-label">Book ID:</span>
                      <span className="detail-value">{selectedBorrowingDetails.bookId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Borrowed On:</span>
                      <span className="detail-value">{new Date(selectedBorrowingDetails.borrowDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Due Date:</span>
                      <span className="detail-value">{new Date(selectedBorrowingDetails.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">{selectedBorrowingDetails.status}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Late Fee:</span>
                      <span className="detail-value">${selectedBorrowingDetails.lateFee.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button className="action-btn" onClick={() => handleReturnBook(selectedBorrowingDetails)}>Return Book</button>
                  </div>
                </div>
              </div>
            )}

            {/* Reservation Details Modal */}
            {showReservationModal && selectedReservationDetails && (
              <div className="borrowing-details-modal">
                <div className="modal-content">
                  <span className="close-modal" onClick={() => setShowReservationModal(false)}>&times;</span>
                  <h4>📋 Reservation Details</h4>
                  <div className="details-section">
                    <div className="detail-item">
                      <span className="detail-label">Book ID:</span>
                      <span className="detail-value">{selectedReservationDetails.bookId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Reservation Date:</span>
                      <span className="detail-value">{new Date(selectedReservationDetails.reservationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">{selectedReservationDetails.status}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Expected Pickup:</span>
                      <span className="detail-value">{new Date(selectedReservationDetails.expectedPickup).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button className="action-btn" onClick={() => deleteReservation(selectedReservationDetails.id)}>Delete Reservation</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Return book function
  const handleReturnBook = async (borrowing) => {
    const confirmReturn = window.confirm(`Are you sure you want to return the book?\n\nBook ID: ${borrowing.bookId}\nBorrowed on: ${new Date(borrowing.borrowDate).toLocaleDateString()}`);

    if (!confirmReturn) return;

    try {
      setLoading(true);

      // Update borrowing status to RETURNED
      await api.returnBorrowing(borrowing.id);

      // Get book details to update availability
      const bookResponse = await fetch(`${API_BASE_URL}/${borrowing.bookId}`);
      if (bookResponse.ok) {
        const bookData = await bookResponse.json();

        // Update book availability (increase available copies)
        const updatedBookData = {
          ...bookData,
          availableCopies: (bookData.availableCopies || 0) + (borrowing.quantity || 1),
          availability: true
        };

        // Update book in backend
        await fetch(`${API_BASE_URL}/${borrowing.bookId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBookData),
        });
      }

      // Refresh borrowings list
      if (member?.id || member?.memberId) {
        const memberKey = member.memberId || member.id;
        const borrowings = await api.listBorrowings({ memberId: memberKey });
        setMyBorrowings(Array.isArray(borrowings) ? borrowings.filter(b => b.memberId === memberKey) : []);
      }

      // Refresh books list
      await fetchBooks();

      setSuccess(`Book returned successfully! Thank you for returning on time.`);

    } catch (err) {
      console.error('Error returning book:', err);
      setError('Failed to return book. Please try again or contact library staff.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div>Loading...</div>;

  return (
    <div className={`member-profile ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <header className="member-header">
        <div className="header-left">
          <div className="header-logo">
            <img src="/logo.png" alt="SARASAVI Logo" className="logo-image" style={{width: '90px', height: '90px'}} />
            <div className="logo-text">
              <h1 className="logo-title">SARASAVI</h1>
              <p className="logo-subtitle">LIBRARY & LEARNING HUB</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-profile">
              <div className="user-avatar">
                {profilePicture ?
                  <img src={profilePicture} alt="Profile" /> :
                  <div className="default-avatar">{profileData.firstName?.[0]}{profileData.lastName?.[0]}</div>
                }
              </div>
              <span className="username">{profileData.firstName} {profileData.lastName}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <img src="/logout.png" alt="Logout" className="logout-icon" />
            </button>
          </div>
        </div>
      </header>

      <div className="member-layout">
        <aside className="member-sidebar">
          <div className="sidebar-header">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <span className="toggle-icon">{sidebarCollapsed ? '→' : '←'}</span>
            </button>
            <h2>Member Portal</h2>
          </div>
          <nav className="sidebar-nav">
            <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <span className="nav-icon">👤</span>
              <span className="nav-text">My Profile</span>
            </button>
            <button className={`nav-item ${activeTab === 'books' ? 'active' : ''}`} onClick={() => setActiveTab('books')}>
              <span className="nav-icon">📚</span>
              <span className="nav-text">Borrow Books</span>
            </button>
            <button className={`nav-item ${activeTab === 'borrowing-reservation-fines' ? 'active' : ''}`} onClick={() => setActiveTab('borrowing-reservation-fines')}>
              <span className="nav-icon">📋</span>
              <span className="nav-text">My Borrowings</span>
            </button>
          </nav>
          <div className="sidebar-footer">
            <div className="member-info">
              <p className="member-id">ID: {member?.memberId || 'N/A'}</p>
              <p className="member-status">Status: {member?.status || 'Active'}</p>
              <p className="member-join-date">Member since: {member?.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </aside>

        <main className="member-main">
          <div className="content-header">
            <div className="profile-header">
              <div className="profile-picture">
                {profilePicture ? <img src={profilePicture} alt="Profile" /> : <div className="default-avatar">{profileData.firstName?.[0]}{profileData.lastName?.[0]}</div>}
              </div>
              <div className="profile-info">
                <h2>{profileData.firstName} {profileData.lastName}</h2>
                <div className="member-id-section">
                  <span className="member-id-label">Member ID:</span>
                  <span className="member-id-value">{member?.memberId || 'N/A'}</span>
                </div>
                <div className="member-status-section">
                  <span className="member-status-label">Status:</span>
                  <span className="member-status-value">{member?.status || 'Active'}</span>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <input type="file" id="profilePicture" accept="image/*" onChange={handleProfilePictureChange} style={{ display: 'none' }} />
              <label htmlFor="profilePicture" className="upload-btn">Change Photo</label>
            </div>
          </div>
          {renderTabContent()}
        </main>
      </div>

      {/* Professional Borrowing Details Modal */}
      <BorrowingDetailsModal />

      {/* Professional Reservation Details Modal */}
      <ReservationDetailsModal />
    </div>
  );
};

export default MemberProfile;

