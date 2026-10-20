import express from 'express';
import rateLimit from 'express-rate-limit';
import EmployerLead from '../models/EmployerLead.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const leadSubmitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { message: 'Too many requests submitted. Please wait before submitting again.' },
});

// GET all leads (Protected)
router.get('/', protect, async (req, res) => {
  try {
    const leads = await EmployerLead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new lead (Public from Employer hiring form)
router.post('/', leadSubmitLimiter, async (req, res) => {
  try {
    const { name, company, phone, email, category, openings, description } = req.body;
    if (!name || !company || !phone || !email) {
      return res.status(400).json({ message: 'Name, company, phone, and email are required' });
    }

    const count = await EmployerLead.countDocuments();
    const leadId = `LEAD-${101 + count}`;
    const formattedDate = new Date().toLocaleString();

    const newLead = new EmployerLead({
      leadId,
      name: name.trim(),
      company: company.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      category: category || 'General Requirement',
      openings: openings || '1-2',
      description: description ? description.trim() : '',
      status: 'New',
      formattedDate,
    });

    const saved = await newLead.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH update lead details (status, notes, priority, assignedTo) (Protected)
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, notes, priority, assignedTo } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (typeof notes === 'string') updateData.notes = notes;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { leadId: req.params.id }] }
      : { leadId: req.params.id };

    const updated = await EmployerLead.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Lead not found' });
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
      ? { $or: [{ _id: req.params.id }, { leadId: req.params.id }] }
      : { leadId: req.params.id };

    const updated = await EmployerLead.findOneAndUpdate(
      query,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Lead not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE lead (Protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { leadId: req.params.id }] }
      : { leadId: req.params.id };

    const deleted = await EmployerLead.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
