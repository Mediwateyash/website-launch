import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Trash2,
  Phone,
  Mail,
  UserCheck,
  Eye,
} from 'lucide-react';
import { exportToCSV } from './adminStore';
import { api } from '../api/apiClient';
import ResumeViewerModal, { downloadDocument } from './ResumeViewerModal';

export default function ResumeBankView({ resumes, onDeleteResume }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewingCandidate, setViewingCandidate] = useState(null);

  const filtered = resumes.filter((r) => {
    const matchesSearch =
      r.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone?.includes(searchTerm) ||
      r.fileName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    exportToCSV('interskill_resume_bank', filtered);
  };

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card__header">
          <div>
            <h2 className="adm-card__title">
              <FileText size={18} /> Candidate Resume Bank ({filtered.length})
            </h2>
            <p className="adm-card__subtitle">
              Unsolicited resumes and general candidate submissions for future matching
            </p>
          </div>

          <div className="adm-toolbar">
            <div className="adm-search-wrap">
              <Search size={14} className="adm-search-icon" />
              <input
                type="text"
                placeholder="Search candidate name, phone, resume..."
                className="adm-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="adm-select-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="IT & Technology">IT & Technology</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
            </select>

            <button
              className="adm-btn-action adm-btn-secondary"
              onClick={handleExport}
              title="Export Resume Bank CSV"
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
                <th>Category</th>
                <th>Experience</th>
                <th>Attached Resume</th>
                <th>Contact</th>
                <th>Date Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="adm-table-empty">
                    No resumes in the candidate bank matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#071D3A' }}>{item.candidateName}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{item.id}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#071D3A',
                          background: '#F1F5F9',
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {item.category || 'General Candidate'}
                      </span>
                    </td>
                    <td style={{ fontSize: '12.5px' }}>{item.experience || 'Not specified'}</td>
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
                            fontSize: '12px',
                            background: '#FEF3C7',
                            border: '1px solid #FDE68A',
                            padding: '4px 10px',
                            borderRadius: '5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          title="View resume inside admin panel"
                        >
                          <Eye size={13} color="#B45309" />
                          <span>{item.fileName || 'View Resume'}</span>
                        </button>

                        {item.fileUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              downloadDocument(api.resolveFileUrl(item.fileUrl), item.fileName)
                            }
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '26px',
                              height: '26px',
                              color: '#071D3A',
                              background: '#F1F5F9',
                              border: '1px solid #CBD5E1',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                            title="Download document file directly to your computer"
                          >
                            <Download size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <a
                          href={`tel:${item.phone}`}
                          style={{ fontSize: '12px', color: '#071D3A', fontWeight: 600 }}
                        >
                          {item.phone}
                        </a>
                        <a
                          href={`mailto:${item.email}`}
                          style={{ fontSize: '11px', color: '#64748B' }}
                        >
                          {item.email}
                        </a>
                      </div>
                    </td>
                    <td style={{ fontSize: '11.5px', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {item.date || 'Recent'}
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <a
                          href={`tel:${item.phone}`}
                          className="adm-action-btn"
                          title="Call Candidate"
                        >
                          <Phone size={13} />
                        </a>
                        <button
                          className="adm-action-btn adm-action-btn--delete"
                          onClick={() => {
                            if (window.confirm(`Delete resume entry for ${item.candidateName}?`)) {
                              onDeleteResume(item.id);
                            }
                          }}
                          title="Delete Record"
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
        isOpen={!!viewingCandidate}
        onClose={() => setViewingCandidate(null)}
        candidate={viewingCandidate}
      />
    </div>
  );
}
