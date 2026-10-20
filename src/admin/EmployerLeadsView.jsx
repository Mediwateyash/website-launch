import React, { useState } from 'react';
import {
  Building2,
  Search,
  Download,
  Eye,
  Trash2,
  Phone,
  Mail,
  Calendar,
  X,
  CheckCircle2,
} from 'lucide-react';
import { exportToCSV } from './adminStore';

export default function EmployerLeadsView({ leads, onUpdateStatus, onDeleteLead }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || lead.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleExport = () => {
    exportToCSV('interskill_employer_leads', filteredLeads);
  };

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card__header">
          <div>
            <h2 className="adm-card__title">
              <Building2 size={18} /> Employer Hiring Requirements ({filteredLeads.length})
            </h2>
            <p className="adm-card__subtitle">
              All client leads submitted via the For Employers page
            </p>
          </div>

          <div className="adm-toolbar">
            <div className="adm-search-wrap">
              <Search size={14} className="adm-search-icon" />
              <input
                type="text"
                placeholder="Search company, name, phone..."
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
              <option value="Contacted">Contacted</option>
              <option value="Profiles Shared">Profiles Shared</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              className="adm-select-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="IT & Technology">IT & Technology</option>
              <option value="Engineering & Civil">Engineering & Civil</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance, Accounting & Research">Finance & Accounting</option>
              <option value="Business Support & Corporate Roles">Business Support</option>
            </select>

            <button
              className="adm-btn-action adm-btn-secondary"
              onClick={handleExport}
              title="Download Leads as CSV"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Contact Person</th>
                <th>Domain & Openings</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="adm-table-empty">
                    No employer leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td style={{ fontWeight: 600, fontSize: '11.5px', color: '#64748B' }}>
                      {lead.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#071D3A' }}>{lead.company}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{lead.category || 'N/A'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{lead.name}</div>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '11.5px', marginTop: '2px' }}>
                        <a href={`tel:${lead.phone}`} style={{ color: '#0A2540' }}>
                          {lead.phone}
                        </a>
                        <span>•</span>
                        <a href={`mailto:${lead.email}`} style={{ color: '#64748B' }}>
                          {lead.email}
                        </a>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{lead.openings || '1-2'} openings</span>
                      <div style={{ fontSize: '11px', color: '#64748B', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lead.description || 'No additional notes provided'}
                      </div>
                    </td>
                    <td style={{ fontSize: '11.5px', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {lead.date || 'Recent'}
                    </td>
                    <td>
                      <select
                        className="adm-select-filter"
                        style={{ fontSize: '11px', padding: '4px 6px' }}
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Profiles Shared">Profiles Shared</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <button
                          className="adm-action-btn"
                          onClick={() => setSelectedLead(lead)}
                          title="View Full Details"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                        <button
                          className="adm-action-btn adm-action-btn--delete"
                          onClick={() => {
                            if (window.confirm(`Delete lead from ${lead.company}?`)) {
                              onDeleteLead(lead.id);
                            }
                          }}
                          title="Delete Lead"
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

      {/* Details Modal */}
      {selectedLead && (
        <div className="adm-modal-backdrop" onClick={() => setSelectedLead(null)}>
          <div className="adm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3>Lead Details: {selectedLead.company}</h3>
              <button
                className="adm-modal-close"
                onClick={() => setSelectedLead(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="adm-modal-body">
              <div className="adm-detail-row">
                <span className="adm-detail-label">Lead ID</span>
                <span className="adm-detail-value">{selectedLead.id}</span>
              </div>
              <div className="adm-detail-row">
                <span className="adm-detail-label">Company Name</span>
                <span className="adm-detail-value" style={{ fontWeight: 700 }}>
                  {selectedLead.company}
                </span>
              </div>
              <div className="adm-detail-row">
                <span className="adm-detail-label">Contact Person</span>
                <span className="adm-detail-value">{selectedLead.name}</span>
              </div>
              <div className="adm-detail-row">
                <span className="adm-detail-label">Phone</span>
                <span className="adm-detail-value">
                  <a href={`tel:${selectedLead.phone}`} style={{ color: '#071D3A', fontWeight: 600 }}>
                    {selectedLead.phone}
                  </a>
                </span>
              </div>
              <div className="adm-detail-row">
                <span className="adm-detail-label">Email</span>
                <span className="adm-detail-value">
                  <a href={`mailto:${selectedLead.email}`} style={{ color: '#071D3A' }}>
                    {selectedLead.email}
                  </a>
                </span>
              </div>
              <div className="adm-detail-row">
                <span className="adm-detail-label">Job Category</span>
                <span className="adm-detail-value">{selectedLead.category}</span>
              </div>
              <div className="adm-detail-row">
                <span className="adm-detail-label">Openings Count</span>
                <span className="adm-detail-value">{selectedLead.openings}</span>
              </div>
              <div className="adm-detail-row">
                <span className="adm-detail-label">Requirement Details</span>
                <span className="adm-detail-value" style={{ lineHeight: 1.5, background: '#F8FAFC', padding: '10px', borderRadius: '6px' }}>
                  {selectedLead.description || 'No detailed description provided.'}
                </span>
              </div>
              <div className="adm-detail-row">
                <span className="adm-detail-label">Status</span>
                <span className="adm-detail-value">
                  <select
                    className="adm-select-filter"
                    value={selectedLead.status}
                    onChange={(e) => {
                      onUpdateStatus(selectedLead.id, e.target.value);
                      setSelectedLead({ ...selectedLead, status: e.target.value });
                    }}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Profiles Shared">Profiles Shared</option>
                    <option value="Closed">Closed</option>
                  </select>
                </span>
              </div>
            </div>

            <div className="adm-modal-footer">
              <a
                href={`tel:${selectedLead.phone}`}
                className="adm-btn-action adm-btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                <Phone size={13} /> Call Contact
              </a>
              <a
                href={`mailto:${selectedLead.email}`}
                className="adm-btn-action adm-btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                <Mail size={13} /> Email Contact
              </a>
              <button
                className="adm-btn-action adm-btn-primary"
                onClick={() => setSelectedLead(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
