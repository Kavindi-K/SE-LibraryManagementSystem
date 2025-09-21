import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <h1 className="logo">Library Management System</h1>
      <nav>
        <a href="#hero">Home</a>
        <a href="#books">Books</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

export default Header;
