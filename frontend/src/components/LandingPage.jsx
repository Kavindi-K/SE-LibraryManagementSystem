import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeInfo, setActiveInfo] = useState(null);

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

  const features = [
    {
      key: 'collection',
      title: 'Comprehensive Collection',
      description:
        'Access 50,000+ books, journals, theses, and curated digital repositories across STEM, humanities, and business.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="6" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="10" y="4" width="6" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M17 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H17" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      more: {
        headline: 'What’s inside',
        bullets: [
          'Subject guides for quick discovery',
          'Librarian-curated reading lists',
          'On-campus and remote access policies',
          'Weekly arrivals and trending titles',
        ],
      },
    },
    {
      key: 'tools',
      title: 'Smart Learning Tools',
      description:
        'AI-powered search, personalized recommendations, citation helpers, and reading progress tracking.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      more: {
        headline: 'How it helps',
        bullets: [
          'Semantic search over catalog and notes',
          'Auto-generated citations (APA/MLA/IEEE)',
          'Study reminders and spaced repetition',
          'Reading analytics dashboard',
        ],
      },
    },
    {
      key: 'security',
      title: 'Secure & Private',
      description:
        'Enterprise-grade encryption, SSO support, audit logs, and privacy-first analytics to protect your data.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="10" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M7 10V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V10" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      more: {
        headline: 'Security highlights',
        bullets: [
          'TLS 1.3 and at-rest encryption',
          'Role-based access control (RBAC)',
          'GDPR-ready data retention',
          'Regular third‑party audits',
        ],
      },
    },
    {
      key: 'multi',
      title: 'Multi-Platform Access',
      description:
        'Seamless experience across desktop, mobile, and tablet with PWA offline reading support.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="8" y="16" width="10" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      more: {
        headline: 'Access anywhere',
        bullets: [
          'Installable PWA on iOS/Android',
          'Offline reading lists',
          'Sync across devices',
          'Low-bandwidth mode',
        ],
      },
    },
    {
      key: 'support',
      title: 'Academic Support',
      description:
        'Expert librarians, research consultations, and workshops on research methods and referencing.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 19C4 16.7909 5.79086 15 8 15H16C18.2091 15 20 16.7909 20 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      more: {
        headline: 'We can help with',
        bullets: [
          '1:1 research consultations',
          'Systematic review strategies',
          'Reference management (Zotero/Mendeley)',
          'Academic writing clinics',
        ],
      },
    },
    {
      key: 'global',
      title: 'Global Resources',
      description:
        'International databases, inter-library loans, and open-access repositories at your fingertips.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 12H21" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 3C9 6.5 9 17.5 12 21C15 17.5 15 6.5 12 3Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      more: {
        headline: 'Worldwide reach',
        bullets: [
          'Partner libraries and ILL services',
          'Access to Scopus/ERIC/DOAJ (mock)',
          'Global research collaboration tips',
          'Time-zone friendly virtual help',
        ],
      },
    },
  ];

  const openFeature = (feature) => setActiveFeature(feature);
  const closeFeature = () => setActiveFeature(null);
  const openInfo = (info) => setActiveInfo(info);
  const closeInfo = () => setActiveInfo(null);

  return (
    <div className="landing-page">
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="logo-section">
            <img src="/logo.png" alt="SARASAVI Logo" className="logo-image" />
            <div className="logo-text">
              <h1 className="logo-title">SARASAVI</h1>
              <p className="logo-subtitle">LIBRARY & LEARNING HUB</p>
            </div>
          </div>
          <nav className="nav">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Home</a>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Services</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
            <div className="nav-buttons">
              <button className="nav-login-btn" onClick={handleLoginClick}>Login</button>
              <button className="nav-signup-btn" onClick={handleSignupClick}>Sign Up</button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span> Welcome to the Future of Learning</span>
            </div>
            <h1 className="hero-title">
              Discover Knowledge at <span className="highlight">SARASAVI</span>
            </h1>
            <p className="hero-subtitle">
              Your gateway to academic excellence and lifelong learning. Explore our vast collection of books, 
              digital resources, and innovative learning tools designed to empower your educational journey.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={handleSignupClick}>
                <span>Start Learning</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="btn-secondary" onClick={handleLoginClick}>
                <span>Sign In</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50,000+</span>
                <span className="stat-label">Books Available</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Digital Access</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Study Seats</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-visual-full">
          <div className="hero-image-container-full">
            <img src="/herosection.avif" alt="SARASAVI Library" className="hero-main-image-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Learning Ecosystem</h2>
            <p className="section-subtitle">Experience the next generation of library services designed for modern learners</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.key} className="feature-card">
                <div className="feature-icon">
                  <div className="icon-bg icon-modern">{f.icon}</div>
                </div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
                <button className="feature-link feature-link-btn" onClick={() => openFeature(f)}>
                  Learn more →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-image-background">
          <img src="/second.jpg" alt="SARASAVI About Section" className="about-bg-image" />
          <div className="about-overlay-content">
            <div className="container">
              <div className="about-text-overlay">
                <div className="about-badge">
                  <span>About SARASAVI</span>
                </div>
                <h2>Empowering Education Through Innovation</h2>
                <p className="about-description">
                  SARASAVI Library & Learning Hub represents the future of academic learning, combining 
                  traditional library services with cutting-edge digital technology. We are committed to 
                  fostering intellectual growth, supporting research excellence, and providing an inclusive 
                  learning environment for students, faculty, and researchers worldwide.
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Connect With SARASAVI</h2>
            <p className="section-subtitle">Ready to start your learning journey? Get in touch with our team</p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3>Email Support</h3>
                  <p>info@sarasavi.lk</p>
                  <span className="contact-sub">support@sarasavi.lk</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.271 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06679 2.16708 8.43376 2.48353C8.80073 2.79999 9.03996 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3>Phone Support</h3>
                  <p>+94 81 754 4601</p>
                  <span className="contact-sub">Mon-Fri: 8:00 AM - 6:00 PM</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3>Visit Our Library</h3>
                  <p>SARASAVI Learning Hub<br />Colombo road,Peradeniya</p>
                  <span className="contact-sub">Kandy, Sri Lanka</span>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <div className="form-row">
                  <div className="form-group">
                    <input type="text" placeholder="Your Name" required />
                  </div>
                  <div className="form-group">
                    <input type="email" placeholder="Your Email" required />
                  </div>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Subject" required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn-primary">
                  <span>Send Message</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section main-section">
              <div className="footer-logo">
                <img src="/logo.png" alt="SARASAVI Logo" className="footer-logo-image" />
                <div className="footer-logo-text">
                  <h3>SARASAVI</h3>
                  <p>Library & Learning Hub</p>
                </div>
              </div>
              <p className="footer-description">Empowering education through innovation. Your gateway to unlimited knowledge and academic excellence.</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#hero">Home</a></li>
                <li><a href="#features">Services</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Learning Resources</h4>
              <ul>
                <li><a href="#" onClick={(e)=>{e.preventDefault(); openInfo({title:'Digital Library', bullets:['Browse 50k+ e-books and journals','Create reading lists','Download for offline (mock)','New arrivals every week']});}}>Digital Library</a></li>
                <li><a href="#" onClick={(e)=>{e.preventDefault(); openInfo({title:'Research Tools', bullets:['Citation generator (APA/MLA/IEEE)','Plagiarism awareness guide (mock)','Subject databases overview','How to request articles']});}}>Research Tools</a></li>
                <li><a href="#" onClick={(e)=>{e.preventDefault(); openInfo({title:'Study Rooms', bullets:['Individual and group rooms','Book up to 2 weeks ahead','Quiet and collaboration zones','AV equipment on request']});}}>Study Rooms</a></li>
                <li><a href="#" onClick={(e)=>{e.preventDefault(); openInfo({title:'Academic Support', bullets:['1:1 consultations with librarians','Workshops and clinics','Reference management help','Research design tips']});}}>Academic Support</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#" onClick={(e)=>{e.preventDefault(); openInfo({title:'Help Center', bullets:['Account & login help','Borrowing & fines','Access problems troubleshooting','Contact channels']});}}>Help Center</a></li>
                <li><a href="#" onClick={(e)=>{e.preventDefault(); openInfo({title:'FAQ', bullets:['How to get a member ID?','Can I renew my books online?','How do reservations work?','Do you support remote access?']});}}>FAQ</a></li>
                <li><a href="#" onClick={(e)=>{e.preventDefault(); openInfo({title:'Privacy Policy', bullets:['We respect your reading privacy (mock)','Only aggregated analytics','Your data is encrypted','Control your preferences']});}}>Privacy Policy</a></li>
                <li><a href="#" onClick={(e)=>{e.preventDefault(); openInfo({title:'Terms of Service', bullets:['Fair use of resources','Respectful community behavior','Booking and cancellation rules','Copyright guidelines']});}}>Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} SARASAVI Library & Learning Hub. All Rights Reserved.</p>
            <p className="footer-credit">Empowering minds, inspiring futures.</p>
          </div>
        </div>
      </footer>

      {activeFeature && (
        <div className="modal-overlay" onClick={closeFeature}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">{activeFeature.icon}</div>
              <div>
                <h3 className="modal-title">{activeFeature.title}</h3>
                <p className="modal-sub">{activeFeature.more.headline}</p>
              </div>
              <button className="modal-close" onClick={closeFeature}>×</button>
            </div>
            <div className="modal-body">
              <ul className="modal-list">
                {activeFeature.more.bullets.map((b, i) => (
                  <li key={i}>
                    <span className="check">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={closeFeature}>Got it</button>
            </div>
          </div>
        </div>
      )}

      {activeInfo && (
        <div className="modal-overlay" onClick={closeInfo}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div>
                <h3 className="modal-title">{activeInfo.title}</h3>
                <p className="modal-sub">Overview</p>
              </div>
              <button className="modal-close" onClick={closeInfo}>×</button>
            </div>
            <div className="modal-body">
              <ul className="modal-list">
                {activeInfo.bullets.map((b, i) => (
                  <li key={i}><span className="check">•</span><span>{b}</span></li>
                ))}
              </ul>
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={closeInfo}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;