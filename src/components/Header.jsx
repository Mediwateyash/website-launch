import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';
import '../styles/header.css';

export default function Header({
  activePage = 'home',
  ctaLabel = 'Get Started',
  ctaHref = '#consultation',
  onNavigate,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', id: 'home', href: '#home', page: 'home' },
    { label: 'About Us', id: 'about', href: '#/about', page: 'about' },
    { label: 'For Job Seekers', id: 'job-seekers', href: '#job-seekers', page: 'job-seekers' },
    { label: 'For Employers', id: 'employers', href: '#/employers', page: 'employers' },
    { label: 'Contact Us', id: 'contact-us', href: '#contact-us' },
  ];

  const handleLinkClick = (e, link) => {
    if (link.page) {
      if (onNavigate) {
        e.preventDefault();
        onNavigate(link.page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // If we are not on the homepage and the link is an anchor on the homepage, navigate to home then scroll
      if (activePage !== 'home' && onNavigate) {
        e.preventDefault();
        onNavigate('home');
        setTimeout(() => {
          const el = document.querySelector(link.href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
    setMobileMenuOpen(false);
  };

  const handleCtaClick = (e) => {
    if (ctaHref && ctaHref.startsWith('#')) {
      const targetId = ctaHref.replace(/^#\/?/, '');
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (onNavigate && targetId === 'consultation') {
        e.preventDefault();
        onNavigate('home');
        setTimeout(() => {
          const homeEl = document.getElementById('consultation');
          if (homeEl) homeEl.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
      <div className="container site-header__inner">
        <div
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <Logo variant="light" />
        </div>

        <nav className="site-nav" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive =
              activePage === link.id ||
              (activePage === 'home' && link.id === 'home');

            return (
              <a
                key={link.id}
                href={link.href}
                className={`site-nav__link ${isActive ? 'is-active' : ''}`}
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="site-header__cta">
          <a href={ctaHref} className="btn-gold" onClick={handleCtaClick}>
            {ctaLabel}
          </a>
        </div>

        <button
          className="mobile-nav-toggle"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer__links">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`mobile-drawer__link ${activePage === link.id ? 'is-active' : ''}`}
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href={ctaHref}
            className="btn-gold mobile-drawer__cta"
            onClick={handleCtaClick}
          >
            {ctaLabel}
          </a>
        </div>
      )}
    </header>
  );
}
