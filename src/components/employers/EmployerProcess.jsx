import React from 'react';
import {
  FileText,
  Search,
  Users,
  Calendar,
  Handshake,
  ArrowRight,
} from 'lucide-react';
import { employerProcessSteps } from '../../data/employerData';

export default function EmployerProcess() {
  const getStepIcon = (iconName) => {
    switch (iconName) {
      case 'FileText':
        return <FileText size={22} />;
      case 'Search':
        return <Search size={22} />;
      case 'Users':
        return <Users size={22} />;
      case 'Calendar':
        return <Calendar size={22} />;
      case 'Handshake':
        return <Handshake size={22} />;
      default:
        return <FileText size={22} />;
    }
  };

  return (
    <section className="emp-process-section" id="recruitment-process">
      <div className="container">
        <div>
          <div className="emp-decorative-bar" />
          <h2 className="emp-section-header__title">Our Recruitment Process</h2>
          <p className="emp-section-header__subtitle" style={{ marginBottom: 20 }}>
            A simple and transparent process to help you hire the right talent.
          </p>
        </div>

        <div className="emp-process-panel">
          <div className="emp-process-timeline">
            {employerProcessSteps.map((step, idx) => (
              <React.Fragment key={step.step}>
                <div className="emp-process-step">
                  <div className="emp-process-icon-wrap">
                    {getStepIcon(step.iconName)}
                  </div>
                  <h4 className="emp-process-title">{step.title}</h4>
                  <p className="emp-process-desc">{step.description}</p>
                </div>

                {idx < employerProcessSteps.length - 1 && (
                  <div className="emp-process-arrow" aria-hidden="true">
                    <ArrowRight size={16} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
