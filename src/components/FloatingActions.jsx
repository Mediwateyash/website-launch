import React, { useState, useEffect } from 'react';
import { ArrowUp, Phone, MessageCircle, Sparkles } from 'lucide-react';

export default function FloatingActions({ onReplayIntro }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 320);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Quick Actions"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 990,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      {/* Quick Phone Call Button */}
      <a
        href="tel:9819461050"
        title="Call Interskill Advisor: +91 9819461050"
        aria-label="Call Interskill Advisory Team"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: '#0F2C59',
          color: '#DDB568',
          border: '1.5px solid #DDB568',
          boxShadow: '0 4px 14px rgba(15, 44, 89, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          transition: 'transform 0.2s ease, background-color 0.2s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.backgroundColor = '#DDB568';
          e.currentTarget.style.color = '#0F2C59';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '#0F2C59';
          e.currentTarget.style.color = '#DDB568';
        }}
      >
        <Phone size={18} />
      </a>

      {/* Replay Brand Launch Experience */}
      {onReplayIntro && (
        <button
          type="button"
          onClick={onReplayIntro}
          title="Watch Cinematic Launch Experience"
          aria-label="Replay Brand Launch Experience"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #092344 0%, #173D69 100%)',
            color: '#DDB568',
            border: '1.5px solid #DDB568',
            boxShadow: '0 4px 16px rgba(217, 180, 94, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.12)';
            e.currentTarget.style.boxShadow = '0 6px 22px rgba(217, 180, 94, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(217, 180, 94, 0.45)';
          }}
        >
          <Sparkles size={18} />
        </button>
      )}

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          title="Scroll back to top"
          aria-label="Scroll back to top"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#DDB568',
            color: '#0F2C59',
            border: 'none',
            boxShadow: '0 4px 14px rgba(221, 181, 104, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, opacity 0.2s ease',
            animation: 'fadeIn 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </aside>
  );
}
