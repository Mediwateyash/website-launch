import React, { useState } from 'react';
import { ArrowRight, Briefcase, MapPin, Clock, Sparkles } from 'lucide-react';
import { jobs } from '../data/jobs';

export default function JobOpenings({ onNavigate }) {
  const [appliedRole, setAppliedRole] = useState(null);

  const handleApply = (title) => {
    setAppliedRole(title);
    setTimeout(() => {
      if (onNavigate) {
        onNavigate('job-seekers');
      } else {
        const el = document.getElementById('consultation');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  };

  return (
    <section className="jobs-section" id="job-openings">
      <div className="container">
        {/* Header Row */}
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">
              <Sparkles size={13} />
              <span>CURRENT JOB OPENINGS</span>
            </span>
            <h2 className="section-heading">Our Clients Are Looking for These Roles</h2>
            <p className="section-subtitle">
              Explore exciting opportunities across various industries. Apply now and take the next step in your career.
            </p>
          </div>
          <a
            href="#/job-seekers"
            className="btn-outline-gold"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('job-seekers');
              }
            }}
          >
            <span>View All Job Openings</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* 4 Job Cards Grid */}
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3 className="job-card__title">{job.title}</h3>

              <div className="job-card__tags">
                <span className="job-tag job-tag--badge">
                  <Briefcase size={12} />
                  <span>{job.category}</span>
                </span>

                {job.experience && (
                  <span className="job-tag">
                    <Clock size={12} />
                    <span>{job.experience}</span>
                  </span>
                )}

                <span className="job-tag">
                  <MapPin size={12} />
                  <span>{job.location}</span>
                </span>
              </div>

              <div className="job-card__footer">
                <button
                  type="button"
                  className="link-gold"
                  onClick={() => handleApply(job.title)}
                >
                  <span>{appliedRole === job.title ? 'Redirecting to Apply...' : 'Apply Now'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
