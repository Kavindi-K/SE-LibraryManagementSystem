import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <h1 className="logo">NexaLibrary</h1>
          <nav className="nav">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Home</a>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to the <span className="highlight">Digital Library</span>
            </h1>
            <p className="hero-subtitle">
              Explore, borrow, and manage books with ease. Your gateway to unlimited knowledge and learning.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={handleSignupClick}>
                Get Started
              </button>
              <button className="btn-secondary" onClick={handleLoginClick}>
                Login
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Books</span>
              </div>
              <div className="stat">
                <span className="stat-number">5,000+</span>
                <span className="stat-label">Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Access</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="/library.png" alt="Modern Digital Library" />
            <div className="floating-cards">
              <div className="floating-card card-1">📚</div>
              <div className="floating-card card-2">📖</div>
              <div className="floating-card card-3">📝</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Why Choose NexaLibrary?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Extensive Collection</h3>
              <p>Access thousands of books across various genres and subjects</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Easy</h3>
              <p>Quick search, instant borrowing, and seamless book management</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Platform</h3>
              <p>Your data and reading history are protected with advanced security</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access your library anywhere, anytime on any device</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About NexaLibrary</h2>
              <p className="about-description">
                NexaLibrary is a modern digital library management system designed to revolutionize 
                how students and readers access, manage, and explore books. Our platform combines 
                cutting-edge technology with user-friendly design to create an unparalleled library experience.
              </p>
              <div className="about-features">
                <div className="about-feature">
                  <span className="feature-check">✓</span>
                  <span>Advanced book search and filtering</span>
                </div>
                <div className="about-feature">
                  <span className="feature-check">✓</span>
                  <span>Personal reading history and recommendations</span>
                </div>
                <div className="about-feature">
                  <span className="feature-check">✓</span>
                  <span>Real-time availability tracking</span>
                </div>
                <div className="about-feature">
                  <span className="feature-check">✓</span>
                  <span>Automated borrowing and return management</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="/library_signup.png" alt="Library Management" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h3>Email</h3>
                  <p>support@nexalibrary.com</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h3>Address</h3>
                  <p>123 Library Street<br />Knowledge City, KC 12345</p>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>NexaLibrary</h3>
              <p>Your gateway to unlimited knowledge and learning.</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Twitter">🐦</a>
                <a href="#" aria-label="LinkedIn">💼</a>
                <a href="#" aria-label="Instagram">📷</a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#hero">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li><a href="#">Book Search</a></li>
                <li><a href="#">Borrowing</a></li>
                <li><a href="#">Reservations</a></li>
                <li><a href="#">Account Management</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} NexaLibrary. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;