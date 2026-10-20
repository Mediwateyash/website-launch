import React, { useState, useEffect } from 'react';
import { Quote, ArrowRight } from 'lucide-react';
import { employerTestimonials as defaultTestimonials } from '../../data/employerData';
import { api } from '../../api/apiClient';

export default function EmployerTestimonials() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  useEffect(() => {
    api.getTestimonials().then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        setTestimonials(res);
      }
    }).catch(() => {});
  }, []);

  return (
    <section className="emp-testimonials-section" id="testimonials">
      <div className="container">
        {/* Header with Title and View More CTA */}
        <div className="emp-section-header-split">
          <div>
            <div className="emp-decorative-bar" />
            <h2 className="emp-section-header__title">What Our Clients Say</h2>
            <p className="emp-section-header__subtitle">
              Trusted by businesses across industries for their hiring needs.
            </p>
          </div>

          <a href="#hiring-form" className="emp-btn-outline-gold">
            <span>View More Reviews</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Testimonials 2-Column Grid */}
        <div className="emp-testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id || t._id} className="emp-testimonial-card">
              <div className="emp-testimonial-quote-wrap">
                <Quote size={24} className="emp-testimonial-quote-icon" />
                <p className="emp-testimonial-quote-text">"{t.quote}"</p>
              </div>

              <div className="emp-testimonial-author">
                <img
                  src={t.image}
                  alt={t.name}
                  className="emp-testimonial-avatar"
                />
                <div className="emp-testimonial-meta">
                  <span className="emp-testimonial-name">{t.name}</span>
                  <span className="emp-testimonial-role-company">
                    {t.role} · {t.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
