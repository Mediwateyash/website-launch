import React from 'react';
import { ArrowRight, Laptop, Users, Target, TrendingUp, Cog, Layers, GraduationCap, Sparkles } from 'lucide-react';
import { industries, talentLevel } from '../data/industries';

export default function IndustriesSection() {
  const getIcon = (name) => {
    switch (name) {
      case 'Laptop':
        return <Laptop size={24} />;
      case 'Users':
        return <Users size={24} />;
      case 'Target':
        return <Target size={24} />;
      case 'TrendingUp':
        return <TrendingUp size={24} />;
      case 'Cog':
        return <Cog size={24} />;
      case 'Layers':
        return <Layers size={24} />;
      default:
        return <Laptop size={24} />;
    }
  };

  return (
    <section className="industries-section" id="industries">
      <div className="container industries-layout">
        {/* Left Column */}
        <div className="industries-left">
          <span className="section-eyebrow">
            <Sparkles size={13} />
            <span>INDUSTRIES WE SERVE</span>
          </span>
          <h2 className="section-heading">
            Connecting the Right Talent with the Right Opportunities
          </h2>
          <p className="section-subtitle">
            At Interskill Staffing Solutions — Next Gem Hiring, we support businesses in
            finding suitable candidates across key professional domains, from entry-level
            talent to experienced professionals.
          </p>
          <a href="#consultation" className="link-gold">
            <span>Learn More</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Right Column */}
        <div className="industries-right">
          {/* 5 Industry Cards Row */}
          <div className="industry-cards-row">
            {industries.map((item) => (
              <div key={item.id} className="industry-card">
                <div className="industry-card__icon-wrap">{getIcon(item.iconName)}</div>
                <span className="industry-card__title">{item.title}</span>
              </div>
            ))}
          </div>

          {/* Wide Supporting Talent Level Card */}
          <div className="talent-level-card">
            <GraduationCap size={26} className="talent-level-card__icon" />
            <div className="talent-level-card__content">
              <span className="talent-level-card__title">{talentLevel.title}</span>
              <span className="talent-level-card__subtitle">{talentLevel.subtitle}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
