import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminHome.css";

const AdminHome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("user"); // or sessionStorage if you used that
    // Navigate to landing page
    navigate("/");
  };

  return (
    <div className="admin-home">
      {/* Sidebar */}
      <nav className="admin-sidebar">
        <h2 className="logo">Admin Dashboard</h2>
      <ul>
        <li><Link to="#">Member Management</Link></li>
        <li><Link to="#">Books Management</Link></li>
        <li><Link to="#">Reservation & Fine Management</Link></li>
    </ul>

        {/* 🔹 Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      {/* Main Content */}
      <div className="admin-content">
        <h1>Welcome, Admin 👋</h1>
        <p>Select an option from the left menu to manage the system.</p>
      </div>
    </div>
  );
};

export default AdminHome;
