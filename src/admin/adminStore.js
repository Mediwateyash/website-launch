// Central Data Store for Interskill Admin Panel with localStorage persistence

const STORAGE_KEYS = {
  EMPLOYER_LEADS: 'interskill_admin_employer_leads',
  CALLBACKS: 'interskill_admin_callbacks',
  CONSULTATIONS: 'interskill_admin_consultations',
  JOBS: 'interskill_admin_jobs',
  APPLICANTS: 'interskill_admin_applicants',
  RESUMES: 'interskill_admin_resumes',
  TEAM: 'interskill_admin_team',
  STATS: 'interskill_admin_stats',
  TESTIMONIALS: 'interskill_admin_testimonials',
  FAQS: 'interskill_admin_faqs',
  ADMIN_USER: 'interskill_admin_user',
};

// Initial Seed Data
const initialEmployerLeads = [
  {
    id: 'LEAD-101',
    name: 'Vikram Singhania',
    company: 'Apex Cloud Solutions',
    phone: '9820123456',
    email: 'vikram.s@apexcloud.com',
    category: 'IT & Technology',
    openings: '3-5',
    description: 'Looking for 3 Senior Full Stack React/Node developers with 4+ years experience in Mumbai.',
    status: 'New',
    date: '2026-10-16 11:30 AM',
  },
  {
    id: 'LEAD-102',
    name: 'Anjali Sharma',
    company: 'Sterling Global Infra',
    phone: '9833445566',
    email: 'anjali@sterlinginfra.in',
    category: 'Engineering & Civil',
    openings: '1-2',
    description: 'Urgent requirement for Senior Site Civil Engineer for Navi Mumbai metro project.',
    status: 'Contacted',
    date: '2026-10-15 04:15 PM',
  },
  {
    id: 'LEAD-103',
    name: 'Karan Malhotra',
    company: 'FinPulse Advisory',
    phone: '9920887766',
    email: 'karan@finpulse.org',
    category: 'Finance, Accounting & Research',
    openings: '1-2',
    description: 'Senior Chartered Accountant with 3-5 years post qualification experience.',
    status: 'Profiles Shared',
    date: '2026-10-14 02:40 PM',
  },
  {
    id: 'LEAD-104',
    name: 'Pooja Iyer',
    company: 'TalentFirst Pvt Ltd',
    phone: '9769123890',
    email: 'pooja.i@talentfirst.com',
    category: 'Human Resources',
    openings: '3-5',
    description: 'Recruitment executives for non-IT and engineering bulk hiring support.',
    status: 'Closed',
    date: '2026-10-12 10:10 AM',
  },
];

const initialCallbacks = [
  {
    id: 'CB-201',
    name: 'Rohan Mehra',
    mobile: '9819123456',
    topic: 'Hiring requirements',
    source: 'Homepage Callback Banner',
    status: 'Pending',
    date: '2026-10-16 01:20 PM',
  },
  {
    id: 'CB-202',
    name: 'Sneha Patil',
    mobile: '9867456789',
    topic: 'Human Resources',
    source: 'Job Seekers Page',
    status: 'Pending',
    date: '2026-10-16 10:45 AM',
  },
  {
    id: 'CB-203',
    name: 'Manish Joshi',
    mobile: '9702334455',
    topic: 'IT & Technology',
    source: 'Employer Page Banner',
    status: 'Contacted',
    date: '2026-10-15 03:00 PM',
  },
  {
    id: 'CB-204',
    name: 'Deepak Sawant',
    mobile: '9820998877',
    topic: 'General enquiry',
    source: 'Homepage Callback Banner',
    status: 'Closed',
    date: '2026-10-14 11:15 AM',
  },
];

const initialConsultations = [
  {
    id: 'CON-301',
    name: 'Arjun Deshmukh',
    phone: '9811223344',
    email: 'arjun.d@tcsgroup.com',
    requirementType: 'I am hiring for my company',
    preferredRole: 'IT & Software Development',
    status: 'New',
    date: '2026-10-16 09:30 AM',
  },
  {
    id: 'CON-302',
    name: 'Kavita Nair',
    phone: '9833778899',
    email: 'kavita.nair@gmail.com',
    requirementType: 'I am looking for a job',
    preferredRole: 'Human Resources',
    status: 'Contacted',
    date: '2026-10-15 01:10 PM',
  },
];

