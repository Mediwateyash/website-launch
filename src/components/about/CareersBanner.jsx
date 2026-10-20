import React from 'react';

export default function CareersBanner() {
  return (
    <section className="careers-banner-section" id="careers-banner">
      <div className="container">
        <div className="careers-banner-grid">
          {/* Left Column: Heading & Description */}
          <div className="careers-banner-left">
            <h2 className="careers-banner-heading">
              <span className="text-gold">Empowering Careers.</span>
              <span className="text-white">Supporting Businesses.</span>
            </h2>
            <p className="careers-banner-desc">
              We work towards a skilled workforce and a stronger industry by creating the right
              opportunities for the right talent.
            </p>
          </div>

          {/* Right Column: People - Skills - Opportunities - Growth Badge with Gold Arrow */}
          <div className="careers-banner-right">
            <div className="careers-badge-card">
              <div className="careers-badge-word">People</div>
              <div className="careers-badge-word highlight">Skills</div>
              <div className="careers-badge-word">Opportunities</div>
              <div className="careers-badge-word highlight">Growth</div>

              {/* Curved Gold Arrow SVG */}
              <svg
                className="careers-arrow-svg"
                viewBox="0 0 140 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 20 C 50 32, 90 28, 126 12"
                  stroke="#DDB568"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M120 6 L 128 12 L 120 18"
                  stroke="#DDB568"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
