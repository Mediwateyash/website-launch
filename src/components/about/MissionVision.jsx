import React from 'react';
import { Target, Eye } from 'lucide-react';

export default function MissionVision() {
  return (
    <section className="mission-vision-section" id="mission-vision">
      <div className="container">
        <div className="mission-vision-grid">
          {/* Card 1: Our Mission */}
          <div className="mv-card mv-card--dark">
            <div className="mv-card-icon">
              <Target size={28} />
            </div>
            <h3 className="mv-card-title">Our Mission</h3>
            <p className="mv-card-text">
              To connect businesses with the right talent while helping individuals move forward in their careers.
            </p>
          </div>

          {/* Card 2: Our Vision */}
          <div className="mv-card mv-card--light">
            <div className="mv-card-icon">
              <Eye size={28} />
            </div>
            <h3 className="mv-card-title">Our Vision</h3>
            <p className="mv-card-text">
              To build meaningful connections between employers and candidates through responsive,
              reliable, and people-focused recruitment services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
