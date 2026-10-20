import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { getStored, STORAGE_KEYS } from '../admin/adminStore';
import { api } from '../api/apiClient';
// import { advisors } from '../data/advisors';

export const defaultTeamMembers = [
  {
    id: 'team-priya',
    name: 'Dr Priya Gawade',
    role: 'CEO of Interskill Solutions & Interskill Staffing Solutions',
    quote: 'People are not just resources; they are the real growth engines of any business.',
    image: '/images/team-priya.jpg',
  },
  {
    id: 'team-shreyash',
    name: 'Shreyash Shirekar',
    role: 'Talent Acquisition & Business Development',
    quote: 'The right talent doesn’t just fill a role; it builds a future.',
    image: '/images/team-shreyash.jpg',
  },
  {
    id: 'team-madhubabu',
    name: 'Madhubabu Gentyala',
    role: 'IT & Technology Talent Specialist',
    quote: 'Connecting the right technical talent with opportunities to grow, innovate and succeed.',
    image: '/images/team-madhubabu.png',
  },
  {
    id: 'team-sahil',
    name: 'Sahil More',
    role: 'Cybersecurity Talent Specialist',
    quote: 'Building stronger digital teams by connecting cybersecurity talent with the right opportunities.',
    image: '/images/team-sahil.jpg',
  },
  {
    id: 'team-yash',
    name: 'Yash Diwate',
    role: 'Digital Marketing & Creative Talent Specialist',
    quote: 'Great ideas begin with great people; connecting creative talent creates meaningful impact.',
    image: '/images/team-yash.jpg',
  },
  {
    id: 'team-priyanka',
    name: 'Priyanka Ghuhagarkar',
    role: 'Branch Operations Manager',
    quote: 'Strong operations, teamwork and trust are the foundation of excellent service.',
    image: '/images/team-priyanka.png',
  },
];

export default function AdvisoryBoard() {
  const [currentTeam, setCurrentTeam] = useState(() => getStored(STORAGE_KEYS.TEAM, defaultTeamMembers));

  useEffect(() => {
    api.getTeam().then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        setCurrentTeam(res);
      }
    }).catch(() => {});
  }, []);
  return (
    <section className="advisory-section" id="advisory-board">
      <div className="container">
        {/* =========================================================================
            NOTE: "Guidance from Industry Experts / Our Advisory Board" is commented
            out below per user request and will be restored whenever requested.
            ========================================================================= */}
        {/*
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">
              <Sparkles size={13} />
              <span>OUR ADVISORY BOARD</span>
            </span>
            <h2 className="section-heading">Guidance from Industry Experts</h2>
            <p className="section-subtitle">
              Our advisory board comprises experienced professionals who provide valuable insights to help us deliver better opportunities.
            </p>
          </div>
          <a href="#about" className="btn-outline-gold">
            <span>Know Our Advisory Board</span>
            <ArrowRight size={14} />
          </a>
        </div>

        <div className="advisory-grid">
          {advisors.map((advisor) => (
            <div key={advisor.id} className="advisor-card">
              <img
                src={advisor.image}
                alt={advisor.name}
                className="advisor-card__photo"
              />
              <div className="advisor-card__info">
                <span className="advisor-card__name">{advisor.name}</span>
                <span className="advisor-card__role">{advisor.role}</span>
                <span className="advisor-card__domain">{advisor.domain}</span>
              </div>
            </div>
          ))}
        </div>
        */}

        {/* KEY LEADERSHIP & TEAM SECTION */}
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">
              <Sparkles size={13} />
              <span>KEY LEADERSHIP & TEAM</span>
            </span>
            <h2 className="section-heading">Meet Our Key Leadership & Team</h2>
            <p className="section-subtitle">
              The experienced leadership and passionate professionals driving Interskill Staffing Solutions — Next Gen Hiring.
            </p>
          </div>
          <a href="#consultation" className="btn-outline-gold">
            <span>Connect with Our Team</span>
            <ArrowRight size={14} />
          </a>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginTop: '28px',
          }}
        >
          {currentTeam.map((member) => (
            <div
              key={member.id || member._id || member.memberId}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg, 12px)',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: 'var(--shadow-subtle)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginBottom: '14px',
                  boxShadow: '0 6px 16px rgba(7, 29, 58, 0.16)',
                  border: '3px solid var(--color-gold)',
                  backgroundColor: '#F0F4F9',
                  flexShrink: 0,
                }}
              >
                <img
                  src={api.resolveFileUrl(member.image)}
                  alt={member.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/team-priya.jpg';
                  }}
                />
              </div>

              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--color-primary-navy)',
                  margin: '0 0 6px 0',
                  lineHeight: 1.25,
                }}
              >
                {member.name}
              </h4>

              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: 'var(--color-gold)',
                  lineHeight: 1.35,
                  marginBottom: '12px',
                }}
              >
                {member.role}
              </span>

              {member.quote && (
                <p
                  style={{
                    fontSize: '12.5px',
                    fontStyle: 'italic',
                    color: '#4B5563',
                    lineHeight: 1.5,
                    margin: 'auto 0 0',
                    paddingTop: '10px',
                    borderTop: '1px solid #F1F5F9',
                  }}
                >
                  “{member.quote.replace(/^[“"]|[”"]$/g, '')}”
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
