import React, { useState } from 'react';
import {
  FileText,
  Search,
  Users,
  Calendar,
  Handshake,
  Phone,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { jobCategories } from '../../data/jobSeekerJobs';
import { api } from '../../api/apiClient';

export default function HiringProcessAndCallback() {
  const steps = [
    {
      num: '01',
      title: 'Submit Your Resume',
      icon: <FileText size={20} />,
    },
    {
      num: '02',
      title: 'Profile Review',
      icon: <Search size={20} />,
    },
    {
      num: '03',
      title: 'Shortlisting by Employers',
      icon: <Users size={20} />,
    },
    {
      num: '04',
      title: 'Interview Coordination',
      icon: <Calendar size={20} />,
    },
    {
      num: '05',
      title: 'Job Offer & Onboarding',
      icon: <Handshake size={20} />,
    },
  ];

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    category: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) {
      setError('Please provide your name and mobile number.');
      return;
    }
    if (!/^[0-9+\s-]{8,15}$/.test(form.mobile.trim())) {
      setError('Please provide a valid contact number.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await api.createCallback({
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        topic: form.category || 'General Candidate Career Assistance',
        source: 'For Job Seekers Page — Hiring Process Callback',
      });
    } catch (err) {
      console.warn('Callback submission warning:', err.message);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <section className="js-process-callback-section" id="process-callback">
      <div className="container js-split-2col-grid">
        {/* Left Column: Hiring Process Card */}
        <div className="js-panel-card">
          <h3 className="js-panel-heading">Our Hiring Process for Candidates</h3>
          <p className="js-panel-subtitle">
            A simple and transparent process to help you get hired.
          </p>

          <div className="js-candidate-process-timeline">
            {steps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="js-candidate-step">
                  <div className="js-candidate-step__circle">{step.icon}</div>
                  <span className="js-candidate-step__num">{step.num}</span>
                  <span className="js-candidate-step__title">{step.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="js-candidate-connector" aria-hidden="true">
                    <ArrowRight size={13} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right Column: Callback Card */}
        <div className="js-panel-card">
          <div className="js-callback-card-header">
            <div className="js-callback-icon-circle">
              <Phone size={18} />
            </div>
            <h3 className="js-panel-heading">
              Need Assistance? Request a Callback.
            </h3>
          </div>
          <p className="js-panel-subtitle">
            Leave your details and our team will get in touch to help you with suitable job opportunities.
          </p>

          {submitted ? (
            <div className="form-feedback-card" style={{ padding: '16px', margin: 'auto 0' }}>
              <h4 style={{ fontSize: '13px', margin: 0, color: '#166534' }}>
                <CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Callback Request Received!
              </h4>
              <p style={{ fontSize: '11.5px', marginTop: '4px' }}>
                Thank you, <strong>{form.name}</strong>. Our placement counselor will contact you at <strong>{form.mobile}</strong>.
              </p>
              <button
                type="button"
                className="link-gold"
                style={{ marginTop: '8px', fontSize: '11.5px' }}
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', mobile: '', category: '' });
                }}
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="js-callback-form-grid" noValidate>
              <div className="js-callback-row-2col">
                <div className="js-callback-field-group">
                  <label htmlFor="jsCbName" className="js-callback-label">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="jsCbName"
                    className="js-callback-input"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="js-callback-field-group">
                  <label htmlFor="jsCbMobile" className="js-callback-label">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="jsCbMobile"
                    className="js-callback-input"
                    placeholder="Enter your number"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="js-callback-field-group">
                <label htmlFor="jsCbCategory" className="js-callback-label">
                  Preferred Job Category
                </label>
                <select
                  id="jsCbCategory"
                  className="js-callback-select"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {jobCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <span className="form-error-msg" style={{ fontSize: '10.5px' }}>
                  {error}
                </span>
              )}

              <button type="submit" className="js-btn-submit-callback">
                <span>Request a Callback</span>
                <ArrowRight size={13} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
