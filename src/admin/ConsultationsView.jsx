import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Download,
  Trash2,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';
import { exportToCSV } from './adminStore';

export default function ConsultationsView({
  consultations,
  onUpdateStatus,
  onDeleteConsultation,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = consultations.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.preferredRole?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || c.requirementType?.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleExport = () => {
    exportToCSV('interskill_consultations', filtered);
  };

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card__header">
          <div>
            <h2 className="adm-card__title">
              <MessageSquare size={18} /> Free Consultation Inquiries ({filtered.length})
            </h2>
            <p className="adm-card__subtitle">
              Submissions from the Free Consultation section on the Homepage
            </p>
          </div>

          <div className="adm-toolbar">
            <div className="adm-search-wrap">
              <Search size={14} className="adm-search-icon" />
              <input
                type="text"
                placeholder="Search name, phone, email..."
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
              <option value="Closed">Closed</option>
            </select>

            <select
              className="adm-select-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Requirement Types</option>
              <option value="job">Looking for a Job</option>
              <option value="hiring">Hiring for Company</option>
              <option value="enquiry">General Enquiry</option>
            </select>

            <button
              className="adm-btn-action adm-btn-secondary"
              onClick={handleExport}
              title="Export Consultations CSV"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Requirement Intent</th>
                <th>Preferred Domain</th>
                <th>Contact Channels</th>
                <th>Date Received</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="adm-table-empty">
                    No consultation inquiries found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#071D3A' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{item.id}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color: '#071D3A',
                          background: '#F1F5F9',
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {item.requirementType || 'Consultation'}
                      </span>
                    </td>
                    <td style={{ fontSize: '12.5px' }}>{item.preferredRole || 'General'}</td>
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
                      <select
                        className="adm-select-filter"
                        style={{ fontSize: '11px', padding: '4px 6px' }}
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value)}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <a
                          href={`tel:${item.phone}`}
                          className="adm-action-btn"
                          title="Call Lead"
                        >
                          <Phone size={13} />
                        </a>
                        <button
                          className="adm-action-btn adm-action-btn--delete"
                          onClick={() => {
                            if (window.confirm(`Delete consultation record for ${item.name}?`)) {
                              onDeleteConsultation(item.id);
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
    </div>
  );
}
