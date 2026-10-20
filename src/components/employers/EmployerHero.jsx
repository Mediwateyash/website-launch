import React from 'react';
import { Users, Target, TrendingUp, ArrowRight } from 'lucide-react';

export default function EmployerHero() {
  const handleScrollToForm = (e) => {
    e.preventDefault();
    const el = document.getElementById('hiring-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="emp-hero" id="employer-hero">
      <div className="container emp-hero__grid">
        {/* Left Content */}
        <div className="emp-hero__left">
          <span className="emp-hero__eyebrow">FOR EMPLOYERS</span>

          <h1 className="emp-hero__headline">
            Hire the Right Talent<br />
            for a <span className="emp-hero__headline-gold">Stronger Tomorrow.</span>
          </h1>

          <p className="emp-hero__description">
            Partner with Interskill Staffing Solutions — Next Gem Hiring to find
            suitable candidates who match your business needs.
          </p>

          <div className="emp-hero__benefits-row">
            <div className="emp-hero__benefit-item">
              <Users size={22} className="emp-hero__benefit-icon" />
              <span className="emp-hero__benefit-text">Skilled Candidates</span>
            </div>

            <div className="emp-hero__benefit-item">
              <Target size={22} className="emp-hero__benefit-icon" />
              <span className="emp-hero__benefit-text">
                Industry Aligned<br />Recruitment
              </span>
            </div>

            <div className="emp-hero__benefit-item">
              <TrendingUp size={22} className="emp-hero__benefit-icon" />
              <span className="emp-hero__benefit-text">
                Support from<br />Requirement to Hiring
              </span>
            </div>
          </div>

          <a
            href="#hiring-form"
            className="emp-hero__cta-btn"
            onClick={handleScrollToForm}
          >
            <span>Submit Hiring Requirement</span>
            <ArrowRight size={15} />
          </a>
        </div>

        {/* Right Photo Banner with Annotation */}
        <div className="emp-hero__right">
          <div className="emp-hero__image-wrapper">
            <img
              src="/images/employer-hero-team.png"
              alt="Corporate team collaborating around a laptop - Your Hiring Partner for Long-Term Success"
              className="emp-hero__image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
