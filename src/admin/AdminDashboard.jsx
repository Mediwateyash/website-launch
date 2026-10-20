import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  PhoneCall,
  Users,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  Plus,
  FileText,
  Download,
  Eye,
} from 'lucide-react';
import { api } from '../api/apiClient';
import ResumeViewerModal, { downloadDocument } from './ResumeViewerModal';

export default function AdminDashboard({
  leads = [],
  jobs = [],
  applicants = [],
  callbacks = [],
  consultations = [],
  resumes = [],
  onNavigateTab,
  onUpdateLeadStatus,
  onUpdateCallbackStatus,
}) {
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;
  const pendingCallbacksCount = callbacks.filter((c) => c.status === 'Pending').length;
  const activeJobsCount = jobs.filter((j) => j.status === 'Active').length;
  const totalApplicantsCount = applicants.length;
  const totalResumesCount = resumes.length;

  // Combine and sort recent candidate submissions (both job applications and general resumes)
  const combinedCandidates = [
    ...applicants.map((a) => ({
      ...a,
      _type: 'Job Applicant',
      _displayTitle: a.jobTitle ? `Applied for: ${a.jobTitle}` : 'Job Applicant',
      _file: a.resumeFileName,
      _url: a.resumeUrl,
      _tab: 'applicants',
    })),
    ...resumes.map((r) => ({
      ...r,
      _type: 'Resume Bank',
      _displayTitle: r.category ? `Talent Pool (${r.category})` : 'General Candidate Pool',
      _file: r.fileName,
      _url: r.fileUrl,
      _tab: 'resumes',
    })),
  ].slice(0, 6);

  return (
    <div>
      {/* KPI Cards Grid */}
      <div className="adm-kpi-grid">
        <div
          className="adm-kpi-card"
          onClick={() => onNavigateTab('employer-leads')}
          title="Click to view employer leads"
        >
          <div className="adm-kpi-card__info">
            <span className="adm-kpi-card__label">Employer Inquiries</span>
            <span className="adm-kpi-card__value">{leads.length}</span>
            <span className="adm-kpi-card__sub adm-kpi-card__sub--highlight">
              {newLeadsCount} new requires action
            </span>
          </div>
          <div className="adm-kpi-card__icon-box adm-kpi-card__icon-box--navy">
            <Building2 size={22} />
          </div>
        </div>

        <div
          className="adm-kpi-card"
          onClick={() => onNavigateTab('callbacks')}
          title="Click to view callback queue"
        >
          <div className="adm-kpi-card__info">
            <span className="adm-kpi-card__label">Pending Callbacks</span>
            <span className="adm-kpi-card__value">{callbacks.length}</span>
            <span className="adm-kpi-card__sub adm-kpi-card__sub--highlight">
              {pendingCallbacksCount} pending follow-ups
            </span>
          </div>
          <div className="adm-kpi-card__icon-box adm-kpi-card__icon-box--gold">
            <PhoneCall size={22} />
          </div>
        </div>

        <div
          className="adm-kpi-card"
          onClick={() => onNavigateTab('job-board')}
          title="Click to manage job postings"
        >
          <div className="adm-kpi-card__info">
            <span className="adm-kpi-card__label">Active Job Openings</span>
            <span className="adm-kpi-card__value">{activeJobsCount}</span>
            <span className="adm-kpi-card__sub">Across Mumbai & Thane</span>
          </div>
          <div className="adm-kpi-card__icon-box adm-kpi-card__icon-box--blue">
            <Briefcase size={22} />
          </div>
        </div>

        <div
          className="adm-kpi-card"
          onClick={() => onNavigateTab('applicants')}
          title="Click to view candidate applicants"
        >
          <div className="adm-kpi-card__info">
            <span className="adm-kpi-card__label">Job Applicants</span>
            <span className="adm-kpi-card__value">{totalApplicantsCount}</span>
            <span className="adm-kpi-card__sub">Role-specific applications</span>
          </div>
          <div className="adm-kpi-card__icon-box adm-kpi-card__icon-box--emerald">
            <Users size={22} />
          </div>
        </div>

        <div
          className="adm-kpi-card"
          onClick={() => onNavigateTab('resumes')}
          title="Click to view resume bank"
        >
          <div className="adm-kpi-card__info">
            <span className="adm-kpi-card__label">Resume Bank</span>
            <span className="adm-kpi-card__value">{totalResumesCount}</span>
            <span className="adm-kpi-card__sub">General candidate pool</span>
          </div>
          <div className="adm-kpi-card__icon-box adm-kpi-card__icon-box--purple">
            <FileText size={22} />
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          className="adm-btn-action adm-btn-primary"
          onClick={() => onNavigateTab('job-board', { openAddModal: true })}
        >
          <Plus size={15} />
          Post New Job Opening
        </button>
        <button
          className="adm-btn-action adm-btn-secondary"
          onClick={() => onNavigateTab('resumes')}
        >
          <FileText size={14} />
          Candidate Resume Bank ({totalResumesCount})
        </button>
        <button
          className="adm-btn-action adm-btn-secondary"
          onClick={() => onNavigateTab('applicants')}
        >
          <Users size={14} />
          Candidate Pipeline ({totalApplicantsCount})
        </button>
        <button
          className="adm-btn-action adm-btn-secondary"
          onClick={() => onNavigateTab('callbacks')}
        >
          <PhoneCall size={14} />
          Callback Queue ({pendingCallbacksCount})
        </button>
        <button
          className="adm-btn-action adm-btn-secondary"
          onClick={() => onNavigateTab('employer-leads')}
        >
          <Building2 size={14} />
          Employer Leads ({leads.length})
        </button>
      </div>

      {/* Two Column Grid for Recent Leads & Recent Callbacks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '22px' }}>
        {/* Card 1: Latest Employer Hiring Inquiries */}
        <div className="adm-card" style={{ margin: 0 }}>
          <div className="adm-card__header">
            <div>
              <h3 className="adm-card__title">
                <Building2 size={16} /> Latest Employer Requirements
              </h3>
              <p className="adm-card__subtitle">Incoming hiring requests submitted by companies</p>
            </div>
            <button
              className="adm-action-btn"
              onClick={() => onNavigateTab('employer-leads')}
            >
              <span>View All</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Company / Contact</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{l.company}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                        {l.name} • {l.phone}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px' }}>{l.category || 'General'}</span>
                    </td>
                    <td>
                      <span
                        className={`adm-status-badge adm-status-badge--${
                          l.status === 'New'
                            ? 'new'
                            : l.status === 'Contacted'
                            ? 'contacted'
                            : l.status === 'Closed'
                            ? 'closed'
                            : 'active'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="adm-select-filter"
                        style={{ fontSize: '11px', padding: '4px 6px' }}
                        value={l.status}
                        onChange={(e) => onUpdateLeadStatus(l.id, e.target.value)}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Profiles Shared">Profiles Shared</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: Callback Requests Queue */}
        <div className="adm-card" style={{ margin: 0 }}>
          <div className="adm-card__header">
            <div>
              <h3 className="adm-card__title">
                <PhoneCall size={16} /> Live Callback Queue
              </h3>
              <p className="adm-card__subtitle">Phone assistance requests from visitors</p>
            </div>
            <button
              className="adm-action-btn"
              onClick={() => onNavigateTab('callbacks')}
            >
              <span>Manage Queue</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {callbacks.slice(0, 5).map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <a
                        href={`tel:${c.mobile}`}
                        style={{ fontSize: '11.5px', color: '#071D3A', textDecoration: 'underline' }}
                      >
                        {c.mobile}
                      </a>
                    </td>
                    <td style={{ fontSize: '12px', color: '#475569' }}>{c.topic}</td>
                    <td>
                      <span
                        className={`adm-status-badge adm-status-badge--${
                          c.status === 'Pending' ? 'pending' : 'active'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>
                      {c.status === 'Pending' ? (
                        <button
                          className="adm-action-btn"
                          style={{ color: '#059669', borderColor: '#A7F3D0' }}
                          onClick={() => onUpdateCallbackStatus(c.id, 'Contacted')}
                          title="Mark as Contacted"
                        >
                          <CheckCircle2 size={13} />
                          <span>Done</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Called</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Card 3: Recent Candidate Submissions & Resumes */}
      <div className="adm-card" style={{ marginTop: '24px' }}>
        <div className="adm-card__header">
          <div>
            <h3 className="adm-card__title">
              <FileText size={16} /> Recent Candidate Submissions & Resumes
            </h3>
            <p className="adm-card__subtitle">
              Unified feed of recent job applicants and general candidate talent bank submissions
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="adm-action-btn"
              onClick={() => onNavigateTab('applicants')}
            >
              <span>View Pipeline ({totalApplicantsCount})</span>
              <ArrowUpRight size={13} />
            </button>
            <button
              className="adm-action-btn"
              onClick={() => onNavigateTab('resumes')}
            >
              <span>View Resume Bank ({totalResumesCount})</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Application Type</th>
                <th>Contact</th>
                <th>Attached Resume</th>
                <th>Date Received</th>
                <th>View Details</th>
              </tr>
            </thead>
            <tbody>
              {combinedCandidates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="adm-table-empty">
                    No candidate resumes or applications received yet.
                  </td>
                </tr>
              ) : (
                combinedCandidates.map((item, idx) => (
                  <tr key={item.id || item._id || idx}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#071D3A' }}>
                        {item.candidateName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        {item.id || item.applicantId || item.resumeId || 'CANDIDATE'}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: item._type === 'Job Applicant' ? '#ECFDF5' : '#F3E8FF',
                          color: item._type === 'Job Applicant' ? '#065F46' : '#6B21A8',
                        }}
                      >
                        {item._type}
                      </span>
                      <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px' }}>
                        {item._displayTitle}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#071D3A' }}>
                        {item.phone}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        {item.email}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => setViewingCandidate(item)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: '#92400E',
                            fontSize: '11.5px',
                            background: '#FEF3C7',
                            border: '1px solid #FDE68A',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          title="View resume inside admin panel"
                        >
                          <Eye size={12} color="#B45309" />
                          <span>{item._file || 'View Document'}</span>
                        </button>

                        {item._url && (
                          <button
                            type="button"
                            onClick={() =>
                              downloadDocument(
                                api.resolveFileUrl(item._url),
                                item._file || 'Candidate_Resume.pdf'
                              )
                            }
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '24px',
                              height: '24px',
                              color: '#071D3A',
                              background: '#F1F5F9',
                              border: '1px solid #CBD5E1',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                            title="Download document directly to your computer"
                          >
                            <Download size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', color: '#64748B' }}>
                      {item.date || item.formattedDate || 'Recently'}
                    </td>
                    <td>
                      <button
                        className="adm-action-btn"
                        onClick={() => onNavigateTab(item._tab)}
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        <span>Open in {item._tab === 'applicants' ? 'Pipeline' : 'Bank'}</span>
                        <ArrowUpRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* In-Panel Resume Viewer Modal */}
      <ResumeViewerModal
        isOpen={!!viewingCandidate}
        onClose={() => setViewingCandidate(null)}
        candidate={viewingCandidate}
      />
    </div>
  );
}
