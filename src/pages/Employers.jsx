import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';
import EmployerHero from '../components/employers/EmployerHero';
import RecruitmentServices from '../components/employers/RecruitmentServices';
import IndustriesAndHiringForm from '../components/employers/IndustriesAndHiringForm';
import EmployerProcess from '../components/employers/EmployerProcess';
import WhyChooseUsAndStats from '../components/employers/WhyChooseUsAndStats';
import EmployerTestimonials from '../components/employers/EmployerTestimonials';
import EmployerCallbackBanner from '../components/employers/EmployerCallbackBanner';

import '../styles/employers.css';

export default function Employers({ onNavigate }) {
  useEffect(() => {
    document.title = 'For Employers — Interskill Staffing Solutions';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="emp-page-root">
      {/* 1. Header with active For Employers navigation */}
      <Header
        activePage="employers"
        ctaLabel="Request a Callback"
        ctaHref="#employer-callback"
        onNavigate={onNavigate}
      />

      <main className="emp-page-main">
        {/* 2. Hero Banner */}
        <EmployerHero />

        {/* 3. Recruitment Services (4 cards) */}
        <RecruitmentServices />

        {/* 4. Industries We Serve (5 cards) + Submit Hiring Requirement Form */}
        <IndustriesAndHiringForm />

        {/* 5. Our Recruitment Process (5 stages) */}
        <EmployerProcess />

        {/* 6. Why Choose Us (Handshake photo + 6 points) & Company Statistics (3 stats) */}
        <WhyChooseUsAndStats />

        {/* 7. Client Testimonials (2 cards) */}
        <EmployerTestimonials />

        {/* 8. Full-Width Callback Banner */}
        <EmployerCallbackBanner />
      </main>

      {/* 9. Shared Footer */}
      <Footer onNavigate={onNavigate} />

      {/* QUICK ACTIONS & SCROLL TO TOP */}
      <FloatingActions />
    </div>
  );
}
