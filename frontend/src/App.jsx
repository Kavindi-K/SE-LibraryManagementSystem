import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import MemberList from './components/MemberList'
import './App.css'

const App = () => {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>Library Management System</h1>
          </div>
          <div className="nav-links">
            <Link to="/members" className="nav-link">Members</Link>
            <Link to="/books" className="nav-link">Books</Link>
            <Link to="/borrowing" className="nav-link">Borrowing</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<MemberList />} />
            <Route path="/members" element={<MemberList />} />
            <Route path="/books" element={<div>Books Management - Coming Soon</div>} />
            <Route path="/borrowing" element={<div>Borrowing Management - Coming Soon</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App