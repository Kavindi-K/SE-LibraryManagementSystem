import React from "react";
import "./Hero.css";

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <h2>Welcome to the Digital Library</h2>
        <p>Explore, borrow, and manage books with ease.</p>
        <div className="hero-buttons">
          <button onClick={() => (window.location.href = "/signup")}>
            Get Started
          </button>
          <button onClick={() => (window.location.href = "/login")}>
            Login
          </button>
        </div>
      </div>
      <div className="hero-image">
        {/* ✅ load directly from public folder */}
        <img src="/library.png" alt="Library" />
      </div>
    </section>
  );
}

export default Hero;
