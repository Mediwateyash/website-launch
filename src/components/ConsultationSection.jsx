import React, { useState } from 'react';
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { getStored, setStored, STORAGE_KEYS } from '../admin/adminStore';
import { api } from '../api/apiClient';
import '../styles/forms.css';

export default function ConsultationSection() {
  const [formData, setFormData] = useState({
    requirementType: 'job',
    fullName: '',
    phone: '',
    email: '',
    preferredRole: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone Number is required';
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newConsultation = {
      id: `CON-${Date.now().toString().slice(-4)}`,
      name: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      requirementType:
        formData.requirementType === 'job'
          ? "I'm looking for a job"
          : formData.requirementType === 'hiring'
          ? "I'm hiring for my company"
          : 'I have a general enquiry',
      preferredRole: formData.preferredRole || 'General consultation',
      status: 'New',
      date: new Date().toLocaleString(),
    };

    try {
      const existing = getStored(STORAGE_KEYS.CONSULTATIONS, []);
      setStored(STORAGE_KEYS.CONSULTATIONS, [newConsultation, ...existing]);
      api.createConsultation(newConsultation).catch((err) => console.warn('Atlas consultation sync note:', err.message));
    } catch (err) {
      console.error('Failed to store consultation:', err);
    }

    setErrors({});
    setSubmitted(true);
  };

  return (
    <section className="consultation-section" id="consultation">
      <div className="container">
        <div className="consultation-box">
          {/* Left Column */}
          <div className="consultation-left">
            <span className="section-eyebrow">FREE CONSULTATION</span>
            <h2 className="section-heading">Let's Find the Right Fit for You.</h2>
            <p className="section-subtitle">
              Whether you're looking for your next career opportunity or the right talent
              for your organisation, our team is here to help.
            </p>

            <div className="consultation-illustration-wrap">
              <img
                src="/images/consultation-illustration.png"
                alt="Recruitment consultation illustration"
                className="consultation-illustration"
              />
            </div>

            <div className="consultation-benefits-grid">
              <div className="benefit-item">
                <CheckCircle2 size={16} className="benefit-item__icon" />
                <span>Career guidance</span>
              </div>
              <div className="benefit-item">
                <CheckCircle2 size={16} className="benefit-item__icon" />
                <span>Hiring support</span>
              </div>
              <div className="benefit-item">
                <CheckCircle2 size={16} className="benefit-item__icon" />
                <span>Industry insights</span>
              </div>
              <div className="benefit-item">
                <CheckCircle2 size={16} className="benefit-item__icon" />
                <span>Quick response</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="consultation-right">
            <h3 className="consultation-form-title">Request a Consultation</h3>
            <p className="consultation-form-subtitle">
              Select the option that best describes your requirement.
            </p>

            {submitted ? (
              <div className="form-feedback-card">
                <h4>Consultation Request Received!</h4>
                <p>
                  Thank you, <strong>{formData.fullName}</strong>. This is a frontend demo
                  confirmation. In the production deployment, our career advisory team will
                  reach out to <strong>{formData.email}</strong> or <strong>{formData.phone}</strong>.
                </p>
                <button
                  className="btn-gold"
                  style={{ marginTop: '14px', fontSize: '12px' }}
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      requirementType: 'job',
                      fullName: '',
                      phone: '',
                      email: '',
                      preferredRole: '',
                    });
                  }}
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Radio selection group */}
                <div className="requirement-radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="requirementType"
                      value="job"
                      checked={formData.requirementType === 'job'}
                      onChange={(e) =>
                        setFormData({ ...formData, requirementType: e.target.value })
                      }
                    />
                    <span>I'm looking for a job</span>
                  </label>

                  <label className="radio-label">
                    <input
                      type="radio"
                      name="requirementType"
                      value="hiring"
                      checked={formData.requirementType === 'hiring'}
                      onChange={(e) =>
                        setFormData({ ...formData, requirementType: e.target.value })
                      }
                    />
                    <span>I'm hiring for my company</span>
                  </label>

                  <label className="radio-label">
                    <input
                      type="radio"
                      name="requirementType"
                      value="enquiry"
                      checked={formData.requirementType === 'enquiry'}
                      onChange={(e) =>
                        setFormData({ ...formData, requirementType: e.target.value })
                      }
                    />
                    <span>I have a general enquiry</span>
                  </label>
                </div>

                {/* Form fields 2-column grid */}
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">
                      Full Name <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="Enter your full name"
                      className={`form-input ${errors.fullName ? 'has-error' : ''}`}
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                    {errors.fullName && (
                      <span className="form-error-msg">{errors.fullName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      Phone Number <span className="required-star">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="Enter your contact number"
                      className={`form-input ${errors.phone ? 'has-error' : ''}`}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                    {errors.phone && (
                      <span className="form-error-msg">{errors.phone}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email Address <span className="required-star">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email address"
                      className={`form-input ${errors.email ? 'has-error' : ''}`}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    {errors.email && (
                      <span className="form-error-msg">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="preferredRole">
                      Preferred Job Role
                    </label>
                    <select
                      id="preferredRole"
                      className="form-select"
                      value={formData.preferredRole}
                      onChange={(e) =>
                        setFormData({ ...formData, preferredRole: e.target.value })
                      }
                    >
                      <option value="">Preferred role, experience and location</option>
                      <option value="it">IT & Software Development</option>
                      <option value="hr">HR & Talent Acquisition</option>
                      <option value="finance">Finance & Accounting</option>
                      <option value="engineering">Engineering & Civil</option>
                      <option value="support">Business & Corporate Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-submit-consultation">
                  <span>Request Consultation</span>
                  <ArrowRight size={15} />
                </button>

                <div className="privacy-notice">
                  <Lock size={12} />
                  <span>
                    Your information will be used to respond to your enquiry, subject to our{' '}
                    <a href="#privacy">Privacy Policy</a>.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
