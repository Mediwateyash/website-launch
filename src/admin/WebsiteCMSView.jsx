import React, { useState, useEffect } from 'react';
import {
  Settings,
  Users,
  Edit2,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Star,
  Globe,
  Upload,
  X,
} from 'lucide-react';
import { api } from '../api/apiClient';

export default function WebsiteCMSView({
  team = [],
  stats = {},
  testimonials = [],
  faqs = [],
  onSaveTeam,
  onSaveStats,
  onSaveTestimonials,
  onSaveFaqs,
}) {
  const [activeSubTab, setActiveSubTab] = useState('metrics'); // 'metrics' | 'team' | 'testimonials' | 'faqs'
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // 1. Stats & Contact Form state
  const [statsForm, setStatsForm] = useState(stats);

  // 2. Team state
  const [teamList, setTeamList] = useState(team);
  const [editingMember, setEditingMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: '', role: '', image: '', quote: '' });
  const [uploadingMemberPhoto, setUploadingMemberPhoto] = useState(false);

  // 3. Testimonials state
  const [testimonialsList, setTestimonialsList] = useState(testimonials);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    quote: '',
    rating: 5,
    image: '',
  });
  const [uploadingTestimonialPhoto, setUploadingTestimonialPhoto] = useState(false);

  // 4. FAQs state
  const [faqList, setFaqList] = useState(faqs);
  const [editingFaq, setEditingFaq] = useState(null);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });

  // Synchronize internal state when props update (e.g. MongoDB Atlas remote fetch resolves)
  useEffect(() => {
    if (Array.isArray(team) && team.length > 0) {
      setTeamList(team);
    }
  }, [team]);

  useEffect(() => {
    if (stats && Object.keys(stats).length > 0) {
      setStatsForm(stats);
    }
  }, [stats]);

  useEffect(() => {
    if (Array.isArray(testimonials) && testimonials.length > 0) {
      setTestimonialsList(testimonials);
    }
  }, [testimonials]);

  useEffect(() => {
    if (Array.isArray(faqs) && faqs.length > 0) {
      setFaqList(faqs);
    }
  }, [faqs]);

  const triggerFeedback = (msg = 'Website content and metrics successfully updated live!') => {
    setFeedbackMsg(msg);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3500);
  };

  const handleUploadMemberPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMemberPhoto(true);
    try {
      const res = await api.uploadImage(file);
      if (res.url) {
        setMemberForm((prev) => ({ ...prev, image: res.url }));
        triggerFeedback('Photo uploaded successfully to Cloudinary / server!');
      }
    } catch (err) {
      alert('Photo upload failed: ' + err.message);
    } finally {
      setUploadingMemberPhoto(false);
    }
  };

  const handleUploadTestimonialPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingTestimonialPhoto(true);
    try {
      const res = await api.uploadImage(file);
      if (res.url) {
        setTestimonialForm((prev) => ({ ...prev, image: res.url }));
        triggerFeedback('Avatar uploaded successfully!');
      }
    } catch (err) {
      alert('Photo upload failed: ' + err.message);
    } finally {
      setUploadingTestimonialPhoto(false);
    }
  };

  // --- Handlers: Metrics ---
  const handleStatsSubmit = (e) => {
    e.preventDefault();
    if (onSaveStats) onSaveStats(statsForm);
    triggerFeedback('Official metrics and contact information updated successfully!');
  };

  // --- Handlers: Team ---
  const openEditMember = (m) => {
    setEditingMember(m);
    setMemberForm({
      name: m.name || '',
      role: m.role || '',
      image: m.image || '',
      quote: m.quote || '',
    });
    setShowMemberModal(true);
  };

  const openAddMember = () => {
    setEditingMember(null);
    setMemberForm({
      name: '',
      role: '',
      image: '/images/team-priya.jpg',
      quote: '',
    });
    setShowMemberModal(true);
  };

  const handleSaveMember = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!memberForm.name.trim()) {
      alert('Please enter full name');
      return;
    }

    const editId = editingMember ? (editingMember.id || editingMember._id || editingMember.memberId) : null;
    let updated;
    if (editId) {
      updated = teamList.map((item) => {
        const itemId = item.id || item._id || item.memberId;
        if (itemId === editId) {
          return {
            ...item,
            name: memberForm.name.trim(),
            role: memberForm.role.trim(),
            image: memberForm.image || '/images/team-priya.jpg',
            quote: memberForm.quote || '',
          };
        }
        return item;
      });
    } else {
      const newId = `team-${Date.now()}`;
      updated = [
        ...teamList,
        {
          id: newId,
          memberId: newId,
          name: memberForm.name.trim(),
          role: memberForm.role.trim(),
          image: memberForm.image || '/images/team-priya.jpg',
          quote: memberForm.quote || '',
        },
      ];
    }
    setTeamList(updated);
    if (onSaveTeam) onSaveTeam(updated);
    setEditingMember(null);
    setShowMemberModal(false);
    setMemberForm({ name: '', role: '', image: '', quote: '' });
    triggerFeedback('Leadership team updated and synced with database!');
  };

  const handleDeleteMember = (memberOrId) => {
    const targetId = typeof memberOrId === 'object' && memberOrId !== null
      ? (memberOrId.id || memberOrId._id || memberOrId.memberId)
      : memberOrId;

    if (window.confirm('Remove this team member from the website?')) {
      const updated = teamList.filter((m) => {
        const mId = m.id || m._id || m.memberId;
        return mId !== targetId;
      });
      setTeamList(updated);
      if (onSaveTeam) onSaveTeam(updated);
      triggerFeedback('Team member removed.');
    }
  };

  // --- Handlers: Testimonials ---
  const openEditTestimonial = (t) => {
    setEditingTestimonial(t);
    setTestimonialForm({
      name: t.name || '',
      role: t.role || '',
      quote: t.quote || '',
      rating: t.rating || 5,
      image: t.image || '',
    });
    setShowTestimonialModal(true);
  };

  const openAddTestimonial = () => {
    setEditingTestimonial(null);
    setTestimonialForm({
      name: '',
      role: '',
      quote: '',
      rating: 5,
      image: '/images/testimonial-rohit.png',
    });
    setShowTestimonialModal(true);
  };

  const handleSaveTestimonial = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!testimonialForm.name.trim() || !testimonialForm.quote.trim()) {
      alert('Please enter both name and review quote');
      return;
    }

    const editId = editingTestimonial ? (editingTestimonial.id || editingTestimonial._id || editingTestimonial.testimonialId) : null;
    let updated;
    if (editId) {
      updated = testimonialsList.map((t) => {
        const tId = t.id || t._id || t.testimonialId;
        if (tId === editId) {
          return {
            ...t,
            ...testimonialForm,
            name: testimonialForm.name.trim(),
            role: testimonialForm.role.trim(),
            quote: testimonialForm.quote.trim(),
          };
        }
        return t;
      });
    } else {
      const newId = `test-${Date.now()}`;
      updated = [
        ...testimonialsList,
        {
          id: newId,
          testimonialId: newId,
          ...testimonialForm,
          image: testimonialForm.image || '/images/testimonial-rohit.png',
        },
      ];
    }
    setTestimonialsList(updated);
    if (onSaveTestimonials) onSaveTestimonials(updated);
    setEditingTestimonial(null);
    setShowTestimonialModal(false);
    setTestimonialForm({ name: '', role: '', quote: '', rating: 5, image: '' });
    triggerFeedback('Testimonial saved and updated on homepage!');
  };

  const handleDeleteTestimonial = (testimonialOrId) => {
    const targetId = typeof testimonialOrId === 'object' && testimonialOrId !== null
      ? (testimonialOrId.id || testimonialOrId._id || testimonialOrId.testimonialId)
      : testimonialOrId;

    if (window.confirm('Remove this review from the public website?')) {
      const updated = testimonialsList.filter((t) => {
        const tId = t.id || t._id || t.testimonialId;
        return tId !== targetId;
      });
      setTestimonialsList(updated);
      if (onSaveTestimonials) onSaveTestimonials(updated);
      triggerFeedback('Testimonial removed.');
    }
  };

  // --- Handlers: FAQs ---
  const openEditFaq = (f) => {
    setEditingFaq(f);
    setFaqForm({ question: f.question, answer: f.answer });
    setShowFaqModal(true);
  };

  const openAddFaq = () => {
    setEditingFaq(null);
    setFaqForm({ question: '', answer: '' });
    setShowFaqModal(true);
  };

  const handleSaveFaq = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      alert('Please enter both question and answer');
      return;
    }

    const editId = editingFaq ? (editingFaq.id || editingFaq._id || editingFaq.faqId) : null;
    let updated;
    if (editId) {
      updated = faqList.map((f) => {
        const fId = f.id || f._id || f.faqId;
        if (fId === editId) {
          return {
            ...f,
            question: faqForm.question.trim(),
            answer: faqForm.answer.trim(),
          };
        }
        return f;
      });
    } else {
      const newId = `faq-${Date.now()}`;
      updated = [
        ...faqList,
        {
          id: newId,
          faqId: newId,
          question: faqForm.question.trim(),
          answer: faqForm.answer.trim(),
        },
      ];
    }
    setFaqList(updated);
    if (onSaveFaqs) onSaveFaqs(updated);
    setEditingFaq(null);
    setShowFaqModal(false);
    setFaqForm({ question: '', answer: '' });
    triggerFeedback('FAQ entry saved and updated live!');
  };

  const handleDeleteFaq = (faqOrId) => {
    const targetId = typeof faqOrId === 'object' && faqOrId !== null
      ? (faqOrId.id || faqOrId._id || faqOrId.faqId)
      : faqOrId;

    if (window.confirm('Remove this FAQ item from the website?')) {
      const updated = faqList.filter((f) => {
        const fId = f.id || f._id || f.faqId;
        return fId !== targetId;
      });
      setFaqList(updated);
      if (onSaveFaqs) onSaveFaqs(updated);
      triggerFeedback('FAQ item removed.');
    }
  };

  return (
    <div>
      {/* Live Feedback Banner */}
      {savedFeedback && (
        <div
          style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '12px 18px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '13.5px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Sub-navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '12px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          className={`adm-btn-action ${activeSubTab === 'metrics' ? 'adm-btn-primary' : 'adm-btn-secondary'}`}
          onClick={() => setActiveSubTab('metrics')}
        >
          <Settings size={14} /> Official Metrics & Contacts
        </button>
        <button
          type="button"
          className={`adm-btn-action ${activeSubTab === 'team' ? 'adm-btn-primary' : 'adm-btn-secondary'}`}
          onClick={() => setActiveSubTab('team')}
        >
          <Users size={14} /> Key Leadership & Team ({teamList.length})
        </button>
        <button
          type="button"
          className={`adm-btn-action ${activeSubTab === 'testimonials' ? 'adm-btn-primary' : 'adm-btn-secondary'}`}
          onClick={() => setActiveSubTab('testimonials')}
        >
          <MessageSquare size={14} /> Client Testimonials ({testimonialsList.length})
        </button>
        <button
          type="button"
          className={`adm-btn-action ${activeSubTab === 'faqs' ? 'adm-btn-primary' : 'adm-btn-secondary'}`}
          onClick={() => setActiveSubTab('faqs')}
        >
          <HelpCircle size={14} /> Website FAQs ({faqList.length})
        </button>
      </div>

      {/* TAB 1: METRICS & CONTACTS */}
      {activeSubTab === 'metrics' && (
        <div className="adm-card">
          <div className="adm-card__header">
            <div>
              <h2 className="adm-card__title">
                <Settings size={18} /> Website Metrics & Official Contact Details
              </h2>
              <p className="adm-card__subtitle">
                Configure hero counters, stats badges, and company contact information across public pages
              </p>
            </div>
          </div>

          <form onSubmit={handleStatsSubmit} style={{ padding: '22px' }}>
            <div className="adm-form-grid-2col" style={{ marginBottom: '18px' }}>
              <div className="adm-form-group">
                <label className="adm-form-label">Industry Focus Areas Metric</label>
                <input
                  type="text"
                  className="adm-form-input"
                  value={statsForm.industryFocus || ''}
                  onChange={(e) =>
                    setStatsForm({ ...statsForm, industryFocus: e.target.value })
                  }
                  placeholder="e.g. 5+ Specialised Sectors"
                />
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Placement Track Record Metric</label>
                <input
                  type="text"
                  className="adm-form-input"
                  value={statsForm.placements || ''}
                  onChange={(e) =>
                    setStatsForm({ ...statsForm, placements: e.target.value })
                  }
                  placeholder="e.g. 500+ Careers Placed"
                />
              </div>
            </div>

            <div className="adm-form-grid-2col" style={{ marginBottom: '18px' }}>
              <div className="adm-form-group">
                <label className="adm-form-label">Client Retention / Trust Metric</label>
                <input
                  type="text"
                  className="adm-form-input"
                  value={statsForm.clientRetention || ''}
                  onChange={(e) =>
                    setStatsForm({ ...statsForm, clientRetention: e.target.value })
                  }
                  placeholder="e.g. 98% Client Satisfaction"
                />
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Turnaround / Response Metric</label>
                <input
                  type="text"
                  className="adm-form-input"
                  value={statsForm.turnaround || ''}
                  onChange={(e) =>
                    setStatsForm({ ...statsForm, turnaround: e.target.value })
                  }
                  placeholder="e.g. 24–48 Hr Profile Delivery"
                />
              </div>
            </div>

            <div style={{ margin: '24px 0 14px', borderTop: '1px solid #E2E8F0', paddingTop: '18px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#071D3A', margin: '0 0 14px' }}>
                Official Corporate Contact Channels
              </h3>
            </div>

            <div className="adm-form-grid-2col" style={{ marginBottom: '18px' }}>
              <div className="adm-form-group">
                <label className="adm-form-label">Official Inquiries Phone Number</label>
                <input
                  type="text"
                  className="adm-form-input"
                  value={statsForm.phone || ''}
                  onChange={(e) => setStatsForm({ ...statsForm, phone: e.target.value })}
                  placeholder="+91 93246 80599"
                />
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Official Inquiries Email Address</label>
                <input
                  type="email"
                  className="adm-form-input"
                  value={statsForm.email || ''}
                  onChange={(e) => setStatsForm({ ...statsForm, email: e.target.value })}
                  placeholder="info@interskillsolutions.com"
                />
              </div>
            </div>

            <div className="adm-form-group" style={{ marginBottom: '18px' }}>
              <label className="adm-form-label">Corporate Office Address</label>
              <textarea
                className="adm-form-textarea"
                rows={2}
                value={statsForm.address || ''}
                onChange={(e) => setStatsForm({ ...statsForm, address: e.target.value })}
                placeholder="Office No. 402, 4th Floor, City Centre, Sector 17, Vashi, Navi Mumbai – 400703"
              />
            </div>

            <div className="adm-form-grid-2col" style={{ marginBottom: '22px' }}>
              <div className="adm-form-group">
                <label className="adm-form-label">Support Hours</label>
                <input
                  type="text"
                  className="adm-form-input"
                  value={statsForm.workingHours || ''}
                  onChange={(e) =>
                    setStatsForm({ ...statsForm, workingHours: e.target.value })
                  }
                  placeholder="Monday – Saturday: 9:30 AM – 6:30 PM"
                />
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">LinkedIn Corporate URL</label>
                <input
                  type="text"
                  className="adm-form-input"
                  value={statsForm.linkedinUrl || ''}
                  onChange={(e) =>
                    setStatsForm({ ...statsForm, linkedinUrl: e.target.value })
                  }
                  placeholder="https://linkedin.com/company/interskill-staffing-solutions"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="adm-btn-action adm-btn-primary">
                <Save size={14} /> Save Metrics & Contacts
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: KEY LEADERSHIP & TEAM */}
      {activeSubTab === 'team' && (
        <div className="adm-card">
          <div className="adm-card__header">
            <div>
              <h2 className="adm-card__title">
                <Users size={18} /> Meet Our Key Leadership & Team ({teamList.length})
              </h2>
              <p className="adm-card__subtitle">
                Team members displayed on the Interskill Homepage and About Us page
              </p>
            </div>
            <button
              type="button"
              className="adm-btn-action adm-btn-primary"
              onClick={openAddMember}
            >
              <Plus size={14} /> Add Team Member
            </button>
          </div>

          <div style={{ padding: '22px' }}>
            <div className="adm-team-grid">
              {teamList.map((m) => {
                const memberKey = m.id || m._id || m.memberId || m.name;
                return (
                  <div key={memberKey} className="adm-team-card">
                    <img
                      src={api.resolveFileUrl(m.image)}
                      alt={m.name}
                      className="adm-team-img"
                      onError={(e) => {
                        e.currentTarget.src = '/images/team-priya.jpg';
                      }}
                    />
                    <div className="adm-team-name">{m.name}</div>
                    <div className="adm-team-role">{m.role}</div>
                    {m.quote && (
                      <div
                        style={{
                          fontSize: '11.5px',
                          color: '#64748B',
                          fontStyle: 'italic',
                          margin: '6px 0 10px',
                          lineHeight: 1.4,
                        }}
                      >
                        "{m.quote}"
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: 'auto', paddingTop: '10px' }}>
                      <button
                        type="button"
                        className="adm-action-btn"
                        onClick={() => openEditMember(m)}
                        title="Edit this team member"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        className="adm-action-btn adm-action-btn--delete"
                        onClick={() => handleDeleteMember(m)}
                        title="Remove member"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TEAM MEMBER MODAL */}
      {showMemberModal && (
        <div
          className="adm-modal-backdrop"
          onClick={() => {
            setShowMemberModal(false);
            setEditingMember(null);
          }}
        >
          <div
            className="adm-modal-card"
            style={{ maxWidth: '620px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#071D3A" />
                {editingMember ? `Edit Member: ${editingMember.name}` : 'Add New Key Leadership Member'}
              </h3>
              <button
                type="button"
                className="adm-modal-close"
                onClick={() => {
                  setShowMemberModal(false);
                  setEditingMember(null);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMember}>
              <div className="adm-modal-body">
                <div className="adm-form-grid-2col">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Full Name & Title *</label>
                    <input
                      type="text"
                      className="adm-form-input"
                      value={memberForm.name}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, name: e.target.value })
                      }
                      placeholder="e.g. Dr Priya Gawade"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Designation / Role *</label>
                    <input
                      type="text"
                      className="adm-form-input"
                      value={memberForm.role}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, role: e.target.value })
                      }
                      placeholder="e.g. CEO of Interskill Solutions"
                      required
                    />
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Photo Image (Upload or URL / Path)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="adm-form-input"
                      value={memberForm.image}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, image: e.target.value })
                      }
                      placeholder="/images/team-priya.jpg or paste image URL"
                      style={{ flex: 1 }}
                    />
                    <label
                      className="adm-btn-action adm-btn-secondary"
                      style={{
                        cursor: 'pointer',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Upload size={13} /> {uploadingMemberPhoto ? 'Uploading...' : 'Upload Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleUploadMemberPhoto}
                        disabled={uploadingMemberPhoto}
                      />
                    </label>
                  </div>
                  {memberForm.image && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={api.resolveFileUrl(memberForm.image)}
                        alt="Preview"
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #DDB568',
                        }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/team-priya.jpg';
                        }}
                      />
                      <span style={{ fontSize: '12px', color: '#64748B' }}>
                        Preview: {memberForm.image.length > 50 ? memberForm.image.slice(0, 50) + '...' : memberForm.image}
                      </span>
                    </div>
                  )}
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Key Quote / Philosophy</label>
                  <textarea
                    className="adm-form-textarea"
                    rows={3}
                    value={memberForm.quote}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, quote: e.target.value })
                    }
                    placeholder="e.g. People are not just resources; they are the real growth engines of any business."
                  />
                </div>
              </div>

              <div
                className="adm-modal-footer"
                style={{
                  padding: '16px 22px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  borderTop: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                }}
              >
                <button
                  type="button"
                  className="adm-btn-action adm-btn-secondary"
                  onClick={() => {
                    setShowMemberModal(false);
                    setEditingMember(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-btn-action adm-btn-primary"
                >
                  <Save size={13} /> {editingMember ? 'Update Member' : 'Add to Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: CLIENT TESTIMONIALS */}
      {activeSubTab === 'testimonials' && (
        <div className="adm-card">
          <div className="adm-card__header">
            <div>
              <h2 className="adm-card__title">
                <MessageSquare size={18} /> Client & Candidate Testimonials ({testimonialsList.length})
              </h2>
              <p className="adm-card__subtitle">
                Customer reviews and placement success stories displayed on the homepage
              </p>
            </div>
            <button
              type="button"
              className="adm-btn-action adm-btn-primary"
              onClick={openAddTestimonial}
            >
              <Plus size={14} /> Add Testimonial
            </button>
          </div>

          <div style={{ padding: '22px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {testimonialsList.map((t) => {
                const tKey = t.id || t._id || t.testimonialId || t.name;
                return (
                  <div
                    key={tKey}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <img
                          src={api.resolveFileUrl(t.image || '/images/testimonial-rohit.png')}
                          alt={t.name}
                          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/testimonial-rohit.png';
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>{t.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>{t.role}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} fill="#D9B45E" stroke="#D9B45E" />
                        ))}
                      </div>
                      <p style={{ fontSize: '13px', color: '#334155', fontStyle: 'italic', lineHeight: 1.5, margin: '0 0 14px' }}>
                        "{t.quote}"
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                      <button type="button" className="adm-action-btn" onClick={() => openEditTestimonial(t)}>
                        <Edit2 size={12} /> Edit
                      </button>
                      <button type="button" className="adm-action-btn adm-action-btn--delete" onClick={() => handleDeleteTestimonial(t)}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TESTIMONIAL MODAL */}
      {showTestimonialModal && (
        <div
          className="adm-modal-backdrop"
          onClick={() => {
            setShowTestimonialModal(false);
            setEditingTestimonial(null);
          }}
        >
          <div
            className="adm-modal-card"
            style={{ maxWidth: '620px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="#071D3A" />
                {editingTestimonial ? `Edit Testimonial: ${editingTestimonial.name}` : 'Add New Testimonial'}
              </h3>
              <button
                type="button"
                className="adm-modal-close"
                onClick={() => {
                  setShowTestimonialModal(false);
                  setEditingTestimonial(null);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial}>
              <div className="adm-modal-body">
                <div className="adm-form-grid-2col">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Client / Candidate Name *</label>
                    <input
                      type="text"
                      className="adm-form-input"
                      value={testimonialForm.name}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                      placeholder="Rohit Patil"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Title / Company *</label>
                    <input
                      type="text"
                      className="adm-form-input"
                      value={testimonialForm.role}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                      placeholder="Senior Full Stack Engineer, Apex Cloud"
                      required
                    />
                  </div>
                </div>

                <div className="adm-form-grid-2col">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Star Rating (1–5)</label>
                    <select
                      className="adm-form-select"
                      value={testimonialForm.rating}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                    >
                      <option value={5}>5 Stars (Outstanding)</option>
                      <option value={4}>4 Stars (Very Good)</option>
                      <option value={3}>3 Stars (Good)</option>
                    </select>
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Avatar Photo</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="adm-form-input"
                        value={testimonialForm.image}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, image: e.target.value })}
                        placeholder="/images/testimonial-rohit.png"
                        style={{ flex: 1 }}
                      />
                      <label
                        className="adm-btn-action adm-btn-secondary"
                        style={{ cursor: 'pointer', margin: 0, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Upload size={13} /> {uploadingTestimonialPhoto ? '...' : 'Upload'}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleUploadTestimonialPhoto}
                          disabled={uploadingTestimonialPhoto}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Testimonial Quote / Review *</label>
                  <textarea
                    className="adm-form-textarea"
                    rows={3}
                    value={testimonialForm.quote}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                    placeholder="Interskill helped me find the right opportunity quickly..."
                    required
                  />
                </div>
              </div>

              <div
                className="adm-modal-footer"
                style={{
                  padding: '16px 22px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  borderTop: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                }}
              >
                <button
                  type="button"
                  className="adm-btn-action adm-btn-secondary"
                  onClick={() => {
                    setShowTestimonialModal(false);
                    setEditingTestimonial(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="adm-btn-action adm-btn-primary">
                  <Save size={13} /> {editingTestimonial ? 'Update Testimonial' : 'Publish Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: FAQS */}
      {activeSubTab === 'faqs' && (
        <div className="adm-card">
          <div className="adm-card__header">
            <div>
              <h2 className="adm-card__title">
                <HelpCircle size={18} /> Frequently Asked Questions ({faqList.length})
              </h2>
              <p className="adm-card__subtitle">
                Manage questions and answers displayed in the public FAQ section
              </p>
            </div>
            <button
              type="button"
              className="adm-btn-action adm-btn-primary"
              onClick={openAddFaq}
            >
              <Plus size={14} /> Add FAQ Item
            </button>
          </div>

          <div style={{ padding: '22px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {faqList.map((f, idx) => {
                const key = f.id || f._id || f.faqId || idx;
                return (
                  <div
                    key={key}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#071D3A', marginBottom: '6px' }}>
                          {f.question}
                        </div>
                        <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                          {f.answer}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" className="adm-action-btn" onClick={() => openEditFaq(f)}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button type="button" className="adm-action-btn adm-action-btn--delete" onClick={() => handleDeleteFaq(f)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {showFaqModal && (
        <div
          className="adm-modal-backdrop"
          onClick={() => {
            setShowFaqModal(false);
            setEditingFaq(null);
          }}
        >
          <div
            className="adm-modal-card"
            style={{ maxWidth: '620px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={18} color="#071D3A" />
                {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Item'}
              </h3>
              <button
                type="button"
                className="adm-modal-close"
                onClick={() => {
                  setShowFaqModal(false);
                  setEditingFaq(null);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveFaq}>
              <div className="adm-modal-body">
                <div className="adm-form-group">
                  <label className="adm-form-label">Question *</label>
                  <input
                    type="text"
                    className="adm-form-input"
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    placeholder="e.g. What services does Interskill Staffing Solutions offer?"
                    required
                    autoFocus
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Detailed Answer *</label>
                  <textarea
                    className="adm-form-textarea"
                    rows={4}
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    placeholder="Interskill Staffing Solutions provides end-to-end recruitment..."
                    required
                  />
                </div>
              </div>

              <div
                className="adm-modal-footer"
                style={{
                  padding: '16px 22px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  borderTop: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                }}
              >
                <button
                  type="button"
                  className="adm-btn-action adm-btn-secondary"
                  onClick={() => {
                    setShowFaqModal(false);
                    setEditingFaq(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="adm-btn-action adm-btn-primary">
                  <Save size={13} /> {editingFaq ? 'Update FAQ' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
