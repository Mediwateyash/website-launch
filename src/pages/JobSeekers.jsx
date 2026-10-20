import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';
import JobSeekerHero from '../components/job-seekers/JobSeekerHero';
import JobSearchBar from '../components/job-seekers/JobSearchBar';
import LatestJobs from '../components/job-seekers/LatestJobs';
import ResumeBanner from '../components/job-seekers/ResumeBanner';
import WhyApplySection from '../components/job-seekers/WhyApplySection';
import HiringProcessAndCallback from '../components/job-seekers/HiringProcessAndCallback';
import FAQAndPromoBanner from '../components/job-seekers/FAQAndPromoBanner';
import { ResumeModal, ApplyJobModal } from '../components/job-seekers/JobModals';

import { jobSeekerJobs } from '../data/jobSeekerJobs';
import { getStored, STORAGE_KEYS } from '../admin/adminStore';
import '../styles/job-seekers.css';

export default function JobSeekers({ onNavigate }) {
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    location: '',
    experience: '',
  });

  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const allJobs = getStored(STORAGE_KEYS.JOBS, jobSeekerJobs).filter((j) => j.status !== 'Inactive');

  // Client-side filtering
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      // Keyword matches title, company, or tags
      if (filters.keyword.trim()) {
        const kw = filters.keyword.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(kw);
        const matchesCompany = job.company.toLowerCase().includes(kw);
        const matchesTags = job.tags.some((t) => t.toLowerCase().includes(kw));
        if (!matchesTitle && !matchesCompany && !matchesTags) return false;
      }

      // Category match
      if (filters.category && job.category !== filters.category) {
        return false;
      }

      // Location match
      if (filters.location && !job.location.toLowerCase().includes(filters.location.split(',')[0].toLowerCase())) {
        return false;
      }

      // Experience match
      if (filters.experience) {
        if (filters.experience.includes('Freshers') && !job.experience.includes('0 – 2')) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const scrollToJobs = () => {
    const el = document.getElementById('latest-jobs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="job-seekers-page">
      {/* Header with active 'For Job Seekers' link and 'Request a Callback' CTA */}
      <Header
        activePage="job-seekers"
        ctaLabel="Request a Callback"
        ctaHref="#process-callback"
        onNavigate={onNavigate}
      />

      <main>
        {/* SECTION 6: HERO BANNER */}
        <JobSeekerHero
          onOpenResume={() => setResumeModalOpen(true)}
          onScrollToJobs={scrollToJobs}
        />

        {/* SECTION 8: LATEST JOB OPENINGS */}
        <LatestJobs
          jobs={filteredJobs}
          onApplyJob={(job) => setSelectedJobForApply(job)}
        />

        {/* SECTION 9: RESUME SUBMISSION BANNER */}
        <ResumeBanner onOpenModal={() => setResumeModalOpen(true)} />

        {/* SECTION 10: WHY APPLY THROUGH US? */}
        <WhyApplySection />

        {/* SECTION 11 & 12: HIRING PROCESS & CALLBACK FORM */}
        <HiringProcessAndCallback />

        {/* SECTION 13 & 14: FAQS & BOTTOM PROMOTIONAL BANNER */}
        <FAQAndPromoBanner onFindJobClick={scrollToJobs} />
      </main>

      {/* FOOTER */}
      <Footer onNavigate={onNavigate} />

      {/* QUICK ACTIONS & SCROLL TO TOP */}
      <FloatingActions />

      {/* Interactive Modals */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />

      <ApplyJobModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
      />
    </div>
  );
}
