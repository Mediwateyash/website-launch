import React from 'react';
import { Users, Target, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export default function AboutHero() {
  return (
    <section className="about-hero-section" id="about-hero">
      <div className="container">
        <div className="about-hero-grid">
          {/* Left Column: Introduction & Core Benefits */}
          <div className="about-hero-content">
            <div className="about-hero-eyebrow">
              <Sparkles size={14} />
              <span>ABOUT US</span>
            </div>

            <h1 className="about-hero-heading">
              Connecting<br />
              Talent with<br />
              <span className="gold-text">Opportunity</span>
            </h1>

            <p className="about-hero-desc">
              At Interskill Staffing Solutions — Next Gem Hiring, we believe that the right
              talent can drive business growth, and the right opportunity can shape a career.
            </p>

            <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <a
                href="#contact"
                className="btn-gold"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Connect With Us</span>
                <ArrowRight size={15} />
              </a>
            </div>

            <div className="about-hero-benefits">
              <div className="about-benefit-item">
                <div className="about-benefit-icon">
                  <Users size={18} />
                </div>
                <span className="about-benefit-label">People Focused</span>
              </div>

              <div className="about-benefit-item">
                <div className="about-benefit-icon">
                  <Target size={18} />
                </div>
                <span className="about-benefit-label">Industry Aligned</span>
              </div>

              <div className="about-benefit-item">
                <div className="about-benefit-icon">
                  <TrendingUp size={18} />
                </div>
                <span className="about-benefit-label">Meaningful Career Opportunities</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Photograph */}
          <div className="about-hero-visual">
            <div className="about-hero-diagonal" />
            <div className="about-hero-img-wrap">
              <img
                src="/images/bottom-promo-woman-clean.png"
                alt="Interskill Staffing Professional Consultant"
                className="about-hero-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
