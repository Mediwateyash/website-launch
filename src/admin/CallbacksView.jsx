import React, { useState } from 'react';
import {
  PhoneCall,
  Search,
  Download,
  Trash2,
  Phone,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';
import { exportToCSV } from './adminStore';

export default function CallbacksView({
  callbacks,
  onUpdateStatus,
  onDeleteCallback,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredCallbacks = callbacks.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile?.includes(searchTerm) ||
      c.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.source?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = callbacks.filter((c) => c.status === 'Pending').length;

  const handleExport = () => {
    exportToCSV('interskill_callbacks', filteredCallbacks);
  };

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card__header">
          <div>
            <h2 className="adm-card__title">
              <PhoneCall size={18} /> Callback Requests Queue ({filteredCallbacks.length})
            </h2>
            <p className="adm-card__subtitle">
              Website visitors requesting immediate phone consultation ({pendingCount} pending)
            </p>
          </div>

          <div className="adm-toolbar">
            <div className="adm-search-wrap">
              <Search size={14} className="adm-search-icon" />
              <input
                type="text"
                placeholder="Search visitor name or mobile..."
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
              <option value="Pending">Pending ({pendingCount})</option>
              <option value="Contacted">Contacted</option>
              <option value="Closed">Closed</option>
            </select>

            <button
              className="adm-btn-action adm-btn-secondary"
              onClick={handleExport}
              title="Export Callbacks CSV"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Visitor Name</th>
                <th>Phone Number</th>
                <th>Topic / Reason</th>
                <th>Lead Source</th>
                <th>Received At</th>
                <th>Status</th>
                <th>Follow Up Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCallbacks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="adm-table-empty">
                    No callback requests found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredCallbacks.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#071D3A' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{item.id}</div>
                    </td>
                    <td>
                      <a
                        href={`tel:${item.mobile}`}
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#071D3A',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <Phone size={13} color="#DDB568" />
                        {item.mobile}
                      </a>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#1E293B',
                          background: '#F8FAFC',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #E2E8F0',
                        }}
                      >
                        {item.topic}
                      </span>
                    </td>
                    <td style={{ fontSize: '11.5px', color: '#64748B' }}>
                      {item.source || 'Website Banner'}
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
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        {item.status === 'Pending' ? (
                          <button
                            className="adm-btn-action adm-btn-primary"
                            style={{ padding: '5px 10px', fontSize: '11.5px' }}
                            onClick={() => onUpdateStatus(item.id, 'Contacted')}
                            title="Mark as Called"
                          >
                            <CheckCircle2 size={13} />
                            <span>Mark Called</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={13} /> Completed
                          </span>
                        )}
                        <button
                          className="adm-action-btn adm-action-btn--delete"
                          onClick={() => {
                            if (window.confirm(`Delete callback for ${item.name}?`)) {
                              onDeleteCallback(item.id);
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
