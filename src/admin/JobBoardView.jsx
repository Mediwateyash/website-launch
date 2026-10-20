import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Tag,
  X,
  Users,
} from 'lucide-react';

export default function JobBoardView({
  jobs,
  applicants,
  onSaveJob,
  onDeleteJob,
  initialOpenAdd = false,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(initialOpenAdd);
  const [editingJob, setEditingJob] = useState(null);

  // Form state
  const defaultForm = {
    title: '',
    company: 'Interskill Client Partner',
    experience: '1 – 3 Years',
    location: 'Mumbai, Maharashtra',
    type: 'Full-Time',
    category: 'IT & Technology',
    tags: 'React, JavaScript',
    description: '',
    isNew: true,
    status: 'Active',
  };

  const [form, setForm] = useState(defaultForm);

  const openAdd = () => {
    setEditingJob(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setForm({
      title: job.title || '',
      company: job.company || '',
      experience: job.experience || '',
      location: job.location || '',
      type: job.type || 'Full-Time',
      category: job.category || 'IT & Technology',
      tags: Array.isArray(job.tags) ? job.tags.join(', ') : job.tags || '',
      description: job.description || '',
      isNew: job.isNew || false,
      status: job.status || 'Active',
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Please enter job title');
      return;
    }

    const jobPayload = {
      id: editingJob ? editingJob.id : `job-${Date.now()}`,
      title: form.title,
      company: form.company,
      experience: form.experience,
      location: form.location,
      type: form.type,
      category: form.category,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      description: form.description,
      isNew: form.isNew,
      status: form.status,
      applicantsCount: editingJob ? editingJob.applicantsCount || 0 : 0,
    };

    onSaveJob(jobPayload);
    setModalOpen(false);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || job.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card__header">
          <div>
            <h2 className="adm-card__title">
              <Briefcase size={18} /> Job Postings Manager ({filteredJobs.length})
            </h2>
            <p className="adm-card__subtitle">
              Live job listings displayed on the website for candidate applications
            </p>
          </div>

          <div className="adm-toolbar">
            <div className="adm-search-wrap">
              <Search size={14} className="adm-search-icon" />
              <input
                type="text"
                placeholder="Search job title, company..."
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
              <option value="Engineering & Civil">Engineering & Civil</option>
            </select>

            <button className="adm-btn-action adm-btn-primary" onClick={openAdd}>
              <Plus size={14} /> Add Job Opening
            </button>
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Job Title & Company</th>
                <th>Experience & Location</th>
                <th>Category & Tags</th>
                <th>New Badge</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="adm-table-empty">
                    No job postings found. Click "Add Job Opening" above to create one.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const jobAppCount = applicants.filter(
                    (a) => a.jobId === job.id || a.jobTitle?.toLowerCase() === job.title?.toLowerCase()
                  ).length;

                  return (
                    <tr key={job.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#071D3A' }}>{job.title}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>{job.company}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '12.5px' }}>{job.experience}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{job.location}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '11.5px', fontWeight: 600 }}>{job.category}</div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '3px' }}>
                          {(job.tags || []).slice(0, 2).map((t, i) => (
                            <span
                              key={i}
                              style={{
                                background: '#F1F5F9',
                                color: '#475569',
                                fontSize: '10px',
                                padding: '2px 5px',
                                borderRadius: '3px',
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <button
                          className="adm-action-btn"
                          onClick={() => onSaveJob({ ...job, isNew: !job.isNew })}
                          style={{
                            background: job.isNew ? '#FEF3C7' : '#F1F5F9',
                            color: job.isNew ? '#B45309' : '#64748B',
                            borderColor: job.isNew ? '#FDE68A' : '#E2E8F0',
                            fontSize: '11px',
                          }}
                        >
                          {job.isNew ? '★ NEW' : 'Standard'}
                        </button>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: jobAppCount > 0 ? '#1E40AF' : '#64748B',
                            background: jobAppCount > 0 ? '#EFF6FF' : 'transparent',
                            padding: '3px 8px',
                            borderRadius: '10px',
                            fontSize: '12px',
                          }}
                        >
                          {jobAppCount} applicants
                        </span>
                      </td>
                      <td>
                        <button
                          className="adm-action-btn"
                          onClick={() =>
                            onSaveJob({
                              ...job,
                              status: job.status === 'Active' ? 'Inactive' : 'Active',
                            })
                          }
                          style={{
                            background: job.status === 'Active' ? '#ECFDF5' : '#FEF2F2',
                            color: job.status === 'Active' ? '#047857' : '#DC2626',
                            borderColor: job.status === 'Active' ? '#A7F3D0' : '#FECDD3',
                            fontSize: '11px',
                          }}
                        >
                          {job.status === 'Active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td>
                        <div className="adm-table-actions">
                          <button
                            className="adm-action-btn"
                            onClick={() => openEdit(job)}
                            title="Edit Job Details"
                          >
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            className="adm-action-btn adm-action-btn--delete"
                            onClick={() => {
                              if (window.confirm(`Delete job opening "${job.title}"?`)) {
                                onDeleteJob(job.id);
                              }
                            }}
                            title="Delete Job"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Job Modal */}
      {modalOpen && (
        <div className="adm-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3>{editingJob ? 'Edit Job Opening' : 'Post New Job Opening'}</h3>
              <button className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="adm-modal-body">
                <div className="adm-form-grid-2col">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Job Title *</label>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. Senior React Developer"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Hiring Company *</label>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. Interskill Client Partner"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="adm-form-grid-2col">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Experience Required</label>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. 1 – 3 Years"
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Job Location</label>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. Mumbai, Maharashtra"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-grid-2col">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Category</label>
                    <select
                      className="adm-form-select"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="IT & Technology">IT & Technology</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance & Accounting">Finance & Accounting</option>
                      <option value="Engineering & Civil">Engineering & Civil</option>
                      <option value="Business Support & Corporate Roles">Business Support</option>
                    </select>
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Skills / Tags (comma-separated)</label>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. React, JavaScript, CSS"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Job Description / Responsibilities</label>
                  <textarea
                    className="adm-form-textarea"
                    placeholder="Key responsibilities and candidate qualifications..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="adm-form-grid-2col">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Display "NEW" Ribbon Badge</label>
                    <select
                      className="adm-form-select"
                      value={form.isNew ? 'yes' : 'no'}
                      onChange={(e) => setForm({ ...form, isNew: e.target.value === 'yes' })}
                    >
                      <option value="yes">Yes (Show NEW badge)</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Posting Status</label>
                    <select
                      className="adm-form-select"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="Active">Active (Visible on Website)</option>
                      <option value="Inactive">Inactive (Draft / Hidden)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="adm-modal-footer">
                <button
                  type="button"
                  className="adm-btn-action adm-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="adm-btn-action adm-btn-primary">
                  {editingJob ? 'Save Changes' : 'Publish Job Opening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
