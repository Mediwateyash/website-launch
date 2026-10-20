import React from 'react';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';

export default function AboutMissionVision({ onNavigate }) {
  return (
    <section className="about-section" id="about">
      <div className="container about-grid">
        {/* Left Column: About Us */}
        <div className="about-left">
          <span className="section-eyebrow">
            <Sparkles size={13} />
            <span>ABOUT US</span>
          </span>
          <h2 className="section-heading">Connecting Talent with Opportunity</h2>
          <p className="section-subtitle">
            At Interskill Solutions, we believe that the right talent can drive business
            growth, and the right opportunity can shape a career. Our recruitment
            services focus on understanding employer requirements, identifying relevant
            candidates and supporting the hiring process.
          </p>
          <a
            href="#/about"
            className="link-gold"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <span>Read More</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Right Column: Vision Card */}
        <div className="mission-vision-cards" style={{ gridTemplateColumns: '1fr' }}>
          {/* Card: Our Vision */}
          <div className="mv-card mv-card--dark" style={{ justifyContent: 'center', minHeight: '180px' }}>
            <div className="mv-card__icon-wrap">
              <Eye size={32} />
            </div>
            <h3 className="mv-card__title" style={{ fontSize: '18px' }}>Our Vision</h3>
            <p className="mv-card__text" style={{ fontSize: '13.5px', lineHeight: '1.6' }}>
              To create meaningful connections between employers and candidates through
              responsible, reliable and people-focused recruitment services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
