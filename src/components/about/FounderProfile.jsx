import React from 'react';
import { Sparkles, Quote } from 'lucide-react';

export default function FounderProfile() {
  return (
    <section className="founder-profile-section" id="founder-profile">
      <div className="container">
        <div className="founder-grid">
          {/* Left Column: Portrait at podium / event */}
          <div className="founder-photo-wrap">
            <img
              src="/images/team-priya.jpg"
              alt="Dr. Priya Gawade speaking at Interskill conference"
              className="founder-photo"
            />
            <div className="founder-badge-overlay">
              <span>Leadership & Vision</span>
            </div>
          </div>

          {/* Right Column: Founder Profile Details */}
          <div className="founder-info">
            <div className="founder-eyebrow">
              <Sparkles size={13} style={{ display: 'inline', marginRight: '6px' }} />
              <span>OUR FOUNDER</span>
            </div>

            <h2 className="founder-name">Dr. Priya Gawade</h2>
            <div className="founder-role">Founder / Managing Director</div>
            <div className="founder-org">Interskill Solutions & Interskill Staffing Solutions</div>

            <div className="founder-divider" />

            <div className="founder-credentials">
              PhD | HR Professional<br />
              with 25+ years of experience
            </div>

            <div className="founder-quote-box">
              <p className="founder-quote">
                “Creating opportunities and building a stronger, more skilled workforce for a brighter tomorrow.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
