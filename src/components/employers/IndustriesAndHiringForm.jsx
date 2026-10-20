import React, { useState } from 'react';
import {
  Laptop,
  Users,
  UserCheck,
  TrendingUp,
  Cog,
  Layers,
  ArrowRight,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { employerIndustries } from '../../data/employerData';
import { getStored, setStored, STORAGE_KEYS } from '../../admin/adminStore';
import { api } from '../../api/apiClient';

export default function IndustriesAndHiringForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    category: '',
    openings: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const getIndustryIcon = (iconName) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop size={20} />;
      case 'Users':
        return <Users size={20} />;
      case 'UserCheck':
        return <UserCheck size={20} />;
      case 'TrendingUp':
        return <TrendingUp size={20} />;
      case 'Cog':
        return <Cog size={20} />;
      case 'Layers':
        return <Layers size={20} />;
      default:
        return <Laptop size={20} />;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!formData.company.trim()) {
      setErrorMsg('Please enter your company name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }

    // Persist to admin store & MongoDB Atlas
    const newLead = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      company: formData.company,
      phone: formData.phone,
      email: formData.email,
      category: formData.category || 'General Requirement',
      openings: formData.openings || '1-2',
      description: formData.description || '',
      status: 'New',
      date: new Date().toLocaleString(),
    };

    try {
      const existingLeads = getStored(STORAGE_KEYS.EMPLOYER_LEADS, []);
      setStored(STORAGE_KEYS.EMPLOYER_LEADS, [newLead, ...existingLeads]);
      api.createLead(newLead).catch((err) => console.warn('Atlas lead sync note:', err.message));
    } catch (err) {
      console.error('Failed to store lead:', err);
    }

    setSubmitted(true);
  };

  return (
    <section className="emp-industries-form-section" id="hiring-form">
      <div className="container emp-split-grid">
        {/* Left Column: Industries We Serve */}
        <div className="emp-industries-panel">
          <div>
            <div className="emp-decorative-bar" />
            <h2 className="emp-section-header__title">Industries We Serve</h2>
            <p className="emp-section-header__subtitle">
              We support businesses in finding suitable candidates across key professional domains.
            </p>
          </div>

          {/* Row 1: 3 cards */}
          <div className="emp-industries-subgrid">
            {employerIndustries.slice(0, 3).map((ind) => (
              <div key={ind.id} className="emp-industry-card">
                <div className="emp-industry-card__icon-wrap">
                  {getIndustryIcon(ind.iconName)}
                </div>
                <span className="emp-industry-card__label">{ind.title}</span>
              </div>
            ))}
          </div>

          {/* Row 2: 3 cards */}
          <div className="emp-industries-subgrid">
            {employerIndustries.slice(3).map((ind) => (
              <div key={ind.id} className="emp-industry-card">
                <div className="emp-industry-card__icon-wrap">
                  {getIndustryIcon(ind.iconName)}
                </div>
                <span className="emp-industry-card__label">{ind.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Submit Your Hiring Requirement Form */}
        <div className="emp-hiring-form-card">
          <h3 className="emp-hiring-form__title">Submit Your Hiring Requirement</h3>
          <p className="emp-hiring-form__subtitle">
            Share your requirements, and our team will get in touch with suitable candidate profiles.
          </p>

          {submitted ? (
            <div className="emp-form-alert-success">
              <CheckCircle size={18} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              Thank you! Your hiring requirement has been recorded locally. Our recruitment specialist will get in touch shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {errorMsg && (
                <div style={{ color: '#ff8a80', fontSize: '11.5px', marginBottom: 10 }}>
                  {errorMsg}
                </div>
              )}

              {/* Row 1: Name and Company */}
              <div className="emp-form-row-2col">
                <div className="emp-form-group">
                  <label className="emp-form-label">
                    Your Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="emp-form-input"
                    required
                  />
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">
                    Company Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="emp-form-input"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Phone and Email */}
              <div className="emp-form-row-2col">
                <div className="emp-form-group">
                  <label className="emp-form-label">
                    Phone Number <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    className="emp-form-input"
                    required
                  />
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">
                    Email Address <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="emp-form-input"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Hiring For and Openings */}
              <div className="emp-form-row-2col">
                <div className="emp-form-group">
                  <label className="emp-form-label">
                    Hiring For <span className="req">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="emp-form-select"
                  >
                    <option value="">Select Job Category</option>
                    <option value="IT & Technology">IT & Technology</option>
                    <option value="Business Support & Corporate Roles">Business Support & Corporate Roles</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance, Accounting & Research">Finance, Accounting & Research</option>
                    <option value="Engineering & Civil">Engineering & Civil</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Number of Openings</label>
                  <select
                    name="openings"
                    value={formData.openings}
                    onChange={handleChange}
                    className="emp-form-select"
                  >
                    <option value="">Select</option>
                    <option value="1-2">1–2 Openings</option>
                    <option value="3-5">3–5 Openings</option>
                    <option value="6-10">6–10 Openings</option>
                    <option value="10+">10+ Openings</option>
                  </select>
                </div>
              </div>

              {/* Full Row: Job Description / Requirements */}
              <div className="emp-form-group emp-form-group--full">
                <label className="emp-form-label">Job Description / Requirements</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Share role, skills, experience, location and any other details..."
                  className="emp-form-textarea"
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="emp-form-submit-btn">
                <span>Submit Requirement</span>
                <ArrowRight size={14} />
              </button>

              {/* Confidentiality Notice */}
              <div className="emp-form-confidential">
                <Lock size={12} className="emp-form-confidential-icon" />
                <span>Your information will be kept confidential and used only for recruitment purposes.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
