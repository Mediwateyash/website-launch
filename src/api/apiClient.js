// Frontend API Client for Interskill Staffing Solutions (MongoDB Atlas & Node.js API)

const getApiBase = () => {
  const customUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (!customUrl) return '/api';
  const trimmed = customUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_BASE = getApiBase();

const TOKEN_KEY = 'interskill_admin_token';
const USER_KEY = 'interskill_admin_user';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthSession = (token, user) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};
export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
export const getCachedUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getAuthHeaders = (extraHeaders = {}) => {
  const token = getAuthToken();
  const headers = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  if (!res.ok) {
    let errorMsg = `API Error: ${res.status}`;
    try {
      const data = await res.json();
      if (data && data.message) errorMsg = data.message;
    } catch {
      const text = await res.text();
      if (text) errorMsg = text;
    }
    throw new Error(errorMsg);
  }
  return res.json();
};

export const api = {
  // Authentication & Session
  getSetupStatus: async () => {
    const res = await fetch(`${API_BASE}/auth/setup-status`);
    return handleResponse(res);
  },
  setupAdmin: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(res);
    if (data.token) setAuthSession(data.token, data);
    return data;
  },
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(res);
    if (data.token) setAuthSession(data.token, data);
    return data;
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  updatePassword: async (passwords) => {
    const res = await fetch(`${API_BASE}/auth/update-password`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(passwords),
    });
    return handleResponse(res);
  },
  logout: () => {
    clearAuthSession();
  },

  // User Management (Admin & Recruiter Access)
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  createUser: async (userData) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },
  updateUser: async (id, data) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteUser: async (id) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Employer Leads
  getLeads: async () => {
    const res = await fetch(`${API_BASE}/leads`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  createLead: async (data) => {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateLead: async (id, data) => {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateLeadStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/leads/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },
  deleteLead: async (id) => {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Callbacks
  getCallbacks: async () => {
    const res = await fetch(`${API_BASE}/callbacks`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  createCallback: async (data) => {
    const res = await fetch(`${API_BASE}/callbacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateCallback: async (id, data) => {
    const res = await fetch(`${API_BASE}/callbacks/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateCallbackStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/callbacks/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },
  deleteCallback: async (id) => {
    const res = await fetch(`${API_BASE}/callbacks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Consultations
  getConsultations: async () => {
    const res = await fetch(`${API_BASE}/consultations`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  createConsultation: async (data) => {
    const res = await fetch(`${API_BASE}/consultations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateConsultation: async (id, data) => {
    const res = await fetch(`${API_BASE}/consultations/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateConsultationStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/consultations/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },
  deleteConsultation: async (id) => {
    const res = await fetch(`${API_BASE}/consultations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Jobs
  getJobs: async (status) => {
    const url = status ? `${API_BASE}/jobs?status=${status}` : `${API_BASE}/jobs`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  createJob: async (jobData) => {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(jobData),
    });
    return handleResponse(res);
  },
  updateJob: async (id, jobData) => {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(jobData),
    });
    return handleResponse(res);
  },
  deleteJob: async (id) => {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Applicants
  getApplicants: async () => {
    const res = await fetch(`${API_BASE}/applicants`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  createApplicant: async (formDataOrObj) => {
    const isFormData = formDataOrObj instanceof FormData;
    const res = await fetch(`${API_BASE}/applicants`, {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? formDataOrObj : JSON.stringify(formDataOrObj),
    });
    return handleResponse(res);
  },
  updateApplicant: async (id, data) => {
    const res = await fetch(`${API_BASE}/applicants/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateApplicantStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/applicants/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },
  deleteApplicant: async (id) => {
    const res = await fetch(`${API_BASE}/applicants/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Resumes
  getResumes: async () => {
    const res = await fetch(`${API_BASE}/resumes`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  createResume: async (formDataOrObj) => {
    const isFormData = formDataOrObj instanceof FormData;
    const res = await fetch(`${API_BASE}/resumes`, {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? formDataOrObj : JSON.stringify(formDataOrObj),
    });
    return handleResponse(res);
  },
  updateResume: async (id, data) => {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteResume: async (id) => {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Website CMS
  getTeam: async () => {
    const res = await fetch(`${API_BASE}/cms/team`);
    return handleResponse(res);
  },
  saveTeam: async (team) => {
    const res = await fetch(`${API_BASE}/cms/team`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ team }),
    });
    return handleResponse(res);
  },
  getStats: async () => {
    const res = await fetch(`${API_BASE}/cms/stats`);
    return handleResponse(res);
  },
  saveStats: async (stats) => {
    const res = await fetch(`${API_BASE}/cms/stats`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(stats),
    });
    return handleResponse(res);
  },
  getTestimonials: async () => {
    const res = await fetch(`${API_BASE}/cms/testimonials`);
    return handleResponse(res);
  },
  saveTestimonials: async (testimonials) => {
    const res = await fetch(`${API_BASE}/cms/testimonials`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ testimonials }),
    });
    return handleResponse(res);
  },
  getFaqs: async () => {
    const res = await fetch(`${API_BASE}/cms/faqs`);
    return handleResponse(res);
  },
  saveFaqs: async (faqs) => {
    const res = await fetch(`${API_BASE}/cms/faqs`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ faqs }),
    });
    return handleResponse(res);
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/cms/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(res);
  },
  resolveFileUrl: (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const base = API_BASE.replace('/api', '');
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  },
  getResumeFileUrl: (candidate, download = false) => {
    if (!candidate) return '';
    const candidateId = candidate._id || candidate.id || candidate.resumeId || candidate.applicantId;
    const isApplicant = candidate._type === 'Job Applicant' || !!candidate.jobId || !!candidate.applicantId;
    const path = isApplicant ? 'applicants' : 'resumes';
    if (candidateId) {
      return `${API_BASE}/${path}/${candidateId}/file${download ? '?download=1' : ''}`;
    }
    const rawUrl = candidate.fileUrl || candidate.resumeUrl || candidate._url || '';
    return api.resolveFileUrl(rawUrl);
  },
};