const initialJobs = [
  {
    id: 'job-1',
    title: 'React Developer',
    isNew: true,
    company: 'TechNova Solutions',
    experience: '1 – 3 Years',
    location: 'Mumbai, Maharashtra',
    type: 'Full-Time',
    category: 'IT & Technology',
    tags: ['React', 'JavaScript', 'HTML'],
    description: 'Looking for an experienced React developer proficient in modern hooks, responsive CSS, and API integration.',
    status: 'Active',
    applicantsCount: 14,
  },
  {
    id: 'job-2',
    title: 'HR Executive',
    isNew: false,
    company: 'PeopleFirst HR',
    experience: '0 – 2 Years',
    location: 'Thane, Maharashtra',
    type: 'Full-Time',
    category: 'Human Resources',
    tags: ['HR Operations', 'Recruitment'],
    description: 'Manage full lifecycle talent acquisition, candidate screening, scheduling, and onboarding activities.',
    status: 'Active',
    applicantsCount: 22,
  },
  {
    id: 'job-3',
    title: 'Accounts Executive',
    isNew: false,
    company: 'FinEdge Consultancy',
    experience: '1 – 3 Years',
    location: 'Mumbai, Maharashtra',
    type: 'Full-Time',
    category: 'Finance & Accounting',
    tags: ['Tally', 'Accounting', 'Excel'],
    description: 'Handle general ledger, GST filing, reconciliation, and day-to-day accounts operations.',
    status: 'Active',
    applicantsCount: 9,
  },
  {
    id: 'job-4',
    title: 'Site Engineer',
    isNew: false,
    company: 'BuildRight Infra',
    experience: '2 – 5 Years',
    location: 'Navi Mumbai, Maharashtra',
    type: 'Full-Time',
    category: 'Engineering & Civil',
    tags: ['Civil', 'AutoCAD', 'Site Execution'],
    description: 'Supervise on-site construction operations, quality verification, and contractor coordination.',
    status: 'Active',
    applicantsCount: 17,
  },
];

const initialApplicants = [
  {
    id: 'APP-501',
    jobId: 'job-1',
    jobTitle: 'React Developer',
    candidateName: 'Aditya Kulkarni',
    email: 'aditya.k@gmail.com',
    phone: '9820445566',
    experience: '2 Years',
    currentCompany: 'WebCraft Studios',
    status: 'Interview Scheduled',
    resumeFileName: 'Aditya_Kulkarni_Resume.pdf',
    date: '2026-10-15 02:15 PM',
  },
  {
    id: 'APP-502',
    jobId: 'job-1',
    jobTitle: 'React Developer',
    candidateName: 'Tanvi Shinde',
    email: 'tanvi.shinde@outlook.com',
    phone: '9819776655',
    experience: '1.5 Years',
    currentCompany: 'NextGen Apps',
    status: 'Screened',
    resumeFileName: 'Tanvi_React_Resume.pdf',
    date: '2026-10-15 04:30 PM',
  },
  {
    id: 'APP-503',
    jobId: 'job-2',
    jobTitle: 'HR Executive',
    candidateName: 'Pallavi Rao',
    email: 'pallavi.rao@gmail.com',
    phone: '9920112233',
    experience: '1 Year',
    currentCompany: 'TalentSphere HR',
    status: 'Shortlisted',
    resumeFileName: 'Pallavi_HR_Resume.pdf',
    date: '2026-10-14 11:00 AM',
  },
  {
    id: 'APP-504',
    jobId: 'job-3',
    jobTitle: 'Accounts Executive',
    candidateName: 'Suresh Bhat',
    email: 'suresh.bhat@yahoo.com',
    phone: '9867889900',
    experience: '3 Years',
    currentCompany: 'Apex Financial Services',
    status: 'New',
    resumeFileName: 'Suresh_Accounts.pdf',
    date: '2026-10-16 09:45 AM',
  },
];

const initialResumes = [
  {
    id: 'RES-601',
    candidateName: 'Rahul Verma',
    email: 'rahul.verma@gmail.com',
    phone: '9820556677',
    category: 'IT & Technology',
    experience: '3 Years',
    fileName: 'Rahul_Verma_FullStack.pdf',
    date: '2026-10-16 12:10 PM',
  },
  {
    id: 'RES-602',
    candidateName: 'Divya Nair',
    email: 'divya.nair@gmail.com',
    phone: '9819334455',
    category: 'Human Resources',
    experience: 'Fresh Graduate',
    fileName: 'Divya_Nair_MBA_HR.pdf',
    date: '2026-10-15 05:20 PM',
  },
  {
    id: 'RES-603',
    candidateName: 'Amit Gokhale',
    email: 'amit.g@rediffmail.com',
    phone: '9930441122',
    category: 'Finance & Accounting',
    experience: '4 Years',
    fileName: 'Amit_Gokhale_Finance.pdf',
    date: '2026-10-14 03:15 PM',
  },
];

