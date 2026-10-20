import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function AudienceCards({ onNavigate }) {
  return (
    <section className="audience-section" id="job-seekers-section">
      <div className="container audience-grid">
        {/* Left Card: Job Seekers */}
        <div className="audience-card">
          <div className="audience-card__image-container">
            <img
              src="/images/job-seeker.png"
              alt="Professional job seeker at work"
              className="audience-card__image"
            />
          </div>
          <div className="audience-card__content">
            <span className="audience-card__eyebrow">FOR JOB SEEKERS</span>
            <h3 className="audience-card__heading">Explore Your Next Opportunity</h3>
            <p className="audience-card__text">
              Submit your resume, explore current openings and take the next step in your career.
            </p>
            <a
              href="#/job-seekers"
              className="btn-gold audience-card__button"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('job-seekers');
                }
              }}
            >
              <span>Find a Job</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Right Card: Employers */}
        <div className="audience-card" id="employers-section">
          <div className="audience-card__image-container">
            <img
              src="/images/employer-meeting.png"
              alt="Corporate business meeting and handshake"
              className="audience-card__image"
            />
          </div>
          <div className="audience-card__content">
            <span className="audience-card__eyebrow">FOR EMPLOYERS</span>
            <h3 className="audience-card__heading">Hire the Right Talent</h3>
            <p className="audience-card__text">
              Share your hiring requirements and connect with candidates suited to your business needs.
            </p>
            <a
              href="#/employers"
              className="btn-navy audience-card__button"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('employers');
                }
              }}
            >
              <span>Submit Hiring Requirements</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
