import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';

// About Us Subcomponents
import AboutHero from '../components/about/AboutHero';
import FounderProfile from '../components/about/FounderProfile';
import LeadershipTeam from '../components/about/LeadershipTeam';
import CareersBanner from '../components/about/CareersBanner';
import MissionVision from '../components/about/MissionVision';
import ValuesSection from '../components/about/ValuesSection';
import ApproachSection from '../components/about/ApproachSection';
import AboutContactSection from '../components/about/AboutContactSection';

import '../styles/about.css';

export default function AboutUs({ onNavigate }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="about-page-root">
      {/* SECTION 1: HEADER (Active 'About Us' gold underline) */}
      <Header
        activePage="about"
        ctaLabel="Request a Callback"
        ctaHref="#contact"
        onNavigate={onNavigate}
      />

      <main>
        {/* SECTION 2: SIMPLIFIED ABOUT US HERO */}
        <AboutHero />

        {/* SECTION 3: FOUNDER PROFILE - DR. PRIYA GAWADE */}
        <FounderProfile />

        {/* SECTION 4: OUR KEY LEADERSHIP & TEAM */}
        <LeadershipTeam />

        {/* SECTION 5: EMPOWERING CAREERS BANNER */}
        <CareersBanner />

        {/* SECTION 6: OUR MISSION AND OUR VISION */}
        <MissionVision />

        {/* SECTION 7: OUR VALUES */}
        <ValuesSection />

        {/* SECTION 8: OUR APPROACH */}
        <ApproachSection />

        {/* SECTION 9: LET'S WORK TOGETHER & CONTACT FORM */}
        <AboutContactSection onNavigate={onNavigate} />
      </main>

      {/* SECTION 10: SHARED FOOTER */}
      <Footer onNavigate={onNavigate} />

      {/* QUICK ACTIONS & SCROLL TO TOP */}
      <FloatingActions />
    </div>
  );
}
