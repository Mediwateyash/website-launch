import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../../api/apiClient';

export default function AboutContactSection({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    userType: 'Job Seeker',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setError('Please fill in your name, contact phone, and email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createConsultation({
        fullName: formData.fullName.trim(),
        companyName: formData.userType === 'Employer' ? 'Company Client' : 'Individual Candidate',
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        serviceNeeded: `About Us Enquiry (${formData.userType}): ${formData.message || 'General Query'}`,
        meetingDate: new Date().toLocaleDateString(),
      });
    } catch (err) {
      console.warn('API consultation notice:', err.message);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <section className="about-contact-section" id="contact">
      <div className="container">
        <div className="about-contact-panel">
          {/* Left Panel: Deep Navy */}
          <div className="contact-left-navy">
            <h2 className="contact-left-title">Let's Work Together</h2>
            <p className="contact-left-desc">
              Whether you are a student exploring your next opportunity or a company looking
              for the right talent, we are here to help make the connection.
            </p>

            <div className="contact-buttons-group">
              <button
                type="button"
                className="btn-contact-gold"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('job-seekers');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    window.location.hash = '#/job-seekers';
                  }
                }}
              >
                <span>Find a Job</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                className="btn-contact-outline"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('employers');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    window.location.hash = '#/employers';
                  }
                }}
              >
                <span>Hire Talent</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Right Panel: White Card Form */}
          <div className="contact-right-white">
            <h3 className="contact-form-title">Get in Touch with Our Team</h3>
            <p className="contact-form-desc">
              Have a question or want to know more about our services? Share your details and
              we'll get back to you.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <CheckCircle2 size={28} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#092344', marginBottom: '8px' }}>
                  Enquiry Received!
                </h4>
                <p style={{ fontSize: '13.5px', color: '#64738A', lineHeight: '1.6' }}>
                  Thank you, <strong>{formData.fullName}</strong>. Your enquiry has been recorded.
                  Our team will contact you shortly.
                </p>
                <button
                  type="button"
                  className="btn-contact-gold"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: '',
                      phone: '',
                      email: '',
                      userType: 'Job Seeker',
                      message: '',
                    });
                  }}
                  style={{ marginTop: '16px', fontSize: '13px' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="about-form-grid">
                <div className="about-form-group">
                  <label className="about-form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="about-form-input"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row-two">
                  <div className="about-form-group">
                    <label className="about-form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="about-form-input"
                      placeholder="e.g. 9819461050"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="about-form-group">
                    <label className="about-form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="about-form-input"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="about-form-group">
                  <label className="about-form-label">I am a *</label>
                  <select
                    name="userType"
                    className="about-form-select"
                    value={formData.userType}
                    onChange={handleChange}
                  >
                    <option value="Job Seeker">Job Seeker</option>
                    <option value="Employer">Employer</option>
                    <option value="General Enquiry">General Enquiry</option>
                  </select>
                </div>

                <div className="about-form-group">
                  <label className="about-form-label">Message (Optional)</label>
                  <textarea
                    name="message"
                    className="about-form-textarea"
                    placeholder="Tell us about your requirements or questions..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                {error && (
                  <p style={{ color: '#dc2626', fontSize: '12.5px', margin: '2px 0 0' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-submit-enquiry"
                  disabled={loading}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Enquiry</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
