import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { jobSeekerFaqs } from '../../data/jobSeekerFaqs';

export default function FAQAndPromoBanner({ onFindJobClick }) {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="js-faq-promo-section" id="faqs">
      <div className="container js-split-2col-grid">
        {/* Left Column: FAQ Panel */}
        <div className="js-faq-panel">
          <h3 className="section-heading" style={{ fontSize: '18px' }}>
            Frequently Asked Questions
          </h3>
          <p className="section-subtitle" style={{ fontSize: '11.5px', marginBottom: '12px' }}>
            Find answers to common questions about job applications.
          </p>

          <div className="js-faq-subgrid">
            {jobSeekerFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    style={{ padding: '10px 12px', fontSize: '11.5px' }}
                    onClick={() => toggleFAQ(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={14} className="faq-chevron" />
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel" style={{ padding: '0 12px 10px', fontSize: '11px' }}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Bottom Promotional Banner */}
        <div className="js-bottom-promo-banner">
          <div className="js-bottom-promo__content">
            <h3 className="js-bottom-promo__title">
              Your Next Opportunity<br />
              Is Just a Few Clicks Away.
            </h3>
            <p className="js-bottom-promo__subtitle">
              Explore open positions and apply today.
            </p>
            <div>
              <button
                type="button"
                className="btn-gold"
                style={{ fontSize: '12px', padding: '8px 18px' }}
                onClick={onFindJobClick}
              >
                <span>Find a Job Now</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <div className="js-bottom-promo__image-wrap">
            <img
              src="/images/bottom-promo-woman-clean.png"
              alt="Professional holding laptop"
              className="js-bottom-promo__image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
