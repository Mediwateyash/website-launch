import express from 'express';
import Job from '../models/Job.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET all jobs (Public can query active; Admin with token can query all)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      if (req.query.status !== 'all') {
        filter.status = req.query.status;
      }
    } else {
      // If no status specified and no auth header, default to Active
      const hasAuth = req.headers.authorization && req.headers.authorization.startsWith('Bearer');
      if (!hasAuth) {
        filter.status = 'Active';
      }
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single job details
router.get('/:id', async (req, res) => {
  try {
    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { jobId: req.params.id }] }
      : { jobId: req.params.id };
    const job = await Job.findOne(query);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create job (Protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, company, experience, location, type, category, tags, description, status } = req.body;
    if (!title || !company) {
      return res.status(400).json({ message: 'Title and company are required' });
    }

    const count = await Job.countDocuments();
    const jobId = `job-${Date.now().toString().slice(-4)}`;

    const newJob = new Job({
      jobId,
      title: title.trim(),
      company: company.trim(),
      experience: experience || '1 – 3 Years',
      location: location || 'Mumbai, Maharashtra',
      type: type || 'Full-Time',
      category: category || 'IT & Technology',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : ['Hiring']),
      description: description || '',
      status: status || 'Active',
      isNew: true,
      applicantsCount: 0,
    });

    const saved = await newJob.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update job (Protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { jobId: req.params.id }] }
      : { jobId: req.params.id };
    const updated = await Job.findOneAndUpdate(
      query,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Job not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH toggle job status (Protected)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { jobId: req.params.id }] }
      : { jobId: req.params.id };
    const updated = await Job.findOneAndUpdate(
      query,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Job not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE job (Protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { jobId: req.params.id }] }
      : { jobId: req.params.id };
    const deleted = await Job.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
