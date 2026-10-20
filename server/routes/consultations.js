import express from 'express';
import rateLimit from 'express-rate-limit';
import Consultation from '../models/Consultation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const consultationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { message: 'Too many consultation requests. Please wait a few minutes.' },
});

// GET all consultations (Protected)
router.get('/', protect, async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new consultation (Public)
router.post('/', consultationLimiter, async (req, res) => {
  try {
    const { name, fullName, phone, email, requirementType, preferredRole, serviceNeeded, companyName, clientType } = req.body;
    const clientName = name || fullName;
    if (!clientName || !phone) {
      return res.status(400).json({ message: 'Name and contact phone number are required' });
    }

    const count = await Consultation.countDocuments();
    const consultationId = `CON-${301 + count}`;
    const formattedDate = new Date().toLocaleString();

    const newConsultation = new Consultation({
      consultationId,
      name: clientName.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : '',
      requirementType: requirementType || companyName || "I'm looking for a job",
      preferredRole: preferredRole || serviceNeeded || 'General consultation',
      clientType: clientType || (companyName && companyName.includes('Company') ? 'Employer' : 'Job Seeker'),
      status: 'New',
      formattedDate,
    });

    const saved = await newConsultation.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH consultation details (status, notes, meetingDate) (Protected)
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, notes, meetingDate } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (typeof notes === 'string') updateData.notes = notes;
    if (meetingDate) updateData.meetingDate = meetingDate;

    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { consultationId: req.params.id }] }
      : { consultationId: req.params.id };

    const updated = await Consultation.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Consultation not found' });
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
      ? { $or: [{ _id: req.params.id }, { consultationId: req.params.id }] }
      : { consultationId: req.params.id };

    const updated = await Consultation.findOneAndUpdate(
      query,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Consultation not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE consultation (Protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { consultationId: req.params.id }] }
      : { consultationId: req.params.id };

    const deleted = await Consultation.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ message: 'Consultation not found' });
    res.json({ message: 'Consultation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
