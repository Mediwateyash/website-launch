import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AudienceCards from './components/AudienceCards';
import ConsultationSection from './components/ConsultationSection';
import IndustriesSection from './components/IndustriesSection';
import RecruitmentProcess from './components/RecruitmentProcess';
import JobOpenings from './components/JobOpenings';
import AdvisoryBoard from './components/AdvisoryBoard';
import Testimonials from './components/Testimonials';
import AboutMissionVision from './components/AboutMissionVision';
import CallbackSection from './components/CallbackSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import CinematicLaunchIntro from './components/launch/CinematicLaunchIntro';

// Pages
import JobSeekers from './pages/JobSeekers';
import Employers from './pages/Employers';
import AboutUs from './pages/AboutUs';
import AdminLayout from './admin/AdminLayout';

import './styles/variables.css';
import './styles/global.css';
import './styles/sections.css';

export default function App() {
  const shouldShowLaunchIntro = () => {
    try {
      const search = window.location.search || '';
      const hash = window.location.hash || '';
      if (search.includes('launch=1') || search.includes('replay=1') || hash.includes('launch')) {
        return true;
      }
      if (search.includes('skipIntro=true') || hash.includes('admin')) {
        return false;
      }
      const seen = sessionStorage.getItem('interskill_launch_intro_seen');
      return !seen;
    } catch (e) {
      return true;
    }
  };

  const [showIntro, setShowIntro] = useState(shouldShowLaunchIntro);
  const getInitialPage = () => {
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (hash.includes('admin') || path.includes('admin')) {
      return 'admin';
    }
    if (hash.includes('job-seeker') || path.includes('job-seeker')) {
      return 'job-seekers';
    }
    if (hash.includes('employer') || path.includes('employer')) {
      return 'employers';
    }
    if (hash.includes('about') || path.includes('about')) {
      return 'about';
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash.includes('admin') || path.includes('admin')) {
        setCurrentPage('admin');
      } else if (hash.includes('job-seeker') || path.includes('job-seeker')) {
        setCurrentPage('job-seekers');
      } else if (hash.includes('employer') || path.includes('employer')) {
        setCurrentPage('employers');
      } else if (hash.includes('about') || path.includes('about')) {
        setCurrentPage('about');
      } else if (hash === '' || hash === '#home' || hash === '#/' || path === '/') {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page === 'job-seekers') {
      window.location.hash = '#/job-seekers';
    } else if (page === 'employers') {
      window.location.hash = '#/employers';
    } else if (page === 'about') {
      window.location.hash = '#/about';
    } else if (page === 'admin') {
      window.location.hash = '#/admin';
    } else {
      window.location.hash = '#/';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('interskill_launch_intro_seen', 'true');
    } catch (e) {}
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  if (currentPage === 'admin') {
    return <AdminLayout onNavigate={navigateTo} />;
  }

  if (currentPage === 'job-seekers') {
    return (
      <>
        {showIntro && <CinematicLaunchIntro onComplete={handleIntroComplete} />}
        <JobSeekers onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === 'employers') {
    return (
      <>
        {showIntro && <CinematicLaunchIntro onComplete={handleIntroComplete} />}
        <Employers onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === 'about') {
    return (
      <>
        {showIntro && <CinematicLaunchIntro onComplete={handleIntroComplete} />}
        <AboutUs onNavigate={navigateTo} />
      </>
    );
  }

  return (
    <div className="homepage-root">
      {/* CINEMATIC LAUNCH INTRO EXPERIENCE */}
      {showIntro && <CinematicLaunchIntro onComplete={handleIntroComplete} />}

      {/* SECTION 1: HEADER / NAVIGATION */}
      <Header
        activePage="home"
        ctaLabel="Get Started"
        ctaHref="#consultation"
        onNavigate={navigateTo}
      />

      <main>
        {/* SECTION 2: HERO BANNER */}
        <Hero onNavigate={navigateTo} />

        {/* SECTION 3: JOB SEEKERS AND EMPLOYERS */}
        <AudienceCards onNavigate={navigateTo} />

        {/* SECTION 4: FREE CONSULTATION FORM */}
        <ConsultationSection />

        {/* SECTION 5: INDUSTRIES WE SERVE */}
        <IndustriesSection />

        {/* SECTION 6: OUR RECRUITMENT PROCESS */}
        <RecruitmentProcess />

        {/* SECTION 7: CURRENT JOB OPENINGS */}
        <JobOpenings onNavigate={navigateTo} />

        {/* SECTION 8: ADVISORY BOARD */}
        <AdvisoryBoard />

        {/* SECTION 9: PLACEMENTS AND REVIEWS */}
        <Testimonials />

        {/* SECTION 10: ABOUT US, MISSION AND VISION */}
        <AboutMissionVision onNavigate={navigateTo} />

        {/* SECTION 11: CALLBACK BANNER */}
        <CallbackSection />

        {/* SECTION 12: FREQUENTLY ASKED QUESTIONS */}
        <FAQSection />
      </main>

      {/* SECTION 13: FOOTER */}
      <Footer onNavigate={navigateTo} />

      {/* QUICK ACTIONS & SCROLL TO TOP */}
      <FloatingActions onReplayIntro={handleReplayIntro} />
    </div>
  );
}
