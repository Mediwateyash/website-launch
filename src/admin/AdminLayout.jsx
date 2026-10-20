import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  PhoneCall,
  MessageSquare,
  FileText,
  Settings,
  ExternalLink,
  ShieldCheck,
  LogOut,
  UserCheck,
  CheckCircle2,
  Database,
} from 'lucide-react';
import './admin.css';
import {
  getStored,
  setStored,
  STORAGE_KEYS,
  initAdminStore,
} from './adminStore';

import AdminDashboard from './AdminDashboard';
import EmployerLeadsView from './EmployerLeadsView';
import JobBoardView from './JobBoardView';
import ApplicantsView from './ApplicantsView';
import CallbacksView from './CallbacksView';
import ConsultationsView from './ConsultationsView';
import ResumeBankView from './ResumeBankView';
import WebsiteCMSView from './WebsiteCMSView';
import UsersView from './UsersView';
import AdminAuthModal from './AdminAuthModal';
import { api, getAuthToken, getCachedUser, clearAuthSession } from '../api/apiClient';

export default function AdminLayout({ onNavigate }) {
  // Authentication & session state
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAuthToken());
  const [currentUser, setCurrentUser] = useState(() => getCachedUser());
  const [users, setUsers] = useState([]);
  const [mongoConnected, setMongoConnected] = useState(false);

  // State management backed by localStorage / Mongo
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tabOptions, setTabOptions] = useState({});

  const [leads, setLeads] = useState(() => getStored(STORAGE_KEYS.EMPLOYER_LEADS, []));
  const [callbacks, setCallbacks] = useState(() => getStored(STORAGE_KEYS.CALLBACKS, []));
  const [consultations, setConsultations] = useState(() => getStored(STORAGE_KEYS.CONSULTATIONS, []));
  const [jobs, setJobs] = useState(() => getStored(STORAGE_KEYS.JOBS, []));
  const [applicants, setApplicants] = useState(() => getStored(STORAGE_KEYS.APPLICANTS, []));
  const [resumes, setResumes] = useState(() => getStored(STORAGE_KEYS.RESUMES, []));
  const [team, setTeam] = useState(() => getStored(STORAGE_KEYS.TEAM, []));
  const [stats, setStats] = useState(() => getStored(STORAGE_KEYS.STATS, {}));
  const [testimonials, setTestimonials] = useState(() => getStored(STORAGE_KEYS.TESTIMONIALS, []));
  const [faqs, setFaqs] = useState(() => getStored(STORAGE_KEYS.FAQS, []));

  // Fetch live data from MongoDB Atlas backend API
  const fetchMongoData = useCallback(async () => {
    try {
      // Validate session token with /me
      if (getAuthToken()) {
        try {
          const me = await api.getMe();
          setCurrentUser(me);
          setMongoConnected(true);
        } catch (err) {
          console.warn('Session verification notice:', err.message);
          if (err.message.includes('401') || err.message.includes('expired') || err.message.includes('authorized')) {
            clearAuthSession();
            setIsAuthenticated(false);
            return;
          }
        }
      }

      const [
        remoteLeads,
        remoteCallbacks,
        remoteConsultations,
        remoteJobs,
        remoteApplicants,
        remoteResumes,
        remoteTeam,
        remoteStats,
        remoteUsers,
        remoteTestimonials,
        remoteFaqs,
      ] = await Promise.allSettled([
        api.getLeads(),
        api.getCallbacks(),
        api.getConsultations(),
        api.getJobs('all'),
        api.getApplicants(),
        api.getResumes(),
        api.getTeam(),
        api.getStats(),
        api.getUsers(),
        api.getTestimonials(),
        api.getFaqs(),
      ]);

      setMongoConnected(true);

      if (remoteLeads.status === 'fulfilled' && Array.isArray(remoteLeads.value)) {
        const mapped = remoteLeads.value.map((l) => ({
          id: l.leadId || l._id,
          name: l.name,
          company: l.company,
          phone: l.phone,
          email: l.email,
          category: l.category,
          openings: l.openings,
          description: l.description,
          status: l.status,
          notes: l.notes || '',
          priority: l.priority || 'Normal',
          assignedTo: l.assignedTo || 'Unassigned',
          date: l.formattedDate || new Date(l.createdAt).toLocaleString(),
        }));
        const remoteIds = new Set(mapped.map((m) => m.id));
        const localCurrent = getStored(STORAGE_KEYS.EMPLOYER_LEADS, []);
        const unSynced = localCurrent.filter((loc) => !remoteIds.has(loc.id));
        const merged = [...mapped, ...unSynced];
        setLeads(merged);
        setStored(STORAGE_KEYS.EMPLOYER_LEADS, merged);
      }

      if (remoteCallbacks.status === 'fulfilled' && Array.isArray(remoteCallbacks.value)) {
        const mapped = remoteCallbacks.value.map((c) => ({
          id: c.callbackId || c._id,
          name: c.name,
          mobile: c.mobile,
          topic: c.topic,
          source: c.source,
          status: c.status,
          notes: c.notes || '',
          priority: c.priority || 'Urgent',
          date: c.formattedDate || new Date(c.createdAt).toLocaleString(),
        }));
        const remoteIds = new Set(mapped.map((m) => m.id));
        const localCurrent = getStored(STORAGE_KEYS.CALLBACKS, []);
        const unSynced = localCurrent.filter((loc) => !remoteIds.has(loc.id));
        const merged = [...mapped, ...unSynced];
        setCallbacks(merged);
        setStored(STORAGE_KEYS.CALLBACKS, merged);
      }

      if (remoteConsultations.status === 'fulfilled' && Array.isArray(remoteConsultations.value)) {
        const mapped = remoteConsultations.value.map((con) => ({
          id: con.consultationId || con._id,
          name: con.name,
          phone: con.phone,
          email: con.email,
          requirementType: con.requirementType,
          preferredRole: con.preferredRole,
          status: con.status,
          notes: con.notes || '',
          date: con.formattedDate || new Date(con.createdAt).toLocaleString(),
        }));
        const remoteIds = new Set(mapped.map((m) => m.id));
        const localCurrent = getStored(STORAGE_KEYS.CONSULTATIONS, []);
        const unSynced = localCurrent.filter((loc) => !remoteIds.has(loc.id));
        const merged = [...mapped, ...unSynced];
        setConsultations(merged);
        setStored(STORAGE_KEYS.CONSULTATIONS, merged);
      }

      if (remoteJobs.status === 'fulfilled' && Array.isArray(remoteJobs.value) && remoteJobs.value.length) {
        const mapped = remoteJobs.value.map((j) => ({
          id: j.jobId || j._id,
          title: j.title,
          company: j.company,
          experience: j.experience,
          location: j.location,
          type: j.type,
          category: j.category,
          tags: j.tags,
          description: j.description,
          isNew: j.isNew,
          status: j.status,
          applicantsCount: j.applicantsCount,
        }));
        setJobs(mapped);
        setStored(STORAGE_KEYS.JOBS, mapped);
      }

      if (remoteApplicants.status === 'fulfilled' && Array.isArray(remoteApplicants.value)) {
        const mapped = remoteApplicants.value.map((a) => ({
          id: a.applicantId || a._id,
          jobId: a.jobId,
          jobTitle: a.jobTitle,
          candidateName: a.candidateName,
          email: a.email,
          phone: a.phone,
          experience: a.experience,
          currentCompany: a.currentCompany,
          status: a.status,
          notes: a.notes || '',
          resumeFileName: a.resumeFileName,
          resumeUrl: a.resumeUrl,
          date: a.formattedDate || new Date(a.createdAt).toLocaleString(),
        }));
        const remoteIds = new Set(mapped.map((m) => m.id));
        const remoteEmails = new Set(mapped.map((m) => (m.email || '').toLowerCase()));
        const localCurrent = getStored(STORAGE_KEYS.APPLICANTS, []);
        const unSynced = localCurrent.filter(
          (loc) => !remoteIds.has(loc.id) && !remoteEmails.has((loc.email || '').toLowerCase())
        );
        const merged = [...mapped, ...unSynced];
        setApplicants(merged);
        setStored(STORAGE_KEYS.APPLICANTS, merged);
      }

      if (remoteResumes.status === 'fulfilled' && Array.isArray(remoteResumes.value)) {
        const mapped = remoteResumes.value.map((r) => ({
          id: r.resumeId || r._id,
          candidateName: r.candidateName,
          email: r.email,
          phone: r.phone,
          category: r.category,
          experience: r.experience,
          fileName: r.fileName,
          fileUrl: r.fileUrl,
          status: r.status || 'New',
          notes: r.notes || '',
          date: r.formattedDate || new Date(r.createdAt).toLocaleString(),
        }));
        const remoteIds = new Set(mapped.map((m) => m.id));
        const remoteEmails = new Set(mapped.map((m) => (m.email || '').toLowerCase()));
        const localCurrent = getStored(STORAGE_KEYS.RESUMES, []);
        const unSynced = localCurrent.filter(
          (loc) => !remoteIds.has(loc.id) && !remoteEmails.has((loc.email || '').toLowerCase())
        );
        const merged = [...mapped, ...unSynced];
        setResumes(merged);
        setStored(STORAGE_KEYS.RESUMES, merged);
      }

      if (remoteTeam.status === 'fulfilled' && remoteTeam.value?.length) {
        const mapped = remoteTeam.value.map((m) => ({
          id: m.memberId || m._id,
          name: m.name,
          role: m.role,
          quote: m.quote,
          image: m.image,
        }));
        setTeam(mapped);
        setStored(STORAGE_KEYS.TEAM, mapped);
      }

      if (remoteStats.status === 'fulfilled' && remoteStats.value) {
        setStats(remoteStats.value);
        setStored(STORAGE_KEYS.STATS, remoteStats.value);
      }

      if (remoteUsers.status === 'fulfilled' && Array.isArray(remoteUsers.value)) {
        setUsers(remoteUsers.value);
      }

      if (remoteTestimonials.status === 'fulfilled' && remoteTestimonials.value?.length) {
        setTestimonials(remoteTestimonials.value);
        setStored(STORAGE_KEYS.TESTIMONIALS, remoteTestimonials.value);
      }

      if (remoteFaqs.status === 'fulfilled' && remoteFaqs.value?.length) {
        setFaqs(remoteFaqs.value);
        setStored(STORAGE_KEYS.FAQS, remoteFaqs.value);
      }
    } catch (err) {
      console.warn('MongoDB sync note:', err.message);
    }
  }, []);

  useEffect(() => {
    initAdminStore();
    if (isAuthenticated) {
      fetchMongoData();
    }

    const handleSubmissionEvent = () => {
      fetchMongoData();
    };
    window.addEventListener('interskill:submission-saved', handleSubmissionEvent);
    return () => {
      window.removeEventListener('interskill:submission-saved', handleSubmissionEvent);
    };
  }, [isAuthenticated, fetchMongoData]);

  // Handlers for state updates with MongoDB Atlas synchronization
  const handleUpdateLeadStatus = async (id, newStatus) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
    setLeads(updated);
    setStored(STORAGE_KEYS.EMPLOYER_LEADS, updated);
    try {
      await api.updateLeadStatus(id, newStatus);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleDeleteLead = async (id) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    setStored(STORAGE_KEYS.EMPLOYER_LEADS, updated);
    try {
      await api.deleteLead(id);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleUpdateCallbackStatus = async (id, newStatus) => {
    const updated = callbacks.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
    setCallbacks(updated);
    setStored(STORAGE_KEYS.CALLBACKS, updated);
    try {
      await api.updateCallbackStatus(id, newStatus);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleDeleteCallback = async (id) => {
    const updated = callbacks.filter((c) => c.id !== id);
    setCallbacks(updated);
    setStored(STORAGE_KEYS.CALLBACKS, updated);
    try {
      await api.deleteCallback(id);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleUpdateConsultationStatus = async (id, newStatus) => {
    const updated = consultations.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
    setConsultations(updated);
    setStored(STORAGE_KEYS.CONSULTATIONS, updated);
    try {
      await api.updateConsultationStatus(id, newStatus);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleDeleteConsultation = async (id) => {
    const updated = consultations.filter((c) => c.id !== id);
    setConsultations(updated);
    setStored(STORAGE_KEYS.CONSULTATIONS, updated);
    try {
      await api.deleteConsultation(id);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleSaveJob = async (job) => {
    const exists = jobs.some((j) => j.id === job.id);
    let updated;
    if (exists) {
      updated = jobs.map((j) => (j.id === job.id ? job : j));
    } else {
      updated = [job, ...jobs];
    }
    setJobs(updated);
    setStored(STORAGE_KEYS.JOBS, updated);
    try {
      if (exists) {
        await api.updateJob(job.id, job);
      } else {
        await api.createJob(job);
      }
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleDeleteJob = async (id) => {
    const updated = jobs.filter((j) => j.id !== id);
    setJobs(updated);
    setStored(STORAGE_KEYS.JOBS, updated);
    try {
      await api.deleteJob(id);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleUpdateApplicantStatus = async (id, newStatus) => {
    const updated = applicants.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    setApplicants(updated);
    setStored(STORAGE_KEYS.APPLICANTS, updated);
    try {
      await api.updateApplicantStatus(id, newStatus);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleDeleteApplicant = async (id) => {
    const updated = applicants.filter((a) => a.id !== id);
    setApplicants(updated);
    setStored(STORAGE_KEYS.APPLICANTS, updated);
    try {
      await api.deleteApplicant(id);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleDeleteResume = async (id) => {
    const updated = resumes.filter((r) => r.id !== id);
    setResumes(updated);
    setStored(STORAGE_KEYS.RESUMES, updated);
    try {
      await api.deleteResume(id);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleSaveTeam = async (newTeam) => {
    setTeam(newTeam);
    setStored(STORAGE_KEYS.TEAM, newTeam);
    try {
      await api.saveTeam(newTeam);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleSaveStats = async (newStats) => {
    setStats(newStats);
    setStored(STORAGE_KEYS.STATS, newStats);
    try {
      await api.saveStats(newStats);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleSaveTestimonials = async (newTestimonials) => {
    setTestimonials(newTestimonials);
    setStored(STORAGE_KEYS.TESTIMONIALS, newTestimonials);
    try {
      await api.saveTestimonials(newTestimonials);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  const handleSaveFaqs = async (newFaqs) => {
    setFaqs(newFaqs);
    setStored(STORAGE_KEYS.FAQS, newFaqs);
    try {
      await api.saveFaqs(newFaqs);
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e.message);
    }
  };

  // User Access Management Handlers
  const handleAddUser = async (userData) => {
    const newUser = await api.createUser(userData);
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleUpdateUser = async (id, data) => {
    const updated = await api.updateUser(id, data);
    setUsers((prev) => prev.map((u) => (u._id === id || u.id === id ? { ...u, ...updated } : u)));
  };

  const handleDeleteUser = async (id) => {
    await api.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u._id !== id && u.id !== id));
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleNavigateTab = (tab, options = {}) => {
    setActiveTab(tab);
    setTabOptions(options);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If not authenticated, display login & setup gate
  if (!isAuthenticated) {
    return (
      <AdminAuthModal
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
          fetchMongoData();
        }}
        onCancel={() => onNavigate && onNavigate('home')}
      />
    );
  }

  // Badge calculations
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const pendingCallbacks = callbacks.filter((c) => c.status === 'Pending').length;
  const newApplicants = applicants.filter((a) => a.status === 'New').length;

  // View title helper
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Executive Overview', subtitle: 'Real-time performance and incoming business leads' };
      case 'employer-leads':
        return { title: 'Employer Inquiries', subtitle: 'Manage corporate hiring requirements' };
      case 'callbacks':
        return { title: 'Callback Requests', subtitle: 'High-priority phone assistance queue' };
      case 'job-board':
        return { title: 'Job Postings Manager', subtitle: 'Publish and manage live opportunities' };
      case 'applicants':
        return { title: 'Candidate Pipeline', subtitle: 'Applications for open positions' };
      case 'consultations':
        return { title: 'Free Consultation Leads', subtitle: 'Website advisory requests' };
      case 'resumes':
        return { title: 'Candidate Resume Bank', subtitle: 'General submissions talent pool' };
      case 'cms':
        return { title: 'Website Content & Team', subtitle: 'Manage leadership team and site metrics' };
      case 'users':
        return { title: 'Team Access & Permissions', subtitle: 'Manage administrators and recruiter accounts' };
      default:
        return { title: 'Admin Portal', subtitle: 'Interskill Staffing Solutions' };
    }
  };

  const currentMeta = getTabTitle();

  return (
    <div className="adm-layout">
      {/* Sidebar Navigation */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar__brand">
          <div className="adm-sidebar__logo-title">
            <ShieldCheck size={22} color="#DDB568" />
            <span>INTERSKILL</span>
          </div>
          <span className="adm-sidebar__logo-tag">{currentUser?.role === 'admin' ? 'Admin' : 'Recruiter'}</span>
        </div>

        <nav className="adm-sidebar__nav">
          <div className="adm-nav-heading">Main Navigation</div>

          <button
            className={`adm-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigateTab('dashboard')}
          >
            <div className="adm-nav-item__left">
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </div>
          </button>

          <div className="adm-nav-heading">Employer & Lead Inquiries</div>

          <button
            className={`adm-nav-item ${activeTab === 'employer-leads' ? 'active' : ''}`}
            onClick={() => handleNavigateTab('employer-leads')}
          >
            <div className="adm-nav-item__left">
              <Building2 size={17} />
              <span>Employer Leads</span>
            </div>
            {newLeads > 0 && <span className="adm-badge-count">{newLeads}</span>}
          </button>

          <button
            className={`adm-nav-item ${activeTab === 'callbacks' ? 'active' : ''}`}
            onClick={() => handleNavigateTab('callbacks')}
          >
            <div className="adm-nav-item__left">
              <PhoneCall size={17} />
              <span>Callback Queue</span>
            </div>
            {pendingCallbacks > 0 && (
              <span className="adm-badge-count adm-badge-count--alert">{pendingCallbacks}</span>
            )}
          </button>

          <button
            className={`adm-nav-item ${activeTab === 'consultations' ? 'active' : ''}`}
            onClick={() => handleNavigateTab('consultations')}
          >
            <div className="adm-nav-item__left">
              <MessageSquare size={17} />
              <span>Consultations</span>
            </div>
          </button>

          <div className="adm-nav-heading">Recruitment & Candidates</div>

          <button
            className={`adm-nav-item ${activeTab === 'job-board' ? 'active' : ''}`}
            onClick={() => handleNavigateTab('job-board')}
          >
            <div className="adm-nav-item__left">
              <Briefcase size={17} />
              <span>Job Postings</span>
            </div>
            <span style={{ fontSize: '11px', color: '#8899A6' }}>{jobs.length}</span>
          </button>

          <button
            className={`adm-nav-item ${activeTab === 'applicants' ? 'active' : ''}`}
            onClick={() => handleNavigateTab('applicants')}
          >
            <div className="adm-nav-item__left">
              <Users size={17} />
              <span>Applicants</span>
            </div>
            {newApplicants > 0 && <span className="adm-badge-count">{newApplicants}</span>}
          </button>

          <button
            className={`adm-nav-item ${activeTab === 'resumes' ? 'active' : ''}`}
            onClick={() => handleNavigateTab('resumes')}
          >
            <div className="adm-nav-item__left">
              <FileText size={17} />
              <span>Resume Bank</span>
            </div>
            <span style={{ fontSize: '11px', color: '#8899A6' }}>{resumes.length}</span>
          </button>

          <div className="adm-nav-heading">Site Management</div>

          <button
            className={`adm-nav-item ${activeTab === 'cms' ? 'active' : ''}`}
            onClick={() => handleNavigateTab('cms')}
          >
            <div className="adm-nav-item__left">
              <Settings size={17} />
              <span>Team & Metrics</span>
            </div>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              className={`adm-nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => handleNavigateTab('users')}
            >
              <div className="adm-nav-item__left">
                <UserCheck size={17} />
                <span>Team Access</span>
              </div>
              <span style={{ fontSize: '11px', color: '#8899A6' }}>{users.length}</span>
            </button>
          )}
        </nav>

        <div className="adm-sidebar__footer">
          <button
            className="adm-btn-website"
            onClick={() => onNavigate && onNavigate('home')}
          >
            <ExternalLink size={14} />
            <span>Public Website</span>
          </button>
          <button
            className="adm-btn-website"
            onClick={handleLogout}
            style={{ marginTop: '8px', color: '#FCA5A5' }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="adm-main">
        {/* Topbar */}
        <header className="adm-topbar">
          <div className="adm-topbar__title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1>{currentMeta.title}</h1>
              {mongoConnected && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#ECFDF5',
                    color: '#065F46',
                    border: '1px solid #A7F3D0',
                    borderRadius: '20px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                  title="Connected to MongoDB Atlas: interskillDB"
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      display: 'inline-block',
                    }}
                  />
                  <span>MongoDB Atlas</span>
                </div>
              )}
            </div>
            <p>{currentMeta.subtitle}</p>
          </div>

          <div className="adm-topbar__actions">
            <button
              className="adm-btn-action adm-btn-secondary"
              onClick={() => onNavigate && onNavigate('home')}
            >
              <ExternalLink size={13} /> Public Site
            </button>

            <div className="adm-user-profile">
              <div className="adm-user-avatar">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'IS'}
              </div>
              <div className="adm-user-meta">
                <span className="adm-user-meta__name">{currentUser?.name || 'Interskill User'}</span>
                <span className="adm-user-meta__role">
                  {currentUser?.role === 'admin' ? 'Master Admin' : 'Recruitment Specialist'}
                </span>
              </div>
              <button
                type="button"
                className="adm-action-icon-btn"
                onClick={handleLogout}
                title="Log Out"
                style={{ marginLeft: '10px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="adm-content">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              leads={leads}
              jobs={jobs}
              applicants={applicants}
              callbacks={callbacks}
              consultations={consultations}
              resumes={resumes}
              onNavigateTab={handleNavigateTab}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onUpdateCallbackStatus={handleUpdateCallbackStatus}
            />
          )}

          {activeTab === 'employer-leads' && (
            <EmployerLeadsView
              leads={leads}
              onUpdateStatus={handleUpdateLeadStatus}
              onDeleteLead={handleDeleteLead}
            />
          )}

          {activeTab === 'callbacks' && (
            <CallbacksView
              callbacks={callbacks}
              onUpdateStatus={handleUpdateCallbackStatus}
              onDeleteCallback={handleDeleteCallback}
            />
          )}

          {activeTab === 'job-board' && (
            <JobBoardView
              jobs={jobs}
              applicants={applicants}
              onSaveJob={handleSaveJob}
              onDeleteJob={handleDeleteJob}
              initialOpenAdd={tabOptions.openAddModal}
            />
          )}

          {activeTab === 'applicants' && (
            <ApplicantsView
              applicants={applicants}
              jobs={jobs}
              onUpdateStatus={handleUpdateApplicantStatus}
              onDeleteApplicant={handleDeleteApplicant}
            />
          )}

          {activeTab === 'consultations' && (
            <ConsultationsView
              consultations={consultations}
              onUpdateStatus={handleUpdateConsultationStatus}
              onDeleteConsultation={handleDeleteConsultation}
            />
          )}

          {activeTab === 'resumes' && (
            <ResumeBankView
              resumes={resumes}
              onDeleteResume={handleDeleteResume}
            />
          )}

          {activeTab === 'cms' && (
            <WebsiteCMSView
              team={team}
              stats={stats}
              testimonials={testimonials}
              faqs={faqs}
              onSaveTeam={handleSaveTeam}
              onSaveStats={handleSaveStats}
              onSaveTestimonials={handleSaveTestimonials}
              onSaveFaqs={handleSaveFaqs}
            />
          )}

          {activeTab === 'users' && (
            <UsersView
              users={users}
              currentUser={currentUser}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </main>
      </div>
    </div>
  );
}
