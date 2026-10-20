import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    resumeId: { type: String, required: true, unique: true },
    candidateName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: String, default: 'General Candidate Pool' },
    experience: { type: String, default: 'Profile Submitted' },
    fileName: { type: String, default: 'Candidate_Resume.pdf' },
    fileUrl: { type: String, default: '' },
    status: { type: String, enum: ['New', 'Reviewed', 'Archived'], default: 'New' },
    notes: { type: String, default: '' },
    formattedDate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