const initialTeam = [
  {
    id: 'team-priya',
    name: 'Dr Priya Gawade',
    role: 'CEO of Interskill Solutions & Interskill Staffing Solutions',
    quote: 'People are not just resources; they are the real growth engines of any business.',
    image: '/images/team-priya.jpg',
  },
  {
    id: 'team-shreyash',
    name: 'Shreyash Shirekar',
    role: 'Talent Acquisition & Business Development',
    quote: 'The right talent doesn’t just fill a role; it builds a future.',
    image: '/images/team-shreyash.jpg',
  },
  {
    id: 'team-madhubabu',
    name: 'Madhubabu Gentyala',
    role: 'IT & Technology Talent Specialist',
    quote: 'Connecting the right technical talent with opportunities to grow, innovate and succeed.',
    image: '/images/team-madhubabu.png',
  },
  {
    id: 'team-sahil',
    name: 'Sahil More',
    role: 'Cybersecurity Talent Specialist',
    quote: 'Building stronger digital teams by connecting cybersecurity talent with the right opportunities.',
    image: '/images/team-sahil.jpg',
  },
  {
    id: 'team-yash',
    name: 'Yash Diwate',
    role: 'Digital Marketing & Creative Talent Specialist',
    quote: 'Great ideas begin with great people; connecting creative talent creates meaningful impact.',
    image: '/images/team-yash.jpg',
  },
  {
    id: 'team-priyanka',
    name: 'Priyanka Ghuhagarkar',
    role: 'Branch Operations Manager',
    quote: 'Strong operations, teamwork and trust are the foundation of excellent service.',
    image: '/images/team-priyanka.png',
  },
];

const initialStats = {
  industryFocus: '600+',
  professionalsConnected: '10000+',
  trustedTag: 'Trusted',
  phone1: '9819461050',
  phone2: '8591207594',
  email1: 'shreyashhrinterskillsolutions@gmail.com',
  email2: 'interskillsolutions@gmail.com',
  address: '104, Jaganath Tower, above Parijat Sweets, Opp Nerul Railway Station (West), Sector 20.',
};

const initialTestimonials = [
  {
    id: 'rohit',
    name: 'Rohit Patil',
    role: 'Placed as Software Developer',
    quote: 'Interskill helped me find the right opportunity and supported me throughout the process. Highly professional and responsive team!',
    rating: 5,
    image: '/images/testimonial-rohit.png',
  },
  {
    id: 'sneha',
    name: 'Sneha Iyer',
    role: 'HR Manager, Growing Tech Pvt. Ltd.',
    quote: 'The team understood our hiring needs and provided quality candidates within a short time. Excellent support and communication.',
    rating: 5,
    image: '/images/testimonial-sneha.png',
  },
];

const initialFaqs = [
  {
    id: 1,
    question: '1. What services does Interskill Staffing Solutions offer?',
    answer: 'Interskill Staffing Solutions provides end-to-end recruitment and workforce solutions, connecting companies with vetted talent across IT, HR, Finance, Engineering, and Corporate Support roles, while assisting job seekers with career placement and guidance.',
  },
  {
    id: 2,
    question: '2. Do you provide recruitment services for companies?',
    answer: 'Yes, we provide end-to-end hiring services for companies of all sizes, from candidate sourcing and screening to interview coordination and offer management across multiple professional sectors.',
  },
  {
    id: 3,
    question: '3. Can freshers register for job opportunities?',
    answer: 'Absolutely. We actively support fresh graduates and entry-level candidates by helping them identify suitable career paths and connecting them with employers open to fresher talent.',
  },
  {
    id: 4,
    question: '4. Is candidate registration free?',
    answer: 'Yes, candidate registration, job application, and placement support for job seekers are completely free of charge. We never charge candidates for recruitment assistance.',
  },
  {
    id: 5,
    question: '5. Which industries and job roles do you support?',
    answer: 'We specialize in IT & Technology, Business Support & Corporate Roles, HR & Talent Acquisition, Finance, Accounting & Research, and Engineering & Civil sectors.',
  },
  {
    id: 6,
    question: '6. How can I get started with Interskill Staffing Solutions?',
    answer: 'You can submit your resume via the "For Job Seekers" section, request a free consultation through our form, or contact our advisory team directly via phone or email.',
  },
];

// Storage helper functions
export const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

// Initializer
export const initAdminStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYER_LEADS)) {
    setStored(STORAGE_KEYS.EMPLOYER_LEADS, initialEmployerLeads);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CALLBACKS)) {
    setStored(STORAGE_KEYS.CALLBACKS, initialCallbacks);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONSULTATIONS)) {
    setStored(STORAGE_KEYS.CONSULTATIONS, initialConsultations);
  }
  if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
    setStored(STORAGE_KEYS.JOBS, initialJobs);
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICANTS)) {
    setStored(STORAGE_KEYS.APPLICANTS, initialApplicants);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESUMES)) {
    setStored(STORAGE_KEYS.RESUMES, initialResumes);
  }
  const storedTeam = getStored(STORAGE_KEYS.TEAM, null);
  if (!storedTeam || storedTeam.length < 6 || !storedTeam[0]?.quote) {
    setStored(STORAGE_KEYS.TEAM, initialTeam);
  }
  if (!localStorage.getItem(STORAGE_KEYS.STATS)) {
    setStored(STORAGE_KEYS.STATS, initialStats);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
    setStored(STORAGE_KEYS.TESTIMONIALS, initialTestimonials);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAQS)) {
    setStored(STORAGE_KEYS.FAQS, initialFaqs);
  }
};

export { STORAGE_KEYS };

// CSV Export Helper
export const exportToCSV = (filename, rows) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
