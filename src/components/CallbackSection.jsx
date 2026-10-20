import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getStored, setStored, STORAGE_KEYS } from '../admin/adminStore';
import { api } from '../api/apiClient';

export default function CallbackSection() {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    topic: 'Job opportunities',
  });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) {
      setError('Please provide your name and mobile number.');
      return;
    }

    const newCallback = {
      id: `CB-${Date.now().toString().slice(-4)}`,
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      topic: form.topic || 'General enquiry',
      source: 'Website Callback Banner',
      status: 'Pending',
      date: new Date().toLocaleString(),
    };

    try {
      const existing = getStored(STORAGE_KEYS.CALLBACKS, []);
      setStored(STORAGE_KEYS.CALLBACKS, [newCallback, ...existing]);
      api.createCallback(newCallback).catch((err) => console.warn('Atlas callback sync note:', err.message));
    } catch (err) {
      console.error('Failed to store callback:', err);
    }

    setError('');
    setSent(true);
  };

  return (
    <section className="callback-section" id="callback">
      <div className="container">
        <div className="callback-banner">
          {/* Left: Support agent photo and text */}
          <div className="callback-left">
            <img
              src="/images/callback-support.png"
              alt="Customer Support Representative"
              className="callback-photo"
            />
            <div className="callback-text-group">
              <span className="callback-eyebrow">REQUEST A CALLBACK</span>
              <h3 className="callback-heading">Need Assistance? Request a Callback.</h3>
              <p className="callback-subtext">
                Leave your details and our team will get in touch to understand your hiring needs or career goals.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="callback-right">
            {sent ? (
              <div className="callback-success-msg">
                <CheckCircle2 size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                <span>Thank you! Callback request recorded for <strong>{form.name}</strong> ({form.mobile}).</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="callback-form">
                <input
                  type="text"
                  placeholder="Your Name *"
                  className="callback-input-field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  aria-label="Your Name"
                />

                <input
                  type="tel"
                  placeholder="Mobile Number *"
                  className="callback-input-field"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  aria-label="Mobile Number"
                />

                <select
                  className="callback-input-field"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  aria-label="What would you like to discuss?"
                >
                  <option value="Job opportunities">Job opportunities</option>
                  <option value="Hiring requirements">Hiring requirements</option>
                  <option value="General enquiry">General enquiry</option>
                  <option value="Other">Other</option>
                </select>

                <button type="submit" className="callback-btn">
                  <span>Request a Callback</span>
                  <ArrowRight size={13} />
                </button>
              </form>
            )}
            {error && <span className="form-error-msg" style={{ marginTop: '4px', display: 'block' }}>{error}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
