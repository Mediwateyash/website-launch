import React from 'react';
import { Sparkles } from 'lucide-react';

export default function ApproachSection() {
  return (
    <section className="approach-section" id="our-approach">
      <div className="container">
        <div className="approach-grid">
          {/* Left Column: Explanatory Copy */}
          <div className="approach-content">
            <div className="approach-eyebrow">
              <Sparkles size={13} style={{ display: 'inline', marginRight: '6px' }} />
              <span>OUR APPROACH</span>
            </div>
            <h2 className="approach-heading">Our Approach</h2>
            <p className="approach-paragraph">
              We take the time to understand employer requirements, identify relevant candidates,
              screen profiles, and support the hiring process. Our team works closely with both
              companies and job seekers to make recruitment simpler, more efficient, and more
              accessible.
            </p>
          </div>

          {/* Right Column: Team Collaboration Photograph */}
          <div className="approach-photo-wrap">
            <img
              src="/images/employer-meeting.png"
              alt="Interskill staffing team collaborating on recruitment strategies"
              className="approach-photo"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
