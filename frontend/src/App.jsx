import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Homepage from './components/Homepage';  // ✅ Changed from Dashboard to Homepage
import MemberProfile from './components/MemberProfile';  // ✅ Import MemberProfile
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';  
import AdminHome from './components/AdminHome';   // ✅ Import AdminHome
import './App.css';
//this is a comment

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Homepage (formerly Dashboard) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            } 
          />

          {/* ✅ Member Profile Page */}
          <Route 
            path="/member-profile" 
            element={
              <ProtectedRoute>
                <MemberProfile />
              </ProtectedRoute>
            } 
          />

          {/* ✅ Admin Home (no protection for now, you can wrap with ProtectedRoute if needed) */}
          <Route path="/admin" element={<AdminHome />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
