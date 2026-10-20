import React from 'react';

export default function Logo({ variant = 'light', className = '' }) {
  const isDark = variant === 'dark';

  return (
    <a href="#" className={`site-logo site-logo--${variant} ${className}`}>
      <img
        src="/images/logo-emblem.png"
        alt="Interskill Staffing Solutions"
        className="site-logo__emblem"
      />
      <div className="site-logo__text-group">
        <span className={`site-logo__title ${isDark ? 'text-white' : 'text-navy'}`}>
          INTERSKILL
        </span>
        <span className={`site-logo__subtitle ${isDark ? 'text-light' : 'text-navy-muted'}`}>
          STAFFING SOLUTIONS
        </span>
        <span className="site-logo__tagline text-gold">
          NEXT GEM HIRING
        </span>
      </div>
    </a>
  );
}
