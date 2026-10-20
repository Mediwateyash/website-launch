import React from 'react';
import { ShieldCheck, Users, FileText, Headphones, ArrowRight } from 'lucide-react';

export default function WhyApplySection() {
  const cards = [
    {
      id: 'trusted',
      icon: <ShieldCheck size={20} />,
      title: 'Trusted Opportunities',
      desc: 'Verified job openings from reputed companies.',
    },
    {
      id: 'guidance',
      icon: <Users size={20} />,
      title: 'Career Guidance',
      desc: 'Support to help you choose the right roles.',
    },
    {
      id: 'shortlisting',
      icon: <FileText size={20} />,
      title: 'Resume Shortlisting',
      desc: 'Your profile is shared with relevant employers.',
    },
    {
      id: 'support',
      icon: <Headphones size={20} />,
      title: 'End-to-End Support',
      desc: 'Assistance during the interview and hiring process.',
    },
  ];

  return (
    <section className="js-why-section" id="why-apply">
      <div className="container js-why-grid">
        {/* Left Column */}
        <div className="js-why-left">
          <h2 className="section-heading">Why Apply Through Us?</h2>
          <p className="section-subtitle">
            We help you connect with genuine opportunities and support you throughout
            the hiring process.
          </p>

          <div className="js-why-cards-row">
            {cards.map((card) => (
              <div key={card.id} className="js-why-card">
                <div className="js-why-card__icon-wrap">{card.icon}</div>
                <h4 className="js-why-card__title">{card.title}</h4>
                <p className="js-why-card__text">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Career Promo Card */}
        <a href="#latest-jobs" className="js-career-promo-card" title="Explore Jobs">
          <img
            src="/images/career-promo-male.png"
            alt="Start Your Career Journey with the Right Opportunities - Explore Jobs"
            className="js-career-promo-card__bg"
          />
        </a>
      </div>
    </section>
  );
}
