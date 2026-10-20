import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema(
  {
    applicantId: { type: String, required: true, unique: true },
    jobId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    candidateName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    experience: { type: String, default: '1 – 3 Years' },
    currentCompany: { type: String, default: 'Applicant' },
    resumeUrl: { type: String, default: '' },
    resumeFileName: { type: String, default: 'Resume.pdf' },
    status: {
      type: String,
      enum: ['New', 'Reviewing', 'Screened', 'Shortlisted', 'Interview Scheduled', 'Offered', 'Hired', 'Rejected'],
      default: 'New',
    },
    notes: { type: String, default: '' },
    interviewDate: { type: String, default: '' },
    formattedDate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Applicant', applicantSchema);
