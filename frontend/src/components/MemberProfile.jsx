import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MemberProfile.css';

const MemberProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('books');
  const [editMode, setEditMode] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    dateOfBirth: ''
  });

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
      // Get member profile
      const memberResponse = await axios.get(`http://localhost:8081/api/members/profile/${userId}`);
      if (memberResponse.data.success) {
        setMember(memberResponse.data.data);
        
        // Get user details
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
    } catch (error) {
      console.error('Error loading member profile:', error);
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
        
        // Update local storage
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Profile picture must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setProfilePicture(imageData);
        // Save to localStorage
        if (user?.id) {
          localStorage.setItem(`profilePicture_${user.id}`, imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    // Clear member data to force manual ID entry on next login
    localStorage.removeItem('member');
    localStorage.removeItem('isMemberAuthenticated');
    navigate('/');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'books':
        return (
          <div className="tab-content">
            <h3>Books</h3>
            <div className="placeholder-content">
              <p>📚 Book browsing and search features will be available here.</p>
              <p>You'll be able to:</p>
              <ul>
                <li>Browse the library catalog</li>
                <li>Search for books by title, author, or genre</li>
                <li>View book details and availability</li>
                <li>Add books to your wishlist</li>
              </ul>
            </div>
          </div>
        );

      case 'borrowing-reservation-fines':
        return (
          <div className="tab-content">
            <h3>Borrowing, Reservations & Fines</h3>
            
            {/* Borrowing Section */}
            <div className="section-card">
              <h4>📖 Current Borrowings</h4>
              <div className="placeholder-content">
                <p>Your currently borrowed books and due dates will appear here.</p>
                <ul>
                  <li>View currently borrowed books</li>
                  <li>Check due dates and renewal options</li>
                  <li>Browse borrowing history</li>
                  <li>Download borrowing receipts</li>
                </ul>
              </div>
            </div>

            {/* Reservations Section */}
            <div className="section-card">
              <h4>📅 Reservations</h4>
              <div className="placeholder-content">
                <p>Book reservations and holds will be managed here.</p>
                <ul>
                  <li>Reserve books that are currently borrowed</li>
                  <li>View your reservation queue</li>
                  <li>Get notified when reserved books are available</li>
                  <li>Cancel reservations if needed</li>
                </ul>
              </div>
            </div>

            {/* Fines Section */}
            <div className="section-card">
              <h4>💰 Fines & Fees</h4>
              <div className="placeholder-content">
                <p>Your fines, fees, and payment history will be shown here.</p>
                <ul>
                  <li>View outstanding fines</li>
                  <li>Pay fines online</li>
                  <li>Download payment receipts</li>
                  <li>View fee calculation details</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    // Load saved profile picture
    if (user?.id) {
      const savedPicture = localStorage.getItem(`profilePicture_${user.id}`);
      if (savedPicture) {
        setProfilePicture(savedPicture);
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="member-profile">
      {/* Header */}
      <header className="member-header">
        <div className="header-left">
          <h1>NexaLibrary University Library</h1>
        </div>
        <div className="header-right">
          <span className="welcome-text">Welcome, {profileData.firstName}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="member-layout">
        {/* Sidebar */}
        <aside className="member-sidebar">
          <div className="sidebar-header">
            <h2>Member Portal</h2>
            <p>ID: {member?.memberId}</p>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'books' ? 'active' : ''}`}
              onClick={() => setActiveTab('books')}
            >
              <span className="nav-icon">📚</span>
              Books
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'borrowing-reservation-fines' ? 'active' : ''}`}
              onClick={() => setActiveTab('borrowing-reservation-fines')}
            >
              <span className="nav-icon">📋</span>
              Borrowing-Reservation-Fines
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="member-main">
          {/* Profile Information Section - Always Visible */}
          <div className="profile-content">
            <div className="profile-header">
              <div className="profile-picture-section">
                <div className="profile-picture">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" />
                  ) : (
                    <div className="default-avatar">
                      {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="profilePicture" className="upload-btn">
                  Change Photo
                </label>
              </div>
              
              <div className="member-info">
                <h2>{profileData.firstName} {profileData.lastName}</h2>
                <p className="member-id">Member ID: {member?.memberId}</p>
                <p className="membership-type">Membership: {member?.membershipType}</p>
                <p className="member-status">Status: {member?.status}</p>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="profile-form-section">
              <div className="form-header">
                <h3>Personal Information</h3>
                <button 
                  type="button" 
                  onClick={() => setEditMode(!editMode)}
                  className="edit-btn"
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Email (Cannot be changed)</label>
                    <input type="email" value={user?.email || ''} disabled />
                  </div>
                  
                  <div className="form-group">
                    <label>User ID (Cannot be changed)</label>
                    <input type="text" value={user?.id || ''} disabled />
                  </div>

                  <div className="form-group">
                    <label>First Name</label>
                    <input 
                      type="text" 
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      disabled={!editMode}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      disabled={!editMode}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input 
                      type="date" 
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Address</label>
                    <textarea 
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      disabled={!editMode}
                      rows="3"
                    />
                  </div>
                </div>

                {editMode && (
                  <div className="form-actions">
                    <button type="submit" className="save-btn" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Tab Content Section */}
          <div className="tab-section">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MemberProfile;