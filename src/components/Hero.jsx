import React from 'react';
import { ArrowRight } from 'lucide-react';
import '../styles/hero.css';

export default function Hero({ onNavigate }) {
  return (
    <section className="hero-section" id="home">
      <div className="container hero-grid">
        {/* Left Content */}
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow__tilde">~</span>
            <span>CONNECTING TALENT WITH OPPORTUNITY</span>
          </div>

          <h1 className="hero-headline">
            <span className="hero-headline__line1">The Right Talent.</span>
            <span className="hero-headline__line2">The Right Opportunity.</span>
          </h1>

          <p className="hero-description">
            We connect businesses with suitable talent and help professionals discover
            meaningful career opportunities.
          </p>

          <div className="hero-actions">
            <a
              href="#/job-seekers"
              className="btn-gold"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('job-seekers');
                }
              }}
            >
              <span>Find a Job</span>
              <ArrowRight size={15} />
            </a>
            <a
              href="#/employers"
              className="btn-outline-white"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('employers');
                }
              }}
            >
              <span>Hire Talent</span>
              <ArrowRight size={15} />
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="hero-stat-number">600+</span>
              <span className="hero-stat-label">Industry Focus Areas</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-number">10000+</span>
              <span className="hero-stat-label">Professionals Connected</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-number gold">Trusted</span>
              <span className="hero-stat-label">by Growing Businesses</span>
            </div>
          </div>
        </div>

        {/* Right Photo Banner */}
        <div className="hero-right">
          <div className="hero-image-wrapper">
            <img
              src="/images/hero-recruitment.png"
              alt="Professional Recruitment Specialist"
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
