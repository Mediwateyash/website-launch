import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { getStored, STORAGE_KEYS } from '../../admin/adminStore';
import { api } from '../../api/apiClient';
import { defaultTeamMembers } from '../AdvisoryBoard';

export default function LeadershipTeam() {
  const [teamMembers, setTeamMembers] = useState(() => getStored(STORAGE_KEYS.TEAM, defaultTeamMembers));

  useEffect(() => {
    api.getTeam().then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        setTeamMembers(res);
      }
    }).catch(() => {});
  }, []);

  return (
    <section className="leadership-section" id="leadership-team">
      <div className="container">
        <div className="leadership-header">
          <div className="leadership-eyebrow">
            <Sparkles size={13} style={{ display: 'inline', marginRight: '6px' }} />
            <span>OUR KEY LEADERSHIP & TEAM</span>
          </div>
          <h2 className="leadership-title">Our Key Leadership & Team</h2>
          <p className="leadership-subtitle">
            A team of experienced professionals committed to creating meaningful opportunities
            for candidates and reliable talent solutions for businesses.
          </p>
        </div>

        <div className="leadership-grid">
          {teamMembers.map((member, index) => (
            <div key={member.id || member._id || member.memberId || index} className="leadership-card">
              <div className="leadership-card__img-wrap">
                <img
                  src={api.resolveFileUrl(member.image)}
                  alt={member.name}
                  className="leadership-card__img"
                  onError={(e) => {
                    e.currentTarget.src = '/images/team-priya.jpg';
                  }}
                />
              </div>
              <div className="leadership-card__content">
                <h3 className="leadership-card__name">{member.name}</h3>
                <div className="leadership-card__role">{member.role}</div>
                {member.quote ? (
                  <div className="leadership-card__resp" style={{ fontStyle: 'italic', color: '#475569', fontSize: '13px', marginTop: '6px', lineHeight: 1.45 }}>
                    "{member.quote}"
                  </div>
                ) : member.responsibility ? (
                  <div className="leadership-card__resp">
                    <strong>Responsibility:</strong> {member.responsibility}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
