import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Mail, User, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api, setAuthSession } from '../api/apiClient';

export default function AdminAuthModal({ onLoginSuccess, onCancel }) {
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [setupSuccess, setSetupSuccess] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.getSetupStatus();
        if (res && res.initialized === false) {
          setIsSetupMode(true);
        }
      } catch (err) {
        console.warn('Could not verify setup status:', err.message);
      } finally {
        setCheckingSetup(false);
      }
    };
    checkStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSetupMode) {
      if (!name.trim() || !email.trim() || !password) {
        setError('Please fill in all required setup fields.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setLoading(true);
      try {
        const res = await api.setupAdmin({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        setSetupSuccess(true);
        setTimeout(() => {
          onLoginSuccess(res);
        }, 1200);
      } catch (err) {
        setError(err.message || 'Setup failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim() || !password) {
        setError('Please provide your admin email and password.');
        return;
      }

      setLoading(true);
      try {
        const res = await api.login({
          email: email.trim(),
          password,
        });
        onLoginSuccess(res);
      } catch (err) {
        setError(err.message || 'Invalid email or password.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (checkingSetup) {
    return (
      <div className="adm-auth-overlay">
        <div className="adm-auth-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: '#DDB568', margin: '0 auto 16px' }} />
          <p style={{ color: '#BAC7D5', fontSize: '14px' }}>Verifying secure admin gateway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-auth-overlay">
      <div className="adm-auth-card">
        {/* Header Branding */}
        <div className="adm-auth-header">
          <div className="adm-auth-icon-wrap">
            <ShieldCheck size={28} color="#DDB568" />
          </div>
          <h2 className="adm-auth-title">
            {isSetupMode ? 'Initialize Primary Administrator' : 'Interskill Management Portal'}
          </h2>
          <p className="adm-auth-subtitle">
            {isSetupMode
              ? 'Welcome. Set up your master administrative account for MongoDB Atlas management.'
              : 'Enter your verified credentials to access recruitment and CRM operations.'}
          </p>
        </div>

        {setupSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              Master Admin Configured!
            </h3>
            <p style={{ color: '#BAC7D5', fontSize: '13.5px' }}>
              Logging you into the dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="adm-auth-form">
            {isSetupMode && (
              <div className="adm-auth-field">
                <label className="adm-auth-label">Administrator Full Name *</label>
                <div className="adm-auth-input-wrap">
                  <User size={16} className="adm-auth-input-icon" />
                  <input
                    type="text"
                    className="adm-auth-input"
                    placeholder="e.g. Dr. Priya Gawade"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="adm-auth-field">
              <label className="adm-auth-label">Email Address *</label>
              <div className="adm-auth-input-wrap">
                <Mail size={16} className="adm-auth-input-icon" />
                <input
                  type="email"
                  className="adm-auth-input"
                  placeholder="admin@interskillsolutions.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="adm-auth-field">
              <label className="adm-auth-label">Master Password *</label>
              <div className="adm-auth-input-wrap">
                <Lock size={16} className="adm-auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="adm-auth-input"
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="adm-auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isSetupMode && (
              <div className="adm-auth-field">
                <label className="adm-auth-label">Confirm Password *</label>
                <div className="adm-auth-input-wrap">
                  <Lock size={16} className="adm-auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="adm-auth-input"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {error && <div className="adm-auth-error-banner">{error}</div>}

            <button
              type="submit"
              className="adm-auth-submit-btn"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating with MongoDB...</span>
                </>
              ) : (
                <>
                  <span>{isSetupMode ? 'Create Master Admin & Enter' : 'Sign In to Dashboard'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                className="adm-auth-cancel-btn"
                onClick={onCancel}
              >
                Return to Website
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
