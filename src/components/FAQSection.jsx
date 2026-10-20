import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { faqs as defaultFaqs } from '../data/faqs';
import { api } from '../api/apiClient';

export default function FAQSection() {
  const [faqList, setFaqList] = useState(defaultFaqs);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.getFaqs().then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        setFaqList(res);
      }
    }).catch(() => {});
  }, []);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq-section" id="faqs">
      <div className="container">
        {/* Header Row */}
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">
              <Sparkles size={13} />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </span>
            <h2 className="section-heading">Find Answers to Common Questions</h2>
          </div>
          <a href="#consultation" className="btn-outline-gold">
            <span>View All FAQs</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* FAQs in 2-Column Grid */}
        <div className="faq-grid">
          {faqList.map((faq) => {
            const faqKey = faq.id || faq.faqId;
            const isOpen = openId === faqKey;
            return (
              <div
                key={faqKey}
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFAQ(faqKey)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faqKey}`}
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={16} className="faq-chevron" />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="faq-answer-panel"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
