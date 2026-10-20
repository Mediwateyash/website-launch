import React, { useState } from 'react';
import { UserPlus, Shield, UserCheck, Trash2, Key, Search, X, CheckCircle2 } from 'lucide-react';

export default function UsersView({ users, currentUser, onAddUser, onUpdateUser, onDeleteUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('recruiter');
  const [error, setError] = useState('');

  const filteredUsers = (users || []).filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await onAddUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });
      setModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to create user');
    }
  };

  return (
    <div className="adm-view">
      {/* Header Controls */}
      <div className="adm-view-controls">
        <div className="adm-search-wrap">
          <Search size={16} className="adm-search-icon" />
          <input
            type="text"
            className="adm-search-input"
            placeholder="Search recruiters or admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="adm-filter-group">
          <select
            className="adm-filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="recruiter">Recruiters</option>
          </select>

          {currentUser?.role === 'admin' && (
            <button className="adm-btn-primary" onClick={() => setModalOpen(true)}>
              <UserPlus size={16} />
              <span>Add Team Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="adm-table-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Email Address</th>
              <th>System Role</th>
              <th>Account Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64738A' }}>
                  No accounts found matching current criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const isSelf = u._id === currentUser?._id;
                return (
                  <tr key={u._id || u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: u.role === 'admin' ? '#F8EED6' : '#E5EAF0',
                            color: u.role === 'admin' ? '#B88728' : '#092344',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '13px',
                          }}
                        >
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#092344' }}>
                            {u.name} {isSelf && <span style={{ fontSize: '11px', color: '#B88728' }}>(You)</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`adm-status-pill ${u.role === 'admin' ? 'adm-status-pill--active' : 'adm-status-pill--neutral'}`}>
                        {u.role === 'admin' ? 'Admin' : 'Recruiter'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`adm-status-btn ${u.isActive ? 'active' : 'inactive'}`}
                        disabled={isSelf}
                        onClick={() => onUpdateUser(u._id || u.id, { isActive: !u.isActive })}
                        title={isSelf ? 'Cannot deactivate self' : 'Toggle account status'}
                      >
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </button>
                    </td>
                    <td style={{ fontSize: '12.5px', color: '#64738A' }}>
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td>
                      {!isSelf && (
                        <button
                          type="button"
                          className="adm-action-icon-btn text-danger"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${u.name}?`)) {
                              onDeleteUser(u._id || u.id);
                            }
                          }}
                          title="Remove user"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {modalOpen && (
        <div className="adm-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Create Team Account</h3>
              <button className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="adm-modal-form">
              <div className="adm-form-group">
                <label className="adm-form-label">Full Name *</label>
                <input
                  type="text"
                  className="adm-form-input"
                  placeholder="e.g. Shreyash Shirekar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Email Address *</label>
                <input
                  type="email"
                  className="adm-form-input"
                  placeholder="name@interskillsolutions.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Initial Password *</label>
                <input
                  type="password"
                  className="adm-form-input"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Access Role *</label>
                <select
                  className="adm-form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="recruiter">Recruiter (Can manage leads, jobs & applicants)</option>
                  <option value="admin">Administrator (Full access including CMS & team access)</option>
                </select>
              </div>

              {error && <p className="adm-form-error">{error}</p>}

              <div className="adm-modal-actions">
                <button
                  type="button"
                  className="adm-btn-outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
