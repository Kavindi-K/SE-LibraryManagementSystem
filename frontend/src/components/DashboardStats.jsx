import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardStats.css';

const DashboardStats = () => {
  const [memberStats, setMemberStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    suspendedMembers: 0,
    premiumMembers: 0,
    basicMembers: 0,
    studentMembers: 0,
    familyMembers: 0,
    membersWithFines: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for other features (to be implemented by teammates)
  const mockStats = {
    totalBooks: 2547,
    availableBooks: 1892,
    borrowedBooks: 445,
    reservedBooks: 210,
    totalReservations: 156,
    activeReservations: 89,
    overdueBooks: 23,
    totalFines: 1245.50,
    paidFines: 987.25,
    pendingFines: 258.25
  };

  // Fetch real member statistics
  const fetchMemberStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all member statistics in parallel
      const [
        totalResponse,
        activeResponse,
        suspendedResponse,
        premiumResponse,
        basicResponse,
        studentResponse,
        familyResponse,
        finesResponse
      ] = await Promise.all([
        axios.get('http://localhost:8081/api/members/stats/total'),
        axios.get('http://localhost:8081/api/members/stats/status/ACTIVE'),
        axios.get('http://localhost:8081/api/members/stats/status/SUSPENDED'),
        axios.get('http://localhost:8081/api/members/stats/membership-type/PREMIUM'),
        axios.get('http://localhost:8081/api/members/stats/membership-type/BASIC'),
        axios.get('http://localhost:8081/api/members/stats/membership-type/STUDENT'),
        axios.get('http://localhost:8081/api/members/stats/membership-type/FAMILY'),
        axios.get('http://localhost:8081/api/members/with-fines')
      ]);

      setMemberStats({
        totalMembers: totalResponse.data?.data || 0,
        activeMembers: activeResponse.data?.data || 0,
        suspendedMembers: suspendedResponse.data?.data || 0,
        premiumMembers: premiumResponse.data?.data || 0,
        basicMembers: basicResponse.data?.data || 0,
        studentMembers: studentResponse.data?.data || 0,
        familyMembers: familyResponse.data?.data || 0,
        membersWithFines: finesResponse.data?.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching member statistics:', error);
      setError('Unable to load member statistics. Using default values.');
      
      // Set default values if API fails
      setMemberStats({
        totalMembers: 125,
        activeMembers: 98,
        suspendedMembers: 12,
        premiumMembers: 34,
        basicMembers: 67,
        studentMembers: 18,
        familyMembers: 6,
        membersWithFines: 8
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-stats">
        <div className="loading">Loading dashboard statistics...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-stats">
      {error && (
        <div className="stats-error">
          {error}
        </div>
      )}

      {/* Member Statistics - Real Data */}
      <div className="stats-section">
        <h2 className="section-title">📊 Member Statistics (Live Data)</h2>
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{memberStats.totalMembers}</div>
              <div className="stat-label">Total Members</div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{memberStats.activeMembers}</div>
              <div className="stat-label">Active Members</div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <div className="stat-number">{memberStats.suspendedMembers}</div>
              <div className="stat-label">Suspended Members</div>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">{memberStats.membersWithFines}</div>
              <div className="stat-label">Members with Fines</div>
            </div>
          </div>
        </div>

        {/* Membership Type Breakdown */}
        <div className="membership-breakdown">
          <h3>Membership Type Distribution</h3>
          <div className="membership-stats">
            <div className="membership-item">
              <span className="membership-label">Basic:</span>
              <span className="membership-count">{memberStats.basicMembers}</span>
            </div>
            <div className="membership-item">
              <span className="membership-label">Premium:</span>
              <span className="membership-count">{memberStats.premiumMembers}</span>
            </div>
            <div className="membership-item">
              <span className="membership-label">Student:</span>
              <span className="membership-count">{memberStats.studentMembers}</span>
            </div>
            <div className="membership-item">
              <span className="membership-label">Family:</span>
              <span className="membership-count">{memberStats.familyMembers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Book Management Statistics - Mock Data */}
      <div className="stats-section">
        <h2 className="section-title">📚 Book Management (Mock Data - Coming Soon)</h2>
        <div className="stats-grid">
          <div className="stat-card info mock">
            <div className="stat-icon">📖</div>
            <div className="stat-content">
              <div className="stat-number">{mockStats.totalBooks}</div>
              <div className="stat-label">Total Books</div>
            </div>
            <div className="mock-badge">Mock</div>
          </div>

          <div className="stat-card success mock">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{mockStats.availableBooks}</div>
              <div className="stat-label">Available Books</div>
            </div>
            <div className="mock-badge">Mock</div>
          </div>

          <div className="stat-card warning mock">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{mockStats.borrowedBooks}</div>
              <div className="stat-label">Borrowed Books</div>
            </div>
            <div className="mock-badge">Mock</div>
          </div>

          <div className="stat-card info mock">
            <div className="stat-icon">🔖</div>
            <div className="stat-content">
              <div className="stat-number">{mockStats.reservedBooks}</div>
              <div className="stat-label">Reserved Books</div>
            </div>
            <div className="mock-badge">Mock</div>
          </div>
        </div>
      </div>

      {/* Reservation & Fine Management Statistics - Mock Data */}
      <div className="stats-section">
        <h2 className="section-title">💳 Reservations & Fines (Mock Data - Coming Soon)</h2>
        <div className="stats-grid">
          <div className="stat-card primary mock">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{mockStats.totalReservations}</div>
              <div className="stat-label">Total Reservations</div>
            </div>
            <div className="mock-badge">Mock</div>
          </div>

          <div className="stat-card success mock">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{mockStats.activeReservations}</div>
              <div className="stat-label">Active Reservations</div>
            </div>
            <div className="mock-badge">Mock</div>
          </div>

          <div className="stat-card danger mock">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <div className="stat-number">{mockStats.overdueBooks}</div>
              <div className="stat-label">Overdue Books</div>
            </div>
            <div className="mock-badge">Mock</div>
          </div>

          <div className="stat-card warning mock">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">${mockStats.totalFines}</div>
              <div className="stat-label">Total Fines</div>
            </div>
            <div className="mock-badge">Mock</div>
          </div>
        </div>

        <div className="fine-breakdown">
          <h3>Fine Management Breakdown</h3>
          <div className="fine-stats">
            <div className="fine-item">
              <span className="fine-label">Paid Fines:</span>
              <span className="fine-amount paid">${mockStats.paidFines}</span>
            </div>
            <div className="fine-item">
              <span className="fine-label">Pending Fines:</span>
              <span className="fine-amount pending">${mockStats.pendingFines}</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="stats-section">
        <h2 className="section-title">🚀 System Status</h2>
        <div className="system-status">
          <div className="status-item implemented">
            <span className="status-icon">✅</span>
            <span className="status-text">Member Management - Fully Implemented</span>
          </div>
          <div className="status-item pending">
            <span className="status-icon">🔄</span>
            <span className="status-text">Book Management - Awaiting Teammate Implementation</span>
          </div>
          <div className="status-item pending">
            <span className="status-icon">🔄</span>
            <span className="status-text">Reservation & Fine Management - Awaiting Teammate Implementation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;