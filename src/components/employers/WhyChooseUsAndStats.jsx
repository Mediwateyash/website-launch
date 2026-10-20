import React from 'react';
import { CheckCircle2, UserCheck, Crosshair, Star } from 'lucide-react';
import { whyChooseUsPoints, employerStats } from '../../data/employerData';

export default function WhyChooseUsAndStats() {
  return (
    <section className="emp-why-stats-section" id="why-choose-us">
      <div className="container emp-why-stats-grid">
        {/* Left: Why Choose Us with Handshake Photo */}
        <div className="emp-why-panel">
          <div className="emp-why-image-wrap">
            <img
              src="/images/employer-handshake.png"
              alt="Professional business meeting and handshake"
              className="emp-why-image"
            />
          </div>

          <div className="emp-why-content">
            <h3 className="emp-why-title">Why Choose Us?</h3>
            <div className="emp-why-points-list">
              {whyChooseUsPoints.map((point, index) => (
                <div key={index} className="emp-why-point-item">
                  <CheckCircle2 size={16} className="emp-why-check-icon" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: 3 Company Statistics */}
        <div className="emp-stats-panel">
          {employerStats.map((stat) => (
            <div key={stat.id} className="emp-stat-col">
              {stat.isStars ? (
                <div className="emp-stat-stars-wrap">
                  <Star size={15} fill="#DDB568" stroke="none" />
                  <Star size={15} fill="#DDB568" stroke="none" />
                  <Star size={15} fill="#DDB568" stroke="none" />
                </div>
              ) : (
                <div className="emp-stat-icon-wrap">
                  {stat.iconName === 'UserCheck' ? (
                    <UserCheck size={20} />
                  ) : (
                    <Crosshair size={20} />
                  )}
                </div>
              )}

              <span
                className={`emp-stat-number ${
                  stat.isStars ? 'emp-stat-number--gold' : ''
                }`}
              >
                {stat.number}
              </span>
              <span className="emp-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
