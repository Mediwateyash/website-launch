import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ArrowRight, FastForward, Play, ShieldCheck, Sparkles } from 'lucide-react';
import './launch-intro.css';

const SCENES = [
  { id: 1, name: 'Atmosphere', duration: 3400 },
  { id: 2, name: 'Talent & Opportunity', duration: 3800 },
  { id: 3, name: 'Brand Reveal', duration: 3400 },
  { id: 4, name: 'Launch Screen', duration: 0 }, // Stays on launch screen
];

export default function CinematicLaunchIntro({ onComplete }) {
  // Pre-launch ceremonial "GO LIVE" state
  const [hasStartedLaunch, setHasStartedLaunch] = useState(false);
  const [currentScene, setCurrentScene] = useState(1);
  const [isExiting, setIsExiting] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
    }
  }, []);

  // Web Audio Synth for ceremonial launch & reveal sound
  const playCinematicChime = (type = 'reveal') => {
    try {
      if (!soundEnabled) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'golive') {
        // Grand opening launch chord
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130.81, now); // C3
        osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.8); // C4
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.5);
      } else if (type === 'reveal') {
        // High harmonic gold reveal tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, now); // C4
        osc.frequency.exponentialRampToValueAtTime(523.25, now + 1.2); // C5
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.8);
      } else if (type === 'enter') {
        // Triumphant enter website chord
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(329.63, now); // E4
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.6); // E5
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.6);
      }
    } catch (e) {
      // Audio fallback silent
    }
  };

  // Handle Ceremonial "GO LIVE" Action
  const handleGoLive = () => {
    if (hasStartedLaunch) return;
    setHasStartedLaunch(true);
    playCinematicChime('golive');
    setCurrentScene(1);
  };

  // Keyboard Enter listener for both GO LIVE and ENTER THE WEBSITE
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (!hasStartedLaunch) {
          handleGoLive();
        } else if (currentScene === 4) {
          handleEnterWebsite();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStartedLaunch, currentScene, isExiting]);

  // Scene Progression Timeline (only active after pressing "GO LIVE")
  useEffect(() => {
    if (!hasStartedLaunch || reducedMotion) return;

    if (currentScene < 4) {
      const duration = SCENES[currentScene - 1].duration;
      timerRef.current = setTimeout(() => {
        setCurrentScene((prev) => {
          const next = prev + 1;
          if (next === 3) playCinematicChime('reveal');
          return next;
        });
      }, duration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hasStartedLaunch, currentScene, reducedMotion, soundEnabled]);

  // Ambient Gold Stardust Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * 0.02 + 0.01,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += Math.sin(Date.now() * p.pulse * 0.05) * 0.005;

        // Wrap boundaries
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 180, 94, ${Math.max(0.1, Math.min(0.9, p.opacity))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#D9B45E';
        ctx.fill();
      });

      if (!document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleVisibility = () => {
      if (!document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Exit & Reveal Homepage Seamlessly
  const handleEnterWebsite = () => {
    if (isExiting) return;
    playCinematicChime('enter');
    setIsWiping(true);

    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 700);
    }, 400);
  };

  const handleSkipIntro = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 350);
  };

  const jumpToScene = (sceneId) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!hasStartedLaunch) setHasStartedLaunch(true);
    setCurrentScene(sceneId);
    if (sceneId === 3) playCinematicChime('reveal');
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <div
      className={`cinematic-intro-root ${isExiting ? 'is-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Interskill Staffing Solutions Launch Experience"
    >
      {/* Background Canvas & Volumetric Lighting */}
      <canvas ref={canvasRef} className="cinematic-bg-canvas" />
      <div className="cinematic-ambient-gradient" />
      <div className="cinematic-volumetric-halo" />

      {/* Dynamic Laser & Flare sweeps */}
      <div className="cinematic-laser-sweep" key={`laser-${hasStartedLaunch ? currentScene : 0}`} />
      <div className="cinematic-lens-flare" />

      {/* Top Utility Controls */}
      <header className="cinematic-top-controls">
        <div className="cinematic-brand-micro">
          <img
            src="/images/logo-emblem.png"
            alt="Interskill Emblem"
            className="cinematic-brand-micro-img"
          />
          <span className="cinematic-brand-micro-text">INTERSKILL LAUNCH</span>
        </div>

        <div className="cinematic-controls-right">
          <button
            type="button"
            className="cinematic-icon-btn"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Audio' : 'Enable Ambient Cinematic Sound'}
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            type="button"
            className="cinematic-skip-btn"
            onClick={handleSkipIntro}
            aria-label="Skip Introduction and enter site"
          >
            <span>Skip Intro</span>
            <FastForward size={14} />
          </button>
        </div>
      </header>

      {/* ====================================================================
          STAGE 0: PRE-LAUNCH "GO LIVE" CEREMONIAL PODIUM
          Shown first until user taps "GO LIVE" or presses Enter
          ==================================================================== */}
      {!hasStartedLaunch && (
        <section className="cinematic-stage stage-active" aria-label="Go Live Ceremony">
          <div className="cinematic-golive-wrap">
            <div className="golive-emblem-wrap">
              <div className="golive-emblem-glow" />
              <img
                src="/images/logo-emblem.png"
                alt="Interskill Staffing Solutions"
                className="golive-emblem-img"
              />
            </div>

            <div className="golive-badge">
              <Sparkles size={13} />
              <span>OFFICIAL DIGITAL LAUNCH</span>
              <Sparkles size={13} />
            </div>

            <h1 className="golive-title-main">
              INTERSKILL <br />
              <span className="scene-gold-gradient-text">STAFFING SOLUTIONS</span>
            </h1>

            <p className="golive-subtitle">
              Next Gen Hiring • Executive Search • Strategic Enterprise Recruitment
            </p>

            {/* The Ceremonial "GO LIVE" Button */}
            <button
              type="button"
              className="golive-trigger-btn"
              onClick={handleGoLive}
              aria-label="Press to Go Live and start cinematic reveal animation"
            >
              <span className="golive-sonar-ring" />
              <span className="golive-sonar-ring-2" />
              <Sparkles size={24} className="golive-sparkle-icon" />
              <span>GO LIVE</span>
              <ArrowRight size={22} />
            </button>

            <div className="golive-hint-text">
              <span>TAP TO LAUNCH OR PRESS</span>
              <span className="golive-key-badge">ENTER ↵</span>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 1: OPENING — THE ATMOSPHERE
          ==================================================================== */}
      {hasStartedLaunch && (
        <section
          className={`cinematic-stage ${currentScene === 1 ? 'stage-active' : 'stage-hidden'}`}
          aria-hidden={currentScene !== 1}
        >
          <div className="scene-atmosphere-wrap">
            <div className="scene-atmosphere-backdrop" />
            
            <div className="scene-eyebrow">
              <span className="scene-eyebrow-line" />
              <span>EXECUTIVE RECRUITMENT • STRATEGIC TALENT</span>
              <span className="scene-eyebrow-line line-right" />
            </div>

            <div className="scene-title-mask">
              <h1 className="scene-main-title">
                WHERE VISIONARY AMBITION <br />
                <span className="scene-gold-gradient-text">MEETS PRECISION HIRING</span>
              </h1>
            </div>

            <p className="scene-subtitle">
              A new benchmark in executive search and high-caliber corporate staffing across India.
            </p>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 2: TALENT MEETS OPPORTUNITY (REAL PHOTOGRAPHIC ASSETS)
          ==================================================================== */}
      {hasStartedLaunch && (
        <section
          className={`cinematic-stage ${currentScene === 2 ? 'stage-active' : 'stage-hidden'}`}
          aria-hidden={currentScene !== 2}
        >
          <div className="scene-atmosphere-wrap">
            <div className="scene-eyebrow">
              <span className="scene-eyebrow-line" />
              <span>BRIDGING ENTERPRISE & EXPERTISE</span>
              <span className="scene-eyebrow-line line-right" />
            </div>

            <div className="scene-title-mask">
              <h2 className="scene-main-title">
                TALENT MEETS <span className="scene-gold-gradient-text">OPPORTUNITY</span>
              </h2>
            </div>

            {/* Layered Photographic Cards */}
            <div className="scene-talent-cards-grid">
              <div className="talent-photo-card">
                <img
                  src="/images/employer-meeting.png"
                  alt="Corporate Leadership Meeting"
                  loading="eager"
                />
                <div className="talent-card-overlay">
                  <span className="talent-card-tag">ENTERPRISE SOLUTIONS</span>
                  <p className="talent-card-title">Executive Search & Strategy</p>
                </div>
                <div className="talent-card-sheen" />
              </div>

              <div className="talent-photo-card">
                <img
                  src="/images/hero-recruitment.png"
                  alt="Recruiter in consultation with candidate"
                  loading="eager"
                />
                <div className="talent-card-overlay">
                  <span className="talent-card-tag">PRECISION MATCHING</span>
                  <p className="talent-card-title">Talent Discovery & Alignment</p>
                </div>
                <div className="talent-card-sheen" />
              </div>

              <div className="talent-photo-card">
                <img
                  src="/images/jobseeker-hero-photo.png"
                  alt="High-Caliber Professional Career Growth"
                  loading="eager"
                />
                <div className="talent-card-overlay">
                  <span className="talent-card-tag">CAREER ACCELERATION</span>
                  <p className="talent-card-title">High-Caliber Opportunities</p>
                </div>
                <div className="talent-card-sheen" />
              </div>
            </div>

            <p className="scene-subtitle">
              Connecting ambitious businesses with verified, pre-screened professionals ready to lead.
            </p>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 3: OFFICIAL BRAND REVEAL (SIGNATURE MOMENT)
          ==================================================================== */}
      {hasStartedLaunch && (
        <section
          className={`cinematic-stage ${currentScene === 3 ? 'stage-active' : 'stage-hidden'}`}
          aria-hidden={currentScene !== 3}
        >
          <div className="scene-brand-reveal-wrap">
            <div className="brand-emblem-halo-box">
              <div className="brand-emblem-glow-ring" />
              <img
                src="/images/logo-emblem.png"
                alt="Interskill Staffing Solutions Logo Emblem"
                className="brand-reveal-logo-img"
              />
            </div>

            <div className="brand-typography-group">
              <h1 className="brand-name-primary">INTERSKILL</h1>
              <h2 className="brand-name-sub">STAFFING SOLUTIONS</h2>

              <div className="brand-tagline-bar">
                <span className="brand-tagline-dash" />
                <span className="brand-tagline-text">NEXT GEN HIRING</span>
                <span className="brand-tagline-dash dash-right" />
              </div>

              <div className="brand-declaration">
                <span>A NEW CHAPTER IN HIRING BEGINS.</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SCENE 4: FINAL LAUNCH SCREEN (THE INVITATION)
          Features the "ENTER THE WEBSITE ->" button
          ==================================================================== */}
      {hasStartedLaunch && (
        <section
          className={`cinematic-stage ${currentScene === 4 ? 'stage-active' : 'stage-hidden'}`}
          aria-hidden={currentScene !== 4}
        >
          <div className="scene-launch-final-wrap">
            {/* Emblem Badge */}
            <div className="launch-brand-badge">
              <img
                src="/images/logo-emblem.png"
                alt="Interskill Logo"
                className="launch-badge-logo"
              />
              <span className="launch-badge-title">INTERSKILL</span>
              <span className="launch-badge-sep">•</span>
              <span className="launch-badge-tag">NEXT GEN HIRING</span>
            </div>

            {/* Headline */}
            <h1 className="launch-headline-main">
              A NEW CHAPTER IN <br />
              <span className="scene-gold-gradient-text">HIRING BEGINS.</span>
            </h1>

            {/* Supporting line */}
            <p className="launch-supporting-line">
              Connecting Talent with Opportunity
            </p>

            {/* Primary CTA: ENTER THE WEBSITE */}
            <button
              type="button"
              className="launch-cta-btn"
              onClick={handleEnterWebsite}
              aria-label="Enter the Interskill Staffing Solutions website"
            >
              <span className="launch-cta-text">ENTER THE WEBSITE</span>
              <span className="launch-cta-arrow">
                <ArrowRight size={20} />
              </span>
              <span className="launch-cta-sheen" />
            </button>

            <div className="golive-hint-text" style={{ marginTop: '16px' }}>
              <span>TAP BUTTON OR PRESS</span>
              <span className="golive-key-badge">ENTER ↵</span>
            </div>

            {/* Trust Indicators */}
            <div className="launch-trust-pills">
              <div className="launch-trust-pill">
                <span className="launch-trust-dot" />
                <span>For Employers & Enterprises</span>
              </div>
              <div className="launch-trust-pill">
                <span className="launch-trust-dot" />
                <span>For Professionals & Job Seekers</span>
              </div>
              <div className="launch-trust-pill">
                <span className="launch-trust-dot" />
                <span>Pan-India Recruitment Network</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Timeline Scrubber */}
      {hasStartedLaunch && (
        <footer className="cinematic-timeline-bar">
          <div className="cinematic-scene-indicators" role="tablist" aria-label="Intro Scenes">
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                type="button"
                role="tab"
                aria-selected={currentScene === scene.id}
                className={`cinematic-scene-tab ${currentScene === scene.id ? 'is-active' : ''}`}
                onClick={() => jumpToScene(scene.id)}
              >
                <span className="cinematic-tab-bar" />
                <span className="cinematic-scene-title-label">{scene.name}</span>
              </button>
            ))}
          </div>

          <div className="cinematic-launch-credit">
            <span>Interskill Staffing Solutions © 2026</span>
          </div>
        </footer>
      )}

      {/* Full-Screen Golden Iris Wipe Effect on Exit */}
      <div className={`cinematic-exit-wipe ${isWiping ? 'is-wiping' : ''}`} />
    </div>
  );
}
