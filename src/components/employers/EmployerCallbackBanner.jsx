import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { getStored, setStored, STORAGE_KEYS } from '../../admin/adminStore';
import { api } from '../../api/apiClient';

export default function EmployerCallbackBanner() {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const newCallback = {
      id: `CB-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      mobile: formData.phone.trim(),
      topic: 'Employer Hiring Assistance',
      source: 'For Employers Callback Banner',
      status: 'Pending',
      date: new Date().toLocaleString(),
    };

    try {
      const existing = getStored(STORAGE_KEYS.CALLBACKS, []);
      setStored(STORAGE_KEYS.CALLBACKS, [newCallback, ...existing]);
      await api.createCallback(newCallback);
    } catch (err) {
      console.warn('Callback sync note (saved locally):', err.message);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <section className="emp-callback-section" id="employer-callback">
      <div className="container">
        <div className="emp-callback-banner">
          {/* 1. Male Professional Photo */}
          <div className="emp-callback-banner__photo-wrap">
            <img
              src="/images/employer-callback-male.png"
              alt="Professional recruitment advisor"
              className="emp-callback-banner__photo"
            />
          </div>

          {/* 2. Text */}
          <div className="emp-callback-banner__text-wrap">
            <h3 className="emp-callback-banner__title">
              Need Assistance?<br />
              Request a Callback.
            </h3>
            <p className="emp-callback-banner__subtitle">
              Leave your details and our team will get in touch to understand your hiring needs.
            </p>
          </div>

          {/* 3. Divider Line */}
          <div className="emp-callback-banner__divider" aria-hidden="true" />

          {/* 4. Form */}
          <div className="emp-callback-banner__form-wrap">
            {submitted ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#a5d6a7',
                  fontSize: '12.5px',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={18} color="#81c784" />
                <span>Thank you! Callback request received. We will call you back shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="emp-callback-banner__form" noValidate>
                {errorMsg && (
                  <span
                    style={{
                      color: '#ff8a80',
                      fontSize: '11px',
                      display: 'block',
                      width: '100%',
                    }}
                  >
                    {errorMsg}
                  </span>
                )}
                <div className="emp-form-group">
                  <label className="emp-form-label" style={{ color: '#c0d1e5' }}>
                    Your Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="emp-form-input"
                    style={{ height: 34 }}
                    required
                  />
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label" style={{ color: '#c0d1e5' }}>
                    Phone Number <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your number"
                    className="emp-form-input"
                    style={{ height: 34 }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="emp-callback-banner__btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={13} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Request a Callback</span>
                      <ArrowRight size={13} />
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
