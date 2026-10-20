import React from 'react';
import { Users, FileText, Building2, Search, ArrowRight } from 'lucide-react';
import { recruitmentServices } from '../../data/employerData';

export default function RecruitmentServices() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Users':
        return <Users size={22} />;
      case 'FileText':
        return <FileText size={22} />;
      case 'Building2':
        return <Building2 size={22} />;
      case 'Search':
        return <Search size={22} />;
      default:
        return <Users size={22} />;
    }
  };

  const handleScrollToForm = (e) => {
    e.preventDefault();
    const el = document.getElementById('hiring-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="emp-services-section" id="recruitment-services">
      <div className="container">
        {/* Header with Title and Discuss CTA */}
        <div className="emp-section-header-split">
          <div>
            <div className="emp-decorative-bar" />
            <h2 className="emp-section-header__title">Our Recruitment Services</h2>
            <p className="emp-section-header__subtitle">
              End-to-end recruitment support to help you find the right talent, faster and more efficiently.
            </p>
          </div>

          <a
            href="#hiring-form"
            className="emp-btn-outline-gold"
            onClick={handleScrollToForm}
          >
            <span>Discuss Your Hiring Needs</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {/* 4 Cards Grid */}
        <div className="emp-services-grid">
          {recruitmentServices.map((service) => (
            <div key={service.id} className="emp-service-card">
              <div className="emp-service-card__icon-wrap">
                {getIcon(service.iconName)}
              </div>
              <h3 className="emp-service-card__title">{service.title}</h3>
              <p className="emp-service-card__desc">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
