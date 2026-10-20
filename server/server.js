import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import leadsRouter from './routes/leads.js';
import callbacksRouter from './routes/callbacks.js';
import consultationsRouter from './routes/consultations.js';
import jobsRouter from './routes/jobs.js';
import applicantsRouter from './routes/applicants.js';
import resumesRouter from './routes/resumes.js';
import cmsRouter from './routes/cms.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';

import Job from './models/Job.js';
import TeamMember from './models/TeamMember.js';
import SiteStats from './models/SiteStats.js';
import Testimonial from './models/Testimonial.js';
import Faq from './models/Faq.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seed helper if DB is fresh
const seedInitialDatabase = async () => {
  try {
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      console.log('[Database Seed]: Seeding default jobs...');
      await Job.insertMany([
        {
          jobId: 'job-1',
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
          jobId: 'job-2',
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
          jobId: 'job-3',
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
          jobId: 'job-4',
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
      ]);
    }

    const teamCount = await TeamMember.countDocuments();
    if (teamCount === 0) {
      console.log('[Database Seed]: Seeding default leadership team...');
      await TeamMember.insertMany([
        {
          memberId: 'team-priya',
          name: 'Dr Priya Gawade',
          role: 'CEO of Interskill Solutions & Interskill Staffing Solutions',
          quote: 'People are not just resources; they are the real growth engines of any business.',
          image: '/images/team-priya.jpg',
          order: 0,
        },
        {
          memberId: 'team-shreyash',
          name: 'Shreyash Shirekar',
          role: 'Talent Acquisition & Business Development',
          quote: 'The right talent doesn’t just fill a role; it builds a future.',
          image: '/images/team-shreyash.jpg',
          order: 1,
        },
        {
          memberId: 'team-madhubabu',
          name: 'Madhubabu Gentyala',
          role: 'IT & Technology Talent Specialist',
          quote: 'Connecting the right technical talent with opportunities to grow, innovate and succeed.',
          image: '/images/team-madhubabu.png',
          order: 2,
        },
        {
          memberId: 'team-sahil',
          name: 'Sahil More',
          role: 'Cybersecurity Talent Specialist',
          quote: 'Building stronger digital teams by connecting cybersecurity talent with the right opportunities.',
          image: '/images/team-sahil.jpg',
          order: 3,
        },
        {
          memberId: 'team-yash',
          name: 'Yash Diwate',
          role: 'Digital Marketing & Creative Talent Specialist',
          quote: 'Great ideas begin with great people; connecting creative talent creates meaningful impact.',
          image: '/images/team-yash.jpg',
          order: 4,
        },
        {
          memberId: 'team-priyanka',
          name: 'Priyanka Ghuhagarkar',
          role: 'Branch Operations Manager',
          quote: 'Strong operations, teamwork and trust are the foundation of excellent service.',
          image: '/images/team-priyanka.png',
          order: 5,
        },
      ]);
    }

    const statsExist = await SiteStats.findOne({ key: 'global_stats' });
    if (!statsExist) {
      console.log('[Database Seed]: Initializing default site statistics...');
      await SiteStats.create({
        key: 'global_stats',
        industryFocus: '600+',
        professionalsConnected: '10000+',
        phone1: '9819461050',
        phone2: '8591207594',
        email1: 'shreyashhrinterskillsolutions@gmail.com',
        email2: 'interskillsolutions@gmail.com',
        address: '104, Jaganath Tower, above Parijat Sweets, Opp Nerul Railway Station (West), Sector 20.',
      });
    }

    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
      console.log('[Database Seed]: Seeding default testimonials...');
      await Testimonial.insertMany([
        {
          testimonialId: 'test-1',
          name: 'Rohit Patil',
          role: 'Placed as Software Developer',
          quote: 'Interskill helped me find the right opportunity and supported me throughout the process. Highly professional and responsive team!',
          rating: 5,
          image: '/images/testimonial-rohit.png',
          order: 0,
        },
        {
          testimonialId: 'test-2',
          name: 'Sneha Iyer',
          role: 'HR Manager, Growing Tech Pvt. Ltd.',
          quote: 'The team understood our hiring needs and provided quality candidates within a short time. Excellent support and communication.',
          rating: 5,
          image: '/images/testimonial-sneha.png',
          order: 1,
        },
      ]);
    }

    const faqCount = await Faq.countDocuments();
    if (faqCount === 0) {
      console.log('[Database Seed]: Seeding default FAQs...');
      await Faq.insertMany([
        {
          faqId: 'faq-1',
          question: '1. What services does Interskill Staffing Solutions offer?',
          answer: 'Interskill Staffing Solutions provides end-to-end recruitment and workforce solutions, connecting companies with vetted talent across IT, HR, Finance, Engineering, and Corporate Support roles, while assisting job seekers with career placement and guidance.',
          order: 0,
        },
        {
          faqId: 'faq-2',
          question: '2. Do you provide recruitment services for companies?',
          answer: 'Yes, we provide end-to-end hiring services for companies of all sizes, from candidate sourcing and screening to interview coordination and offer management across multiple professional sectors.',
          order: 1,
        },
        {
          faqId: 'faq-3',
          question: '3. Can freshers register for job opportunities?',
          answer: 'Absolutely. We actively support fresh graduates and entry-level candidates by helping them identify suitable career paths and connecting them with employers open to fresher talent.',
          order: 2,
        },
        {
          faqId: 'faq-4',
          question: '4. Is candidate registration free?',
          answer: 'Yes, candidate registration, job application, and placement support for job seekers are completely free of charge. We never charge candidates for recruitment assistance.',
          order: 3,
        },
        {
          faqId: 'faq-5',
          question: '5. Which industries and job roles do you support?',
          answer: 'We specialize in IT & Technology, Business Support & Corporate Roles, HR & Talent Acquisition, Finance, Accounting & Research, and Engineering & Civil sectors.',
          order: 4,
        },
        {
          faqId: 'faq-6',
          question: '6. How can I get started with Interskill Staffing Solutions?',
          answer: 'You can submit your resume via the "For Job Seekers" section, request a free consultation through our form, or contact our advisory team directly via phone or email.',
          order: 5,
        },
      ]);
    }
  } catch (err) {
    console.error('[Database Seed Error]:', err.message);
  }
};

// API Routes
app.use('/api/leads', leadsRouter);
app.use('/api/callbacks', callbacksRouter);
app.use('/api/consultations', consultationsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/applicants', applicantsRouter);
app.use('/api/resumes', resumesRouter);
app.use('/api/cms', cmsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// Health check and root endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Interskill Staffing Solutions Backend API',
    documentation: 'Connected to MongoDB Atlas and Cloudinary',
    endpoints: {
      health: '/api/health',
      jobs: '/api/jobs',
      leads: '/api/leads',
      callbacks: '/api/callbacks',
      consultations: '/api/consultations',
      applicants: '/api/applicants',
      resumes: '/api/resumes',
      cms: '/api/cms',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: 'connected', timestamp: new Date() });
});

// Start Server & Connect MongoDB Atlas (Standalone PM2 / Node mode)
if (!process.env.VERCEL) {
  connectDB().then(() => {
    seedInitialDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 [Interskill Backend API running on port ${PORT}]`);
      console.log(`📡 [Connected to MongoDB Atlas: interskillDB]`);
    });
  });
}

export default app;
