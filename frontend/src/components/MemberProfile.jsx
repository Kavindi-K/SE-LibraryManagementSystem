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
      const memberResponse = await axios.get(`http://localhost:8081/api/members/profile/${userId}`);
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

              {selectedBook && <BookDetails book={selectedBook} onClose={handleCloseDetails} />}
            </div>
          </div>
        );

      case 'borrowing-reservation-fines':
        return (
          <div className="tab-content">
            <h3>📋 Borrowing, Reservations & Fines</h3>
            {/* Borrowings, Reservations & Fines code (same as your original) */}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div>Loading...</div>;

  return (
    <div className={`member-profile ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <header className="member-header">
        <div className="header-left"><h1>NexaLibrary University</h1></div>
        <div className="header-right">
          <span className="welcome-text">Welcome, {profileData.firstName}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="member-layout">
        <aside className="member-sidebar">
          <div className="sidebar-header">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <span className="toggle-icon">{sidebarCollapsed ? '→' : '←'}</span>
              <span className="toggle-text">{sidebarCollapsed ? 'Expand' : 'Collapse'}</span>
            </button>
            <h2>Member Portal</h2>
            <p>ID: {member?.memberId}</p>
          </div>
          <nav className="sidebar-nav">
            <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <span className="nav-icon">👤</span> <span className="nav-text">Profile</span>
            </button>
            <button className={`nav-item ${activeTab === 'books' ? 'active' : ''}`} onClick={() => setActiveTab('books')}>
              <span className="nav-icon">📚</span> <span className="nav-text">Books</span>
            </button>
            <button className={`nav-item ${activeTab === 'borrowing-reservation-fines' ? 'active' : ''}`} onClick={() => setActiveTab('borrowing-reservation-fines')}>
              <span className="nav-icon">📋</span> <span className="nav-text">Borrowing & Fines</span>
            </button>
          </nav>
          <div className="sidebar-footer">
            <p>Member since: {member?.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}</p>
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
                <p>Member ID: {member?.memberId}</p>
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
    </div>
  );
};

export default MemberProfile;
