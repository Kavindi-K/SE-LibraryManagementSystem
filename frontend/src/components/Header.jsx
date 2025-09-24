import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <h1 className="logo">NexaLibrary</h1>
      <nav>
        <a href="#hero">Home</a>
        <a href="#books">Books</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <button className="login-btn" onClick={handleLoginClick}>
          Login
        </button>
      </nav>
    </header>
  );
}

export default Header;
