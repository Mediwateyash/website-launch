import express from 'express';
import TeamMember from '../models/TeamMember.js';
import SiteStats from '../models/SiteStats.js';
import Testimonial from '../models/Testimonial.js';
import Faq from '../models/Faq.js';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { saveUploadedFile } from '../utils/fileStorage.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// LEADERSHIP TEAM CMS
// ---------------------------------------------------------------------------

// GET /api/cms/team (Public)
router.get('/team', async (req, res) => {
  try {
    const team = await TeamMember.find().sort({ order: 1, createdAt: 1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/cms/team (Protected - batch replace or create)
router.post('/team', protect, async (req, res) => {
  try {
    const { team } = req.body;
    if (Array.isArray(team)) {
      await TeamMember.deleteMany({});
      const formatted = team.map((m, idx) => ({
        memberId: m.id || m.memberId || `team-${idx}`,
        name: m.name,
        role: m.role,
        quote: m.quote || '',
        image: m.image || '/images/team-priya.jpg',
        order: idx,
      }));
      const saved = await TeamMember.insertMany(formatted);
      return res.json(saved);
    }

    const { name, role, quote, image } = req.body;
    const member = new TeamMember({
      memberId: `team-${Date.now()}`,
      name,
      role,
      quote: quote || '',
      image: image || '/images/team-priya.jpg',
    });
    const saved = await member.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---------------------------------------------------------------------------
// GLOBAL SITE STATS & CONTACT DETAILS CMS
// ---------------------------------------------------------------------------

// GET /api/cms/stats (Public)
router.get('/stats', async (req, res) => {
  try {
    let stats = await SiteStats.findOne({ key: 'global_stats' });
    if (!stats) {
      stats = await SiteStats.create({ key: 'global_stats' });
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/cms/stats (Protected)
router.put('/stats', protect, async (req, res) => {
  try {
    const updated = await SiteStats.findOneAndUpdate(
      { key: 'global_stats' },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---------------------------------------------------------------------------
// TESTIMONIALS CMS
// ---------------------------------------------------------------------------

// GET /api/cms/testimonials (Public)
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: 1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/cms/testimonials (Protected - batch replace or add)
router.post('/testimonials', protect, async (req, res) => {
  try {
    const { testimonials } = req.body;
    if (Array.isArray(testimonials)) {
      await Testimonial.deleteMany({});
      const formatted = testimonials.map((t, idx) => ({
        testimonialId: t.id || t.testimonialId || `test-${idx}`,
        name: t.name,
        role: t.role,
        quote: t.quote,
        rating: t.rating || 5,
        image: t.image || '/images/testimonial-rohit.png',
        order: idx,
        isPublished: t.isPublished !== false,
      }));
      const saved = await Testimonial.insertMany(formatted);
      return res.json(saved);
    }

    const { name, role, quote, rating, image } = req.body;
    const count = await Testimonial.countDocuments();
    const newTestimonial = new Testimonial({
      testimonialId: `test-${count + 1}`,
      name,
      role,
      quote,
      rating: rating || 5,
      image: image || '/images/testimonial-rohit.png',
    });
    const saved = await newTestimonial.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---------------------------------------------------------------------------
// FAQS CMS
// ---------------------------------------------------------------------------

// GET /api/cms/faqs (Public)
router.get('/faqs', async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/cms/faqs (Protected - batch replace or add)
router.post('/faqs', protect, async (req, res) => {
  try {
    const { faqs } = req.body;
    if (Array.isArray(faqs)) {
      await Faq.deleteMany({});
      const formatted = faqs.map((f, idx) => ({
        faqId: f.id || f.faqId || `faq-${idx + 1}`,
        question: f.question,
        answer: f.answer,
        order: idx,
        isPublished: f.isPublished !== false,
      }));
      const saved = await Faq.insertMany(formatted);
      return res.json(saved);
    }

    const { question, answer } = req.body;
    const count = await Faq.countDocuments();
    const newFaq = new Faq({
      faqId: `faq-${count + 1}`,
      question,
      answer,
      order: count,
    });
    const saved = await newFaq.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---------------------------------------------------------------------------
// CMS DIRECT PHOTO UPLOAD (VPS Disk & Optional Cloudinary)
// ---------------------------------------------------------------------------
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.originalname.match(/\.(jpg|jpeg|png|webp|svg)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image file. Only JPG, PNG, WEBP, and SVG images are allowed.'), false);
  }
};

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: imageFilter,
});

router.post('/upload', protect, imageUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    const result = await saveUploadedFile(req.file, 'images', req);
    res.json({ url: result.url, fileName: result.fileName });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
