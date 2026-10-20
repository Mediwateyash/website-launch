import React, { useState } from 'react';
import {
  Users,
  Search,
  Download,
  Trash2,
  FileText,
  Phone,
  Mail,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { exportToCSV } from './adminStore';
import { api } from '../api/apiClient';
import ResumeViewerModal, { downloadDocument } from './ResumeViewerModal';

export default function ApplicantsView({
  applicants,
  jobs,
  onUpdateStatus,
  onDeleteApplicant,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [jobFilter, setJobFilter] = useState('ALL');
  const [viewingApplicant, setViewingApplicant] = useState(null);

  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.includes(searchTerm) ||
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesJob = jobFilter === 'ALL' || app.jobTitle === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const handleExport = () => {
    exportToCSV('interskill_applicants', filteredApplicants);
  };

  const uniqueJobTitles = Array.from(new Set(applicants.map((a) => a.jobTitle).filter(Boolean)));

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card__header">
          <div>
            <h2 className="adm-card__title">
              <Users size={18} /> Candidate Applications ({filteredApplicants.length})
            </h2>
            <p className="adm-card__subtitle">
              Candidates who applied to live job listings on the Job Seekers page
            </p>
          </div>

          <div className="adm-toolbar">
            <div className="adm-search-wrap">
              <Search size={14} className="adm-search-icon" />
              <input
                type="text"
                placeholder="Search candidate, role, phone..."
                className="adm-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="adm-select-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="New">New</option>
              <option value="Screened">Screened</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              className="adm-select-filter"
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
            >
              <option value="ALL">All Applied Roles</option>
              {uniqueJobTitles.map((title, i) => (
                <option key={i} value={title}>
                  {title}
                </option>
              ))}
            </select>

            <button
              className="adm-btn-action adm-btn-secondary"
              onClick={handleExport}
              title="Export Applicants CSV"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Applied Role</th>
                <th>Contact Info</th>
                <th>Experience</th>
                <th>Resume</th>
                <th>Status Pipeline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan="7" className="adm-table-empty">
                    No candidate applications found.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#071D3A' }}>{app.candidateName}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{app.date || 'Recent'}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: '12px',
                          color: '#1E40AF',
                          background: '#EFF6FF',
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {app.jobTitle}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <a
                          href={`tel:${app.phone}`}
                          style={{ fontSize: '12px', color: '#071D3A', fontWeight: 600 }}
                        >
                          {app.phone}
                        </a>
                        <a
                          href={`mailto:${app.email}`}
                          style={{ fontSize: '11.5px', color: '#64748B' }}
                        >
                          {app.email}
                        </a>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12.5px' }}>{app.experience || 'Not specified'}</div>
                      {app.currentCompany && (
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          at {app.currentCompany}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => setViewingApplicant(app)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '11.5px',
                            color: '#92400E',
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
                          <span>{app.resumeFileName || 'View Resume'}</span>
                        </button>

                        {app.resumeUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              downloadDocument(
                                api.resolveFileUrl(app.resumeUrl),
                                app.resumeFileName || 'Candidate_Resume.pdf'
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
                            title="Download resume file directly to your computer"
                          >
                            <Download size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <select
                        className="adm-select-filter"
                        style={{ fontSize: '11px', padding: '4px 6px' }}
                        value={app.status}
                        onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                      >
                        <option value="New">New</option>
                        <option value="Screened">Screened</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <a
                          href={`tel:${app.phone}`}
                          className="adm-action-btn"
                          title="Call Candidate"
                        >
                          <Phone size={13} />
                        </a>
                        <button
                          className="adm-action-btn adm-action-btn--delete"
                          onClick={() => {
                            if (window.confirm(`Delete application for ${app.candidateName}?`)) {
                              onDeleteApplicant(app.id);
                            }
                          }}
                          title="Delete Application"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
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
        isOpen={!!viewingApplicant}
        onClose={() => setViewingApplicant(null)}
        candidate={viewingApplicant}
      />
    </div>
  );
}
