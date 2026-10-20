import React from 'react';
import { Search, ArrowRight, Briefcase } from 'lucide-react';
import { jobCategories, jobLocations, jobExperiences } from '../../data/jobSeekerJobs';

export default function JobSearchBar({ filters, onFilterChange, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <div className="container js-search-container">
      <form onSubmit={handleSubmit} className="js-search-bar">
        {/* Field 1: Search Jobs */}
        <div className="js-search-field">
          <label htmlFor="jsSearchInput" className="js-search-label">
            Search Jobs
          </label>
          <div className="js-search-input-wrap">
            <Search size={15} className="js-search-input-icon" />
            <input
              type="text"
              id="jsSearchInput"
              className="js-search-input"
              placeholder="Job title, keyword or company"
              value={filters.keyword}
              onChange={(e) => onFilterChange('keyword', e.target.value)}
            />
          </div>
        </div>

        {/* Field 2: Job Category */}
        <div className="js-search-field">
          <label htmlFor="jsCategorySelect" className="js-search-label">
            Job Category
          </label>
          <select
            id="jsCategorySelect"
            className="js-search-select"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option value="">Select Category</option>
            {jobCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Field 3: Location */}
        <div className="js-search-field">
          <label htmlFor="jsLocationSelect" className="js-search-label">
            Location
          </label>
          <select
            id="jsLocationSelect"
            className="js-search-select"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
          >
            <option value="">Select Location</option>
            {jobLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Field 4: Experience */}
        <div className="js-search-field">
          <label htmlFor="jsExperienceSelect" className="js-search-label">
            Experience
          </label>
          <select
            id="jsExperienceSelect"
            className="js-search-select"
            value={filters.experience}
            onChange={(e) => onFilterChange('experience', e.target.value)}
          >
            <option value="">Select Experience</option>
            {jobExperiences.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
        </div>

        {/* Field 5: Submit Button */}
        <button type="submit" className="js-search-btn">
          <span>Search Jobs</span>
          <ArrowRight size={14} />
        </button>
      </form>
    </div>
  );
}
