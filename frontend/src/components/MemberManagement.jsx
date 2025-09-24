import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MemberManagement.css';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [membershipTypeFilter, setMembershipTypeFilter] = useState('ALL');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    emergencyContact: '',
    membershipType: 'BASIC',
    status: 'ACTIVE',
    joiningDate: '',
    expiryDate: '',
    borrowingLimit: 0,
    fineAmount: 0,
    profilePictureUrl: ''
  });

  // Fetch all members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/members');
      
      if (response.data.success) {
        setMembers(response.data.data);
        setFilteredMembers(response.data.data);
      } else {
        setError('Failed to fetch members');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Error fetching members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Search and filter members
  const applyFilters = () => {
    let filtered = members;

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(member =>
        member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.memberId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    // Apply membership type filter
    if (membershipTypeFilter !== 'ALL') {
      filtered = filtered.filter(member => member.membershipType === membershipTypeFilter);
    }

    setFilteredMembers(filtered);
  };

  // Create member
  const handleCreateMember = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/members', formData);
      
      if (response.data.success) {
        await fetchMembers();
        setShowCreateModal(false);
        resetForm();
        alert('Member created successfully!');
      } else {
        alert('Failed to create member: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error creating member:', error);
      alert('Error creating member. Please try again.');
    }
  };

  // Update member
  const handleUpdateMember = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8081/api/members/${selectedMember.id}`, formData);
      
      if (response.data.success) {
        await fetchMembers();
        setShowEditModal(false);
        setSelectedMember(null);
        resetForm();
        alert('Member updated successfully!');
      } else {
        alert('Failed to update member: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Error updating member. Please try again.');
    }
  };

  // Delete member
  const handleDeleteMember = async () => {
    try {
      const response = await axios.delete(`http://localhost:8081/api/members/${selectedMember.id}`);
      
      if (response.data.success) {
        await fetchMembers();
        setShowDeleteModal(false);
        setSelectedMember(null);
        alert('Member deleted successfully!');
      } else {
        alert('Failed to delete member: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Error deleting member. Please try again.');
    }
  };

  // Suspend/Activate member
  const handleStatusChange = async (memberId, action) => {
    try {
      const response = await axios.put(`http://localhost:8081/api/members/${memberId}/${action}`);
      
      if (response.data.success) {
        await fetchMembers();
        alert(`Member ${action}d successfully!`);
      } else {
        alert(`Failed to ${action} member: ` + response.data.message);
      }
    } catch (error) {
      console.error(`Error ${action}ing member:`, error);
      alert(`Error ${action}ing member. Please try again.`);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      emergencyContact: '',
      membershipType: 'BASIC',
      status: 'ACTIVE',
      joiningDate: '',
      expiryDate: '',
      borrowingLimit: 0,
      fineAmount: 0,
      profilePictureUrl: ''
    });
  };

  // Open edit modal
  const openEditModal = (member) => {
    setSelectedMember(member);
    setFormData({
      userId: member.userId || '',
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      email: member.email || '',
      phoneNumber: member.phoneNumber || '',
      address: member.address || '',
      emergencyContact: member.emergencyContact || '',
      membershipType: member.membershipType || 'BASIC',
      status: member.status || 'ACTIVE',
      joiningDate: member.joiningDate || '',
      expiryDate: member.expiryDate || '',
      borrowingLimit: member.borrowingLimit || 0,
      fineAmount: member.fineAmount || 0,
      profilePictureUrl: member.profilePictureUrl || ''
    });
    setShowEditModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'success';
      case 'SUSPENDED': return 'danger';
      case 'EXPIRED': return 'warning';
      case 'PENDING': return 'info';
      default: return 'secondary';
    }
  };

  // Get membership type color
  const getMembershipTypeColor = (type) => {
    switch(type) {
      case 'BASIC': return 'primary';
      case 'PREMIUM': return 'gold';
      case 'STUDENT': return 'info';
      case 'FAMILY': return 'success';
      case 'FACULTY': return 'warning';
      case 'REGULAR': return 'secondary';
      default: return 'secondary';
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, membershipTypeFilter, members]);

  return (
    <div className="member-management">
      <div className="member-management-header">
        <h1>Member Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Add New Member
        </button>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search members by name, email, or member ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="EXPIRED">Expired</option>
            <option value="PENDING">Pending</option>
          </select>

          <select 
            value={membershipTypeFilter} 
            onChange={(e) => setMembershipTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Membership Types</option>
            <option value="BASIC">Basic</option>
            <option value="PREMIUM">Premium</option>
            <option value="STUDENT">Student</option>
            <option value="FAMILY">Family</option>
            <option value="FACULTY">Faculty</option>
            <option value="REGULAR">Regular</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      {loading ? (
        <div className="loading">Loading members...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="table-container">
          <table className="members-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Membership Type</th>
                <th>Status</th>
                <th>Joining Date</th>
                <th>Expiry Date</th>
                <th>Fine Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-data">No members found</td>
                </tr>
              ) : (
                filteredMembers.map(member => (
                  <tr key={member.id}>
                    <td className="member-id">{member.memberId}</td>
                    <td>{member.firstName} {member.lastName}</td>
                    <td>{member.email}</td>
                    <td>{member.phoneNumber || 'N/A'}</td>
                    <td>
                      <span className={`badge ${getMembershipTypeColor(member.membershipType)}`}>
                        {member.membershipType}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td>{formatDate(member.joiningDate)}</td>
                    <td>{formatDate(member.expiryDate)}</td>
                    <td>${member.fineAmount.toFixed(2)}</td>
                    <td className="actions">
                      <button 
                        className="btn btn-sm btn-info"
                        onClick={() => openEditModal(member)}
                      >
                        Edit
                      </button>
                      {member.status === 'ACTIVE' ? (
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => handleStatusChange(member.id, 'suspend')}
                        >
                          Suspend
                        </button>
                      ) : (
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => handleStatusChange(member.id, 'activate')}
                        >
                          Activate
                        </button>
                      )}
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setSelectedMember(member);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Member Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Member</h2>
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateMember} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Membership Type</label>
                  <select
                    name="membershipType"
                    value={formData.membershipType}
                    onChange={handleInputChange}
                  >
                    <option value="BASIC">Basic</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="STUDENT">Student</option>
                    <option value="FAMILY">Family</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="REGULAR">Regular</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Member</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateMember} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Membership Type</label>
                  <select
                    name="membershipType"
                    value={formData.membershipType}
                    onChange={handleInputChange}
                  >
                    <option value="BASIC">Basic</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="STUDENT">Student</option>
                    <option value="FAMILY">Family</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="REGULAR">Regular</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Borrowing Limit</label>
                  <input
                    type="number"
                    name="borrowingLimit"
                    value={formData.borrowingLimit}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Fine Amount ($)</label>
                  <input
                    type="number"
                    name="fineAmount"
                    value={formData.fineAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal modal-small">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete member <strong>{selectedMember?.firstName} {selectedMember?.lastName}</strong>?</p>
              <p className="warning">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={handleDeleteMember}
              >
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;