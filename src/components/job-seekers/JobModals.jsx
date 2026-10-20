import React, { useState } from 'react';
import { X, CheckCircle2, FileUp, ArrowRight, Loader2 } from 'lucide-react';
import { getStored, setStored, STORAGE_KEYS } from '../../admin/adminStore';
import { api } from '../../api/apiClient';

export function ResumeModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      setError('Resume file size must be less than 5MB.');
      return;
    }

    setLoading(true);
    setError('');

    // Always keep localStorage updated
    try {
      const existing = getStored(STORAGE_KEYS.RESUMES, []);
      const newResume = {
        id: `RES-${Date.now().toString().slice(-4)}`,
        candidateName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        category: 'General Candidate Pool',
        experience: 'Profile Submitted',
        fileName: file ? file.name : 'Candidate_Resume.pdf',
        date: new Date().toLocaleString(),
      };
      setStored(STORAGE_KEYS.RESUMES, [newResume, ...existing]);
    } catch (err) {
      console.error('Failed to store resume locally:', err);
    }

    // Submit to MongoDB Atlas backend & Cloudinary
    try {
      if (file) {
        const formData = new FormData();
        formData.append('candidateName', name.trim());
        formData.append('email', email.trim());
        formData.append('phone', phone.trim());
        formData.append('category', 'General Candidate Pool');
        formData.append('experience', 'Profile Submitted');
        formData.append('resume', file);
        await api.createResume(formData);
      } else {
        await api.createResume({
          candidateName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          category: 'General Candidate Pool',
          experience: 'Profile Submitted',
          fileName: 'Candidate_Resume.pdf',
        });
      }
      setSubmitted(true);
      try {
        window.dispatchEvent(new CustomEvent('interskill:submission-saved'));
      } catch (e) {}
    } catch (err) {
      console.error('API submission error:', err);
      setError(err.message || 'Failed to upload resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setFile(null);
    onClose();
  };

  return (
    <div className="js-modal-backdrop" onClick={onClose}>
      <div className="js-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="js-modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
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
                margin: '0 auto 14px',
              }}
            >
              <CheckCircle2 size={28} />
            </div>
            <h3 className="js-modal-title">Resume Received!</h3>
            <p className="js-modal-subtitle">
              Thank you, <strong>{name}</strong>. Your resume {file ? `(${file.name})` : ''} has
              been submitted to our candidate talent pool. Our HR team will review your profile.
            </p>
            <button
              type="button"
              className="btn-gold"
              onClick={handleReset}
              style={{ marginTop: '14px', fontSize: '13px' }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#F8EED6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#092344',
                }}
              >
                <FileUp size={18} />
              </div>
              <h3 className="js-modal-title" style={{ margin: 0 }}>
                Submit Your Resume
              </h3>
            </div>
            <p className="js-modal-subtitle">
              Join our talent database and get notified when matching openings go live.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Enter your mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upload Resume (PDF, DOCX — Max 5MB)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="form-input"
                  style={{ paddingTop: '7px' }}
                  onChange={(e) => {
                    const selected = e.target.files[0];
                    if (selected && selected.size > 5 * 1024 * 1024) {
                      setError('File size exceeds 5MB limit. Please choose a smaller resume.');
                      setFile(null);
                      e.target.value = '';
                      return;
                    }
                    setError('');
                    setFile(selected || null);
                  }}
                />
              </div>
            </div>

            {error && <p className="form-error-msg" style={{ marginBottom: '12px' }}>{error}</p>}

            <button
              type="submit"
              className="btn-navy"
              disabled={loading}
              style={{ width: '100%', height: '40px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Uploading to Database...</span>
                </>
              ) : (
                <>
                  <span>Submit Resume</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function ApplyJobModal({ job, isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please provide your name, email, and contact number.');
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      setError('Resume file size must be less than 5MB.');
      return;
    }

    setLoading(true);
    setError('');

    // Always keep localStorage updated
    try {
      const existing = getStored(STORAGE_KEYS.APPLICANTS, []);
      const newApplicant = {
        id: `APP-${Date.now().toString().slice(-4)}`,
        jobId: job.id,
        jobTitle: job.title,
        candidateName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        experience: job.experience || '1-3 Years',
        currentCompany: 'Active Applicant',
        status: 'New',
        resumeFileName: file ? file.name : `${name.trim().replace(/\s+/g, '_')}_Resume.pdf`,
        date: new Date().toLocaleString(),
      };
      setStored(STORAGE_KEYS.APPLICANTS, [newApplicant, ...existing]);
    } catch (err) {
      console.error('Failed to store applicant locally:', err);
    }

    // Submit to MongoDB Atlas backend & Cloudinary
    try {
      if (file) {
        const formData = new FormData();
        formData.append('jobId', job.id || job.jobId || '');
        formData.append('jobTitle', job.title || '');
        formData.append('candidateName', name.trim());
        formData.append('email', email.trim());
        formData.append('phone', phone.trim());
        formData.append('experience', job.experience || '1-3 Years');
        formData.append('currentCompany', 'Active Applicant');
        formData.append('resume', file);
        await api.createApplicant(formData);
      } else {
        await api.createApplicant({
          jobId: job.id || job.jobId || '',
          jobTitle: job.title || '',
          candidateName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          experience: job.experience || '1-3 Years',
          currentCompany: 'Active Applicant',
          resumeFileName: `${name.trim().replace(/\s+/g, '_')}_Resume.pdf`,
        });
      }
      setSubmitted(true);
      try {
        window.dispatchEvent(new CustomEvent('interskill:submission-saved'));
      } catch (e) {}
    } catch (err) {
      console.error('API application submission error:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setFile(null);
    onClose();
  };

  return (
    <div className="js-modal-backdrop" onClick={onClose}>
      <div className="js-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="js-modal-close-btn"
          onClick={onClose}
          aria-label="Close application modal"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
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
                margin: '0 auto 14px',
              }}
            >
              <CheckCircle2 size={28} />
            </div>
            <h3 className="js-modal-title">Application Submitted!</h3>
            <p className="js-modal-subtitle">
              Thank you, <strong>{name}</strong>! Your application for{' '}
              <strong>{job.title}</strong> at <strong>{job.company}</strong> has been
              recorded and saved to our database.
            </p>
            <button
              type="button"
              className="btn-gold"
              onClick={handleClose}
              style={{ marginTop: '14px', fontSize: '13px' }}
            >
              Back to Openings
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <span className="section-eyebrow">JOB APPLICATION</span>
              <h3 className="js-modal-title" style={{ margin: 0 }}>
                {job.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#657184', marginTop: '2px' }}>
                {job.company} • {job.location} • {job.experience}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Enter your contact number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attach Resume (PDF, DOCX — Max 5MB)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="form-input"
                  style={{ paddingTop: '7px' }}
                  onChange={(e) => {
                    const selected = e.target.files[0];
                    if (selected && selected.size > 5 * 1024 * 1024) {
                      setError('File size exceeds 5MB limit. Please choose a smaller resume.');
                      setFile(null);
                      e.target.value = '';
                      return;
                    }
                    setError('');
                    setFile(selected || null);
                  }}
                />
              </div>
            </div>

            {error && <p className="form-error-msg" style={{ marginBottom: '12px' }}>{error}</p>}

            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
              style={{ width: '100%', height: '40px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Confirm Application</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
