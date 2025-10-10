import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from './SearchBar';
import GenreFilter from './GenreFilter';
import BookGrid from './BookGrid';
import BookCard from './BookCard';
import BookDetails from './BookDetails';
import './Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showMemberIdModal, setShowMemberIdModal] = useState(false);
  const [memberFormData, setMemberFormData] = useState({
    email: '',
    password: '',
    membershipType: 'BASIC'
  });
  const [memberIdLoginData, setMemberIdLoginData] = useState({
    memberId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isExistingMember, setIsExistingMember] = useState(false);

  // Book-related states
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState('');

  const checkMembershipStatus = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      const response = await axios.get(`http://localhost:8081/api/members/profile/${userId}`);
      if (response.data.success) {
        setIsExistingMember(true);
      }
    } catch (error) {
      setIsExistingMember(false);
    }
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    if (userData && userData.email) {
      setMemberFormData(prev => ({
        ...prev,
        email: userData.email
      }));
      
      checkMembershipStatus(userData.id);
    }

    // Fetch books first, then extract genres from books data
    fetchBooks();
  }, [checkMembershipStatus]);

  // Filter books based on genre and search query
  useEffect(() => {
    let filtered = books;

    // Filter by genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(filtered);
    
    // Extract genres from books when books change
    if (books.length > 0) {
      const uniqueGenres = [...new Set(books.map(book => book.genre))].filter(Boolean).sort();
      setGenres(uniqueGenres);
    }
  }, [books, selectedGenre, searchQuery]);

  const fetchBooks = async () => {
    try {
      setBooksLoading(true);
      setBooksError('');
      const response = await axios.get('http://localhost:8081/api/books');
      if (response.data && Array.isArray(response.data)) {
        setBooks(response.data);
        setFilteredBooks(response.data);
      } else {
        setBooksError('Failed to load books');
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setBooksError('Error loading books. Please try again.');
    } finally {
      setBooksLoading(false);
    }
  };


  const handleBecomeMemberClick = () => {
    if (isExistingMember) {
      setShowMemberIdModal(true);
    } else {
      setShowMemberModal(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('member');
    localStorage.removeItem('isMemberAuthenticated');
    navigate('/login');
  };

  const handleMemberFormChange = (e) => {
    const { name, value } = e.target;
    setMemberFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleMemberIdChange = (e) => {
    const { name, value } = e.target;
    setMemberIdLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleMemberRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!memberFormData.email || !memberFormData.password) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (user && user.email !== memberFormData.email) {
        setError('Email must match your registered account email');
        setLoading(false);
        return;
      }

      const verifyResponse = await axios.post('http://localhost:8081/api/users/login', {
        username: user.username,
        password: memberFormData.password
      });

      if (!verifyResponse.data.success) {
        setError('Password verification failed. Please enter your correct password.');
        setLoading(false);
        return;
      }

      const memberResponse = await axios.post('http://localhost:8081/api/members/register', {
        userId: user.id,
        email: memberFormData.email,
        membershipType: memberFormData.membershipType
      });

      if (memberResponse.data.success) {
        setSuccess('Member registration successful! Check your email for your Member ID. You will need this ID to access your member profile in the future.');
        setMemberFormData({
          email: user.email || '',
          password: '',
          membershipType: 'BASIC'
        });
        
        setIsExistingMember(true);
        
        localStorage.setItem('member', JSON.stringify(memberResponse.data.data));
        localStorage.setItem('isMemberAuthenticated', 'true');
        
        setTimeout(() => {
          setShowMemberModal(false);
          navigate('/member-profile');
        }, 3000);
      } else {
        setError(memberResponse.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Member registration error:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already a member')) {
        setError('You are already a registered member. Please use "Already a Member?" option below and enter your Member ID to access your profile.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMemberIdLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!memberIdLoginData.memberId) {
        setError('Please enter your Member ID');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:8081/api/members/member-id/${memberIdLoginData.memberId}`);

      if (response.data.success) {
        localStorage.setItem('member', JSON.stringify(response.data.data));
        localStorage.setItem('isMemberAuthenticated', 'true');
        
        navigate('/member-profile');
      } else {
        setError(response.data.message || 'Member ID not found');
      }
    } catch (error) {
      console.error('Member login error:', error);
      setError('Member ID not found or invalid');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  const handleCloseDetail = () => {
    setSelectedBook(null);
  };

  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="homepage-header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/library.png" alt="Library Logo" className="library-logo" />
            <h1>NexaLibrary Library</h1>
          </div>
          
          <nav className="header-nav">
            <a href="#featured">Featured Books</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="header-actions">
            <button 
              className="become-member-btn"
              onClick={handleBecomeMemberClick}
            >
              {isExistingMember ? 'Go to Member Portal' : 'Become a Member'}
            </button>
            
            <div className="user-profile">
              <span className="welcome-text">Welcome, {user?.username || 'User'}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Discover Knowledge at NexaLibrary</h2>
          <p>Your gateway to academic excellence and lifelong learning</p>
          <div className="hero-stats">
            <div className="stat">
              <h3>50,000+</h3>
              <p>Books Available</p>
            </div>
            <div className="stat">
              <h3>24/7</h3>
              <p>Digital Access</p>
            </div>
            <div className="stat">
              <h3>500+</h3>
              <p>Study Seats</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section id="featured" className="featured-books-section">
        <div className="container">
          <h2>Explore Our Collection</h2>
          
          {/* Search Bar */}
          <SearchBar onSearch={handleSearchChange} />
          
          {/* Genre Filter */}
          <GenreFilter 
            genres={genres} 
            selectedGenre={selectedGenre}
            onGenreChange={handleGenreChange}
          />

          {/* Books Display */}
          {booksLoading ? (
            <div className="loading-message">Loading books...</div>
          ) : booksError ? (
            <div className="error-message">{booksError}</div>
          ) : filteredBooks.length > 0 ? (
            <BookGrid 
              books={filteredBooks} 
              onBookSelect={handleBookSelect}
            />
          ) : (
            <div className="no-books-message">
              <p>No books found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetails 
          book={selectedBook}
          onClose={handleCloseDetail}
        />
      )}

      {/* Library Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">📚</div>
              <h3>Book Lending</h3>
              <p>Borrow physical books for up to 14 days with renewal options</p>
            </div>
            <div className="service-card">
              <div className="service-icon">💻</div>
              <h3>Digital Resources</h3>
              <p>Access to e-books, research papers, and online databases</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🏫</div>
              <h3>Study Spaces</h3>
              <p>Quiet study areas, group rooms, and collaborative spaces</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🎓</div>
              <h3>Research Support</h3>
              <p>Academic research assistance and citation guidance</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Library Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About NexaLibrary</h2>
              <p>
                The NexaLibrary Library serves as the academic heart of our institution, 
                providing comprehensive resources and services to support learning, teaching, 
                and research activities. Our modern facility houses an extensive collection 
                of books, journals, and digital resources across various disciplines.
              </p>
              <div className="library-hours">
                <h3>Library Hours</h3>
                <div className="hours-grid">
                  <div>
                    <strong>Monday - Friday:</strong> 8:00 AM - 10:00 PM
                  </div>
                  <div>
                    <strong>Saturday:</strong> 9:00 AM - 8:00 PM
                  </div>
                  <div>
                    <strong>Sunday:</strong> 10:00 AM - 6:00 PM
                  </div>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="/library.png" alt="NexaLibrary" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2>Contact Us</h2>
          <div className="contact-info">
            <div className="contact-item">
              <h4>Location</h4>
              <p>NexaLibrary, New Kandy Road, Malabe, Sri Lanka</p>
            </div>
            <div className="contact-item">
              <h4>Phone</h4>
              <p>+94 11 754 4801</p>
            </div>
            <div className="contact-item">
              <h4>Email</h4>
              <p>library@nexalibrary.lk</p>
            </div>
            <div className="contact-item">
              <h4>Help Desk</h4>
              <p>Available during library hours for assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Member Registration Modal */}
      {showMemberModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Become a Library Member</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowMemberModal(false);
                  setError('');
                  setSuccess('');
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Join our library community and unlock exclusive benefits!</p>
              
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              
              <form onSubmit={handleMemberRegistration} className="member-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={memberFormData.email}
                    onChange={handleMemberFormChange}
                    placeholder="Enter your registered email"
                    required
                    disabled={loading}
                  />
                  <small>Must match your account email</small>
                </div>

                <div className="form-group">
                  <label>Password Verification</label>
                  <input
                    type="password"
                    name="password"
                    value={memberFormData.password}
                    onChange={handleMemberFormChange}
                    placeholder="Enter your account password"
                    required
                    disabled={loading}
                  />
                  <small>Enter your login password for verification</small>
                </div>

                <div className="form-group">
                  <label>Membership Type</label>
                  <select
                    name="membershipType"
                    value={memberFormData.membershipType}
                    onChange={handleMemberFormChange}
                    disabled={loading}
                  >
                    <option value="BASIC">Basic - $10/month</option>
                    <option value="PREMIUM">Premium - $25/month</option>
                    <option value="STUDENT">Student - $5/month</option>
                    <option value="FAMILY">Family - $40/month</option>
                    <option value="FACULTY">Faculty - $15/month</option>
                    <option value="REGULAR">Regular - $20/month</option>
                  </select>
                </div>

                <div className="membership-benefits">
                  <h4>Membership Benefits:</h4>
                  <ul>
                    <li>Extended borrowing periods</li>
                    <li>Access to premium digital resources</li>
                    <li>Priority book reservations</li>
                    <li>Study room booking privileges</li>
                    <li>Research assistance services</li>
                  </ul>
                </div>

                <button 
                  type="submit" 
                  className="register-btn"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register as Member'}
                </button>
              </form>
              
              <div className="modal-actions">
                <button 
                  className="already-member-btn"
                  onClick={() => {
                    setShowMemberModal(false);
                    setShowMemberIdModal(true);
                    setError('');
                    setSuccess('');
                  }}
                  disabled={loading}
                >
                  Already a Member?
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member ID Login Modal */}
      {showMemberIdModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Member Login</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowMemberIdModal(false);
                  setError('');
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Enter your Member ID to access your profile</p>
              
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleMemberIdLogin} className="member-id-form">
                <div className="form-group">
                  <label>Member ID</label>
                  <input
                    type="text"
                    name="memberId"
                    value={memberIdLoginData.memberId}
                    onChange={handleMemberIdChange}
                    placeholder="Enter your Member ID (e.g., LIB2025001)"
                    required
                    disabled={loading}
                  />
                  <small>You received this ID via email after registration</small>
                </div>

                <button 
                  type="submit" 
                  className="member-login-btn"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Access Profile'}
                </button>
              </form>

              <div className="modal-actions">
                <button 
                  className="back-to-register-btn"
                  onClick={() => {
                    setShowMemberIdModal(false);
                    setShowMemberModal(true);
                    setError('');
                  }}
                  disabled={loading}
                >
                  ← Back to Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="container">
          <p>&copy; 2025 NexaLibrary Library. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;