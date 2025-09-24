import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';
import './MemberProfile.css';

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

  const [myBorrowings, setMyBorrowings] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [newReservation, setNewReservation] = useState({ bookId: '', reservationDate: new Date().toISOString().slice(0,10) });

  useEffect(() => {
    async function loadMemberData() {
      if (!member?.id && !member?.memberId) return;
      try {
        const memberKey = member.memberId || member.id;
        const borrowings = await api.listBorrowings({ memberId: memberKey });
        const reservations = await api.listReservations({ memberId: memberKey });
        // Client-side safety filter in case backend returns extra
        setMyBorrowings(Array.isArray(borrowings) ? borrowings.filter(b => b.memberId === memberKey) : []);
        setMyReservations(Array.isArray(reservations) ? reservations.filter(r => r.memberId === memberKey) : []);
      } catch (e) {
        // ignore
      }
    }
    loadMemberData();
  }, [member]);

  async function createMyReservation(e) {
    e.preventDefault();
    if (!member?.memberId || !newReservation.bookId) return;
    const payload = { memberId: member.memberId, bookId: newReservation.bookId, reservationDate: newReservation.reservationDate, status: 'PENDING' };
    const created = await api.createReservation(payload);
    setMyReservations((prev) => [created, ...prev]);
    setNewReservation({ bookId: '', reservationDate: new Date().toISOString().slice(0,10) });
  }

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
                    onChange={(e) =>
                      setProfileData({ ...profileData, firstName: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, lastName: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) =>
                      setProfileData({ ...profileData, dateOfBirth: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({ ...profileData, address: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>
              </div>
              {editMode ? (
                <div className="button-group">
                  <button type="submit" className="save-btn">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setEditMode(false);
                      loadMemberProfile(user.id);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              )}
            </form>
          </div>
        );

      case 'books':
        return (
          <div className="tab-content">
            <h3>📚 Books</h3>
            <p>Browse catalog, search books, and add to wishlist.</p>
            <div className="section-card">
              <h4>Book Search</h4>
              <div className="search-box">
                <input type="text" placeholder="Search books by title, author, or ISBN..." />
                <button className="search-btn">Search</button>
              </div>
            </div>
            <div className="section-card">
              <h4>Your Wishlist</h4>
              <p>No books in your wishlist yet.</p>
            </div>
          </div>
        );

      case 'borrowing-reservation-fines':
        return (
          <div className="tab-content">
            <h3>📋 Borrowing, Reservations & Fines</h3>
            <div className="section-card">
              <h4>📖 Your Borrowings</h4>
              {myBorrowings.length === 0 ? (
                <div className="status-indicator"><span className="status-badge">No items borrowed</span></div>
              ) : (
                <div className="table-wrapper">
                  <table className="simple-table">
                    <thead>
                      <tr>
                        <th>Borrow No</th><th>Book</th><th>Borrow</th><th>Due</th><th>Return</th><th>Status</th><th>Late Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myBorrowings.map((b) => (
                        <tr key={b.id}>
                          <td>{b.borrowingNumber}</td>
                          <td>{b.bookId}</td>
                          <td>{b.borrowDate}</td>
                          <td>{b.dueDate}</td>
                          <td>{b.returnDate || '-'}</td>
                          <td>{b.status}</td>
                          <td>{b.lateFee || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="section-card">
              <h4>📅 Your Reservations</h4>
              <form className="inline-form" onSubmit={createMyReservation}>
                <input placeholder="Enter Book ID" value={newReservation.bookId} onChange={(e)=>setNewReservation({...newReservation, bookId:e.target.value})} />
                <input type="date" value={newReservation.reservationDate} onChange={(e)=>setNewReservation({...newReservation, reservationDate:e.target.value})} />
                <button type="submit">Reserve</button>
              </form>
              {myReservations.length === 0 ? (
                <div className="status-indicator"><span className="status-badge">No active reservations</span></div>
              ) : (
                <div className="table-wrapper">
                  <table className="simple-table">
                    <thead>
                      <tr>
                        <th>Reserve No</th><th>Book</th><th>Date</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myReservations.map((r) => (
                        <tr key={r.id}>
                          <td>{r.reservationNumber}</td>
                          <td>{r.bookId}</td>
                          <td>{r.reservationDate}</td>
                          <td>{r.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="section-card">
              <h4>💰 Fines</h4>
              <div className="status-indicator">
                <span className="status-badge success">No outstanding fines</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (user?.id) {
      const savedPicture = localStorage.getItem(`profilePicture_${user.id}`);
      if (savedPicture) {
        setProfilePicture(savedPicture);
      }
    }
  }, [user]);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        Loading...
      </div>
    );

  return (
    <div className={`member-profile ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Header - Clean design without toggle button */}
      <header className="member-header">
        <div className="header-left">
          <h1>NexaLibrary University</h1>
        </div>
        <div className="header-right">
          <span className="welcome-text">Welcome, {profileData.firstName}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="member-layout">
        {/* Sidebar with toggle button */}
        <aside className="member-sidebar">
          <div className="sidebar-header">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <span className="toggle-icon">
                {sidebarCollapsed ? '→' : '←'}
              </span>
              <span className="toggle-text">
                {sidebarCollapsed ? 'Expand' : 'Collapse'}
              </span>
            </button>
            <h2>Member Portal</h2>
            <p>ID: {member?.memberId}</p>
          </div>
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'books' ? 'active' : ''}`}
              onClick={() => setActiveTab('books')}
            >
              <span className="nav-icon">📚</span>
              <span className="nav-text">Books</span>
            </button>
            <button
              className={`nav-item ${
                activeTab === 'borrowing-reservation-fines' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('borrowing-reservation-fines')}
            >
              <span className="nav-icon">📋</span>
              <span className="nav-text">Borrowing & Fines</span>
            </button>
          </nav>
          <div className="sidebar-footer">
            <p>Member since: {member?.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="member-main">
          <div className="content-header">
            <div className="profile-header">
              <div className="profile-picture">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" />
                ) : (
                  <div className="default-avatar">
                    {profileData.firstName?.[0]}
                    {profileData.lastName?.[0]}
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h2>{profileData.firstName} {profileData.lastName}</h2>
                <p>Member ID: {member?.memberId}</p>
              </div>
            </div>
            <div className="header-actions">
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
          </div>

          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default MemberProfile;