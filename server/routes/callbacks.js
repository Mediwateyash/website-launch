import express from 'express';
import rateLimit from 'express-rate-limit';
import Callback from '../models/Callback.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const callbackLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { message: 'Too many callback requests. Please wait a few minutes.' },
});

// GET all callbacks (Protected)
router.get('/', protect, async (req, res) => {
  try {
    const callbacks = await Callback.find().sort({ createdAt: -1 });
    res.json(callbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new callback request (Public)
router.post('/', callbackLimiter, async (req, res) => {
  try {
    const { name, mobile, topic, source } = req.body;
    if (!name || !mobile) {
      return res.status(400).json({ message: 'Name and phone number are required' });
    }

    const count = await Callback.countDocuments();
    const callbackId = `CALL-${201 + count}`;
    const formattedDate = new Date().toLocaleString();

    const newCallback = new Callback({
      callbackId,
      name: name.trim(),
      mobile: mobile.trim(),
      topic: topic || 'General enquiry',
      source: source || 'Website Callback Banner',
      status: 'Pending',
      formattedDate,
    });

    const saved = await newCallback.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH callback details (status, notes, followUpDate, priority) (Protected)
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, notes, followUpDate, priority } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (typeof notes === 'string') updateData.notes = notes;
    if (followUpDate) updateData.followUpDate = followUpDate;
    if (priority) updateData.priority = priority;

    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { callbackId: req.params.id }] }
      : { callbackId: req.params.id };

    const updated = await Callback.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Callback record not found' });
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
      ? { $or: [{ _id: req.params.id }, { callbackId: req.params.id }] }
      : { callbackId: req.params.id };

    const updated = await Callback.findOneAndUpdate(
      query,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Callback not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE callback (Protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const query = req.params.id.length === 24
      ? { $or: [{ _id: req.params.id }, { callbackId: req.params.id }] }
      : { callbackId: req.params.id };

    const deleted = await Callback.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ message: 'Callback not found' });
    res.json({ message: 'Callback request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
