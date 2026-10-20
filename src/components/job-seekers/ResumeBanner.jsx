import React from 'react';
import { FileUp, ArrowRight } from 'lucide-react';

export default function ResumeBanner({ onOpenModal }) {
  return (
    <section className="js-resume-banner-section">
      <div className="container">
        <div className="js-resume-banner">
          <div className="js-resume-banner__left">
            <div className="js-resume-banner__icon-wrap">
              <FileUp size={24} />
            </div>
            <div className="js-resume-banner__text">
              <h3 className="js-resume-banner__title">
                Don’t See a Suitable Opening?
              </h3>
              <p className="js-resume-banner__subtitle">
                Submit your resume and we’ll keep you in mind for relevant opportunities.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="js-btn-resume"
            onClick={onOpenModal}
          >
            <span>Submit Your Resume</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
