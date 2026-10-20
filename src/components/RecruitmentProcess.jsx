import React from 'react';
import {
  FileText,
  Users,
  SlidersHorizontal,
  Calendar,
  Handshake,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function RecruitmentProcess() {
  const steps = [
    {
      num: '01',
      title: 'Understand Requirements',
      icon: <FileText size={22} />,
    },
    {
      num: '02',
      title: 'Source Candidates',
      icon: <Users size={22} />,
    },
    {
      num: '03',
      title: 'Screen & Shortlist',
      icon: <SlidersHorizontal size={22} />,
    },
    {
      num: '04',
      title: 'Coordinate Interviews',
      icon: <Calendar size={22} />,
    },
    {
      num: '05',
      title: 'Support Hiring',
      icon: <Handshake size={22} />,
    },
  ];

  return (
    <section className="process-section" id="process">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-eyebrow">
            <Sparkles size={13} />
            <span>OUR RECRUITMENT PROCESS</span>
          </span>
          <h2 className="section-heading">Our Recruitment Process</h2>
          <p className="section-subtitle" style={{ margin: '6px auto 0' }}>
            A simple and effective process to connect the right talent with the right opportunities.
          </p>
        </div>

        <div className="process-timeline">
          {steps.map((step, index) => (
            <React.Fragment key={step.num}>
              <div className="process-step">
                <span className="process-step__number">{step.num}</span>
                <div className="process-step__icon-circle">{step.icon}</div>
                <span className="process-step__label">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="process-connector" aria-hidden="true">
                  <ArrowRight size={14} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
