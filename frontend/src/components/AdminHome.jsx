import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MemberManagement from "./MemberManagement";
import DashboardStats from "./DashboardStats";
import "./AdminHome.css";

const AdminHome = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    // Navigate to landing page
    navigate("/");
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'members':
        return <MemberManagement />;
      case 'books':
        return (
          <div className="coming-soon">
            <h2>📚 Books Management</h2>
            <p>This feature will be implemented by your teammate.</p>
            <p>Coming soon...</p>
          </div>
        );
      case 'reservations':
        return (
          <div className="coming-soon">
            <h2>📋 Reservation & Fine Management</h2>
            <p>This feature will be implemented by your teammate.</p>
            <p>Coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="dashboard-overview">
            <h1>Welcome, Admin 👋</h1>
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
                    className="btn btn-secondary" 
                    disabled
                    title="Feature coming soon"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>Reservations & Fines</h3>
                  <p>Handle reservations and fine management</p>
                  <button 
                    className="btn btn-secondary" 
                    disabled
                    title="Feature coming soon"
                  >
                    Coming Soon
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
              📚 Books Management
            </button>
          </li>
          <li>
            <button 
              className={activeSection === 'reservations' ? 'active' : ''}
              onClick={() => setActiveSection('reservations')}
            >
              📋 Reservation & Fine Management
            </button>
          </li>
        </ul>

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      {/* Main Content */}
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminHome;
