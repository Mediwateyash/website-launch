import express from 'express';
import https from 'https';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import cloudinary from '../config/cloudinary.js';
import Applicant from '../models/Applicant.js';
import Job from '../models/Job.js';
import { protect } from '../middleware/auth.js';
import { saveUploadedFile, getSignedCloudinaryUrl } from '../utils/fileStorage.js';

const router = express.Router();

// File upload validation filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(pdf|doc|docx)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many applications submitted. Please try again later.' },
});

// GET all applicants (Protected - only authenticated admins/recruiters)
router.get('/', protect, async (req, res) => {
  try {
    const applicants = await Applicant.find().sort({ createdAt: -1 });
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new applicant with optional Cloudinary resume upload (Public)
router.post(
  '/',
  applyLimiter,
  (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File is too large. Resume must be less than 5MB.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { jobId, jobTitle, candidateName, email, phone, experience, currentCompany } = req.body;
      if (!candidateName || !email || !phone) {
        return res.status(400).json({ message: 'Name, email, and phone are required' });
      }

      let resumeUrl = '';
      let resumeFileName = req.file ? req.file.originalname : 'Candidate_Resume.pdf';

      // Save directly to Cloudinary
      if (req.file) {
        const stored = await saveUploadedFile(req.file, 'resumes');
        resumeUrl = stored.url;
        resumeFileName = stored.fileName;
      }

    const count = await Applicant.countDocuments();
    const applicantId = `APP-${501 + count}`;
    const formattedDate = new Date().toLocaleString();

    const newApplicant = new Applicant({
      applicantId,
      jobId: jobId || 'general',
      jobTitle: jobTitle || 'General Opening',
      candidateName: candidateName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      experience: experience || '1 – 3 Years',
      currentCompany: currentCompany || 'Applicant',
      resumeUrl,
      resumeFileName,
      status: 'New',
      formattedDate,
    });

    const saved = await newApplicant.save();

    // Increment applicantsCount on the Job if valid jobId
    if (jobId) {
      await Job.findOneAndUpdate(
        { $or: [{ _id: jobId }, { jobId }] },
        { $inc: { applicantsCount: 1 } }
      ).catch(() => {});
    }

    res.status(201).json(saved);
  } catch (error) {
    console.error('Applicant submission error:', error);
    res.status(400).json({ message: error.message });
  }
});

// PATCH applicant details (status, notes, interviewDate) (Protected)
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, notes, interviewDate } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (typeof notes === 'string') updateData.notes = notes;
    if (interviewDate) updateData.interviewDate = interviewDate;

    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { applicantId: req.params.id }] }
      : { applicantId: req.params.id };

    const updated = await Applicant.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Applicant not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Compatibility route for status update
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { applicantId: req.params.id }] }
      : { applicantId: req.params.id };

    const updated = await Applicant.findOneAndUpdate(
      query,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Applicant not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE applicant (Protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { applicantId: req.params.id }] }
      : { applicantId: req.params.id };

    const deleted = await Applicant.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ message: 'Applicant not found' });
    res.json({ message: 'Applicant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET file stream / proxy for in-panel preview and download
router.get('/:id/file', async (req, res) => {
  try {
    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { applicantId: req.params.id }] }
      : { applicantId: req.params.id };

    const applicant = await Applicant.findOne(query);
    if (!applicant || !applicant.resumeUrl) {
      return res.status(404).send('Document not found');
    }

    const signedUrl = getSignedCloudinaryUrl(applicant.resumeUrl);
    const targetUrl = signedUrl || applicant.resumeUrl;
    const isDocx = applicant.resumeFileName?.toLowerCase().endsWith('.docx') || applicant.resumeFileName?.toLowerCase().endsWith('.doc');
    const contentType = isDocx
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : 'application/pdf';
    const dispositionType = req.query.download === '1' ? 'attachment' : 'inline';

    https.get(targetUrl, (cloudRes) => {
      if (cloudRes.statusCode === 200) {
        res.setHeader('Content-Type', cloudRes.headers['content-type'] || contentType);
        res.setHeader(
          'Content-Disposition',
          `${dispositionType}; filename="${encodeURIComponent(applicant.resumeFileName || 'resume.pdf')}"`
        );
        cloudRes.pipe(res);
      } else {
        res.redirect(targetUrl);
      }
    }).on('error', (err) => {
      console.error('[Cloudinary Proxy Error]:', err);
      res.redirect(applicant.resumeUrl);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
