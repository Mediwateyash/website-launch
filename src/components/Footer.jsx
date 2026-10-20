import React from 'react';
import Logo from './Logo';
import { MapPin, Phone, Mail } from 'lucide-react';
import '../styles/footer.css';

export default function Footer({ onNavigate }) {
  const handleNav = (e, page, hash) => {
    if (page && onNavigate) {
      e.preventDefault();
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (hash) {
      // If we have an anchor
      if (onNavigate) {
        onNavigate('home');
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  };

  return (
    <footer className="site-footer" id="contact-us">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div className="footer-col-brand">
            <div
              onClick={(e) => handleNav(e, 'home')}
              style={{ cursor: 'pointer', display: 'inline-block' }}
            >
              <Logo variant="dark" />
            </div>
            <p className="footer-tagline">
              Connecting businesses with suitable talent and helping professionals discover
              meaningful career opportunities.
            </p>
            <div className="footer-social-links" aria-label="Social media links">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="LinkedIn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.46a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Facebook"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Instagram"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="YouTube"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col-links">
            <h4 className="footer-heading">Quick Links</h4>
            <div className="footer-links-subgrid">
              <div className="footer-link-group">
                <a
                  href="#home"
                  className="footer-nav-link"
                  onClick={(e) => handleNav(e, 'home')}
                >
                  Home
                </a>
                <a
                  href="#/about"
                  className="footer-nav-link"
                  onClick={(e) => handleNav(e, 'about')}
                >
                  About Us
                </a>
                <a
                  href="#industries"
                  className="footer-nav-link"
                  onClick={(e) => handleNav(e, null, '#industries')}
                >
                  Industries
                </a>
                <a
                  href="#job-seekers"
                  className="footer-nav-link"
                  onClick={(e) => handleNav(e, 'job-seekers')}
                >
                  For Job Seekers
                </a>
                <a
                  href="#/employers"
                  className="footer-nav-link"
                  onClick={(e) => handleNav(e, 'employers')}
                >
                  For Employers
                </a>
              </div>
              <div className="footer-link-group">
                <a
                  href="#job-openings"
                  className="footer-nav-link"
                  onClick={(e) => handleNav(e, null, '#job-openings')}
                >
                  Job Openings
                </a>
                <a
                  href="#advisory-board"
                  className="footer-nav-link"
                  onClick={(e) => handleNav(e, null, '#advisory-board')}
                >
                  Key Team
                </a>
                <a
                  href="#faqs"
                  className="footer-nav-link"
                  onClick={(e) => handleNav(e, null, '#faqs')}
                >
                  FAQs
                </a>
                <a
                  href="#contact-us"
                  className="footer-nav-link"
                  onClick={(e) => handleNav(e, null, '#contact-us')}
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Contact Us */}
          <div className="footer-col-contact">
            <h4 className="footer-heading">Contact Us</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <MapPin size={16} className="footer-contact-icon" />
                <span>104, Jaganath Tower, above Parijat Sweets, Opp Nerul Railway Station (West), Sector 20.</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={16} className="footer-contact-icon" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <a href="tel:9819461050">9819461050</a>
                  <a href="tel:8591207594">8591207594</a>
                </div>
              </div>
              <div className="footer-contact-item">
                <Mail size={16} className="footer-contact-icon" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <a href="mailto:shreyashhrinterskillsolutions@gmail.com">shreyashhrinterskillsolutions@gmail.com</a>
                  <a href="mailto:interskillsolutions@gmail.com">interskillsolutions@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Interskill Staffing Solutions — Next Gem Hiring. All rights reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Connecting Talent with Opportunity</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <a
              href="#/admin"
              onClick={(e) => handleNav(e, 'admin')}
              style={{ color: '#BAC7D5', fontSize: '11.5px', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.target.style.color = '#DDB568')}
              onMouseLeave={(e) => (e.target.style.color = '#BAC7D5')}
              title="Recruitment Operations Dashboard"
            >
              Admin Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
