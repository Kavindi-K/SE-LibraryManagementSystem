import React, { useState, useEffect } from 'react';
import { memberService } from '../services/memberService';
import MemberForm from './MemberForm';
import './MemberList.css';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [membershipTypes, setMembershipTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, filterType]);

  const loadData = async () => {
    await Promise.all([fetchMembers(), fetchMembershipTypes()]);
  };

  const fetchMembers = async () => {
    try {
      const response = await memberService.getAllMembers();
      setMembers(response.data);
      setError('');
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch members:', err);
      setError('Backend connection failed. Please restart your backend server.');
      setLoading(false);
    }
  };

  const fetchMembershipTypes = async () => {
    try {
      const response = await memberService.getMembershipTypes();
      setMembershipTypes(response.data);
    } catch (err) {
      // Use default types if API fails
      setMembershipTypes([
        { name: 'STUDENT', displayName: 'Student', borrowingLimit: 5, dailyFineRate: 0.50 },
        { name: 'FACULTY', displayName: 'Faculty', borrowingLimit: 10, dailyFineRate: 0.25 },
        { name: 'REGULAR', displayName: 'Regular', borrowingLimit: 3, dailyFineRate: 1.00 },
        { name: 'PREMIUM', displayName: 'Premium', borrowingLimit: 15, dailyFineRate: 0.10 }
      ]);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm)
      );
    }

    if (filterType) {
      filtered = filtered.filter(member => member.membershipType === filterType);
    }

    setFilteredMembers(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await memberService.deleteMember(id);
        fetchMembers();
      } catch (err) {
        alert('Failed to delete member');
      }
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMember(null);
    fetchMembers();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getMembershipTypeDisplay = (type) => {
    const membershipType = membershipTypes.find(mt => mt.name === type);
    return membershipType ? membershipType.displayName : type;
  };

  if (loading) {
    return (
      <div className="member-list-container">
        <div className="loading">Connecting to backend...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="member-list-container">
        <div className="error-message">
          <h3>⚠️ Backend Connection Issue</h3>
          <p>{error}</p>
          <div className="error-instructions">
            <p><strong>To fix this:</strong></p>
            <ol>
              <li>Stop your current backend (Ctrl+C in the backend terminal)</li>
              <li>Double-click <code>force-restart-backend.bat</code> to restart with new config</li>
              <li>Wait for "Started LibraryApplication" message</li>
              <li>Click "Retry" below</li>
            </ol>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setError('');
              setLoading(true);
              loadData();
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="member-list-container">
      <div className="header">
        <h2>Member Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Member
        </button>
      </div>

      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search members by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-dropdown">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">All Membership Types</option>
            {membershipTypes.map(type => (
              <option key={type.name} value={type.name}>
                {type.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="members-table">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Membership Type</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id}>
                  <td>{`${member.firstName} ${member.lastName}`}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>
                    <span className={`membership-badge ${member.membershipType.toLowerCase()}`}>
                      {getMembershipTypeDisplay(member.membershipType)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${member.isActive ? 'active' : 'inactive'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{formatDate(member.createdAt)}</td>
                  <td className="actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && members.length === 0 && (
          <div className="no-results">
            No members found. Click "Add New Member" to get started.
          </div>
        )}

        {filteredMembers.length === 0 && members.length > 0 && (
          <div className="no-results">
            No members found matching your search criteria.
          </div>
        )}
      </div>

      {showForm && (
        <MemberForm
          member={editingMember}
          membershipTypes={membershipTypes}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default MemberList;
