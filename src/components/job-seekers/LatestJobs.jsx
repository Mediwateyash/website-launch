import React, { useState } from 'react';
import { ArrowRight, Briefcase, MapPin, Clock, Bookmark } from 'lucide-react';

export default function LatestJobs({ jobs, onApplyJob }) {
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="js-jobs-section" id="latest-jobs">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">Latest Job Openings</h2>
            <p className="section-subtitle">
              Explore new opportunities from our client companies. Apply now and take
              the next step in your career.
            </p>
          </div>
          <a href="#latest-jobs" className="btn-outline-gold">
            <span>View All Job Openings</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* 4 Job Cards Grid */}
        <div className="js-jobs-grid">
          {jobs.length === 0 ? (
            <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '30px', color: '#657184' }}>
              No openings match the current search filters. Try clearing your search keyword or filters.
            </div>
          ) : (
            jobs.map((job) => {
              const isSaved = bookmarkedIds.includes(job.id);
              return (
                <div key={job.id} className="js-job-card">
                  <div className="js-job-card__header">
                    <div className="js-job-card__title-wrap">
                      <h3 className="js-job-card__title">{job.title}</h3>
                      {job.isNew && <span className="js-badge-new">New</span>}
                    </div>
                    <button
                      type="button"
                      className={`js-bookmark-btn ${isSaved ? 'is-bookmarked' : ''}`}
                      onClick={() => toggleBookmark(job.id)}
                      aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
                      title={isSaved ? 'Saved' : 'Save this job'}
                    >
                      <Bookmark size={16} fill={isSaved ? '#DDB568' : 'none'} />
                    </button>
                  </div>

                  <span className="js-job-card__company">{job.company}</span>

                  <div className="js-job-card__meta-list">
                    <div className="js-job-meta-item">
                      <Briefcase size={13} className="js-job-meta-icon" />
                      <span>{job.experience}</span>
                    </div>
                    <div className="js-job-meta-item">
                      <MapPin size={13} className="js-job-meta-icon" />
                      <span>{job.location}</span>
                    </div>
                    <div className="js-job-meta-item">
                      <Clock size={13} className="js-job-meta-icon" />
                      <span>{job.type}</span>
                    </div>
                  </div>

                  <div className="js-job-card__tags">
                    {job.tags.map((tag) => (
                      <span key={tag} className="js-tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="js-job-card__footer">
                    <button
                      type="button"
                      className="js-btn-apply"
                      onClick={() => onApplyJob(job)}
                    >
                      <span>Apply Now</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
